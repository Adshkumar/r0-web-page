import type { ApiRequest, ApiResponse } from "../../../../server/http.js";
import { createDesktopSession, hashClientAddress } from "../../../../server/desktop-auth.js";
import { ApiError, requireMethod, withApi } from "../../../../server/http.js";
import { getAdminClient } from "../../../../server/supabase.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "POST")) return;
  const supabase = getAdminClient();
  const forwardedIp = request.headers["x-real-ip"];
  const ip = Array.isArray(forwardedIp) ? forwardedIp[0] : forwardedIp;
  const bucketStart = new Date(Math.floor(Date.now() / 900_000) * 900_000).toISOString();
  const rateLimit = await supabase.rpc("r0_check_desktop_session_rate_limit", {
    p_ip_hash: hashClientAddress(ip?.trim() || "unknown"),
    p_window_start: bucketStart,
    p_limit: 20,
  });
  if (rateLimit.error) {
    throw new ApiError("The desktop sign-in service is unavailable.", 503, "auth_unavailable");
  }
  if (rateLimit.data !== true) {
    throw new ApiError(
      "Too many desktop sign-in attempts. Wait a few minutes and try again.",
      429,
      "rate_limited",
    );
  }

  const cleanup = await supabase.rpc("r0_cleanup_desktop_auth");
  if (cleanup.error) {
    throw new ApiError("The desktop sign-in service is unavailable.", 503, "auth_unavailable");
  }

  const session = createDesktopSession();
  const { error } = await supabase.from("r0_desktop_sessions").insert({
    id: session.sessionId,
    poll_secret_hash: session.pollSecretHash,
    status: "pending",
    expires_at: session.expiresAt,
  });
  if (error) {
    throw new ApiError("The desktop sign-in request could not be created.", 503, "auth_unavailable");
  }

  response.status(201).json({
    sessionId: session.sessionId,
    pollSecret: session.pollSecret,
    loginUrl: session.loginUrl,
  });
}

export default withApi(handler);
