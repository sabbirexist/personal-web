import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face { font-family: "Inter Tight"; src: url("${BASE}/fonts/InterTight.woff2") format("woff2"); font-weight: 100 900; font-style: normal; }
  @font-face { font-family: "Instrument Serif"; src: url("${BASE}/fonts/InstrumentSerif-Italic.woff2") format("woff2"); font-weight: 400; font-style: italic; }
  @font-face { font-family: "Mono"; src: url("${BASE}/fonts/InterTight.woff2") format("woff2"); font-weight: 400; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #000000; color: #f6f2ea;
    font-family: "Inter Tight", sans-serif;
    display: grid; grid-template-columns: 1fr 400px; gap: 48px;
    padding: 56px 64px;
  }
  .glow { position: absolute; width: 780px; height: 600px; left: 120px; top: -180px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,90,26,.30), transparent 65%); filter: blur(50px); }
  .left { position: relative; display: flex; flex-direction: column; justify-content: center; }
  .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 34px; }
  .logo svg { width: 30px; height: 30px; color: #ff5a1a; }
  .wordmark { font-size: 19px; font-weight: 600; letter-spacing: -.04em; }
  .sub { font-size: 8px; letter-spacing: .22em; color: #a49b8f; margin-top: 4px; text-transform: uppercase; }
  .eyebrow { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #a49b8f; margin-bottom: 18px; }
  .eyebrow b { color: #ff5a1a; font-weight: 500; }
  h1 { font-size: 60px; line-height: .94; letter-spacing: -.05em; font-weight: 600; }
  h1 em { font-family: "Instrument Serif", serif; font-weight: 400; color: #ff5a1a; letter-spacing: -.02em; }
  .role { margin-top: 20px; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #a49b8f; }
  .role span { color: #ff5a1a; margin: 0 8px; }
  .url { margin-top: auto; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: #6f685f; }
  .card { position: relative; align-self: center; height: 518px; border-radius: 26px; overflow: hidden; border: 1px solid rgba(246,242,234,.12); }
  .card img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.85), transparent 45%); }
  .cap { position: absolute; left: 18px; bottom: 16px; z-index: 2; display: flex; flex-direction: column; gap: 7px; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.75); }
  .pip { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 12px; letter-spacing: 0; text-transform: none; color: #fff; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #7ee0a6; box-shadow: 0 0 0 4px rgba(126,224,166,.18); }
</style></head>
<body>
  <div class="glow"></div>
  <div class="left">
    <div class="logo">
      <svg viewBox="0 0 24 24" fill="none"><path d="M17.9 6.35C17.9 4.42 15.24 3.3 12.2 3.3 8.86 3.3 6.36 4.82 6.36 7.34c0 2.86 3.28 3.62 5.86 4.14 2.72.55 5.68 1.4 5.68 4.28 0 2.52-2.66 4.24-6.02 4.24-3.02 0-5.62-1.14-5.72-3.42" stroke="currentColor" stroke-width="2.55" stroke-linecap="round"/></svg>
      <div>
        <div class="wordmark">SABBIR</div>
        <div class="sub">Edit / Motion</div>
      </div>
    </div>
    <div class="eyebrow"><b>—</b>&nbsp;&nbsp;Video editor × Motion designer</div>
    <h1>Motion that makes<br>brands <em>unforgettable</em></h1>
    <div class="role">Dhaka, Bangladesh<span>·</span>Available for work</div>
    <div class="url">sabbir.studio</div>
  </div>
  <div class="card">
    <img src="${BASE}/work/sabbir-portrait.webp" alt="">
    <div class="cap">SABBIR / DHAKA<div class="pip"><span class="dot"></span>Open for work</div></div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server", "--force-color-profile=srgb", "--font-render-hinting=none"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle2" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "public/og.png" });
console.log("wrote public/og.png");

// apple icon from the favicon
const icon = await browser.newPage();
await icon.setViewport({ width: 180, height: 180, deviceScaleFactor: 2 });
const fs = await import("node:fs");
const svg = fs.readFileSync("public/favicon.svg", "utf8");
await icon.setContent(
  `<html><body style="margin:0;background:transparent"><div style="width:180px;height:180px">${svg.replace('width="64" height="64"', 'width="180" height="180"')}</div></body></html>`
);
await new Promise((r) => setTimeout(r, 300));
await icon.screenshot({ path: "public/apple-icon.png", omitBackground: true });
console.log("wrote public/apple-icon.png");

await browser.close();
