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
const recoveryForm = document.querySelector<HTMLFormElement>("#recovery-form")!;
const newPasswordForm = document.querySelector<HTMLFormElement>("#new-password-form")!;
const accountPanel = document.querySelector<HTMLElement>("#account-panel")!;
const message = document.querySelector<HTMLElement>("#auth-message")!;
const configError = document.querySelector<HTMLElement>("#auth-config-error")!;
const socialOptions = document.querySelector<HTMLElement>("#social-options")!;
const termsCopy = document.querySelector<HTMLElement>("#terms-copy")!;
const submitButton = document.querySelector<HTMLButtonElement>("#submit-button")!;
const emailInput = document.querySelector<HTMLInputElement>("#email")!;
const passwordInput = document.querySelector<HTMLInputElement>("#password")!;
const confirmWrap = document.querySelector<HTMLElement>("#confirm-wrap")!;
const confirmInput = document.querySelector<HTMLInputElement>("#confirm-password")!;
const title = document.querySelector<HTMLElement>("#auth-title")!;
const subtitle = document.querySelector<HTMLElement>("#auth-subtitle")!;
const modePrompt = document.querySelector<HTMLElement>("#mode-prompt")!;
const passwordFields = document.querySelector<HTMLElement>("#password-fields")!;
passwordInput.required = false;
confirmInput.required = false;

type AuthMode = "signin" | "signup";
let mode: AuthMode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin";
let recoveryMode = new URLSearchParams(location.search).get("mode") === "recovery";
let step: "email" | "password" = "email";

function showMessage(text: string, isError = false) {
  message.textContent = text;
  message.classList.toggle("notice-error", isError);
  message.hidden = !text;
}

function explainError(error: unknown): string {
  const value = error instanceof Error ? error.message : "";
  const lower = value.toLowerCase();
  if (lower.includes("invalid login credentials")) return "We couldn't sign you in with those details. Check your email and password, or create an account.";
  if (lower.includes("email not confirmed")) return "Verify your email using the link we sent, then sign in again.";
  if (lower.includes("already registered")) return "An account may already exist for that email. Try signing in or reset your password.";
  if (lower.includes("password should be at least") || lower.includes("password is too short")) return "Use a longer password that meets the account password requirements.";
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
  step = "email";
  passwordInput.value = "";
  confirmInput.value = "";
  const signup = next === "signup";
  title.textContent = signup ? "Create your account" : "Welcome back";
  subtitle.textContent = signup ? "Create an r0 account to continue." : "Sign in to continue to r0.";
  submitButton.querySelector<HTMLElement>(".button-label")!.textContent = "Continue";
  submitButton.dataset.idleLabel = "Continue";
  passwordInput.autocomplete = signup ? "new-password" : "current-password";
  passwordFields.hidden = true;
  passwordInput.required = false;
  confirmWrap.hidden = !signup;
  confirmInput.required = false;
  document.querySelector<HTMLElement>("#forgot-password")!.hidden = signup;
  modePrompt.innerHTML = signup
    ? 'Already have an account? <button type="button" class="mode-link" data-mode="signin">Sign in</button>'
    : 'New to r0? <button type="button" class="mode-link" data-mode="signup">Create account</button>';
  modePrompt.querySelector<HTMLButtonElement>("[data-mode]")!.addEventListener("click", () => setMode(signup ? "signin" : "signup"));
  showMessage("");
}

function showPasswordStep() {
  step = "password";
  passwordFields.hidden = false;
  passwordInput.required = true;
  confirmWrap.hidden = mode !== "signup";
  confirmInput.required = mode === "signup";
  document.querySelector<HTMLElement>("#forgot-password")!.hidden = mode === "signup";
  socialOptions.hidden = true;
  const label = mode === "signup" ? "Create account" : "Sign in";
  submitButton.querySelector<HTMLElement>(".button-label")!.textContent = label;
  submitButton.dataset.idleLabel = label;
  subtitle.textContent = mode === "signup" ? "Choose a password for your new account." : "Enter your password to continue.";
  passwordInput.focus();
}

function showAccount(user: User) {
  form.hidden = true;
  recoveryForm.hidden = true;
  newPasswordForm.hidden = true;
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
  modePrompt.hidden = recoveryMode;
  termsCopy.hidden = false;
  if (recoveryMode) {
    form.hidden = true;
    recoveryForm.hidden = true;
    newPasswordForm.hidden = false;
    socialOptions.hidden = true;
    title.textContent = "Choose a new password";
    subtitle.textContent = "Set a new password for your r0 account.";
    return;
  }
  form.hidden = false;
  recoveryForm.hidden = true;
  newPasswordForm.hidden = true;
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
  if (step === "email") {
    showPasswordStep();
    return;
  }
  if (mode === "signup" && passwordInput.value !== confirmInput.value) {
    showMessage("Those passwords don't match. Check both fields and try again.", true);
    confirmInput.focus();
    return;
  }
  showMessage("");
  setBusy(submitButton, true);
  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: emailInput.value.trim(),
        password: passwordInput.value,
        options: { emailRedirectTo: `${location.origin}/auth` },
      });
      if (error) throw error;
      passwordInput.value = "";
      confirmInput.value = "";
      if (data.user && data.session) showAccount(data.user);
      else showMessage("Check your email for a verification link. Verify your address, then come back here to sign in.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      });
      if (error) throw error;
      if (data.user) showAccount(data.user);
    }
  } catch (error) {
    showMessage(explainError(error), true);
  } finally {
    setBusy(submitButton, false);
  }
});

document.querySelector<HTMLButtonElement>("#forgot-password")!.addEventListener("click", () => {
  recoveryForm.hidden = false;
  form.hidden = true;
  socialOptions.hidden = true;
  modePrompt.hidden = true;
  title.textContent = "Reset your password";
  subtitle.textContent = "We'll email you a link to choose a new password.";
  document.querySelector<HTMLInputElement>("#recovery-email")!.value = emailInput.value;
  showMessage("");
});

document.querySelector<HTMLButtonElement>("#back-to-signin")!.addEventListener("click", () => {
  recoveryMode = false;
  recoveryForm.hidden = true;
  form.hidden = false;
  socialOptions.hidden = false;
  modePrompt.hidden = false;
  setMode("signin");
});

document.querySelector<HTMLButtonElement>("#change-email")!.addEventListener("click", () => {
  passwordInput.value = "";
  confirmInput.value = "";
  step = "email";
  passwordInput.required = false;
  confirmInput.required = false;
  passwordFields.hidden = true;
  socialOptions.hidden = false;
  submitButton.querySelector<HTMLElement>(".button-label")!.textContent = "Continue";
  submitButton.dataset.idleLabel = "Continue";
  subtitle.textContent = mode === "signup" ? "Create an r0 account to continue." : "Sign in to continue to r0.";
  emailInput.focus();
});

recoveryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const recoveryEmail = document.querySelector<HTMLInputElement>("#recovery-email")!;
  if (!supabase || !recoveryForm.reportValidity()) return;
  const button = recoveryForm.querySelector<HTMLButtonElement>(".primary-button")!;
  setBusy(button, true);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.value.trim(), {
      redirectTo: `${location.origin}/auth?mode=recovery`,
    });
    if (error) throw error;
    showMessage("If an account exists for that email, a password reset link will arrive shortly.");
  } catch (error) {
    showMessage(explainError(error), true);
  } finally {
    setBusy(button, false);
  }
});

newPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nextPassword = document.querySelector<HTMLInputElement>("#new-password")!;
  const confirmation = document.querySelector<HTMLInputElement>("#new-password-confirm")!;
  if (!supabase || !newPasswordForm.reportValidity()) return;
  if (nextPassword.value !== confirmation.value) {
    showMessage("Those passwords don't match. Check both fields and try again.", true);
    confirmation.focus();
    return;
  }
  const button = newPasswordForm.querySelector<HTMLButtonElement>(".primary-button")!;
  setBusy(button, true);
  try {
    const { data, error } = await supabase.auth.updateUser({ password: nextPassword.value });
    if (error) throw error;
    recoveryMode = false;
    history.replaceState({}, document.title, "/auth");
    if (data.user) showAccount(data.user);
    showMessage("Your password has been updated.");
  } catch (error) {
    showMessage(explainError(error), true);
  } finally {
    setBusy(button, false);
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
    passwordInput.value = "";
    confirmInput.value = "";
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
    if (event === "PASSWORD_RECOVERY") {
      recoveryMode = true;
      showSignedOut();
      return;
    }
    if (!recoveryMode && session?.user) showAccount(session.user);
  });
  void supabase.auth.getSession().then(({ data, error }) => {
    if (error) showMessage(explainError(error), true);
    if (recoveryMode) showSignedOut();
    else if (data.session?.user) showAccount(data.session.user);
    else setMode(mode);
  });
  const callbackError = new URLSearchParams(location.search).get("error_description");
  if (callbackError) showMessage(explainError(new Error(callbackError)), true);
} else {
  showSignedOut();
}
