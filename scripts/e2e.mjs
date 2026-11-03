import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews");
fs.mkdirSync(OUT, { recursive: true });

const content = JSON.parse(fs.readFileSync("data/content.json", "utf8"));
const firstProject = content.projects[0];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server", "--force-color-profile=srgb"],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1.5 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`EXCEPTION ${String(e).slice(0, 200)}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});

const shot = async (name, full = false) => {
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full, captureBeyondViewport: full });
  console.log("shot", name);
};
const log = (...args) => console.log("•", ...args);

// 1. guard
await page.goto(`${BASE}/admin`, { waitUntil: "networkidle2" });
log("guard redirect ->", page.url());

// 2. login
await page.waitForSelector("#password");
await shot("admin-login");
await page.type("#password", "sabbir2026");
await Promise.all([
  page.waitForFunction(() => location.pathname === "/admin", { timeout: 15000 }),
  page.click('button[type="submit"]'),
]);
await new Promise((r) => setTimeout(r, 1200));
await shot("admin-overview");
log("logged in ->", page.url());

// 3. projects
await page.goto(`${BASE}/admin/projects`, { waitUntil: "networkidle2" });
await shot("admin-projects");

// 4. project editor
await page.goto(`${BASE}/admin/projects/${firstProject.id}`, { waitUntil: "networkidle2" });
await shot("admin-project-edit", true);

// 5. create + delete a project
await page.goto(`${BASE}/admin/projects/new`, { waitUntil: "networkidle2" });
await page.type("#p-title", "Automation Test Project");
await page.type("#p-subtitle", "Temporary check");
await page.click('button[type="submit"]');
await page.waitForFunction(() => location.pathname.startsWith("/admin/projects/p_"), { timeout: 15000 });
const createdUrl = page.url();
log("created ->", createdUrl);
const created = await page.evaluate(async () => {
  const res = await fetch("/api/admin/projects");
  const json = await res.json();
  return json.items.find((p) => p.title === "Automation Test Project");
});
log("created id", created?.id, created?.slug);
await page.evaluate(async (id) => {
  await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
}, created.id);
await page.goto(`${BASE}/admin/projects`, { waitUntil: "networkidle2" });
const stillThere = await page.evaluate(() => document.body.innerText.includes("Automation Test Project"));
log("deleted:", !stillThere);

// 6. messages
await page.goto(`${BASE}/admin/messages`, { waitUntil: "networkidle2" });
await shot("admin-messages");

// 7. media
await page.goto(`${BASE}/admin/media`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));
await shot("admin-media");

// 8. settings
await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle2" });
await shot("admin-settings", true);

// 9. public contact form
await page.goto(`${BASE}/#contact`, { waitUntil: "networkidle2" });
await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
await new Promise((r) => setTimeout(r, 700));
await page.type('input[name="name"]', "E2E Tester");
await page.type('input[name="email"]', "e2e@example.com");
await page.type('textarea[name="message"]', "Testing the contact form from the automated check.");
await page.click('form button[type="submit"]');
const sent = await page.waitForFunction(
  () => document.body.innerText.includes("Message received"),
  { timeout: 15000 }
).then(() => true).catch(() => false);
log("contact form success:", sent);

// clean up the test message
await page.goto(`${BASE}/admin/messages`, { waitUntil: "networkidle2" });
const removed = await page.evaluate(async () => {
  const res = await fetch("/api/contact");
  const json = await res.json();
  const testMsg = json.messages.find((m) => m.email === "e2e@example.com");
  if (!testMsg) return false;
  await fetch(`/api/admin/messages/${testMsg.id}`, { method: "DELETE" });
  return true;
});
log("test message cleaned:", removed);

// 10. public: light theme + project page + work archive
const light = async (url, name, theme) => {
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1.5 });
  await p.evaluateOnNewDocument((t) => {
    localStorage.setItem("theme", t);
    sessionStorage.setItem("intro-seen", "1");
  }, theme);
  await p.goto(url, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));
  await p.evaluate(() => {
    const style = document.createElement("style");
    style.textContent =
      "header.fixed{position:absolute!important}.grain{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.lines>.line>span{transform:none!important}.intro{animation:none!important;opacity:1!important}";
    document.head.appendChild(style);
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 400));
  await p.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log("shot", name);
  await p.close();
};

await light(`${BASE}/`, "home-light", "light");
await light(`${BASE}/work`, "work-dark", "dark");
await light(`${BASE}/work/${firstProject.slug}`, "project-dark", "dark");

// 11. mobile
const m = await browser.newPage();
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await m.evaluateOnNewDocument(() => {
  localStorage.setItem("theme", "dark");
  sessionStorage.setItem("intro-seen", "1");
});
await m.goto(`${BASE}/`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1400));
await m.evaluate(() => {
  const style = document.createElement("style");
  style.textContent =
    "header.fixed{position:absolute!important}.grain{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.lines>.line>span{transform:none!important}.intro{animation:none!important;opacity:1!important}";
  document.head.appendChild(style);
});
await m.screenshot({ path: path.join(OUT, "home-mobile.png") });
console.log("shot home-mobile");
await m.click('button[aria-controls="mobile-menu"]');
await new Promise((r) => setTimeout(r, 800));
await m.screenshot({ path: path.join(OUT, "mobile-menu.png") });
console.log("shot mobile-menu");

console.log("\nERRORS:", errors.length ? errors.slice(0, 10) : "none");
await browser.close();
