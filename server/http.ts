export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): this;
  json(body: unknown): this;
  end(): this;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Handler = (request: ApiRequest, response: ApiResponse) => Promise<void>;

export function withApi(handler: Handler): Handler {
  return async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    try {
      await handler(request, response);
    } catch (error) {
      if (error instanceof ApiError) {
        response.status(error.status).json({ error: error.message, code: error.code });
        return;
      }

      console.error(
        "[r0-api] request failed:",
        error instanceof Error ? error.message : "unknown error",
      );
      response.status(500).json({ error: "The r0 API could not complete the request." });
    }
  };
}

export function requireMethod(
  request: ApiRequest,
  response: ApiResponse,
  method: string,
): boolean {
  if (request.method?.toUpperCase() === method) return true;
  response.setHeader("Allow", method);
  response.status(405).json({ error: "Method not allowed." });
  return false;
}

export function readJsonObject(request: ApiRequest): Record<string, unknown> {
  let value: unknown = request.body;
  if (typeof value === "string") {
    if (Buffer.byteLength(value, "utf8") > 16_384) {
      throw new ApiError("Request body is too large.", 413, "body_too_large");
    }
    try {
      value = JSON.parse(value);
    } catch {
      throw new ApiError("Request body must be valid JSON.", 400, "invalid_json");
    }
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError("Request body must be a JSON object.", 400, "invalid_body");
  }

  if (Buffer.byteLength(JSON.stringify(value), "utf8") > 16_384) {
    throw new ApiError("Request body is too large.", 413, "body_too_large");
  }
  return value as Record<string, unknown>;
}

export function getBearerToken(request: ApiRequest): string {
  const value = request.headers.authorization;
  const header = Array.isArray(value) ? value[0] : value;
  const match = typeof header === "string" ? /^Bearer ([^\s]+)$/.exec(header) : null;
  if (!match) throw new ApiError("Authentication is required.", 401, "unauthorized");
  return match[1];
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}
