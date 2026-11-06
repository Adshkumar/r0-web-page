import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import {
  ApiError,
  readJsonObject,
  requireMethod,
  withApi,
  type ApiRequest,
  type ApiResponse,
} from "../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "POST")) return;
  await authenticateDesktopRequest(request);
  readJsonObject(request);
  throw new ApiError(
    "Hosted AI is not configured for this r0 API. Choose a BYOK provider in AI settings.",
    503,
    "hosted_ai_unavailable",
  );
}

export default withApi(handler);
