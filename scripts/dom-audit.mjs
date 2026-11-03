import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-proxy-server"],
});

const widths = [360, 390, 480, 768, 1024, 1280, 1440, 1920];
const paths = ["/", "/work", "/work/nova-loop-title-sequence", "/admin/login"];

for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600 });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("theme", "dark");
      sessionStorage.setItem("intro-seen", "1");
    });
    await page.goto(BASE + path, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 400));
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const offenders = [];
      if (overflow > 1) {
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > doc.clientWidth + 1 && r.left >= 0) {
            const style = getComputedStyle(el);
            if (style.position !== "fixed") {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className && String(el.className).slice(0, 60)) || "",
                right: Math.round(r.right),
              });
            }
          }
        });
      }
      return { overflow, offenders: offenders.slice(0, 6) };
    });
    if (report.overflow > 1) {
      console.log(`OVERFLOW ${path} @${width}: ${report.overflow}px`, JSON.stringify(report.offenders));
    }
    await page.close();
  }
}

// light-mode button colours
const p = await browser.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(() => {
  localStorage.setItem("theme", "light");
  sessionStorage.setItem("intro-seen", "1");
});
await p.goto(BASE, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 600));
const styles = await p.evaluate(() => {
  const btn = document.querySelector(".btn-primary");
  const body = getComputedStyle(document.body);
  return {
    theme: document.documentElement.dataset.theme,
    accentInk: getComputedStyle(document.documentElement).getPropertyValue("--accent-ink").trim(),
    btnColor: btn ? getComputedStyle(btn).color : null,
    btnBg: btn ? getComputedStyle(btn).backgroundColor : null,
    bodyBg: body.backgroundColor,
    bodyColor: body.color,
  };
});
console.log("LIGHT STYLES", JSON.stringify(styles, null, 2));

await browser.close();
console.log("audit done");
