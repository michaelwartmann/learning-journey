// On-device Chinese speech recognition for the speaking trainer.
// sherpa-onnx (WebAssembly) + a 14M streaming Zipformer model, both in ../vendor/sherpa/.
// Works without Google or any server: Firefox, Chinese browsers, WeChat, Chrome in mainland China.
// Usage:
//   LocalASR.load(onProgress)            -> Promise, downloads ~37 MB once (then cached)
//   const h = await LocalASR.start({onText, onEndpoint})   // call from a click
//   const text = await h.stop()
(function () {
  const BASE = new URL("../vendor/sherpa/", document.currentScript.src).href;
  let loading = null, recognizer = null;

  function addScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  function load(onProgress) {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      window.Module = {
        locateFile: (p) => BASE + p,
        setStatus: (s) => {
          const m = /\((\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\)/.exec(s || "");
          if (m && onProgress) onProgress(Math.round(+m[1] / 1048576), Math.round(+m[2] / 1048576));
        },
        print: () => {}, printErr: () => {},
        onRuntimeInitialized: () => {
          try { recognizer = window.createOnlineRecognizer(window.Module); resolve(); }
          catch (e) { reject(e); }
        },
      };
      addScript(BASE + "sherpa-onnx-asr.js")
        .then(() => addScript(BASE + "sherpa-onnx-wasm-main-asr.js"))
        .catch((e) => { loading = null; reject(e); });
    });
    return loading;
  }

  function downsample(x, from, to) {
    if (from === to) return new Float32Array(x);
    const ratio = from / to, n = Math.round(x.length / ratio), out = new Float32Array(n);
    let pos = 0;
    for (let i = 0; i < n; i++) {
      const next = Math.round((i + 1) * ratio);
      let sum = 0, c = 0;
      for (let j = pos; j < next && j < x.length; j++) { sum += x[j]; c++; }
      out[i] = c ? sum / c : 0; pos = next;
    }
    return out;
  }

  async function start({ onText, onEndpoint } = {}) {
    // Create the audio context before the first await, while we are still inside the click.
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    await load();
    const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    if (ctx.state === "suspended") await ctx.resume();
    const src = ctx.createMediaStreamSource(mic);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    const stream = recognizer.createStream();
    const done = []; let last = "";
    const text = () => done.join("") + last;
    const decode = () => {
      while (recognizer.isReady(stream)) recognizer.decode(stream);
      const t = recognizer.getResult(stream).text;
      if (t) last = t;
      if (recognizer.isEndpoint(stream)) {
        if (last) { done.push(last); last = ""; recognizer.reset(stream); onEndpoint && onEndpoint(text()); }
        else recognizer.reset(stream);
      }
    };
    proc.onaudioprocess = (e) => {
      stream.acceptWaveform(16000, downsample(e.inputBuffer.getChannelData(0), ctx.sampleRate, 16000));
      decode();
      onText && onText(text());
    };
    src.connect(proc); proc.connect(ctx.destination);
    let stopped = false;
    return {
      async stop() {
        if (stopped) return text();
        stopped = true;
        proc.onaudioprocess = null;
        try { src.disconnect(); proc.disconnect(); } catch (e) {}
        mic.getTracks().forEach((t) => t.stop());
        stream.acceptWaveform(16000, new Float32Array(8000)); // half a second of silence flushes the last word
        while (recognizer.isReady(stream)) recognizer.decode(stream);
        const t = recognizer.getResult(stream).text; if (t) last = t;
        const result = text();
        try { stream.free(); } catch (e) {}
        try { await ctx.close(); } catch (e) {}
        return result;
      },
    };
  }

  // For tests: recognise a mono Float32Array at the given sample rate.
  async function recognise(samples, rate) {
    await load();
    const s = recognizer.createStream();
    s.acceptWaveform(rate, samples);
    s.acceptWaveform(rate, new Float32Array(Math.round(rate * 0.6)));
    while (recognizer.isReady(s)) recognizer.decode(s);
    const t = recognizer.getResult(s).text; s.free(); return t;
  }

  window.LocalASR = { load, start, recognise, supported: !!(window.WebAssembly && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) };
})();
