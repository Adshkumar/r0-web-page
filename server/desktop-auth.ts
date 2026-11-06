import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { ApiError, getBearerToken, isUuid, type ApiRequest } from "./http.js";
import { getAdminClient, getSupabaseUser } from "./supabase.js";

const SESSION_LIFETIME_MS = 15 * 60 * 1000;
const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const WEBSITE_AUTH_URL = "https://r0-ide.vercel.app/auth";

export interface R0Account {
  id: number;
  auth_user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  github_username: string | null;
  created_at: string;
}

export interface DesktopIdentity {
  tokenId: string;
  account: R0Account;
}

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function hashClientAddress(value: string): string {
  const key = createHmac("sha256", getEncryptionKey())
    .update("r0-desktop-session-rate-limit-ip", "utf8")
    .digest();
  return createHmac("sha256", key).update(value, "utf8").digest("hex");
}

export function createOpaqueToken() {
  const tokenId = randomUUID();
  const secret = randomBytes(32).toString("base64url");
  return { tokenId, secret, token: `${tokenId}.${secret}`, secretHash: sha256(secret) };
}

function getEncryptionKey(): Buffer {
  const encoded = process.env.R0_TOKEN_ENCRYPTION_KEY?.trim();
  if (!encoded) {
    throw new ApiError("The desktop credential encryption key is not configured.", 503, "api_not_configured");
  }
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) {
    throw new ApiError("The desktop credential encryption key must decode to 32 bytes.", 503, "api_not_configured");
  }
  return key;
}

export function encryptDesktopToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptDesktopToken(value: string): string {
  const [encodedIv, encodedTag, encodedCiphertext, extra] = value.split(".");
  if (!encodedIv || !encodedTag || !encodedCiphertext || extra) {
    throw new ApiError("The desktop credential could not be read.", 500, "credential_unavailable");
  }
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(encodedIv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(encodedCiphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    throw new ApiError("The desktop credential could not be read.", 500, "credential_unavailable");
  }
}

export async function getOrCreateAccount(user: User): Promise<R0Account> {
  if (!user.email?.trim()) {
    throw new ApiError("The signed-in Supabase account has no email address.", 403, "email_required");
  }
  const metadata = user.user_metadata ?? {};
  const provider =
    typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : null;
  const { data, error } = await getAdminClient()
    .from("r0_accounts")
    .upsert(
      {
        auth_user_id: user.id,
        email: user.email,
        display_name:
          (typeof metadata.full_name === "string" && metadata.full_name) ||
          (typeof metadata.name === "string" && metadata.name) ||
          null,
        avatar_url:
          (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
          (typeof metadata.picture === "string" && metadata.picture) ||
          null,
        provider,
        github_username:
          (typeof metadata.user_name === "string" && metadata.user_name) ||
          (typeof metadata.preferred_username === "string" && metadata.preferred_username) ||
          null,
      },
      { onConflict: "auth_user_id" },
    )
    .select("id,auth_user_id,email,display_name,avatar_url,provider,github_username,created_at")
    .single();

  if (error || !data) {
    throw new ApiError("The r0 account could not be created.", 500, "account_unavailable");
  }
  return data as R0Account;
}

export async function authorizeDesktopSession(sessionId: string, user: User): Promise<void> {
  const account = await getOrCreateAccount(user);
  const token = createOpaqueToken();
  const accepted = await getAdminClient().rpc("r0_authorize_desktop_session", {
    p_session_id: sessionId,
    p_account_id: account.id,
    p_token_id: token.tokenId,
    p_secret_hash: token.secretHash,
    p_encrypted_token: encryptDesktopToken(token.token),
    p_token_expires_at: new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString(),
  });

  if (accepted.error) {
    throw new ApiError("The desktop sign-in request could not be completed.", 500, "authorization_failed");
  }
  if (accepted.data !== true) {
    throw new ApiError(
      "This desktop sign-in request expired or was already authorized for another account.",
      409,
      "desktop_session_unavailable",
    );
  }
}

export async function authenticateSupabaseRequest(request: ApiRequest): Promise<User> {
  return getSupabaseUser(request);
}

export async function authenticateDesktopRequest(
  request: ApiRequest,
): Promise<DesktopIdentity> {
  const bearer = getBearerToken(request);
  const separator = bearer.indexOf(".");
  const tokenId = bearer.slice(0, separator);
  const secret = bearer.slice(separator + 1);
  if (separator <= 0 || !/^[A-Za-z0-9_-]{43}$/.test(secret) || !isUuid(tokenId)) {
    throw new ApiError("The desktop session is invalid or expired.", 401, "invalid_session");
  }

  const { data: token, error: tokenError } = await getAdminClient()
    .from("r0_desktop_tokens")
    .select("id,account_id,secret_hash,expires_at,revoked_at")
    .eq("id", tokenId)
    .maybeSingle();
  if (tokenError) {
    throw new ApiError("The desktop session could not be checked.", 503, "auth_unavailable");
  }

  const supplied = Buffer.from(sha256(secret), "hex");
  const stored =
    typeof token?.secret_hash === "string" ? Buffer.from(token.secret_hash, "hex") : Buffer.alloc(0);
  if (
    !token ||
    stored.length !== supplied.length ||
    !timingSafeEqual(stored, supplied) ||
    token.revoked_at ||
    !Number.isFinite(Date.parse(token.expires_at)) ||
    Date.parse(token.expires_at) <= Date.now()
  ) {
    throw new ApiError("The desktop session is invalid or expired.", 401, "invalid_session");
  }

  const { data: account, error: accountError } = await getAdminClient()
    .from("r0_accounts")
    .select("id,auth_user_id,email,display_name,avatar_url,provider,github_username,created_at")
    .eq("id", token.account_id)
    .maybeSingle();
  if (accountError || !account) {
    throw new ApiError("The desktop session is invalid or expired.", 401, "invalid_session");
  }
  return { tokenId, account: account as R0Account };
}

export function createDesktopSession() {
  const sessionId = randomUUID();
  const pollSecret = randomBytes(32).toString("base64url");
  const loginUrl = new URL(WEBSITE_AUTH_URL);
  loginUrl.searchParams.set("desktop_session", sessionId);
  return {
    sessionId,
    pollSecret,
    pollSecretHash: sha256(pollSecret),
    loginUrl: loginUrl.toString(),
    expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS).toISOString(),
  };
}

export function verifyPollSecret(suppliedSecret: string, storedHash: string): boolean {
  const supplied = Buffer.from(sha256(suppliedSecret), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return stored.length === supplied.length && timingSafeEqual(stored, supplied);
}

export { isUuid };
