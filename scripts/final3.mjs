import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews");
const css = `header.fixed{position:absolute!important}[data-scroll-progress]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}.intro{animation:none!important;opacity:1!important}.spin-ring{animation:none!important}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb","--font-render-hinting=none"] });
async function open(theme,w,h,scale){
  const p = await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:scale,isMobile:w<600,hasTouch:w<600});
  await p.evaluateOnNewDocument((t)=>{localStorage.setItem("theme",t);sessionStorage.setItem("intro-seen","1");},theme);
  await p.goto(BASE,{waitUntil:"load",timeout:60000});
  await new Promise(r=>setTimeout(r,1300));
  await p.evaluate((s)=>{const el=document.createElement("style");el.textContent=s;document.head.appendChild(el);window.scrollTo(0,0);},css);
  await new Promise(r=>setTimeout(r,400));
  return p;
}
const el = async (p, sel, name) => { const e = await p.$(sel); if (e) { await e.screenshot({path:path.join(OUT,name+".png"),captureBeyondViewport:true}); console.log(name); } };

const d = await open("dark",1440,1000,1.5);
await d.screenshot({path:path.join(OUT,"preview-home-dark.png")});
await el(d,"#services","preview-services-dark");
await d.close();

const l = await open("light",1440,1000,1.5);
await l.screenshot({path:path.join(OUT,"preview-home-light.png")});
await el(l,".reel-band","preview-reel-light");
await el(l,"#services","preview-services-light");
await el(l,"#process","preview-process-light");
await el(l,"#contact","preview-contact-light");
await l.close();

const m = await open("light",390,844,2);
await m.screenshot({path:path.join(OUT,"mobile-light.png")});
await m.close();
const md = await open("dark",390,844,2);
await md.screenshot({path:path.join(OUT,"mobile-preview.png")});
await md.close();
await b.close();
