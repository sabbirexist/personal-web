import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server", "--force-color-profile=srgb"],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("theme", "dark");
  sessionStorage.setItem("intro-seen", "1");
  window.__cls = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__cls += entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
  window.__lcp = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    window.__lcp = entries[entries.length - 1].startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
await page.goto("http://localhost:3007/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3000));

const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paint = performance.getEntriesByType("paint");
  const fcp = paint.find((p) => p.name === "first-contentful-paint");
  return {
    ttfb: Math.round(nav.responseStart),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    fcp: fcp ? Math.round(fcp.startTime) : null,
    lcp: Math.round(window.__lcp),
    cls: Number(window.__cls.toFixed(4)),
    domNodes: document.querySelectorAll("*").length,
    transferKB: Math.round(
      performance.getEntriesByType("resource").reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024
    ),
    resources: performance.getEntriesByType("resource").length,
  };
});
console.log("PERF", JSON.stringify(metrics, null, 2));

// hover preview check
await page.evaluate(() => document.querySelector("#work")?.scrollIntoView({ block: "start" }));
await new Promise((r) => setTimeout(r, 1200));
const card = await page.$(".work-card");
const box = await card.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await new Promise((r) => setTimeout(r, 2000));
console.log(
  "HOVER",
  await page.evaluate(() => {
    const v = document.querySelector(".work-card video");
    return v ? { paused: v.paused, src: v.getAttribute("src"), ready: v.readyState, time: Number(v.currentTime.toFixed(2)) } : null;
  })
);

// lightbox close via backdrop
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));
await page.click("button[data-video]");
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: "previews/state-lightbox.png" });
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 500));
console.log("LIGHTBOX closed:", await page.evaluate(() => !document.querySelector('[role="dialog"]')));

await browser.close();
