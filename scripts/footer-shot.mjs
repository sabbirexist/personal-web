import puppeteer from "puppeteer-core";
import path from "node:path";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3007";
const OUT = path.resolve("previews/audit");
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server","--force-color-profile=srgb"] });
const p = await b.newPage();
await p.setViewport({width:1440,height:900,deviceScaleFactor:1.5});
await p.evaluateOnNewDocument(()=>{localStorage.setItem("theme","light");sessionStorage.setItem("intro-seen","1");});
await p.goto(BASE,{waitUntil:"load",timeout:60000});
await new Promise(r=>setTimeout(r,1200));
const el = await p.$("footer");
if (el) { await el.screenshot({path:path.join(OUT,"footer-actual.png"),captureBeyondViewport:true}); console.log("footer shot"); }
await b.close();
