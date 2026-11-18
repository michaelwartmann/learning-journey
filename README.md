# 一步一步 · Step by Step

A Mandarin learning journal: one learner's road from a language app to HSK exams, with real people, flashcards and AI. Static site for GitHub Pages; no build step, no database.

- `index.html` the journal (newspaper-style, new sections are added at the bottom)
- `practice.html` + `practice.js` small original HSK 3-style practice sets
- `toolkit.html` methods, settings, links to free official papers
- `downloads/` free Anki deck (word data: MIT-licensed complete-hsk-vocabulary)
- `audio/` narration clips, one per section (see audio/README.md)

Practice items are original. Official papers are linked, never copied.

## Hover pinyin
`slides/zh.json` is generated from `slides/zh/*.html` (per-character pinyin for hover):
`npm i pinyin-pro && node build-zh.js slides/zh slides/zh.json`

## Works offline, installable, no outside requests
- `manifest.webmanifest` + `icons/`: add it to the home screen (Android: menu → Install app; iPhone: Share → Add to Home Screen).
- `sw.js`: the talk, its slides and the fonts are saved on the first visit; other pages, pictures and tools the first time they are opened. Audio and Anki decks always come from the network.
- `fonts/`: all fonts are in the repo (SIL OFL, `fonts/OFL.txt`), cut down to the characters the site uses, so the Chinese fonts stay small (~300–450 KB). After adding text with new characters, run `python3 fonts/make-fonts.py <folder with the source TTFs from github.com/google/fonts>`. Missing characters fall back to the phone's own fonts.
- `vendor/`: Hanzi Writer (MIT) and the stroke data for 学 (Arphic Public License).

No Google Fonts or CDNs: they are blocked in China and leak visits.
