import {
  decryptDesktopToken,
  isUuid,
  verifyPollSecret,
} from "../../../server/desktop-auth.js";
import { requireMethod, withApi, type ApiRequest, type ApiResponse } from "../../../server/http.js";
import { getAdminClient } from "../../../server/supabase.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "GET")) return;
  const sessionId = request.query.session;
  const secretHeader = request.headers["x-desktop-session-secret"];
  const pollSecret = Array.isArray(secretHeader) ? secretHeader[0] : secretHeader;
  if (!isUuid(sessionId) || typeof pollSecret !== "string" || pollSecret.length > 128) {
    response.status(200).json({ status: "missing" });
    return;
  }

  const { data: session, error } = await getAdminClient()
    .from("r0_desktop_sessions")
    .select("poll_secret_hash,status,account_id,credential_ciphertext,expires_at")
    .eq("id", sessionId)
    .maybeSingle();
  if (error) throw error;
  if (!session || !verifyPollSecret(pollSecret, session.poll_secret_hash)) {
    response.status(200).json({ status: "missing" });
    return;
  }
  if (Date.parse(session.expires_at) <= Date.now()) {
    response.status(410).json({ status: "expired" });
    return;
  }
  if (session.status === "pending") {
    response.status(200).json({ status: "pending" });
    return;
  }
  if (session.status !== "authorized" || !session.credential_ciphertext) {
    response.status(200).json({ status: "missing" });
    return;
  }

  response.status(200).json({
    status: "ready",
    token: decryptDesktopToken(session.credential_ciphertext),
  });
}

export default withApi(handler);
