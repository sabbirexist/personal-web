p = "README.md"
s = open(p, encoding="utf-8").read()
s = s.replace("![Homepage, dark](previews/preview-home-dark.png)", "![Homepage, dark and light](docs/preview.jpg)")
open(p, "w", encoding="utf-8").write(s)
print("readme preview:", "docs/preview.jpg" in s)
