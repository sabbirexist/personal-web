p = "app/layout.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('import { LightboxHost } from "@/components/client/lightbox";',
              'import { LightboxHost } from "@/components/client/lightbox";\nimport { Analytics } from "@vercel/analytics/next";')
s = s.replace("        {children}\n      </body>", "        {children}\n        <Analytics />\n      </body>")
open(p, "w", encoding="utf-8").write(s)
print("analytics wired:", "Analytics" in s)
