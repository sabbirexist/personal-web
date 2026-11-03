import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://visualsbysabbir.vercel.app";
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args:["--no-proxy-server"] });
const p = await b.newPage();
const out = {};
await p.goto(BASE + "/admin/login", { waitUntil: "load", timeout: 90000 });
out.login = await p.evaluate(async (password) => (await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ password }) })).status, process.env.ADMIN_PW);
out.send = await p.evaluate(async () => {
  const r = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name:"ZZ Persistence Test", email:"test@example.com", projectType:"Brand film / commercial", message:"Automated check that the admin can persist messages on the live deployment." }) });
  return { status: r.status, body: await r.text() };
});
const messages = await p.evaluate(async () => (await (await fetch("/api/contact")).json()).messages);
const test = messages.find(m => m.name === "ZZ Persistence Test");
out.count = messages.length;
out.found = Boolean(test);
if (test) {
  out.patch = await p.evaluate(async (id) => { const r = await fetch(`/api/admin/messages/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ read: true }) }); return { status: r.status, body: await r.text() }; }, test.id);
  out.del = await p.evaluate(async (id) => { const r = await fetch(`/api/admin/messages/${id}`, { method:"DELETE" }); return { status: r.status, body: await r.text() }; }, test.id);
}
out.media = await p.evaluate(async () => (await fetch("/api/admin/media")).status);
console.log(JSON.stringify(out));
await b.close();
