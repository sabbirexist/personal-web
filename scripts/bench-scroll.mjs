import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server", "--force-color-profile=srgb"],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
});

async function run(theme, throttle) {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  if (throttle > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  await page.evaluateOnNewDocument((t) => {
    localStorage.setItem("theme", t);
    sessionStorage.setItem("intro-seen", "1");
  }, theme);
  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));

  await page.evaluate(() => {
    window.__frames = [];
    window.__long = [];
    let last = performance.now();
    const loop = (t) => {
      window.__frames.push(t - last);
      last = t;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__long.push(e.duration);
      }).observe({ type: "longtask", buffered: true });
    } catch {}
  });

  // wheel-scroll through the page
  for (let i = 0; i < 55; i++) {
    await page.mouse.wheel({ deltaY: 380 });
    await new Promise((r) => setTimeout(r, 55));
  }
  await new Promise((r) => setTimeout(r, 900));

  const stats = await page.evaluate(() => {
    const f = window.__frames.slice(10).sort((a, b) => a - b);
    const pct = (p) => Math.round(f[Math.min(f.length - 1, Math.floor(f.length * p))] * 10) / 10;
    return {
      frames: f.length,
      p50: pct(0.5),
      p95: pct(0.95),
      worst: Math.round(f[f.length - 1] * 10) / 10,
      over33ms: f.filter((x) => x > 33).length,
      longTasks: window.__long.length,
      longMs: Math.round(window.__long.reduce((a, b) => a + b, 0)),
      scrollY: Math.round(window.scrollY),
    };
  });
  console.log(`${theme} cpu x${throttle}`, JSON.stringify(stats));
  await page.close();
}

await run("dark", 1);
await run("dark", 4);
await run("light", 4);

await browser.close();
