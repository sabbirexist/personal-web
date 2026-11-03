import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
fs.mkdirSync(OUT, { recursive: true });

const css = `
  header.fixed { position: absolute !important; }
  .grain, [data-scroll-progress] { display: none !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; }
  .lines > .line > span { transform: none !important; }
  .intro { animation: none !important; opacity: 1 !important; }
  .spin-ring { animation: none !important; }
`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server", "--force-color-profile=srgb", "--font-render-hinting=none"],
});

async function page(width, height, theme = "dark", scale = 1) {
  const p = await browser.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: scale, isMobile: width < 600, hasTouch: width < 600 });
  await p.evaluateOnNewDocument((t) => {
    localStorage.setItem("theme", t);
    sessionStorage.setItem("intro-seen", "1");
  }, theme);
  await p.goto(BASE, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await p.evaluate((style) => {
    const el = document.createElement("style");
    el.textContent = style;
    document.head.appendChild(el);
    window.scrollTo(0, 0);
  }, css);
  await new Promise((r) => setTimeout(r, 400));
  return p;
}

const m = await page(390, 844, "dark", 2);
await m.screenshot({ path: path.join(OUT, "m-hero.png") });
for (const [sel, name] of [
  ["#work", "m-work"],
  ["#services", "m-services"],
  ["#trusted", "m-trusted"],
  ["#about", "m-about"],
  ["#contact", "m-contact"],
  ["footer", "m-footer"],
]) {
  const el = await m.$(sel);
  if (!el) {
    console.log("missing", sel);
    continue;
  }
  await el.screenshot({ path: path.join(OUT, `${name}.png`), captureBeyondViewport: true });
  console.log(name);
}
await m.click('button[aria-controls="mobile-menu"]');
await new Promise((r) => setTimeout(r, 900));
await m.screenshot({ path: path.join(OUT, "m-menu.png") });
await m.close();

const t = await page(360, 780, "dark", 2);
await t.screenshot({ path: path.join(OUT, "m360-hero.png") });
await t.close();

const d = await page(1440, 950, "dark", 1.5);
await d.screenshot({ path: path.join(OUT, "d-hero.png") });
await d.close();

await browser.close();
console.log("done");
