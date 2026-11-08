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
