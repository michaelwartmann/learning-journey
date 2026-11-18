// 一步一步 offline: the talk, fonts and slides are saved on first visit; every other page,
// picture and tool is saved the first time it is opened. Pages show the saved copy at once
// and refresh it in the background, so updates arrive on the next visit.
const CACHE = "step-by-step-v1";
const SLIDES = ["01-cover", "02-ladder", "03-anki", "04-problem", "05-speed", "06-people", "07-trip", "08-thanks"];
const CORE = [
  "./", "index.html", "resources.html", "practice.html", "practice.js", "toolkit.html", "deck.css", "deck.js", "style.css",
  "manifest.webmanifest", "icons/icon-192.png", "icons/favicon-64.png",
  "fonts/fonts.css", "fonts/noto-serif-sc-normal-400-900.woff2", "fonts/noto-sans-sc-normal-400-700.woff2",
  "fonts/source-serif-4-normal-400-700.woff2", "fonts/noto-sans-normal-400-700.woff2",
  "vendor/hanzi-writer.min.js", "vendor/hanzi-writer-data/%E5%AD%A6.json",
  "slides/zh.json", ...SLIDES.flatMap((s) => [`slides/zh/${s}.html`, `slides/en/${s}.html`]),
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/\.(apkg|mp3)$/.test(url.pathname)) return; // big downloads and audio go straight to the network
  const key = new Request(url.origin + url.pathname); // ignore ?query and no-cache flags for the saved copy
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const saved = await c.match(key);
    const fresh = fetch(req).then((r) => { if (r.ok) c.put(key, r.clone()); return r; });
    if (saved) { e.waitUntil(fresh.catch(() => {})); return saved; }
    return fresh.catch(async () => (req.mode === "navigate" &&
      ((await c.match(new Request(url.origin + url.pathname.replace(/[^/]*$/, "") + "index.html"))) || (await c.match("index.html")))) || Response.error());
  }));
});
