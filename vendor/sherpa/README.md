# On-device Chinese speech recognition

Used by tools/speaking-trainer.html when the browser has no working speech recognition
(Firefox, most Chinese browsers, WeChat, Chrome inside mainland China). Runs fully on the
phone; no audio leaves the device.

- Runtime: sherpa-onnx WebAssembly build (`sherpa-onnx-wasm-main-asr.js/.wasm`, `sherpa-onnx-asr.js`),
  https://github.com/k2-fsa/sherpa-onnx, Apache-2.0. Taken from the k2-fsa WebAssembly ASR demo.
- Model: sherpa-onnx-streaming-zipformer-zh-14M-2023-02-23 (int8 encoder/decoder/joiner + tokens),
  https://huggingface.co/csukuangfj/sherpa-onnx-streaming-zipformer-zh-14M-2023-02-23, Apache-2.0.
  Packed into `sherpa-onnx-wasm-main-asr.data`; the file list inside the `.js` loader was
  rewritten to match (scripts can redo this: concatenate encoder, decoder, joiner, tokens).
