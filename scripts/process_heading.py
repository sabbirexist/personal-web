p = "components/site/sections.tsx"
s = open(p, encoding="utf-8").read()
old = """              <h2 className="h2 mt-3.5">
                A calm
                <br />
                <span className="serif italic text-accent-text">process</span>
              </h2>"""
new = """              <h2 className="h2 mt-3.5 whitespace-nowrap">
                A calm <span className="serif italic text-accent-text">process</span>
              </h2>"""
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("process heading single line:", "A calm <span" in s and "<br />" not in s)
