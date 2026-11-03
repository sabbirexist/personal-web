import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb","--font-render-hinting=none"] });
async function shot(w,h,theme,scale,name,scroll){
  const p = await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:scale,isMobile:w<600,hasTouch:w<600});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");},theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1400));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);window.scrollTo(0,0);},css);
  await new Promise(r=>setTimeout(r,400));
  if(scroll){await p.evaluate((sel)=>{const el=document.querySelector(sel); if(el) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-80);},scroll); await new Promise(r=>setTimeout(r,500));}
  await p.screenshot({path:path.join(OUT,name+".png")});
  console.log(name);
  await p.close();
}
await shot(1440,1000,"dark",1.5,"preview-home-dark");
await shot(1440,1000,"light",1.5,"preview-home-light");
await shot(390,844,"dark",2,"mobile-preview");
await shot(390,844,"light",2,"mobile-light");
await b.close();
