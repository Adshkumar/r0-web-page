import { AUTH_URL } from "../data/links";

const AUTH_ORIGIN = new URL(AUTH_URL).origin;
const RETURN_PARAM_NAMES = new Set([
  "next",
  "redirect",
  "redirect_to",
  "redirect_uri",
  "return",
  "return_to",
]);

function hasUnsafeParams(params: URLSearchParams) {
  return [...params.keys()].some((key) => {
    const normalized = key.toLowerCase();
    return (
      RETURN_PARAM_NAMES.has(normalized) ||
      /(?:token|secret|credential|authorization)/.test(normalized) ||
      normalized === "code" ||
      normalized === "desktop_session" ||
      normalized === "desktop-session" ||
      normalized === "session" ||
      normalized === "session_id" ||
      normalized === "sessionid"
    );
  });
}

export function getSafeReturnPath(value: string | null): string | null {
  if (
    !value ||
    value.length > 2048 ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return null;
  }

  try {
    const destination = new URL(value, AUTH_ORIGIN);
    if (
      destination.origin !== AUTH_ORIGIN ||
      destination.pathname === "/auth" ||
      destination.pathname.startsWith("/auth/") ||
      hasUnsafeParams(destination.searchParams) ||
      hasUnsafeParams(new URLSearchParams(destination.hash.slice(1).replace(/^[^?]*\?/, "")))
    ) {
      return null;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return null;
  }
}

export function getAuthUrl(
  next: string | null = null,
  mode: "signin" | "signup" = "signin",
): string {
  const url = new URL(AUTH_URL);
  const safeNext = getSafeReturnPath(next);
  if (safeNext) url.searchParams.set("next", safeNext);
  if (mode === "signup") url.searchParams.set("mode", mode);
  return url.toString();
}
