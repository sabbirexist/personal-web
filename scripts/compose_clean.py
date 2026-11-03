from PIL import Image

def pair(a, b, out, w, bg=(0,0,0)):
    ia = Image.open(a).convert("RGB"); ib = Image.open(b).convert("RGB")
    a2 = ia.resize((w, int(ia.height*w/ia.width)), Image.LANCZOS)
    b2 = ib.resize((w, int(ib.height*w/ib.width)), Image.LANCZOS)
    h = max(a2.height, b2.height)
    cv = Image.new("RGB", (w*2+16, h), bg)
    cv.paste(a2,(0,0)); cv.paste(b2,(w+16,0))
    cv.save(out,"JPEG",quality=90,optimize=True,progressive=True)
    print(out, cv.size)

pair("previews/preview-home-dark.png","previews/preview-home-light.png","previews/theme-comparison.jpg",960)
pair("previews/mobile-preview.png","previews/mobile-light.png","previews/mobile-comparison.jpg",430, (250,246,238))
Image.open("previews/preview-home-dark.png").convert("RGB").save("previews/home-dark.jpg","JPEG",quality=90,optimize=True,progressive=True)
print("done")
