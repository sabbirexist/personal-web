from PIL import Image
a = Image.open("previews/audit/strip-mobile.png").convert("RGB")
b = Image.open("previews/audit/strip-desktop.png").convert("RGB")
w = 520
a2 = a.resize((w, int(a.height*w/a.width)), Image.LANCZOS)
b2 = b.resize((w, int(b.height*w/b.width)), Image.LANCZOS)
cv = Image.new("RGB", (w*2+14, max(a2.height,b2.height)), (0,0,0))
cv.paste(a2,(0,0)); cv.paste(b2,(w+14,0))
cv.save("previews/stripe-final.jpg","JPEG",quality=90,optimize=True,progressive=True)
print(cv.size)
