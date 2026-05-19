# F1 Pit Wall Insights

**Analytics for product builders. Not dashboards for BI teams.**

> Prototype analytics locally. Keep your UI product-native. Grow into Sisense-powered embedded analytics — **without rebuilding anything.**

<p align="center">
  <a href="https://frontend-two-tau-54.vercel.app"><strong>🚀 Live Demo</strong></a> ·
  <a href="https://github.com/lugypresko/sisense-test"><strong>⭐ GitHub</strong></a> ·
  <a href="https://notebooklm.google.com/notebook/b7b9326b-3728-4bc0-9502-e5f505da2b52"><strong>📖 Explainer</strong></a>
</p>

---

## 📸 See It Working

![F1 Pit Wall Dashboard - VER vs PER comparison showing lap trends, tyre degradation, and pit-wall strategy insights](docs/screenshots/f1-pit-wall-hero.png)

**What you're seeing:**
- Real F1 telemetry analytics
- Live driver comparison (Verstappen vs Pérez)
- Lap timing trends, tyre degradation, strategy cards
- Built in React. Powered by processed data.
- **No Sisense account. No setup. No BS.**

---

## ⚡ Get Started in 90 Seconds

```bash
# 1. Clone
git clone https://github.com/lugypresko/sisense-test.git
cd sisense-test/frontend

# 2. Install
npm install

# 3. Run
npm run dev

# 4. Open browser
# http://localhost:5173
```

**That's it.** You now have a working analytics dashboard.

✅ **Local data** — no server setup  
✅ **Real charts** — not mockups  
✅ **Product-native UI** — not an iframe  
✅ **Your code** — fully editable  

---

## 🎯 What This Is (And What It's Not)

### This IS:
- A real React analytics app you can fork and customize
- A walkthrough of the modern builder journey (prototype → product → platform)
- A proof that you don't need BI tools to start building analytics features
- A bridge from local prototyping to production-grade embedded analytics

### This is NOT:
- Another Sisense feature demo
- A BI dashboard in an iframe
- Enterprise software you need to configure for hours
- "Yet another analytics template"

---

## 🚦 Which Path Are You Taking?

### Path 1: Just Want to See It Work? ✨
**You're done.** Run the 3 commands above, open the dashboard, explore. Takes 2 minutes.

---

### Path 2: Fork & Customize It 🔧
You have a product idea. You want analytics inside it. This repo shows how.

**Good first forks:**
- Replace F1 with your domain (SaaS metrics, sports, supply chain, whatever)
- Add another race dataset or driver comparison
- Customize the UI to match your product
- Extend with more KPI cards or visualizations
- Deploy to Vercel (one-click)

**Start here:** [Customize Guide](#customization)

---

### Path 3: Connect Real Data (Sisense) 📊
Your prototype works. Now you want:
- ✅ Real data governance
- ✅ Reusable analytics components
- ✅ Production-grade data modeling
- ✅ Sisense Studio integration

**Go here:** [Add Sisense in 5 Minutes](#add-sisense)

---

## 🏗️ How This Works (The Strategy)

You've probably been told:

> "Start inside the BI platform. Design in Sisense Studio. Everything will work."

**But actual developers:**

1. Start with a **product idea** (not a platform)
2. **Vibe-code** a prototype in their stack
3. **Test locally** to validate the experience
4. **Shape the UI** around the real workflow
5. **Only then** add governance + platform infrastructure

This repo shows that exact journey.

```
Idea → Local Prototype → Validate UX → Add Sisense → Ship
```

The key insight:

> **You don't need Sisense to prove the dashboard works.  
> You need Sisense to make it scale, govern it, and keep it maintainable.**

This repo proves step 1-4 work great without Sisense.  
Then step 5 shows how Sisense fits naturally.

---

## 📖 Project Structure

```
frontend/
├── src/
│   ├── analytics/
│   │   ├── providers/
│   │   │   ├── local.ts          ← Local data provider
│   │   │   └── sisense.ts        ← Sisense Compose SDK
│   │   └── hooks/
│   ├── components/
│   │   ├── DashboardHome.tsx     ← Main dashboard
│   │   ├── ComparisonView.tsx    ← Driver comparison
│   │   └── sisense/
│   │       └── SisenseLapChart.tsx ← Sisense component example
│   ├── data/
│   │   └── f1-telemetry.json     ← Processed F1 data
│   └── App.tsx
├── .env.local                     ← Configuration (see setup below)
├── vite.config.ts
└── package.json

sisense/
├── f1-data-model.ts              ← Generated data model
└── setup-guide.md

docs/
├── screenshots/
└── architecture.md
```

**Key design:** Analytics provider boundary at `src/analytics/providers/`.

The dashboard doesn't care if data comes from local files or Sisense.  
That keeps iteration fast while preserving a clean upgrade path.

---

## 🚀 Run Modes Explained

### Local Mode (Default)

This is how the repo works out of the box.

```bash
npm run dev
```

**How it works:**
- Dashboard reads from local JSON files
- Data is processed F1 telemetry
- Charts render instantly (no network)
- Full editing freedom

**When to use:**
- First time exploring
- Testing the product experience
- Prototyping without platform setup
- Local development/iteration

**No configuration needed.** It just works.

---

### Sisense Mode (Optional)

Once you've validated locally, connect real data.

```bash
# Create .env.local in frontend/ directory
VITE_ANALYTICS_PROVIDER=sisense
VITE_SISENSE_URL=https://your-sisense-instance.sisense.com
VITE_SISENSE_TOKEN=your-api-token
VITE_SISENSE_DATASOURCE=F1_Pit_Wall
```

**How it works:**
- Dashboard uses Sisense Compose SDK
- Queries come from your Sisense instance
- Same UI, real data backend
- Full Sisense Studio integration

**When to use:**
- Production analytics
- Multi-user access with governance
- Real company data
- Scaling beyond your laptop

**If config is missing:**
App stays up and shows a helpful message:
```
Sisense Mode requires environment variables.
Running in Local Mode instead.
```

No crashes. No friction.

---

## ⚙️ Add Sisense in 5 Minutes

### Step 1: Create Trial Account
[Sign up for Sisense (7-day free trial)](https://www.sisense.com/trial/)

Takes 2 minutes. No credit card required.

### Step 2: Upload Sample Data

In Sisense Studio:
1. Go to **Data** → **Add Data**
2. Upload the F1 CSV files from `/data/f1-telemetry.csv`
3. Note the data source name (e.g., `F1_Pit_Wall`)

### Step 3: Generate Data Model

Run this command:

```bash
npx @sisense/sdk-cli get-data-model \
  --url https://your-instance.sisense.com \
  --token your-api-token \
  --dataSource "F1_Pit_Wall" \
  --output src/sisense/f1-data-model.ts
```

Generates a TypeScript file with full type safety for queries.

### Step 4: Create .env.local

```bash
# frontend/.env.local
VITE_ANALYTICS_PROVIDER=sisense
VITE_SISENSE_URL=https://your-instance.sisense.com
VITE_SISENSE_TOKEN=your-api-token
VITE_SISENSE_DATASOURCE=F1_Pit_Wall
```

### Step 5: Restart & You're Done

```bash
npm run dev
```

Dashboard now pulls data from Sisense.

✅ Same UI  
✅ Real data  
✅ Production-ready  

---

## 🧩 Customization: Make It Yours

### Replace F1 with Your Domain

The dashboard structure is generic. The data is just F1 telemetry.

**Change the data:**

1. Replace `/frontend/src/data/f1-telemetry.json` with your own dataset
2. Update `/frontend/src/types/analytics.ts` to match your schema
3. Update chart components to use your metrics
4. Done.

**Example:** Replace `lap_time`, `tyre_degradation`, `gap_to_leader` with your metrics.

### Add Another Comparison

Currently: Verstappen vs Pérez

Want: Hamilton vs Russell? Leclerc vs Sainz? Users vs competitors? Revenue by region?

**File to change:** `src/components/ComparisonView.tsx`

Current flow uses a hardcoded pair. Make it dynamic.

### Replace a Chart with Sisense

Don't replace everything at once.

Replace one chart:

1. Remove the local chart component
2. Add a Sisense Compose SDK component
3. Query the same metric from Sisense
4. Test that it works
5. Move to the next chart

This is the **bridge approach.** Gradual migration. Zero risk.

**Example:**
```typescript
// Before (local)
import { LapTimeChart } from './charts/LapTimeChart';

// After (Sisense)
import { SisenseLapTimeChart } from './sisense/SisenseLapTimeChart';
```

### Deploy to Vercel

One-click deployment:

```bash
npm install -g vercel
vercel
```

Follow prompts. Your dashboard is live.

If you added Sisense, pass environment variables to Vercel:
```
VITE_SISENSE_URL=...
VITE_SISENSE_TOKEN=...
```

---

## 💡 Suggested First Forks

Pick one and start:

1. **Add Another F1 Race**
   - Use Monaco, Silverstone, or Austin telemetry
   - Add a race selector dropdown
   - Compare same drivers across different tracks

2. **Build a "Head to Head" Mode**
   - HAM vs RUS comparison
   - LEC vs SAI comparison
   - Dynamic driver selection
   - Share comparison link

3. **Replace One Chart with Sisense**
   - Keep everything local except lap trends
   - Verify Sisense connection works
   - Expand to other charts

4. **Customize for Your Domain**
   - Same UI, your data
   - SaaS metrics (MRR, Churn, LTV)
   - E-commerce (Sales, AOV, CAC)
   - Supply chain (Lead times, inventory turns)
   - Pick your domain

5. **Add AI Chat Panel**
   - "What's the biggest gap between these drivers?"
   - "Should we pit now or on the next lap?"
   - Natural language queries against the data
   - OpenAI + Sisense Compose SDK

---

## 🏛️ Architecture & Design

### Why a Provider Boundary?

This matters for the conversion journey.

```
┌─────────────────────────────────────────┐
│         F1 Pit Wall Dashboard           │
│     (Product-native, fully custom)      │
└────────────────┬────────────────────────┘
                 │
         Analytics Provider
         (One interface, two implementations)
         │
    ┌────┴──────┐
    │            │
    ▼            ▼
Local Mode    Sisense Mode
(JSON files)  (Compose SDK)
```

**Benefits:**

- Dashboard doesn't know or care where data comes from
- Can switch providers without touching UI code
- Prototype with local data
- Upgrade to Sisense without rewriting
- Easy to add other providers (BigQuery, Postgres, etc.)

### Component Flow

```
App.tsx
├── <SisenseContextProvider> (if Sisense enabled)
├── <DashboardHome>
│   ├── <DriverSelector>
│   ├── <ComparisonView>
│   │   ├── <KPICard>
│   │   ├── <LapTrendChart>
│   │   ├── <TyreDegradationChart>
│   │   ├── <DriverDeltaChart>
│   │   └── <PitWallStrategyCard>
│   └── <InsightAssistant>
```

Each component is **provider-agnostic.**

If data is local, it queries the local provider.  
If Sisense is configured, it queries Sisense.  
Same component code.

---

## 🔌 Sisense Integration Details

### What Gets Connected?

When you add Sisense environment variables:

1. **Compose SDK loads** (if `VITE_SISENSE_URL` is defined)
2. **SisenseContextProvider wraps the app** (authentication + session)
3. **Query components use Sisense hooks** (instead of local data)
4. **Same UI renders** (no visual difference)

### The Bridge Approach

You don't have to replace everything at once.

**Phase 1:** Keep everything local (2 min to see it work)  
**Phase 2:** Add Sisense config, one chart still uses local data  
**Phase 3:** Replace charts incrementally  
**Phase 4:** All charts use Sisense  

Each phase is reversible. If Sisense breaks, fall back to local.

### Example: Replacing One Chart

```typescript
// src/components/ComparisonView.tsx

// Check if Sisense is configured
const isSisenseEnabled = !!process.env.VITE_SISENSE_URL;

export function LapTrendVisualization() {
  if (isSisenseEnabled) {
    // Use Sisense Compose SDK component
    return <SisenseLapTimeChart driverId={driverId} />;
  } else {
    // Fall back to local data
    return <LocalLapTimeChart data={localData} />;
  }
}
```

---

## ❓ FAQ

### Do I need a Sisense account to run this?

**No.** Local mode works immediately. Zero setup.

Sisense is optional, for when you want production features (governance, multi-user, real data).

### Can I use my own data?

**Yes.** Replace the JSON files in `src/data/` with your own dataset.

Update the types in `src/types/analytics.ts` to match your schema, then update components.

### How do I deploy this?

**Vercel (recommended):**
```bash
npm install -g vercel
vercel
```

**Other platforms:**
- Netlify: `netlify deploy --prod --dir dist`
- AWS: Build → upload to S3 + CloudFront
- Docker: See `Dockerfile` in repo

### What if Sisense config fails?

App won't crash. It shows a helpful message and falls back to local mode.

You can still develop and test.

### Can I use this in production?

**Local mode:** Not recommended for production (data is hardcoded).

**Sisense mode:** Yes. Sisense is designed for production analytics.

Governance, multi-user, real-time data, all baked in.

### How much does Sisense cost?

Free trial: 7 days, full features.  
Pricing: [See Sisense pricing](https://www.sisense.com/pricing/)

For embedded analytics, pricing is per-user or per-API-call. Talk to sales for your use case.

### Can I fork this and sell it?

Yes. This repo uses [MIT License](LICENSE).

Fork, customize, deploy, make money. We only ask you credit Sisense in your README (and this is genuinely useful for discovery).

### How do I add more metrics?

1. Add new fields to your data (JSON or Sisense)
2. Create a new component for the metric
3. Add it to the comparison view
4. Done.

See [Customization Guide](#customization) for examples.

### What if I get stuck?

- **Setup issues:** Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- **Code questions:** Open an issue on GitHub
- **Sisense questions:** [Sisense Compose SDK Docs](https://sisense.dev)
- **Ideas for extensions:** Drop a GitHub discussion

---

## 🔗 Useful Links

- **[Sisense Free Trial](https://www.sisense.com/trial/)** — Get started
- **[Compose SDK Playground](https://sisense.dev/playground)** — Interactive sandbox
- **[Compose SDK Docs](https://sisense.dev)** — Full API reference
- **[Sisense GitHub](https://github.com/sisenseteam)** — Sample code & MCP
- **[Live Demo](https://frontend-two-tau-54.vercel.app)** — See it in action

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts (local) + Sisense Compose SDK (optional)
- **Data:** Processed F1 telemetry (JSON)
- **Hosting:** Vercel (recommended)
- **Analytics:** Sisense Compose SDK (optional)

---

## 📊 Implementation Status

### ✅ Implemented

- React + Vite + TypeScript frontend
- Local data provider (JSON files)
- F1 pit-wall decision dashboard UI
- Driver comparison flow (Verstappen vs Pérez)
- KPI cards (gap, stint drop, turning point)
- Lap time trend visualization
- Driver delta (time gap over race)
- Tyre degradation view
- Pit-wall strategy cards
- Insight assistant panel
- Sisense mode configuration
- `SisenseContextProvider` wrapper
- Graceful fallback when Sisense env vars missing
- Compose SDK proof-of-concept: `SisenseLapTimeChart`

### 🚀 Ready for Extension

- Full Sisense-backed chart replacement (one-by-one)
- Additional Compose SDK components
- More F1 race datasets
- Multi-driver comparison (arbitrary pairs)
- Multi-race analysis
- AI-powered pit-wall race summaries
- StackBlitz / CodeSandbox live editor version
- Technical screencast walkthrough
- Production deployment checklist

---

## 📈 How This Converts (PLG Strategy)

This repo is designed as a **developer-led growth motion.**

### Step 1: Acquisition (Right Now)

CTA: **"Clone this repo. See analytics work in 90 seconds."**

Not: "Sign up for Sisense."  
Not: "Learn our platform."  
Not: "Configure your data source."

Just: **Clone. npm install. npm run dev.**

### Step 2: Aha Moment (2 Minutes)

Developer sees:
- ✅ A real analytics dashboard
- ✅ Working in their React stack
- ✅ No signup walls
- ✅ No platform friction

They think: **"This could work in my app."**

### Step 3: Activation (Voluntary)

When they're ready to level up, they run:

```bash
npm install @sisense/sdk-ui
```

That command is the real conversion signal.

They've moved from **passive observer** → **active evaluator.**

### Step 4: Expansion

After the first local win, they naturally ask:

- "Can I use real data?"
- "How do I deploy this?"
- "Can I secure it with authentication?"
- "How do I govern this at scale?"

Each question is a Sisense answer.

---

## 🎯 For Product Teams at Sisense

This repo is:

1. **An acquisition funnel** — "Free trial" that doesn't require a trial signup
2. **A proof of concept** — Shows Compose SDK works in modern stacks
3. **A community asset** — Forkable, extensible, shareable
4. **A developer story** — Not "Sisense is great" but "I shipped analytics fast"

**Success metrics:**
- Forks + GitHub stars
- npm installs of @sisense/sdk-ui
- Sisense trial signups (after people fork)
- Community extensions + remixes
- "I used this repo" stories

---

## 📝 License

MIT. Fork it. Extend it. Ship it.

---

## 🙌 Contributing

Have an idea for an extension? Found a bug?

**Open an issue or submit a PR.**

Good contributions:
- New race datasets
- Additional driver comparisons
- UI customizations
- Sisense integration improvements
- Documentation updates
- Deployment guides

---

## 🚀 Quick Links

| Want to... | Go to... |
|---|---|
| **See it work** | [Live Demo](https://frontend-two-tau-54.vercel.app) |
| **Explore the code** | [GitHub Repo](https://github.com/lugypresko/sisense-test) |
| **Understand the strategy** | [Explainer](https://notebooklm.google.com/notebook/...) |
| **Fork & customize** | Clone the repo + follow [Customization Guide](#customization) |
| **Add Sisense** | Follow [Add Sisense in 5 Minutes](#add-sisense) |
| **Deploy to prod** | See [Deployment Guide](docs/DEPLOYMENT.md) |
| **Get help** | Open a [GitHub Issue](https://github.com/lugypresko/sisense-test/issues) |

---

## 🎬 What's Next?

### For Developers Forking This:
1. Clone it
2. Run it locally
3. Customize to your domain
4. Deploy to Vercel
5. Share your version in the discussions

### For Sisense Community:
1. Try the demo
2. Extend with your ideas
3. Tag `@sisense` when you ship
4. We'll feature great forks

### For Product Managers:
1. This shows how developers actually build analytics
2. Not inside your platform — next to it
3. The CTA is "fork and run," not "sign up"
4. Success is when developers start building, not when they log in

---

## 💭 Philosophy

> **Builders don't start inside platforms. They start with problems.**
>
> This repo solves a problem first (adding analytics to a React app), then shows where Sisense fits.
>
> That's product-led growth.

---

**Built by [Your Name] with ❤️ and AI assistance.**  
**Powered by Sisense Compose SDK.**  
**Inspired by modern development workflows.**

```
Local Prototype → Product Experience → Sisense-Powered → Ship
```

**You're somewhere on that journey. This repo will help.**

---

<p align="center">
  Made for builders, by builders.
</p>

<p align="center">
  <a href="https://github.com/lugypresko/sisense-test">⭐ Star on GitHub</a> ·
  <a href="https://twitter.com/sisense">Follow @sisense</a> ·
  <a href="https://dev.to">Read on Dev.to</a>
</p>
