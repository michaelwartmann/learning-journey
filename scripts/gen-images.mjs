// Generates the speaking-trainer pictures with OpenRouter.
// Usage: OPENROUTER_API_KEY=... node scripts/gen-images.mjs [--force] [id ...]
// Writes img/speaking/<id>.png; existing files are skipped unless --force.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";

const KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.IMAGE_MODEL || "google/gemini-3.1-flash-image";
if (!KEY) { console.error("OPENROUTER_API_KEY is not set"); process.exit(1); }

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter(a => !a.startsWith("--"));
const scenes = JSON.parse(await readFile(new URL("./speaking-scenes.json", import.meta.url)));
const STYLE = "Square photograph in the style of a picture from a language exam. " +
  "The person or people are East Asian (Chinese). Plain light grey-white studio background or a simple real setting, " +
  "one clear action that is easy to describe in one sentence, natural expression, soft even light, sharp focus. " +
  "No text, no letters, no logos, no watermark, no frame.";

await mkdir("img/speaking", { recursive: true });
const exists = p => access(p).then(() => true, () => false);

let made = 0, failed = 0;
for (const s of scenes) {
  if (only.length && !only.includes(s.id)) continue;
  const out = `img/speaking/${s.id}.png`;
  if (!force && (await exists(out) || await exists(out.replace(".png", ".webp")))) { console.log("skip", s.id); continue; }
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json",
                 "HTTP-Referer": "https://xn--iqru82bwkw.xn--rhqv96g/learning-journey/", "X-Title": "Step by Step speaking trainer" },
      body: JSON.stringify({ model: MODEL, modalities: ["image", "text"],
        messages: [{ role: "user", content: `${STYLE}\nScene: ${s.prompt}.` }],
        image_config: { aspect_ratio: "1:1" } })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(j.error || j).slice(0, 300));
    const url = j.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!url || !url.startsWith("data:image")) throw new Error("no image in response");
    await writeFile(out, Buffer.from(url.split(",")[1], "base64"));
    console.log("made", s.id); made++;
  } catch (e) { console.error("FAILED", s.id, e.message); failed++; }
}
console.log(`done: ${made} made, ${failed} failed`);
if (failed && !made) process.exit(1);
