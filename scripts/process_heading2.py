p = "components/site/sections.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('<h2 className="h2 mt-3.5 whitespace-nowrap">', '<h2 className="h2 mt-3.5">')
s = s.replace('<div className="md:col-span-4">', '<div className="md:col-span-4 lg:col-span-5">')
s = s.replace('<div className="md:col-span-8">', '<div className="md:col-span-8 lg:col-span-7">')
open(p, "w", encoding="utf-8").write(s)
print("no nowrap:", "whitespace-nowrap" not in s)
print("cols:", "lg:col-span-5" in s and "lg:col-span-7" in s)
