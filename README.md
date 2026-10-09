# Key-Design Architects, website (rebuild)

Static, multi-page Astro site with a self-serve CMS at `/beheerder`. Replaces
the old single-page React app so the site is real, crawlable HTML instead of
a JavaScript shell.

## What changed vs. the old site

- **Every page is now real HTML**, generated at build time, no more empty
  `<div id="root">` that only fills in after JavaScript runs. This is the fix
  for the "unreadable JavaScript" / SEO problem.
- **No loading screen**, there's nothing to wait for; content is already in
  the page.
- **Each portfolio project has its own real URL** (`/portfolio/project-naam`)
  instead of only existing inside client-side state.
- **The admin CMS still exists** at `/beheerder`, backed by the same Firebase
  project as before, you can still edit every text, project, and photo
  yourself, no code or AI needed.
- **Real login** (Firebase Authentication, email + password) instead of the
  old passcode-in-the-database scheme.
- **Locked-down database**, see `firestore.rules`. Public visitors can read
  content and submit the contact form; only a signed-in admin can edit
  anything or read submitted leads.
- **Contact form emails actually work** now (EmailJS, works on static
  hosting, the old Express/Nodemailer setup silently failed on Netlify).

## One-time setup (do this before your first deploy)

### 1. Install dependencies locally (optional, only if you want to preview)
```bash
npm install
npm run dev
```

### 2. Create your admin login (Firebase Authentication)
The old "beheerderscode" passcode no longer works. Instead:
1. Go to the [Firebase Console](https://console.firebase.google.com) → your
   project (`key-design-architects`) → **Authentication** → **Users**.
2. If "Email/Password" isn't enabled yet: **Sign-in method** tab → enable it.
3. Click **Add user**, enter the email + password you want to log in with at
   `/beheerder`. That's your new login, no code changes needed.

### 3. Deploy the new database rules
The current rules are wide open (`allow read, write: if true`), that's the
security issue we discussed. Replace them:
1. Firebase Console → **Firestore Database** → **Rules**.
2. Paste in the contents of `firestore.rules` from this project.
3. Click **Publish**.

(Do steps 2 and 3 together. If you lock the rules before creating your
admin user, you won't be able to log in and edit content until you do.)

### Login werkt niet? Checklist
If `/beheerder` won't let you in, it's almost always one of these, and the
updated login screen now shows which one:
- **"Geen account gevonden"** → you haven't done step 2 above yet. Go create
  the user in Firebase Console → Authentication → Users.
- **"Dit domein is niet toegelaten"** → Firebase Console → Authentication →
  Settings → **Authorized domains** → add your live domain (e.g.
  `keydesignarchitects.be` and `www.keydesignarchitects.be`) and, if you're previewing on a
  Netlify preview URL, that too.
- **"Ongeldig e-mailadres of wachtwoord"** → check for typos, or reset the
  password for that user directly in Firebase Console.
- Nothing happens at all → check that **Email/Password** sign-in is actually
  enabled under Authentication → Sign-in method (it's off by default).

### 3b. Push the new site copy to your database (important, one-time)
This is a step that's easy to miss: everything I write for you (hero text,
services, the regularisatie section, disclaimers, and so on) only exists in
this project's local files until it's also saved into your live database.
Your site always shows whatever is in the database, not what's in these
files, so without this step the pages that depend on newer content (Diensten,
the homepage vision section, and others) will keep showing old or empty
content even after you deploy.

Run this once, from your own computer (not from a hosting dashboard), after
completing steps 2 and 3 above:

```bash
npm install
SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="yourpassword" node scripts/seed-content.mjs
```

This signs in as you and writes all the current text and the default hero
photo into Firestore. It does not touch your existing portfolio projects.
After it finishes, rebuild and redeploy (or hit "Publiceren" in `/beheerder`)
to see it live. You only need to run this once; after that, every edit you
make in `/beheerder` saves straight to the database as normal.

### 4. Set up EmailJS (so the contact form emails you directly)
1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. Add an **Email Service** (e.g. connect your Gmail/iCloud).
3. Add an **Email Template** with variables: `from_name`, `from_email`,
   `phone`, `location`, `project_type`, `message`.
4. Copy your **Public Key**, **Service ID**, and **Template ID**.

### 5. Set environment variables in Netlify
Netlify dashboard → your site → **Site configuration** → **Environment
variables** → add:
- `PUBLIC_EMAILJS_PUBLIC_KEY`
- `PUBLIC_EMAILJS_SERVICE_ID`
- `PUBLIC_EMAILJS_TEMPLATE_ID`
- `PUBLIC_NETLIFY_BUILD_HOOK` (see step 6, add this one after step 6)

### 6. Create a Netlify build hook (so editing content republishes the site)
1. Netlify dashboard → your site → **Site configuration** → **Build & deploy**
   → **Build hooks** → **Add build hook**. Name it "Publish from CMS".
2. Copy the generated URL and add it as `PUBLIC_NETLIFY_BUILD_HOOK` in step 5.
3. Redeploy once so the env var takes effect.

Once this is done, the **"Publiceren"** button inside `/beheerder` will
trigger a fresh build any time you've edited text or projects.

## Deploying

Just push/upload this project to Netlify as normal:
- Build command: `npm run build` (already set in `netlify.toml`)
- Publish directory: `dist` (already set)

Netlify will run `npm install`, pull the current content from Firestore,
extract any images, and generate the static site automatically.

## Still to do on your end

- **Delete the leftover test project**: I removed "tesjte" from the copy of
  your data I'm shipping in this project, but your *live* database on
  Firestore still has it (my sandbox can't reach the internet to delete it
  remotely). Fastest fix right now: Firebase Console → Firestore Database →
  `projects` collection → delete the document that isn't "Woning Lookstraat".
  Or once you can log in, delete it from `/beheerder` → Projecten, same
  result.
- The feasibility/haalbaarheid calculator now uses the full original
  calculation engine (tiered degressive architect fees, phase-by-phase
  amounts, budget category breakdown), same numbers you'd get from the old
  site, driven by the same CMS rate settings.

## Favicon not showing in Google search results yet?

That's expected right after a redesign/migration, not a sign anything's
misconfigured, I checked and all four standard favicon formats (`.ico`,
`.svg`, 96×96 PNG, Apple touch icon) are correctly linked in every page's
`<head>`, sized and formatted the way Google's guidelines ask for. Google
caches favicons separately from page content and only refreshes them
periodically after it re-crawls a domain, this commonly takes anywhere from
a few days to a few weeks after a real deploy, and there's no way to force it
faster. If it's still not showing a month after going live, that's worth
revisiting.

## How to change logos, photos, texts, and content
Everything goes through `/beheerder`, no code, no re-uploading files:
- **Hero (top of homepage)**: "Hero" tab, switch between a photo slideshow
  and a background video, add/reorder/delete slideshow photos, or paste in
  video URLs. See "Hero: slideshow vs. video" below for the full picture.
- **Texts**: "Site teksten" tab, grouped by section (Hero, Portfolio, Contact,
  Footer, etc.), edit any field, click "Wijzigingen opslaan".
- **Projects**: "Projecten" tab, "+ Nieuw project" to add one, "Bewerken" to
  edit, "Verwijderen" to delete, "☆ Vastpinnen" to feature a project on the
  homepage (pinned projects show first; unpin the same way).
- **Logos/photos**: project and hero photos upload directly in their edit
  forms. Your header/footer logos and Kenneth's portrait aren't yet editable
  from the dashboard (they're files in `public/images/brand/`), say the
  word if you'd like those made editable from `/beheerder` too.
- **Publishing**: saving text/projects/hero updates the database immediately,
  but the live pages are pre-built for speed, hit "Publiceren" (Publiceren
  tab) after making changes to push them live.

## Hero: slideshow vs. video
The homepage hero is now a full-bleed section like Through Renders', and you
can run it two ways, switch anytime in `/beheerder` → **Hero**, no code
needed:

**Fotoslideshow (default)**, add as many photos as you like in the Hero tab;
with two or more, it automatically crossfades between them every 6 seconds.
Each photo can have an optional title/location/year caption shown bottom-left.
Photos are compressed automatically on upload, the same way project photos
are, so there's no file-size limit to worry about.

**Video**, paste in a URL to an already-hosted `.mp4` file (a separate URL
for mobile is optional, useful for a lighter file on phones). Videos are too
large to upload through the dashboard the way photos are, so you'll need to
host the file somewhere first and just link to it. A few straightforward
options, easiest first:
1. **Firebase Storage** (same project as everything else): Firebase Console
   → Storage → upload the .mp4 → click it → copy the "download URL" → paste
   that into the Hero tab.
2. **Cloudinary** (free tier, no technical setup): create an account, upload
   the video, copy the shareable URL.
3. Any other host that gives you a direct link ending in `.mp4`.

If "Video" is selected but no URL has been set yet, the site automatically
falls back to the photo slideshow so the hero is never empty.

## Language toggle (NL/EN)
The header (and mobile menu) has an EN/NL button. Every field on the site
lives in Dutch/Flemish in the CMS, hand-writing a real English version of
every single field would be a genuinely separate project, so this uses
Google Translate under the hood instead: one click flips the whole site to
English (and back), including any future content added through
`/beheerder`, with no extra maintenance required.

Worth knowing: machine translation is good but not perfect, especially for
legal/Orde-specific wording (the Wettelijk Statuut text, disclaimers). If an
English-speaking client base becomes a real priority later, the right next
step is proper English fields per CMS entry with wording reviewed by a
native speaker, that's a bigger, separate piece of work worth planning
separately when it matters.

## Back-to-top button
A floating round button (bottom-right, appears after scrolling ~500px) is
built into the shared page layout, so it's automatically present on every
page with no per-page setup.

## Project structure
```
src/
  layouts/Layout.astro       shared page shell (meta tags, header, footer)
  components/                Header, Footer, MobileMenu, CookieConsent,
                              HeroSection (slideshow/video), ContactForm (React),
                              FeasibilityAssessor (React)
  components/admin/          the /beheerder dashboard (React)
  pages/                     one file per public page
  pages/portfolio/[slug].astro   generates one real page per project
  pages/beheerder/           admin dashboard route (noindex)
  lib/data.ts                reads site_settings.json + projects.json at build time
  lib/firebase.ts            Firestore + Auth client
  data/                      current CMS content snapshot (auto-refreshed by
                              scripts/fetch-content.mjs on every build)
scripts/fetch-content.mjs    pulls latest content from Firestore before build
firestore.rules              locked-down database rules (see setup step 3)
```
