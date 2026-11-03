import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
for (const [theme, name] of [["light","logo2-light"],["dark","logo2-dark"]]) {
  const p = await b.newPage();
  await p.setViewport({width:1440,height:900,deviceScaleFactor:3});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");}, theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  const info = await p.evaluate(() => {
    const links = [...document.querySelectorAll("header a")].map(a => ({href:a.getAttribute("href"), text:a.textContent.trim().slice(0,40)}));
    return links;
  });
  console.log(theme, JSON.stringify(info));
  const el = await p.$("header a[href='/']");
  if (el) await el.screenshot({path:path.join(OUT,name+".png")});
  await p.close();
}
await b.close();
