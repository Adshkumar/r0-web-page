import { describe, expect, it } from "bun:test";
import { AUTH_URL } from "../data/links";
import { getAuthUrl, getSafeReturnPath } from "./auth-redirect";

describe("auth redirects", () => {
  it("uses the canonical auth URL for sign-in and account creation", () => {
    expect(getAuthUrl()).toBe(AUTH_URL);
    expect(new URL(getAuthUrl(null, "signup")).searchParams.get("mode")).toBe("signup");
  });

  it("preserves safe relative destinations", () => {
    expect(getSafeReturnPath("/dashboard?tab=account#profile")).toBe(
      "/dashboard?tab=account#profile",
    );
    const authUrl = new URL(getAuthUrl("/dashboard?tab=account", "signup"));
    expect(authUrl.origin + authUrl.pathname).toBe(AUTH_URL);
    expect(authUrl.searchParams.get("next")).toBe("/dashboard?tab=account");
    expect(authUrl.searchParams.get("mode")).toBe("signup");
  });

  it.each([
    "https://attacker.example",
    "//attacker.example/path",
    "/\\attacker.example",
    "dashboard",
    "/auth",
    "/auth/callback",
    "/dashboard?access_token=secret",
    "/dashboard#refresh_token=secret",
    "/dashboard?desktop_session=secret",
    "/dashboard?poll_secret=secret",
    "/dashboard?pollSecret=secret",
    "/dashboard?next=%2Fsettings%3Faccess_token%3Dsecret",
  ])("rejects unsafe return destinations: %s", (path: string) => {
    expect(getSafeReturnPath(path)).toBeNull();
    expect(new URL(getAuthUrl(path)).searchParams.has("next")).toBe(false);
  });
});
