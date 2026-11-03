import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews");
fs.mkdirSync(OUT, { recursive: true });

const hideFixed = `
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

async function open(theme, width, height, scale = 1.5) {
  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: scale,
    isMobile: width < 600,
    hasTouch: width < 600,
  });
  await page.evaluateOnNewDocument((t) => {
    localStorage.setItem("theme", t);
    sessionStorage.setItem("intro-seen", "1");
  }, theme);
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1300));
  await page.evaluate((css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
  }, hideFixed);
  await new Promise((r) => setTimeout(r, 400));
  return page;
}

const dark = await open("dark", 1440, 1000);
await dark.screenshot({ path: path.join(OUT, "preview-home-dark.png") });
console.log("preview-home-dark");
for (const [sel, name] of [
  ["#work", "preview-work-dark"],
  ["#services", "preview-services-dark"],
  ["#capabilities", "preview-band-dark"],
  ["footer", "preview-footer-dark"],
]) {
  const el = await dark.$(sel);
  if (!el) continue;
  await el.screenshot({ path: path.join(OUT, `${name}.png`), captureBeyondViewport: true });
  console.log(name);
}
await dark.close();

const light = await open("light", 1440, 1000);
await light.screenshot({ path: path.join(OUT, "preview-home-light.png") });
console.log("preview-home-light");
for (const [sel, name] of [
  ["#services", "preview-services-light"],
  ["#about", "preview-about-light"],
  ["#contact", "preview-contact-light"],
]) {
  const el = await light.$(sel);
  if (!el) continue;
  await el.screenshot({ path: path.join(OUT, `${name}.png`), captureBeyondViewport: true });
  console.log(name);
}
await light.close();

/* ---------------------------------------------------------------- mobile */
const mobile = await open("dark", 390, 844, 2);
await mobile.screenshot({ path: path.join(OUT, "mobile-preview.png") });
console.log("mobile-preview");
await mobile.click('button[aria-controls="mobile-menu"]');
await new Promise((r) => setTimeout(r, 900));
await mobile.screenshot({ path: path.join(OUT, "mobile-menu.png") });
console.log("mobile-menu");
await mobile.close();

/* ---------------------------------------------------------------- admin */
const admin = await browser.newPage();
await admin.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1.5 });
await admin.goto(`${BASE}/admin/login`, { waitUntil: "load", timeout: 60000 });
await new Promise((r) => setTimeout(r, 500));
await admin.screenshot({ path: path.join(OUT, "admin-login.png") });
await admin.type("#password", "sabbir2026");
await Promise.all([
  admin.waitForFunction(() => location.pathname === "/admin", { timeout: 15000 }),
  admin.click('button[type="submit"]'),
]);
await new Promise((r) => setTimeout(r, 1200));
await admin.screenshot({ path: path.join(OUT, "admin-overview.png") });
console.log("admin-overview");

for (const [route, name] of [
  ["/admin/projects", "admin-projects"],
  ["/admin/projects/p_aether", "admin-project-edit"],
  ["/admin/content", "admin-content"],
  ["/admin/messages", "admin-messages"],
  ["/admin/settings", "admin-settings"],
]) {
  await admin.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 700));
  await admin.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(name);
}
await admin.close();

await browser.close();
console.log("done");

