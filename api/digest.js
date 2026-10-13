// Daily AI Digest — live serverless demo of the n8n "Daily AI Digest" workflow.
// Fetches AI news RSS feeds, picks the top stories, returns them as JSON.
// Mirrors the n8n workflow logic: RSS Read → Filter → Limit (8) → Format.

const FEEDS = [
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
];

const MAX_ITEMS = 8;
const FETCH_TIMEOUT_MS = 9000;

function stripTags(s) {
  return (s || "").replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").replace(/<[^>]*>/g, "").trim();
}

function decodeEntities(s) {
  return (s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

function parseRss(xml, sourceName) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const b of blocks) {
    const pick = (tag) => {
      const m = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? decodeEntities(stripTags(m[1])) : "";
    };
    const title = pick("title");
    const link = pick("link");
    if (!title || !link) continue;
    items.push({
      title,
      link,
      source: sourceName,
      published: pick("pubDate"),
      summary: decodeEntities(stripTags(pick("description"))).slice(0, 220),
    });
  }
  return items;
}

async function fetchFeed(feed) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(feed.url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "FahadKhan-AI-Digest-Demo/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, feed.name);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

module.exports = async (req, res) => {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const all = results.flat();

  // Newest first (best-effort by pubDate), cap at MAX_ITEMS — like the n8n Limit node.
  all.sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0));
  const items = all.slice(0, MAX_ITEMS);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
  res.status(200).json({
    generated_at: new Date().toISOString(),
    count: items.length,
    sources: FEEDS.map((f) => f.name),
    items,
  });
};
