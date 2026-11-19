# Clevorah

Comparisons for starting an online business. Each public page names one favorite and one alternative.

The brief for the site is [clevorah-plan.md](clevorah-plan.md). This app is separate from Predikt.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

Copy `.env.example` to `.env.local` and set the admin email, password, and session secret. The desk path is `ADMIN_PATH`.

Without `MONGODB_URI`, pages and the desk use `data/content.json`. That file is gitignored and is created on the first request from `lib/seed.ts`. When `MONGODB_URI` is set, the same records are stored in MongoDB.

The 20 launch comparisons start as drafts. A draft has no public URL. Publishing requires a first-hand note. The original date is set on the first publish and is not rewritten.

Affiliate buttons stay off a page until that brand has an affiliate URL and is not paused. Commission amounts, country rules, and signup links are typed in the desk. Gemini can fill a draft, and it does not publish the page.
