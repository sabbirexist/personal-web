p = "components/site/hero.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('className="mt-12 border-t border-white/10 py-4 sm:mt-16 sm:py-5"', 'className="mt-12 border-t border-white/10 py-5 sm:mt-16 sm:py-6"')
open(p, "w", encoding="utf-8").write(s)
print("strip:", "py-5 sm:mt-16 sm:py-6" in s)
