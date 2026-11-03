p = "app/globals.css"
s = open(p, encoding="utf-8").read()
old = """@keyframes grainShift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(-2%, 1%, 0);
  }
  50% {
    transform: translate3d(1%, -2%, 0);
  }
  75% {
    transform: translate3d(-1%, 2%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
"""
s = s.replace(old, "")
open(p, "w", encoding="utf-8").write(s)
print("keyframes removed:", "grainShift" not in s)

for f in ["README.md", "docs/PLAN.md"]:
    s = open(f, encoding="utf-8").read()
    s = s.replace("Restrained layout, but texture (grain, hairlines)", "Restrained layout, hairlines and micro-details")
    s = s.replace("a single static alpha tile", "a flat surface layer")
    s = s.replace("the animated full-screen blend-mode grain", "the full-screen grain layer")
    s = s.replace("Texture: 128px film-grain tile at 3–4% opacity, radial ember glow", "Texture: hairline rules and radial ember glow")
    open(f, "w", encoding="utf-8").write(s)
print("docs cleaned")
