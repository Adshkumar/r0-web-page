import { afterEach, describe, expect, it } from "bun:test";
import { randomBytes } from "node:crypto";
import {
  createDesktopSession,
  createOpaqueToken,
  decryptDesktopToken,
  encryptDesktopToken,
  hashClientAddress,
  sha256,
  verifyPollSecret,
} from "./desktop-auth.js";

const originalEncryptionKey = process.env.R0_TOKEN_ENCRYPTION_KEY;

afterEach(() => {
  if (originalEncryptionKey === undefined) delete process.env.R0_TOKEN_ENCRYPTION_KEY;
  else process.env.R0_TOKEN_ENCRYPTION_KEY = originalEncryptionKey;
});

describe("desktop auth credentials", () => {
  it("creates an expiring browser session without putting credentials in its URL", () => {
    const session = createDesktopSession();
    const loginUrl = new URL(session.loginUrl);

    expect(loginUrl.origin + loginUrl.pathname).toBe("https://r0-ide.vercel.app/auth");
    expect([...loginUrl.searchParams.keys()]).toEqual(["desktop_session"]);
    expect(loginUrl.searchParams.get("desktop_session")).toBe(session.sessionId);
    expect(loginUrl.search).not.toContain(session.pollSecret);
    expect(session.pollSecretHash).toBe(sha256(session.pollSecret));
    expect(verifyPollSecret(session.pollSecret, session.pollSecretHash)).toBe(true);
    expect(verifyPollSecret("wrong-secret", session.pollSecretHash)).toBe(false);
    expect(Date.parse(session.expiresAt)).toBeGreaterThan(Date.now());
  });

  it("generates opaque API tokens and stores only a hash for validation", () => {
    const token = createOpaqueToken();
    const [id, secret] = token.token.split(".");

    expect(id).toBe(token.tokenId);
    expect(secret).toBe(token.secret);
    expect(token.secret).toHaveLength(43);
    expect(token.secretHash).toBe(sha256(token.secret));
    expect(token.secretHash).not.toContain(token.secret);
  });

  it("hashes client addresses with a deployment-specific key", () => {
    process.env.R0_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
    const firstHash = hashClientAddress("203.0.113.1");

    expect(firstHash).toHaveLength(64);
    expect(firstHash).toBe(hashClientAddress("203.0.113.1"));
    expect(firstHash).not.toBe(hashClientAddress("203.0.113.2"));

    process.env.R0_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
    expect(firstHash).not.toBe(hashClientAddress("203.0.113.1"));
  });

  it("encrypts temporary poll credentials and rejects tampering", () => {
    process.env.R0_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
    const credential = createOpaqueToken().token;
    const encrypted = encryptDesktopToken(credential);

    expect(encrypted).not.toContain(credential);
    expect(decryptDesktopToken(encrypted)).toBe(credential);
    expect(() => decryptDesktopToken(`${encrypted.slice(0, -1)}x`)).toThrow(
      "The desktop credential could not be read.",
    );
  });
});
