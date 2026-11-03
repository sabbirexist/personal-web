import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
fs.mkdirSync(OUT, { recursive: true });

const forceStyle = `
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

async function grab(width, height, theme, tag, full = false) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: width < 600 ? 2 : 1, isMobile: width < 600, hasTouch: width < 600 });
  await page.evaluateOnNewDocument((t) => {
    localStorage.setItem("theme", t);
    sessionStorage.setItem("intro-seen", "1");
  }, theme);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate((css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
  }, forceStyle);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, `home-${tag}.png`), fullPage: full, captureBeyondViewport: full });
  console.log("home-" + tag, width + "x" + height);
  return page;
}

const p1440 = await grab(1440, 1000, "dark", "1440");
await p1440.close();
const p1920 = await grab(1920, 1080, "dark", "1920");
await p1920.close();
const p768 = await grab(768, 1024, "dark", "768");
await p768.close();
const p390 = await grab(390, 844, "dark", "390");
await p390.close();
const p360 = await grab(360, 780, "dark", "360");
await p360.close();

// light + sections at 1440
const light = await browser.newPage();
await light.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1.5 });
await light.evaluateOnNewDocument(() => {
  localStorage.setItem("theme", "light");
  sessionStorage.setItem("intro-seen", "1");
});
await light.goto(BASE, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1200));
await light.evaluate((css) => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  window.scrollTo(0, 0);
}, forceStyle);
await new Promise((r) => setTimeout(r, 400));
await light.screenshot({ path: path.join(OUT, "home-1440-light.png") });
console.log("home-1440-light");

for (const [sel, name] of [
  ["#work", "work"],
  ["#services", "services"],
  ["#capabilities", "band"],
  ["#testimonials", "testimonials"],
  ["#about", "about"],
  ["#contact", "contact"],
  ["footer", "footer"],
]) {
  const el = await light.$(sel);
  if (!el) continue;
  await el.screenshot({ path: path.join(OUT, `${name}-light.png`), captureBeyondViewport: true });
  console.log(name + "-light");
}

// full mobile page
const mob = await browser.newPage();
await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await mob.evaluateOnNewDocument(() => {
  localStorage.setItem("theme", "dark");
  sessionStorage.setItem("intro-seen", "1");
});
await mob.goto(BASE, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1400));
await mob.evaluate((css) => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  window.scrollTo(0, 0);
}, forceStyle);
await new Promise((r) => setTimeout(r, 600));
for (const [sel, name] of [
  ["#work", "m-work"],
  ["#services", "m-services"],
  ["#about", "m-about"],
  ["#contact", "m-contact"],
  ["footer", "m-footer"],
]) {
  const el = await mob.$(sel);
  if (!el) continue;
  await el.screenshot({ path: path.join(OUT, `${name}.png`), captureBeyondViewport: true });
  console.log(name);
}
await mob.goto(`${BASE}/work`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));
await mob.evaluate((css) => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  window.scrollTo(0, 0);
}, forceStyle);
await mob.screenshot({ path: path.join(OUT, "mobile-work.png") });
console.log("mobile-work");
await mob.goto(`${BASE}/work/nova-loop-title-sequence`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));
await mob.evaluate((css) => {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  window.scrollTo(0, 0);
}, forceStyle);
await mob.screenshot({ path: path.join(OUT, "mobile-project.png") });
console.log("mobile-project");

await browser.close();

