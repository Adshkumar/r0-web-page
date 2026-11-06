import { authorizeDesktopSession, authenticateSupabaseRequest } from "../../../../server/desktop-auth.js";
import {
  ApiError,
  isUuid,
  readJsonObject,
  requireMethod,
  withApi,
  type ApiRequest,
  type ApiResponse,
} from "../../../../server/http.js";

async function handler(request: ApiRequest, response: ApiResponse) {
  if (!requireMethod(request, response, "POST")) return;
  const body = readJsonObject(request);
  if (!isUuid(body.sessionId)) {
    throw new ApiError("The desktop sign-in request is invalid.", 400, "invalid_session");
  }

  const user = await authenticateSupabaseRequest(request);
  await authorizeDesktopSession(body.sessionId, user);
  response.status(200).json({ authorized: true });
}

export default withApi(handler);
