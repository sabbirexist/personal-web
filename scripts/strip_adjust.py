p = "components/site/hero.tsx"
s = open(p, encoding="utf-8").read()
old = '<div className="mt-8 border-t border-white/10 py-8 sm:mt-10 sm:py-9">'
new = '<div className="mt-12 border-t border-white/10 py-4 sm:mt-16 sm:py-5">'
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("ticker strip:", new in s)
