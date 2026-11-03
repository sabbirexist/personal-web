import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
for (const [theme, name] of [["light","logo-light"],["dark","logo-dark"]]) {
  const p = await b.newPage();
  await p.setViewport({width:1440,height:900,deviceScaleFactor:3});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");}, theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  const header = await p.$("header nav");
  if (header) {
    const logo = await p.evaluateHandle(() => document.querySelector("header nav a[aria-label]") || document.querySelector("header nav a"));
    const el = logo.asElement();
    if (el) await el.screenshot({path:path.join(OUT,name+".png")});
  }
  console.log(name);
  await p.close();
}
await b.close();
