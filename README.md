# Takarda — website source

A static, no-build website for **Takarda**, a book club connecting Northern
Nigeria's past, present and future. Three pages (Home, Blog, Eco-Reading
Project / Donate), built with plain HTML, Tailwind CSS, and a small
vanilla-JS file — deploys to Vercel with zero configuration.

## What's in here

```
takarda/
├── index.html          Home (hero, mission, past/present/future, impact
│                        gallery, About + team, join-community, eco teaser)
├── blog.html            Blog listing with Past/Present/Future filters
├── donate.html          Eco-Reading Project + Paystack donate button
├── css/
│   └── custom.css        Design tokens, the deckle-edge motif, badges,
│                          timeline thread, scroll gallery, buttons, motion
├── js/
│   └── main.js            Mobile nav, scroll-reveal, gallery arrows,
│                            blog filter, join-form handler, footer year
├── assets/
│   ├── logo.png, logo-*.png   Your logo at several sizes
│   └── favicon.png, favicon-32.png
├── tailwind.config.js    Design tokens, for the optional compiled build
├── postcss.config.js
├── src/input.css         Tailwind entry point, for the optional compiled build
├── package.json
├── vercel.json           Static hosting + cache headers
└── .gitignore
```

The three HTML pages currently load Tailwind from the **Play CDN**
(`cdn.tailwindcss.com`) with an inline config, so **the site works exactly
as-is with no build step** — just upload the folder or point Vercel at it.
`tailwind.config.js` / `src/input.css` / the `build:css` script are included
so you can switch to a compiled stylesheet later if you want (see below).

## Design system

- **Colors** — `violet` (#6C4CF1, primary), `coral` (#FF5D8F), `lime`
  (#D6FF3F), `sky` (#22C7B5), on a plain white background with near-black
  `ink` (#161221) text. All defined once in `tailwind.config.js` and mirrored
  in the inline config in each HTML file, plus as CSS custom properties in
  `css/custom.css` — change a hex in both places to retint the whole site.
- **Type** — Lora (display/headings), Inter (body/UI), Caveat (the hand-drawn
  sticker badges), loaded from Google Fonts.
- **Impact gallery lightbox** — clicking any of the 5 impact photos opens a
  full-screen viewer with prev/next arrows, Escape-to-close, and click-outside
  -to-close. It works with the current placeholder tiles; once you drop a real
  `<img>` into a trigger button, the lightbox automatically shows that photo
  enlarged instead of the placeholder text (see `js/main.js`, the
  `render()` function, if you want to adjust how it detects images).

## Deploy to Vercel — fastest path

1. Go to [vercel.com/new](https://vercel.com/new).
2. Drag this whole `takarda` folder onto the page (or import it from a
   GitHub repo — push this folder as-is, no build command needed).
3. Framework preset: **Other**. Leave build command and output directory
   blank. Click **Deploy**.

That's it — Vercel serves static files directly, and `vercel.json` adds
long-cache headers for `/assets`, `/css`, and `/js`.

### Or with the Vercel CLI

```bash
npm i -g vercel
cd takarda
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

## Before you launch — things to swap in

1. **WhatsApp community link** — every "Join our community" button (header,
   hero, the `#community` section on the homepage, and all three footers)
   currently points to:
   ```html
   https://chat.whatsapp.com/REPLACE_WITH_YOUR_INVITE_CODE
   ```
   Search all three HTML files for `REPLACE_WITH_YOUR_INVITE_CODE` and
   replace it with your real group invite link (in WhatsApp:
   **Group → Group info → Invite via link**).

2. **Paystack link** — open `donate.html`, find the "Donate via Paystack"
   button, and replace the placeholder URL:
   ```html
   <a href="https://paystack.com/pay/takarda-eco-reading" ...>
   ```
   with your real Payment Page link from **Paystack Dashboard → Payment
   Pages → your page → Share link**. (If you'd rather collect card details
   without leaving the site, swap this for Paystack's Inline/Popup JS —
   see their docs at https://paystack.com/docs/payments/accept-payments/.)

3. **Impact gallery photos** — in `index.html`, search for
   `photo-placeholder`. There are five slots; replace each
   `<div class="photo-placeholder ...">…</div>` with an `<img>` tag once you
   have the real photos.

4. **Team photos** — each of the three cards in the About section of
   `index.html` has a square placeholder ("Amina's photo — add here", etc.).
   Save your real headshots like this:

   - **Format:** JPG or WEBP (WEBP compresses smaller at the same quality)
   - **Aspect ratio:** square (1:1) — crop the photo to a square before saving
   - **Size:** at least 800×800px, so it stays sharp on retina screens
     (the site displays it smaller and lets the browser scale down)
   - **File size:** aim under ~300KB each after compression, for fast loading
   - **Color:** sRGB color profile (the default for virtually every camera/phone)
   - **Filename:** kebab-case, saved into a new `assets/team/` folder —
     `assets/team/amina-bello.jpg`, `assets/team/yusuf-danladi.jpg`,
     `assets/team/zainab-ibrahim.jpg`

   Then in `index.html`, replace each placeholder `<div>` with an `<img>`.
   For example, Amina's card currently has:
   ```html
   <div class="photo-placeholder aspect-square flex items-center justify-center p-6 text-center">
     <span class="text-ink-70 text-sm">Amina's photo<br />— add here</span>
   </div>
   ```
   Replace it with:
   ```html
   <img src="/assets/team/amina-bello.jpg" alt="Amina Bello" class="aspect-square w-full object-cover" />
   ```
   Repeat for Yusuf's and Zainab's cards, and update the placeholder
   names/bios/roles at the same time if anything's changed.

5. **Join-community form** — `js/main.js` currently only shows a client-side
   confirmation message; it doesn't send anywhere yet. Point it at a real
   provider — the easiest options are:
   - [Formspree](https://formspree.io) or [Buttondown](https://buttondown.email) —
     just change the form's `action` attribute and remove the JS
     `preventDefault()` block for `#join-form` in `main.js`.
   - Your own API route / serverless function, if you add one later.
   The newsletter form on `blog.html` needs the same treatment.

6. **Stock photography** — the market, book and community photos are
   hotlinked from Unsplash (free license, no attribution required) as
   realistic placeholders. Swap the `src` attributes for your own
   photography whenever you're ready — Northern Nigeria market days,
   actual club meet-ups, real reading corners will read much better than
   stock.

7. **Copy** — placeholder founder names (Amina Bello, Yusuf Danladi) and
   strategist (Zainab Ibrahim), sample blog posts, and the impact numbers
   on the donate page (`3 reading corners`, `640+ books`, etc.) are all
   sample content. Replace with your real details before launch.

8. **Email / social links** — `hello@takarda.club` and the Instagram/X/
   WhatsApp icons in the footer currently point to placeholders (`#`).
   Update `href`s across all three pages.

## Switching to a compiled Tailwind build (optional)

The CDN approach above is genuinely fine for a site this size. If you'd
rather ship a smaller, offline-buildable stylesheet:

```bash
npm install
npm run build:css        # writes css/tailwind-build.css
```

Then in each HTML file, remove the `<script src="https://cdn.tailwindcss.com">`
block and the inline `tailwind.config = {...}` script, and add instead:

```html
<link rel="stylesheet" href="/css/tailwind-build.css" />
```

`vercel.json` doesn't need to change — Vercel will still serve the folder
as static files as long as you commit the generated `css/tailwind-build.css`
(or add a `buildCommand`/`outputDirectory` to run `npm run build:css` during
deploy).

## Local preview

No build required:

```bash
npx serve .
```

or simply open `index.html` in a browser.

## Accessibility & performance notes

- Every page has a skip-link, visible focus states, and respects
  `prefers-reduced-motion`.
- Images use descriptive `alt` text — update it if you swap in new photos.
- The mobile nav, blog filters, and impact gallery are all
  keyboard-operable.
