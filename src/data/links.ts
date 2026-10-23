export const GITHUB = "https://github.com/Adshkumar/r0";
export const VERSION = "0.18.0";
export const RELEASES = `${GITHUB}/releases`;
export const LATEST_RELEASE = `${RELEASES}/latest`;
export const ISSUES = `${GITHUB}/issues`;
export const LICENSE = `${GITHUB}#readme`;
export const repoDoc = (name: string) => `${GITHUB}/blob/main/${name}`;
export const DISCUSSIONS = `${GITHUB}/discussions`;
export const AUTHOR = GITHUB;

/** Design Partner Program link (set to a Tally/Typeform URL or empty to use the structured email gate) */
export const DESIGN_PARTNER_FORM_URL = "";

export const STARS = "1";

/** The one-liner shown on the site. Kept here so it lives in one place. */
export const INSTALL_URL = "https://r0-ide.vercel.app/install.ps1";
export const INSTALL_CMD = `irm ${INSTALL_URL} | iex`;
export const WINDOWS_CMD_INSTALL_CMD = `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Invoke-WebRequest -UseBasicParsing '${INSTALL_URL}').Content"`;
