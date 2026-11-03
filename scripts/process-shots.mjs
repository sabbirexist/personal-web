import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
async function shot(w,h,theme,scale,name){
  const p = await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:scale,isMobile:w<600,hasTouch:w<600});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");},theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);const sec=document.querySelector("#process"); if(sec) window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 90);},css);
  await new Promise(r=>setTimeout(r,600));
  const el = await p.$("#process");
  if (el) await el.screenshot({path:path.join(OUT,name+".png"),captureBeyondViewport:true});
  console.log(name);
  await p.close();
}
await shot(1440,900,"dark",1.2,"process-1440");
await shot(1024,860,"light",1.2,"process-1024");
await shot(390,844,"dark",2,"process-mobile");
await b.close();
