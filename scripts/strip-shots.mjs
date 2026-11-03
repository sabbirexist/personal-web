import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
for (const [w,h,scale,name] of [[390,844,2,"strip-mobile"],[1440,1000,1.5,"strip-desktop"]]) {
  const p = await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:scale,isMobile:w<600,hasTouch:w<600});
  await p.evaluateOnNewDocument(()=>{localStorage.setItem("theme","dark");sessionStorage.setItem("intro-seen","1");});
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1300));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);},css);
  await p.evaluate(()=>{const el=document.querySelector(".reel-band"); if(el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);});
  await new Promise(r=>setTimeout(r,600));
  await p.screenshot({path:path.join(OUT,name+".png")});
  console.log(name);
  await p.close();
}
await b.close();
