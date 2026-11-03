p = "components/site/hero.tsx"
s = open(p, encoding="utf-8").read()

s = s.replace(
    '<p className="mono flex items-center gap-2 text-white/65">',
    '<p className="mono flex items-center gap-2 text-[var(--reel-fg)] opacity-65">'
)
s = s.replace(
    '<p className="mono hidden text-white/35 sm:block">Four frames · one reel</p>',
    '<p className="mono hidden text-[var(--reel-fg)] opacity-40 sm:block">Four frames · one reel</p>'
)
s = s.replace(
    '<div className="mt-12 border-t border-white/10 py-5 sm:mt-16 sm:py-6">',
    '<div className="mt-12 border-t border-line py-5 sm:mt-16 sm:py-6">'
)
s = s.replace(
    '<span className="mono hidden shrink-0 text-white/35 sm:block">Capabilities</span>',
    '<span className="mono hidden shrink-0 text-[var(--reel-fg)] opacity-40 sm:block">Capabilities</span>'
)
s = s.replace(
    'className="px-4 text-[clamp(0.9rem,1.7vw,1.35rem)] font-semibold uppercase tracking-[-0.01em] text-white/85 sm:px-6"',
    'className="px-4 text-[clamp(0.9rem,1.7vw,1.35rem)] font-semibold uppercase tracking-[-0.01em] text-[var(--reel-fg)] opacity-90 sm:px-6"'
)
open(p, "w", encoding="utf-8").write(s)
print("reel markup:", "var(--reel-fg)" in s, "border-white/10" not in s)

# footer: remove the dot after the wordmark
p = "components/site/footer.tsx"
s = open(p, encoding="utf-8").read()
s = s.replace("""          <h2 className="display w-full text-balance pt-2 text-[clamp(3.4rem,17.5vw,15rem)] leading-[0.78] tracking-[-0.06em] text-ink">
            {site.wordmark}
            <span className="text-accent">.</span>
          </h2>""",
"""          <h2 className="display w-full text-balance pt-2 text-[clamp(3.4rem,17.5vw,15rem)] leading-[0.78] tracking-[-0.06em] text-ink">
            {site.wordmark}
          </h2>""")
open(p, "w", encoding="utf-8").write(s)
print("footer dot removed:", '<span className="text-accent">.</span>' not in s)
