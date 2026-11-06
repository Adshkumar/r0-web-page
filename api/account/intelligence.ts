import { authenticateDesktopRequest } from "../../server/desktop-auth.js";
import {
  ApiError,
  readJsonObject,
  requireMethod,
  withApi,
  type ApiRequest,
  type ApiResponse,
} from "../../server/http.js";
import { getAdminClient } from "../../server/supabase.js";

const TASKS = [
  "agent",
  "autocomplete",
  "inline-edit",
  "commit-message",
  "chat-title",
  "terminal-title",
  "github-draft",
  "review-summary",
  "review-insight",
] as const;

const DEFAULT_PREFERENCES = {
  defaultConnection: { providerId: "auto", modelId: "" },
  tasks: {},
  autoRouting: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseConnection(value: unknown) {
  if (!isRecord(value)) return null;
  if (
    typeof value.providerId !== "string" ||
    !/^[a-z0-9][a-z0-9._-]{0,99}$/.test(value.providerId) ||
    typeof value.modelId !== "string" ||
    value.modelId.length > 200
  ) {
    return null;
  }
  return { providerId: value.providerId, modelId: value.modelId.trim() };
}

function parsePreferences(value: unknown) {
  if (!isRecord(value)) {
    throw new ApiError("The AI preferences are invalid.", 400, "invalid_preferences");
  }
  const defaultConnection = parseConnection(value.defaultConnection);
  if (!defaultConnection) {
    throw new ApiError("The default AI connection is invalid.", 400, "invalid_preferences");
  }
  const tasks: Record<string, { providerId: string; modelId: string }> = {};
  if (value.tasks !== undefined && !isRecord(value.tasks)) {
    throw new ApiError("The AI task preferences are invalid.", 400, "invalid_preferences");
  }
  if (isRecord(value.tasks)) {
    for (const task of TASKS) {
      if (value.tasks[task] === undefined) continue;
      const connection = parseConnection(value.tasks[task]);
      if (!connection) {
        throw new ApiError("An AI task connection is invalid.", 400, "invalid_preferences");
      }
      tasks[task] = connection;
    }
  }
  return {
    defaultConnection,
    tasks,
    autoRouting: typeof value.autoRouting === "boolean" ? value.autoRouting : true,
  };
}

function snapshot(
  scope: string,
  revision: number,
  preferences: unknown,
  updatedAt: string | null,
) {
  return {
    scope,
    scopes: [{ id: "personal", name: "Personal", canEdit: true }],
    revision,
    preferences,
    updatedAt,
  };
}

async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET" && request.method !== "PUT") {
    requireMethod(request, response, "GET");
    return;
  }
  const { account } = await authenticateDesktopRequest(request);
  const queryScope = request.query.scope;
  if (queryScope !== "personal") {
    throw new ApiError("Team AI settings are not available for this account.", 403, "scope_forbidden");
  }

  if (request.method === "GET") {
    const { data, error } = await getAdminClient()
      .from("r0_intelligence_settings")
      .select("revision,preferences,updated_at")
      .eq("account_id", account.id)
      .eq("scope", "personal")
      .maybeSingle();
    if (error) throw error;
    response.status(200).json(
      snapshot(
        "personal",
        data?.revision ?? 0,
        data?.preferences ?? DEFAULT_PREFERENCES,
        data?.updated_at ?? null,
      ),
    );
    return;
  }

  const body = readJsonObject(request);
  if (
    body.scope !== "personal" ||
    !Number.isSafeInteger(body.revision) ||
    (body.revision as number) < 0
  ) {
    throw new ApiError("The AI settings update is invalid.", 400, "invalid_update");
  }
  const preferences = parsePreferences(body.preferences);
  const { data, error } = await getAdminClient().rpc("r0_save_intelligence_settings", {
    p_account_id: account.id,
    p_expected_revision: body.revision,
    p_preferences: preferences,
  });
  if (error) throw error;
  if (!data) {
    throw new ApiError(
      "AI settings changed on another device. Reload before saving again.",
      409,
      "revision_conflict",
    );
  }
  response.status(200).json(
    snapshot(
      "personal",
      data.revision,
      data.preferences,
      data.updated_at,
    ),
  );
}

export default withApi(handler);
