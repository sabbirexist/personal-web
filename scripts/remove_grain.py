# 1. remove the grain element from the root layout
p = "app/layout.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace('        <div className="grain" aria-hidden="true" />\n\n', "")
open(p, "w", encoding="utf-8").write(s)
print("grain element removed:", 'className="grain"' not in s)

# 2. remove the grain CSS block
p = "app/globals.css"
s = open(p, encoding="utf-8").read()
start = s.find("  .grain {")
if start != -1:
    end = s.find("\n  }", start) + len("\n  }")
    s = s[:start] + s[end:]
    print("css grain block removed")
# drop unused grain tokens
s = s.replace("  --grain-opacity: 0.075;\n  --grain-blend: overlay;\n", "")
s = s.replace("  --grain-opacity: 0.04;\n  --grain-blend: multiply;\n", "")
open(p, "w", encoding="utf-8").write(s)
print("tokens removed:", "--grain-opacity" not in s)
