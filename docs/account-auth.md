# r0 website authentication

The `/auth` page uses Supabase Auth in the browser. It supports email/password registration and sign-in, email-confirmation redirects, password reset, PKCE OAuth callbacks, current-account display, and local sign-out. Google and GitHub buttons appear only when that provider is explicitly listed at build time. Apple is not shown because it has not been configured here.

## Environment variables

Copy `.env.example` to `.env` for local development and fill in the public values from Supabase **Project Settings → API**:

```dotenv
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-project-publishable-or-anon-key
PUBLIC_SUPABASE_PROVIDERS=google,github
```

The URL and publishable/anon key are designed for browser clients. Never put a service-role key, OAuth client secret, SMTP password, or other privileged secret in a `PUBLIC_` variable. The social-provider list only controls which buttons the site renders; each provider must also be fully configured in Supabase and its provider dashboard before enabling it.

If Supabase URL/key are unset, the page shows a configuration message and disables account actions. Do not enable registration on production until those values are set in the deployment environment.

## Supabase dashboard setup

1. Create or select the r0 Supabase project. Keep Auth email/password enabled and email confirmation enabled.
2. In **Authentication → URL Configuration**, set the production Site URL to `https://r0-ide.vercel.app` and add redirect URLs for `https://r0-ide.vercel.app/auth` and `http://localhost:6079/auth` (plus any actual preview origins used for testing).
3. Configure email templates and a production SMTP provider for verification and recovery. Supabase's default email sender is intended for trials and is rate-limited.
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

## Desktop IDE integration boundary

The website client uses Supabase PKCE and stores its browser session using the Supabase client. The current desktop IDE uses a separate r0 account API: it creates a desktop session, opens the API-provided login URL in the system browser, polls that session, validates the r0 API token, and stores it through the Tauri secure-storage command. The desktop's current API does not accept the Supabase session as an r0 account token.

Therefore, this website implementation does not claim to sign the desktop IDE into the Supabase account. A unified website + desktop identity requires a coordinated backend migration: the r0 API must validate Supabase JWTs or exchange Supabase identities for r0 sessions, and the desktop must implement Supabase PKCE/deep-link completion plus secure refresh-token persistence. That account API source is not in this repository. Keep the existing desktop sign-in and provider features in place until that migration is implemented and tested. Do not pass access or refresh tokens in a callback URL.

## Privacy and terms

The account page keeps a Supabase Auth session in browser storage through the Supabase client. The current `/privacy` and `/terms` pages are drafts. Review and complete them for the actual legal operator, Supabase project region and retention behavior, email/social providers, user rights, account deletion, and contact details before production registration is enabled.
