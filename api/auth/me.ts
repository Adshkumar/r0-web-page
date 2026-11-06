import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import { requireMethod, withApi, type ApiRequest, type ApiResponse } from "../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "GET")) return;
  const { account } = await authenticateDesktopRequest(request);
  response.status(200).json({
    user: {
      id: account.id,
      email: account.email,
      name: account.display_name,
      avatar_url: account.avatar_url,
      provider: account.provider,
      github_username: account.github_username,
      subscription_status: "free",
      subscriptionPlan: "free",
      created_at: account.created_at,
    },
  });
}

export default withApi(handler);
