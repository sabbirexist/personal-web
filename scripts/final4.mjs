import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb","--font-render-hinting=none"] });
for (const [theme, name] of [["dark","preview-home-dark"],["light","preview-home-light"]]) {
  const p = await b.newPage();
  await p.setViewport({width:1440,height:1000,deviceScaleFactor:1.5});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");}, theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1300));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);window.scrollTo(0,0);},css);
  await new Promise(r=>setTimeout(r,400));
  await p.screenshot({path:path.join(OUT,name+".png")});
  console.log(name);
  await p.close();
}
await b.close();
