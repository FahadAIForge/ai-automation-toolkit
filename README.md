# AI Automation Toolkit — by Fahad Khan

Production-ready AI workflow automations built with **n8n** and **Python**. Live demos: the deployed site runs the same logic as the workflows.

**🌐 Live site:** *(Vercel URL added after deploy)*

## Automations

### 01 — Sponsorship Outreach Automation
Runs every Monday at 9:00 AM:
1. **Schedule trigger** — weekly cron
2. **Google Sheets** — reads the sponsor list (`Sponsors` tab)
3. **Filter** — keeps sponsors with `Budget ≥ $500` (configurable) and `Status ≠ Contacted`
4. **Gmail** — sends a personalized outreach email to each qualified sponsor
5. **Update sheet** — marks them `Contacted` with today's date (no duplicates, ever)

File: [`workflows/sponsorship-outreach.json`](workflows/sponsorship-outreach.json)

### 02 — Daily AI Digest
Runs every day at 7:00 AM:
1. **Schedule trigger** — daily cron
2. **RSS** — pulls TechCrunch AI + VentureBeat AI feeds
3. **Filter + limit** — top 8 stories
4. **Format** — clean mobile-friendly HTML email
5. **Gmail** — delivered to your inbox

File: [`workflows/daily-ai-digest.json`](workflows/daily-ai-digest.json)

## The live site

The deployed site (`index.html` + `api/digest.js`) is an interactive showcase:
- **Sponsorship demo** — the exact budget-filter + email-generator logic, running in the browser
- **Digest demo** — a serverless function (`api/digest.js`) that runs the same fetch → filter → format pipeline against the live RSS feeds

No build step, no dependencies — static hosting + one serverless function.

## Import into n8n

1. Install n8n: `npm install -g n8n` → `n8n start` → open `http://localhost:5678`
2. Import `workflows/sponsorship-outreach.json` and `workflows/daily-ai-digest.json`
3. Create the sponsor sheet from `workflows/sponsors-sample.csv` (tab named `Sponsors`)
4. Connect Google Sheets + Gmail via OAuth, replace the Sheet ID / recipient placeholders
5. Test manually, then activate

Full walkthrough: [`workflows/SETUP-GUIDE.md`](workflows/SETUP-GUIDE.md)

## Stack

n8n · Python · Google Sheets API · Gmail API · RSS · Vercel Serverless
