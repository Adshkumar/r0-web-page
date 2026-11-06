import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import { requireMethod, withApi, type ApiRequest, type ApiResponse } from "../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "GET")) return;
  await authenticateDesktopRequest(request);
  response.status(200).json({
    status: "free",
    capabilities: {
      intelligence: false,
      hostedAi: false,
      settingsSync: true,
      cloudWorkspaces: false,
      cloudAgents: false,
      previews: false,
      collaboration: false,
      enterprisePolicy: false,
    },
    subscription: null,
    enterprise: { has_access: false, is_admin: false, policy: null },
    collaboration: null,
  });
}

export default withApi(handler);
