
# ReelFactory.xyz — Reel Making Agency Website

A bright, pastel, fully-animated international reel-making agency site in English, with AI-generated copy and imagery, dynamic team profiles, and a no-login admin panel.

## ⚠️ Security Note
You chose **no login** for the admin panel. This means anyone who discovers the admin URL can edit team data, reviews, and FAQs. I'll place it at a non-obvious path (e.g. `/admin-panel-rf`), but **I strongly recommend adding at least a password later**. You can ask me to add one anytime.

---

## 🎨 Visual Style
- **Palette:** Bright pastels — soft pink, peach, mint, lavender, sky blue, butter yellow on a clean white/cream background.
- **Typography:** Playful, modern sans-serif headings + clean readable body font.
- **Animations:** Smooth fade-ins on scroll, floating shapes in the background, gradient blob accents, hover scale effects, marquee for client logos, animated gradient buttons.
- **Vibe:** Friendly, creative, Gen-Z reel-creator energy — international and professional.

---

## 📄 Pages

### 1. Home (`/`)
- Animated hero with bold tagline ("Reels that make brands unforgettable")
- AI-generated hero illustration
- Stats counter (reels delivered, brands served, views generated)
- Service highlights (3–4 cards)
- Featured artists carousel
- Selected reviews
- Animated CTA section

### 2. Services (`/services`)
- Full service offerings: Short-form reels, UGC content, brand storytelling, podcast clips, ad creatives, motion graphics
- Each service: AI-generated icon/image, description, what's included
- Process timeline (Brief → Concept → Shoot → Edit → Deliver)
- Pricing-style packages (optional CTA blocks)

### 3. Reels / Feels (`/feels`)
- Showcase grid of past reel work
- AI-generated thumbnails representing different reel styles (fashion, food, tech, lifestyle, fitness)
- Category filters
- Hover preview animations

### 4. Artists (`/artists`)
- Grid of all team members with photo, name, role
- Click → individual profile page at `/artists/[auto-slug-from-name]`

### 5. Artist Profile (`/artists/$slug`)
- Hero with photo, name, role
- Bio
- Skills (tag list)
- Contact: email, phone (click to call/mail)
- **Per-member reviews section**
- **Per-member FAQ section**
- Back to all artists

### 6. Contact (`/contact`)
- Animated contact form (name, email, message) — submissions saved to database
- Agency email, phone, social links
- Decorative AI-generated illustration

---

## 🛠 Admin Panel (`/admin-panel-rf` — no login)

Tabs for managing:
- **Team Members:** Add / edit / delete. Fields: name, photo upload, role, skills (tags), phone, email, bio. URL slug auto-regenerates from name on save.
- **Per-member Reviews:** Add/edit/delete reviews tied to each artist (reviewer name, rating, text)
- **Per-member FAQs:** Add/edit/delete Q&A tied to each artist
- **Contact Submissions:** View messages received from contact form

---

## 🔗 Auto-URL Behavior
When you change an artist's name in the admin, the slug auto-updates (e.g. "John Doe" → `/artists/john-doe`, rename to "John Smith" → `/artists/john-smith`). Old URL will 404 (since you chose auto-slug without redirects).

---

## 🗄 Backend (Lovable Cloud)
Tables:
- `team_members` (id, name, slug, role, photo_url, skills[], phone, email, bio)
- `member_reviews` (id, member_id, reviewer_name, rating, review_text)
- `member_faqs` (id, member_id, question, answer)
- `contact_submissions` (id, name, email, message, created_at)
- Storage bucket for team photos

Public read access for site visitors; open insert/update/delete on admin tables (per your no-login choice).

---

## 🤖 AI-Generated Content
I'll use Lovable AI (Nano Banana) to generate:
- Hero illustration (pastel, animated reel/camera theme)
- Service category images (6 images)
- Reel showcase thumbnails (8–10 images for the Feels page)
- Contact page illustration
- Default placeholder avatars
- All marketing copy (headlines, service descriptions, sample reviews/FAQs) in polished international English

---

## 🌍 Other Details
- Fully English, international tone
- Responsive (mobile, tablet, desktop)
- SEO meta tags per page (title, description, og:image)
- Smooth page transitions
