// Sponsorship demo — mirrors the n8n workflow's Config + Filter + Gmail nodes.
document.getElementById("sponsor-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const company = document.getElementById("f-company").value.trim();
  const name = document.getElementById("f-name").value.trim();
  const budget = Number(document.getElementById("f-budget").value);
  const minBudget = Number(document.getElementById("f-min").value);
  const result = document.getElementById("sponsor-result");

  const firstName = name.split(" ")[0] || name;
  const qualified = budget >= minBudget;

  if (qualified) {
    const subject = `Partnership opportunity with ${company} 🤝`;
    const body =
`Hi ${firstName},

I came across ${company} and loved what you're building. I help companies automate their outreach and operations with AI — and I think there's a strong fit here.

Would you be open to a quick 15-minute call next week to explore a partnership?

Best,
Fahad Khan
AI Automation Specialist`;

    result.className = "demo-result qualify";
    result.innerHTML =
      `<div class="verdict ok">✅ QUALIFIED — email would be sent</div>` +
      `<div class="reason">Budget $${budget.toLocaleString()} ≥ minimum $${minBudget.toLocaleString()} · Status ≠ Contacted → passes the n8n filter node.</div>` +
      `<div class="email-preview"><div class="e-subject">Subject: ${escapeHtml(subject)}</div><div class="e-body">${escapeHtml(body)}</div></div>`;
  } else {
    result.className = "demo-result reject";
    result.innerHTML =
      `<div class="verdict no">⏭️ SKIPPED — no email sent</div>` +
      `<div class="reason">Budget $${budget.toLocaleString()} &lt; minimum $${minBudget.toLocaleString()} → filtered out by the n8n filter node. The workflow moves on to the next sponsor without spending an email.</div>`;
  }
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Digest demo — calls the serverless /api/digest (same pipeline as the n8n workflow).
document.getElementById("digest-btn").addEventListener("click", async function () {
  const box = document.getElementById("digest-result");
  const btn = document.getElementById("digest-btn");
  box.hidden = false;
  box.innerHTML = `<div class="spinner">Fetching this morning's AI headlines…</div>`;
  btn.disabled = true;

  try {
    const res = await fetch("/api/digest");
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();

    if (!data.items || !data.items.length) {
      box.innerHTML = `<div class="digest-error">No stories right now — the feeds may be temporarily unreachable. Try again in a bit.</div>`;
      return;
    }

    const date = new Date(data.generated_at).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });

    let html = `<div class="digest-meta">📰 Daily AI Digest — ${date} · ${data.count} stories · sources: ${data.sources.join(", ")}</div>`;
    for (const it of data.items) {
      html +=
        `<div class="digest-item">` +
        `<a href="${escapeAttr(it.link)}" target="_blank" rel="noopener">${escapeHtml(it.title)}</a>` +
        (it.summary ? `<p>${escapeHtml(it.summary)}…</p>` : "") +
        `<span class="src">${escapeHtml(it.source)}${it.published ? " · " + escapeHtml(it.published.slice(0, 16)) : ""}</span>` +
        `</div>`;
    }
    box.innerHTML = html;
  } catch {
    box.innerHTML = `<div class="digest-error">Couldn't reach the digest service just now. Please try again.</div>`;
  } finally {
    btn.disabled = false;
  }
});

function escapeAttr(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
