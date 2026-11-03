import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
async function shot(w,h,theme,scale,name,scroll){
  const p = await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:scale,isMobile:w<600,hasTouch:w<600});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");},theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1300));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);},css);
  if(scroll){await p.evaluate((sel)=>{const el=document.querySelector(sel); if(el) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-100);},scroll); await new Promise(r=>setTimeout(r,600));}
  else await p.evaluate(()=>window.scrollTo(0,0));
  await p.screenshot({path:path.join(OUT,name+".png")});
  console.log(name);
  await p.close();
}
await shot(1440,950,"light",1.5,"fx-light-services","#services");
await shot(1440,950,"light",1.5,"fx-light-reel",".reel-band");
await shot(1440,950,"light",1.5,"fx-light-header");
await shot(1440,950,"light",1.5,"fx-light-footer","footer");
await shot(390,844,"light",2,"fx-light-mobile");
await b.close();
