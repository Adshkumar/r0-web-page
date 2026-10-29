import { createClient, type User } from "@supabase/supabase-js";

const root = document.querySelector<HTMLElement>(".auth-page");
if (!root) throw new Error("r0 account page is missing its root element");

const supabaseUrl = root.dataset.supabaseUrl?.trim() ?? "";
const supabaseAnonKey = root.dataset.supabaseAnonKey?.trim() ?? "";
const providers = (root.dataset.providers ?? "").split(",").filter(Boolean);
const configured = Boolean(supabaseUrl && supabaseAnonKey && URL.canParse(supabaseUrl));
const supabase = configured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const form = document.querySelector<HTMLFormElement>("#auth-form")!;
const accountPanel = document.querySelector<HTMLElement>("#account-panel")!;
const message = document.querySelector<HTMLElement>("#auth-message")!;
const configError = document.querySelector<HTMLElement>("#auth-config-error")!;
const socialOptions = document.querySelector<HTMLElement>("#social-options")!;
const termsCopy = document.querySelector<HTMLElement>("#terms-copy")!;
const submitButton = document.querySelector<HTMLButtonElement>("#submit-button")!;
const emailInput = document.querySelector<HTMLInputElement>("#email")!;
const title = document.querySelector<HTMLElement>("#auth-title")!;
const subtitle = document.querySelector<HTMLElement>("#auth-subtitle")!;
const modePrompt = document.querySelector<HTMLElement>("#mode-prompt")!;

type AuthMode = "signin" | "signup";
let mode: AuthMode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin";

function showMessage(text: string, isError = false) {
  message.textContent = text;
  message.classList.toggle("notice-error", isError);
  message.hidden = !text;
}

function explainError(error: unknown): string {
  const value = error instanceof Error ? error.message : "";
  const lower = value.toLowerCase();
  if (lower.includes("email not confirmed")) return "Verify your email using the link we sent, then sign in again.";
  if (lower.includes("already registered")) return "An account may already exist for that email. Try signing in or use the sign-in option.";
  if (lower.includes("rate limit") || lower.includes("too many requests")) return "Too many attempts. Wait a moment, then try again.";
  if (lower.includes("failed to fetch") || lower.includes("network")) return "We couldn't reach the account service. Check your connection and try again.";
  if (lower.includes("pkce") || lower.includes("code verifier") || lower.includes("invalid flow state")) return "This sign-in link is invalid or has expired. Start again from this page.";
  if (lower.includes("provider is not enabled") || lower.includes("unsupported provider")) return "This sign-in provider is not enabled for r0 yet. Choose another method or contact support.";
  return value || "Something went wrong. Please try again.";
}

function setBusy(button: HTMLButtonElement, busy: boolean) {
  const label = button.querySelector<HTMLElement>(".button-label");
  const spinner = button.querySelector<HTMLElement>(".spinner");
  button.disabled = busy;
  if (spinner) spinner.hidden = !busy;
  if (label) {
    button.dataset.idleLabel ||= label.textContent || "Continue";
    label.textContent = busy ? "Please wait…" : button.dataset.idleLabel;
  }
}

function setMode(next: AuthMode) {
  mode = next;
  const signup = next === "signup";
  title.textContent = signup ? "Create your account" : "Welcome back";
  subtitle.textContent = signup ? "We'll email you a secure link to create your r0 account." : "We'll email you a secure sign-in link.";
  submitButton.querySelector<HTMLElement>(".button-label")!.textContent = "Continue";
  submitButton.dataset.idleLabel = "Continue";
  modePrompt.innerHTML = signup
    ? 'Already have an account? <button type="button" class="mode-link" data-mode="signin">Sign in</button>'
    : 'New to r0? <button type="button" class="mode-link" data-mode="signup">Create account</button>';
  modePrompt.querySelector<HTMLButtonElement>("[data-mode]")!.addEventListener("click", () => setMode(signup ? "signin" : "signup"));
  showMessage("");
}

function showAccount(user: User) {
  form.hidden = true;
  accountPanel.hidden = false;
  socialOptions.hidden = true;
  termsCopy.hidden = true;
  modePrompt.hidden = true;
  title.textContent = "Your r0 account";
  subtitle.textContent = "You are signed in.";
  document.querySelector<HTMLElement>("#account-email")!.textContent = user.email ?? "Signed in account";
  document.querySelector<HTMLElement>("#account-verification")!.textContent = user.email_confirmed_at
    ? "Email verified"
    : "Email verification pending";
}

function showSignedOut() {
  accountPanel.hidden = true;
  modePrompt.hidden = false;
  termsCopy.hidden = false;
  form.hidden = false;
  socialOptions.hidden = false;
  setMode(mode);
}

document.querySelectorAll<HTMLButtonElement>(".mode-link").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode as AuthMode));
});

if (!configured) {
  configError.hidden = false;
  form.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input,button").forEach((item) => (item.disabled = true));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase || !form.reportValidity()) return;
  showMessage("");
  setBusy(submitButton, true);
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput.value.trim(),
      options: {
        emailRedirectTo: `${location.origin}/auth`,
        shouldCreateUser: mode === "signup",
      },
    });
    if (error) throw error;
    showMessage(mode === "signup"
      ? "Check your email for a secure link to verify your address and finish creating your account."
      : "If an account exists for this email, a secure sign-in link will arrive shortly.");
  } catch (error) {
    showMessage(explainError(error), true);
  } finally {
    setBusy(submitButton, false);
  }
});

document.querySelectorAll<HTMLButtonElement>(".social-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const provider = button.dataset.provider;
    if (provider !== "google" && provider !== "github") return;
    if (!configured) {
      showMessage("Social sign-in is not configured for this deployment. Set the public Supabase URL and anon key, then rebuild the site.", true);
      return;
    }
    if (!providers.includes(provider)) {
      showMessage(`${provider === "github" ? "GitHub" : "Google"} sign-in is not enabled for r0 yet. Configure this provider in Supabase Auth and enable it in the website deployment settings.`, true);
      return;
    }
    if (!supabase) return;
    button.disabled = true;
    showMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth` },
      });
      if (error) throw error;
    } catch (error) {
      showMessage(explainError(error), true);
      button.disabled = false;
    }
  });
});

document.querySelector<HTMLButtonElement>("#signout-button")!.addEventListener("click", async (event) => {
  if (!supabase) return;
  const button = event.currentTarget as HTMLButtonElement;
  button.disabled = true;
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
    history.replaceState({}, document.title, "/auth");
    showSignedOut();
    showMessage("You are signed out.");
  } catch (error) {
    showMessage(explainError(error), true);
  } finally {
    button.disabled = false;
  }
});

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) showAccount(session.user);
  });
  void supabase.auth.getSession().then(({ data, error }) => {
    if (error) showMessage(explainError(error), true);
    if (data.session?.user) showAccount(data.session.user);
    else setMode(mode);
  });
  const callbackError = new URLSearchParams(location.search).get("error_description");
  if (callbackError) showMessage(explainError(new Error(callbackError)), true);
} else {
  showSignedOut();
}
