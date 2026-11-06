# r0 website authentication

The `/auth` page uses Supabase Auth in the browser. It supports passwordless email sign-in and account creation through magic links, PKCE OAuth callbacks, current-account display, and local sign-out. Google and GitHub buttons are shown; each provider starts OAuth only when it is enabled in `PUBLIC_SUPABASE_PROVIDERS` and configured in Supabase. Apple is not included.

The canonical sign-in and account-creation entry point is `https://r0-ide.vercel.app/auth`. Website links use this page for both actions. A protected website page may include a `next` path; the auth page accepts only same-site relative paths, rejects auth-page loops and credential-bearing destinations, and preserves a valid path through OAuth and magic-link callbacks.

## Environment variables

Copy `.env.example` to `.env` for local development and fill in the public values from Supabase **Project Settings → API**:

```dotenv
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-project-publishable-or-anon-key
PUBLIC_SUPABASE_PROVIDERS=google,github

# Server-only Vercel Function credentials. Never use a PUBLIC_ prefix for these.
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
R0_TOKEN_ENCRYPTION_KEY=your-base64-encoded-32-byte-key
```

The URL and publishable/anon key are designed for browser clients. Never put a service-role key, OAuth client secret, SMTP password, or other privileged secret in a `PUBLIC_` variable. The social-provider list only controls which buttons the site renders; each provider must also be fully configured in Supabase and its provider dashboard before enabling it.

Generate `R0_TOKEN_ENCRYPTION_KEY` with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`. Configure the server-only values in Vercel environment settings; never commit populated environment files.

If Supabase URL/key are unset, the page shows a configuration message and disables account actions. Do not enable registration on production until those values are set in the deployment environment.

## Supabase dashboard setup

1. Create or select the r0 Supabase project. Enable email sign-in and configure email templates/SMTP so Supabase can send magic links.
2. In **Authentication → URL Configuration**, set the production Site URL to `https://r0-ide.vercel.app` and add redirect URLs for `https://r0-ide.vercel.app/auth**` and `http://localhost:6079/auth**` (plus any actual preview origins used for testing), so validated `next` query values survive callbacks.
3. Configure the email template to send the Supabase sign-in link and set up a production SMTP provider. Supabase's default email sender is intended for trials and is rate-limited.
4. To enable GitHub sign-in, create a GitHub OAuth App (or a GitHub App configured for OAuth), use `https://<project-ref>.supabase.co/auth/v1/callback` as its Authorization callback URL, then copy its client ID and client secret into **Supabase → Authentication → Sign In / Providers → GitHub** and enable the provider. Add `https://r0-ide.vercel.app/auth` and your local `/auth` URL to Supabase's redirect URL allow-list. Set `PUBLIC_SUPABASE_PROVIDERS=github` for the website build to show the GitHub button. The secret stays only in GitHub/Supabase; never add it to Astro environment variables.
5. Google can be enabled the same way with a Google OAuth client and the callback URL supplied by Supabase. Set `PUBLIC_SUPABASE_PROVIDERS=google,github` to show both buttons.
6. Add `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `PUBLIC_SUPABASE_PROVIDERS` to the Vercel project environment for the relevant environments and redeploy. For GitHub only, use `PUBLIC_SUPABASE_PROVIDERS=github`.

No application profile table is created by this website, so there is no custom table requiring RLS yet. Supabase Auth owns account records. If account settings later add a profile table, enable RLS and scope every read/write policy to `auth.uid() = user_id`; never use the service-role key in browser code.

## Local development and deployment

```sh
npm install
npm run dev
npm run build
npm run preview
```

For Vercel, use `npm run build` and the `dist` output directory. Configure the variables before building because Astro statically renders the public configuration into the `/auth` page.

## Desktop IDE integration

The website client uses Supabase PKCE and stores its browser session using the Supabase client. The current desktop IDE uses a separate r0 account API: it creates a desktop session, opens the API-provided login URL in the system browser, polls that session, validates the r0 API token, and stores it through the Tauri secure-storage command. The desktop's current API does not accept the Supabase session as an r0 account token.

The website now contains Vercel Functions for desktop session creation, secret-protected polling, explicit authorization, Supabase identity validation, account mapping, desktop token validation/revocation, and personal AI preference sync. The account page requires an explicit **Authorize r0 Desktop** action after sign-in. The desktop credential is opaque, stored in the Tauri secure credential store, hashed for API validation, encrypted while temporarily held for polling, and never included in a URL.

### Deploying the desktop API

1. Apply `supabase/migrations/202611050001_desktop_auth.sql` to the Supabase project used by the website. It creates private account/session/token/preferences tables and service-role-only functions. Do not expose these tables to `anon` or `authenticated`.
2. In the Vercel project connected to this website repository, configure `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `R0_TOKEN_ENCRYPTION_KEY`. The service-role key and encryption key are server-only. Add the public Supabase URL/key and provider list too if the website auth page does not already have them.
3. Deploy the site to Vercel and verify the desktop init route, browser sign-in, explicit authorization, and desktop polling. The Cloudflare Worker deployment from `wrangler deploy` does not run these Vercel Functions.
4. Only after those checks pass, set the desktop repo's `VITE_API_URL` to the deployed HTTPS API origin. For local builds, set it in the ignored desktop `.env.local`; for GitHub Actions release/test builds, set it as a repository Actions variable under **Settings → Secrets and variables → Actions → Variables**. The URL is public and embedded in desktop builds; never put credentials in this variable.

The initial API implementation returns a free account and keeps hosted AI, paid subscriptions, billing, enterprise policy, cloud workspaces, and collaboration disabled. Those features need their own entitlement/payment and provider-service implementations and secrets; setting `VITE_API_URL` does not enable them. The `/pricing` and account billing pages are not implemented.

## Privacy and terms

The account page keeps a Supabase Auth session in browser storage through the Supabase client. The current `/privacy` and `/terms` pages are drafts. Review and complete them for the actual legal operator, Supabase project region and retention behavior, email/social providers, user rights, account deletion, and contact details before production registration is enabled.
