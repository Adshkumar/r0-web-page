import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import { requireMethod, withApi, type ApiRequest, type ApiResponse } from "../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method === "GET") {
    await authenticateDesktopRequest(request);
    response.status(200).json({ enabled: false, data: [] });
    return;
  }
  if (request.method === "POST") {
    await authenticateDesktopRequest(request);
    response.status(503).json({
      error: "Hosted AI is not configured for this r0 API.",
      code: "hosted_ai_unavailable",
    });
    return;
  }
  requireMethod(request, response, "GET");
}

export default withApi(handler);
