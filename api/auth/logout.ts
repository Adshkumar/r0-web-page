import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import { getAdminClient } from "../../server/supabase.js";
import { requireMethod, withApi, type ApiRequest, type ApiResponse } from "../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "DELETE")) return;
  const identity = await authenticateDesktopRequest(request);
  const { error } = await getAdminClient()
    .from("r0_desktop_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", identity.tokenId)
    .is("revoked_at", null);
  if (error) throw error;
  response.status(204).end();
}

export default withApi(handler);
