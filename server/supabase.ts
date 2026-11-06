import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { ApiError, getBearerToken, type ApiRequest } from "./http.js";

let adminClient: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    throw new ApiError("The r0 account API is not configured.", 503, "api_not_configured");
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new ApiError("The r0 account API configuration is invalid.", 503, "api_not_configured");
  }
  if (
    parsedUrl.protocol !== "https:" &&
    parsedUrl.hostname !== "localhost" &&
    parsedUrl.hostname !== "127.0.0.1"
  ) {
    throw new ApiError("The Supabase URL must use HTTPS.", 503, "api_not_configured");
  }

  adminClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  return adminClient;
}

export async function getSupabaseUser(request: ApiRequest): Promise<User> {
  const token = getBearerToken(request);
  const { data, error } = await getAdminClient().auth.getUser(token);
  if (error || !data.user) {
    throw new ApiError("The Supabase session is invalid or expired.", 401, "unauthorized");
  }
  return data.user;
}
