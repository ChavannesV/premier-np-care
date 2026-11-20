# Premier NP Care

A five-page marketing website for Premier NP Care, a Nurse Practitioner-led telehealth-affiliated practice. The public site is informational only: no patient portal, database, scheduling logic, or EHR integration. A private Keystatic editor saves public website content as JSON in this repository. It supports direct GitHub login or client email/password and passkey login through Keystatic Cloud.

## Run locally

Use Node.js 20.9 or newer, then:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000` for the website and `http://localhost:3000/admin`
for the editor. No account or environment variables are needed for local
browsing/editing. Nunito Sans and Cormorant Garamond are bundled through
Fontsource, so development and builds do not fetch fonts from Google. If the port is occupied, run `npm run dev -- --port 3100`.
The development server defaults to **local** storage: Save writes JSON and
uploaded images to this checkout, and Next.js refreshes the page. It does not
publish anything. Commit those changes when ready.

`.env.example` documents optional email settings and production editor setup.
No patient information belongs in the editor: it manages public website content.

## Editing the website

In production, bookmark `https://www.premiernpcare.com/admin` and sign in
with the account invited to the client's Keystatic Cloud team, or a GitHub
account with repository write access when direct GitHub mode is configured.

| Editor section | What can be changed |
| --- | --- |
| Practice information | Practice name, phone, address, service area, hours, minimum patient age, booking URL, accepting-new-patients status |
| Insurance | Summary, coverage note, plans and which plans are featured |
| Provider | Name, credentials, role, photograph, biography and mission |
| Services | Service titles, descriptions, lists, images and ordering |
| Shared content | Practice highlights, visit steps, patient fit and provider standards |
| Pages | Homepage, Provider, Services, How It Works and Contact copy, including search titles/descriptions |

Fields explain their purpose. Required text, URLs and list sizes are validated.
Photos are saved in the repository. Layout, styling, page routes and application
behavior stay in code.

**Production publishing:** edit → Save on the production branch (`main`) →
GitHub commit → Vercel rebuild → updated website after a successful deployment.
Saving is not instant publication; wait for the deployment to finish. A save on
another branch produces a preview when configured, and requires merging before
it reaches production. A failed build leaves the last successful deployment live.
GitHub commit history provides an audit trail; reverting a content commit and
letting Vercel rebuild restores the prior content.

**Local publishing:** Save only updates your checkout. Verify locally, commit,
and push to the configured production branch to trigger publication.

Public pages read validated JSON at build time. They do not call GitHub or
Keystatic while a visitor browses. Shared practice facts also populate search
engine structured data. An invalid hand-edited file fails the build with the
file name and field errors.

### Content files

- `src/content/data/`: editor-managed content.
- `keystatic.config.ts`: local, GitHub or Cloud storage and editor sections.
- `src/content/page-editor.ts`: page editor fields.
- `src/lib/content.ts`: shared content exports consumed by the website.
- `src/lib/config.ts`: booking and phone values from editable practice settings.
- `public/images/`: site photos and uploaded images.

`NEXT_PUBLIC_BOOKING_URL` and `NEXT_PUBLIC_PHONE_NUMBER` no longer override the
editor. Update those fields under Practice information instead. Email delivery
credentials and the contact form destination remain environment variables.

### Client handover with email or passkey login (recommended)

Keystatic Cloud handles editor authentication while content and ordinary image
uploads remain in GitHub. Editors can use email/password or passkeys without a
GitHub account. A GitHub account or organization is still needed to **own the
repository** after transfer. The client should own their Cloud team, repository,
Vercel project and domain; avoid depending on the developer's personal accounts.

1. Transfer the GitHub repository to the client's account/organization and the
   Vercel project to their team. Confirm the Git integration, production branch
   `main`, domain and existing contact-email settings after transfer.
2. Create a dedicated **client-owned** team/project at
   [Keystatic Cloud](https://keystatic.cloud). Connect the transferred repository
   and grant its GitHub integration access to that repository. Copy the actual
   `team/project` identifier from the Cloud project's settings.
3. Invite the client's editors to that Cloud team. Team members can access all
   projects in their team, so keep different clients in separate teams. Cloud
   currently allows up to three users per team on its free plan; confirm current
   [pricing and authentication details](https://keystatic.com/docs/cloud).
4. Set these **Production** variables in the client's Vercel project:

   ```text
   NEXT_PUBLIC_KEYSTATIC_STORAGE=cloud
   NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT=actual-client-team/actual-project
   ```

   Cloud mode does not need the four direct-GitHub `KEYSTATIC_*` credentials
   listed below. `NEXT_PUBLIC_KEYSTATIC_REPO` is used only by direct GitHub mode;
   update it to the transferred repository if retaining that option.
5. Redeploy after changing these build-time variables. The Cloud OAuth return
   path is `/keystatic/cloud/oauth/callback`; follow the project's Cloud setup
   for its production domain. Do not use the direct-GitHub API callback below.
6. Test **as the client**: open `/admin`, sign in, edit a small piece of content,
   Save on `main`, verify its GitHub commit and Vercel production deployment,
   then undo the change. If Vercel blocks the commit author, resolve the account/
   team permissions or plan before handover. A successful editor save alone
   does not prove auto-publishing works.
7. Give the client the `/admin` bookmark and demonstrate edits, image uploads,
   waiting for deployment and reverting a change. Once their access and
   publishing work, remove the developer's access if they want full handover.

The code supports Cloud mode now; connecting a real Cloud project and testing
client authentication are separate setup steps. Leaving storage unset preserves
local editing in development and direct GitHub mode in production. Invalid
Cloud configuration shows a setup message, without breaking the public site.

### Connect GitHub publishing (one-time setup)

1. Connect this repository to the Vercel project and confirm its production
   branch is `main`. The default repository is
   `supertrens/premier-np-care`; set `NEXT_PUBLIC_KEYSTATIC_REPO=owner/name` if
   it changes. Do not copy the AllAges GitHub App credentials.
2. Set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` locally and restart `npm run dev`.
   With no Keystatic credentials configured yet, open `/admin` and use the
   setup flow to create a GitHub App. Set its deployed URL to
   `https://www.premiernpcare.com` and install it only on this repository.
3. Copy the generated `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and
   `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to the Vercel project's environment
   variables. Keep secrets in environment settings, never in content or Git.
4. Confirm the GitHub App callback includes
   `https://www.premiernpcare.com/api/keystatic/github/oauth/callback`.
   Add other editor hostnames explicitly if used. Give the owner's GitHub
   account write access to this repository.
5. In production leave `NEXT_PUBLIC_KEYSTATIC_STORAGE` unset (GitHub is the
   production default), or set it to `github`. **Never set it to `local`.**
   Redeploy after adding the credentials or changing any `NEXT_PUBLIC_*` setting.
6. Test one harmless editor change on the production branch: confirm the
   GitHub commit, a successful Vercel production deployment, and the live
   change. Undo the test through the editor. Check commit-author permissions
   in Vercel if GitHub commits do not trigger deployments.

For direct Save-to-publish, the owner must be allowed to commit to the
production branch. If the repository requires pull requests, use
branch → review/merge → publish instead; saving a branch alone will not update
production. Do not silently bypass existing repository protections.

Production editing refuses local disk writes. Without GitHub App credentials,
the public site still builds and runs, but the editor API reports that setup is
required. `/admin`, `/keystatic` and `/api/keystatic` are excluded from indexing;
GitHub permissions control production editing access.

Setup reference: [Keystatic GitHub mode](https://keystatic.com/docs/github-mode).

## Verification

Storage-mode checks (Node.js 22.18+):

```bash
node --experimental-strip-types --test scripts/editor-storage.test.mjs
```

```bash
npm run lint
npm run typecheck
npm run build
# With npm run dev running in another terminal:
npm run smoke
SMOKE_EDITOR_WRITES=1 npm run smoke  # temporary edit → render → restore
```

The smoke test checks public pages, mobile navigation and the local editor.
With `SMOKE_EDITOR_WRITES=1`, it also makes temporary content edits and restores
them; that option is limited to a local checkout. It uses installed Google Chrome by default. See the script for
browser/URL options. Production login, commits and Vercel republishing must be verified after
connecting the chosen GitHub App or Keystatic Cloud project.

### Dependency maintenance

This change retains the existing Next.js 16.2.9 version. `npm audit` currently
reports advisories in the dependency tree, including Next.js; a framework and
dependency security update should be handled before the next production launch.
The local editor and production build checks above pass, but they are not a
security audit.

## Contact Form And Resend

The contact form posts to `POST /api/contact` and sends email through Resend only when these env vars are configured:

```bash
RESEND_API_KEY="re_placeholder"
CONTACT_TO_EMAIL="practice@example.com"
CONTACT_FROM_EMAIL="Premier NP Care <hello@your-verified-domain.com>"
```

When configured, every contact submission sends two emails:

- A practice notification to `CONTACT_TO_EMAIL`, with the patient email set as the reply-to address.
- A confirmation email to the patient email address entered in the form.

Use a verified Resend sender/domain for `CONTACT_FROM_EMAIL` before production. The temporary `onboarding@resend.dev` address is useful for early testing, but a verified practice domain is needed for reliable patient confirmations.

In development, missing Resend env vars return a placeholder success response so the form can be tested without sending email. In production, missing env vars return a configuration error.

Do not ask patients to include urgent concerns or sensitive medical details in the contact form.

## Deploy To Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in Vercel.
3. Add the environment variables above in Vercel Project Settings.
4. Deploy. Vercel auto-detects Next.js.

Useful checks before deployment:

```bash
npm run lint
npm run build
```

## Search And Indexing

The production domain is:

`https://www.premiernpcare.com` (configured in `src/lib/site.ts`).

The site generates:

- `https://www.premiernpcare.com/robots.txt`
- `https://www.premiernpcare.com/sitemap.xml`

After deployment, connect the domain in Google Search Console:

1. Open Google Search Console.
2. Add `https://www.premiernpcare.com/` as a URL-prefix property, or verify the root domain with DNS.
3. Submit `https://www.premiernpcare.com/sitemap.xml`.
4. Use URL Inspection for `https://www.premiernpcare.com/`.
5. Request indexing for the homepage.

Google indexing is not instant; allow several days to a few weeks for consistent search visibility.

## Pre-Launch Review Checklist

- Confirm the exact credential line and licensing language for Virginie Chavannes, APN.
- Review approved service imagery in `public/images/client/`.
- Confirm the domain in `src/lib/site.ts` and the booking URL in the editor.
- Complete the GitHub App setup and verify Save → commit → production deployment.
- Add Resend environment variables.
- Review service scope and safety language with the provider.
- Confirm `https://www.premiernpcare.com/robots.txt` and `https://www.premiernpcare.com/sitemap.xml` return `200`.
- Submit the sitemap in Google Search Console.
- Submit a test contact form in production preview before launch.
