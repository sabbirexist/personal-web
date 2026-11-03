p = "docs/PLAN.md"
s = open(p, encoding="utf-8").read()
s = s.replace("- **Texture**: 128px film-grain tile at 3–4% opacity, radial ember glow, subtle noise on cards — richness at ~0 KB.",
              "- **Texture**: hairline rules, radial ember glow, soft card shadows — richness with no image cost.")
s = s.replace("1. Tokens, fonts, grain, logo, icons.", "1. Tokens, fonts, logo, icons.")
s = s.replace("blend-mode grain, all decorative", "grain layer, all decorative")
open(p, "w", encoding="utf-8").write(s)
print("plan cleaned")
