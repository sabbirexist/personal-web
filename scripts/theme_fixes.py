# ---------- 1. services active card: light version follows the theme
p = "app/globals.css"
s = open(p, encoding="utf-8").read()
old = """  html[data-theme="light"] .svc-active {
    --svc-fg: #fff8f2;
    background: linear-gradient(180deg, #171310 0%, #0d0b09 100%);
    border-color: transparent;
    color: #fff8f2;
    box-shadow: 0 34px 70px -44px rgba(20, 12, 6, 0.65);
  }"""
new = """  html[data-theme="light"] .svc-active {
    --svc-fg: #17130f;
    background: linear-gradient(180deg, #fffdf9 0%, #f6ede1 100%);
    border-color: color-mix(in oklab, var(--accent) 30%, transparent);
    color: #17130f;
    box-shadow: 0 26px 60px -40px rgba(90, 60, 30, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }"""
assert old in s
s = s.replace(old, new)

# ---------- 2. reel band: light version is a light warm panel
old = """  .reel-band {
    position: relative;
    background: #030303;
    border-top: 1px solid color-mix(in oklab, var(--accent) 16%, transparent);
    border-bottom: 1px solid var(--line);
  }
  html[data-theme="light"] .reel-band {
    background: linear-gradient(180deg, #13100d 0%, #070605 100%);
    border-top-color: color-mix(in oklab, var(--accent) 30%, transparent);
    border-bottom-color: rgba(20, 14, 10, 0.2);
  }"""
new = """  .reel-band {
    --reel-fg: #f7f2e9;
    position: relative;
    background: #030303;
    color: var(--reel-fg);
    border-top: 1px solid color-mix(in oklab, var(--accent) 16%, transparent);
    border-bottom: 1px solid var(--line);
  }
  html[data-theme="light"] .reel-band {
    --reel-fg: #171310;
    background: linear-gradient(180deg, #f4eee4 0%, #efe8dc 100%);
    border-top-color: color-mix(in oklab, var(--accent) 26%, transparent);
    border-bottom-color: rgba(20, 14, 10, 0.12);
  }"""
assert old in s
s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("css updated")
