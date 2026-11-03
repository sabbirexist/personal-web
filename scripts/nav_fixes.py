# --- nav: pill lower, constant logo size
p = "components/site/nav.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('<header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">', '<header className="fixed inset-x-0 top-0 z-50 pt-5 sm:pt-6">')
s = s.replace('<Logo wordmark={wordmark} size={scrolled ? 22 : 24} sub="Edit / Motion" />', '<Logo wordmark={wordmark} size={24} sub="Edit / Motion" />')
open(p, "w", encoding="utf-8").write(s)
print("nav:", 'pt-5 sm:pt-6' in s, 'size={24}' in s)

# --- logo: dashed PORTFOLIO label after the wordmark
p = "components/logo.tsx"
s = open(p, encoding="utf-8").read()
old = """        <span
          className="font-semibold tracking-[-0.05em]"
          style={{ fontSize: size * 0.62 }}
        >
          {wordmark}
        </span>"""
new = """        <span className="flex items-baseline gap-1.5">
          <span className="font-semibold tracking-[-0.05em]" style={{ fontSize: size * 0.62 }}>
            {wordmark}
          </span>
          <span
            className="mono whitespace-nowrap opacity-40"
            style={{ fontSize: Math.max(6.5, size * 0.28), letterSpacing: "0.16em" }}
          >
            — PORTFOLIO
          </span>
        </span>"""
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("logo portfolio:", "— PORTFOLIO" in s)
