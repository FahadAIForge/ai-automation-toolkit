# n8n Automation Setup Guide — Fahad Khan

Two production-ready workflows, built and validated. Running them on your own
computer takes about 10 minutes.

## What's included

| File | Workflow | Schedule |
|---|---|---|
| `sponsorship-outreach.json` | Reads sponsors from Google Sheets → emails those with budget ≥ $500 → marks them Contacted (never emails twice) | Every Monday, 9:00 AM |
| `daily-ai-digest.json` | Pulls latest AI news from TechCrunch AI + VentureBeat AI → builds a clean HTML digest → emails it to you | Every day, 7:00 AM |
| `sponsors-sample.csv` | Sample sponsor list (5 rows) — import into Google Sheets, then replace with real data | — |

## Step 1 — Install n8n (one time)

1. Install Node.js LTS from https://nodejs.org (use the LTS version)
2. Open a terminal / command prompt and run:
   ```
   npm install -g n8n
   ```
3. Start it:
   ```
   n8n start
   ```
4. Open http://localhost:5678 in your browser and create your owner account.

## Step 2 — Import the workflows

1. In n8n, go to **Workflows** → click **⋯** → **Import from File**
2. Import `sponsorship-outreach.json`, then `daily-ai-digest.json`.

## Step 3 — Create the sponsor sheet

1. Go to Google Sheets, create a new spreadsheet.
2. **File → Import → Upload** `sponsors-sample.csv` (or copy the columns manually):
   `Company | Contact_Name | Email | Budget | Website | Niche | Status | Date_Contacted`
3. Rename the tab to `Sponsors`.
4. Replace the 5 sample rows with your real sponsors. Leave `Status` empty.
5. Copy the **Spreadsheet ID** from the sheet's URL
   (the long string between `/d/` and `/edit`).

## Step 4 — Connect Google (one time)

In the **Sponsorship Outreach Automation** workflow:
1. Click the **Read Sponsors** node → **Credential** → **Create new** → sign in
   with your Google account and allow access. Repeat on **Mark Contacted**.
2. Paste your Spreadsheet ID into both nodes (replace `PASTE_SHEET_ID_HERE`).
3. Click the **Send Email** node → create a Gmail credential the same way.

In the **Daily AI Digest** workflow:
1. Open the **Config** node → replace `PASTE_YOUR_EMAIL_HERE` with your email.
2. Click **Send Digest** → create the Gmail credential.

## Step 5 — Test & activate

1. Open each workflow → click **Execute workflow** (runs once immediately).
   Check your inbox / sheet to confirm it worked.
2. If the test looks good, toggle **Active** (top-right) on both workflows.
   They will now run on schedule automatically.

## Customization

- **Minimum budget:** open the **Config** node in the sponsorship workflow and
  change `minBudget` (default 500). No other node needs editing.
- **Digest story count:** `maxStories` in the digest's Config node (default 8).
- **Email template:** edit the **Compose Email** node.

## Notes

- Keep n8n running on your computer for the schedules to fire
  (minimize the terminal — don't close it).
- The workflows were import-tested on n8n 2.43.4. If Google shows a
  "unverified app" warning during OAuth, click Advanced → proceed
  (it's your own n8n instance).
