# Songs for the sing-along page

Each song is one JSON file in this folder, listed in `index.json`. The page (`../sing-along.html`) draws jianpu, staff notation (abcjs), pinyin and Hanzi from it and plays the melody.

```json
{
  "id": "shengri-kuaile",          // same as the file name
  "title": "祝你生日快乐", "english": "Happy Birthday to You",
  "about": "one or two sentences",
  "key": "F",                      // 1 = F (C, D, Eb, E, F, G, A, Bb …)
  "time": "3/4", "tempo": 96,      // quarter notes per minute
  "lyricsFrom": "song",            // "song": lyrics are in this file; "you": the learner pastes them on the page
  "lyricsHint": "shown above the paste box (only for lyricsFrom: you)",
  "lines": [ { "notes": "5,/ 5,/ | 6, 5, 1 | 7,-", "lyrics": "祝你生日快乐", "en": "optional gloss" } ]
}
```

**Notes** (jianpu style, separated by spaces): `1`–`7` scale degrees, `0` rest.
After the digit: `'` one octave up, `,` one octave down (repeat for two),
`/` half a beat, `//` a quarter beat, `.` dotted, each `-` holds one more beat.
`|` bar line, `||` final bar. Lines may break in the middle of a bar.

**Lyrics:** one character per sung note (rests take none); `_` means the previous character is held over this note.

Only songs whose melody and words may be shared go into this folder. For songs under copyright, use `lyricsFrom: "you"` and leave the words out.
