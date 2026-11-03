from PIL import Image
ia=Image.open("previews/preview-home-dark.png").convert("RGB"); ib=Image.open("previews/preview-home-light.png").convert("RGB")
w=960
a2=ia.resize((w,int(ia.height*w/ia.width)),Image.LANCZOS); b2=ib.resize((w,int(ib.height*w/ib.width)),Image.LANCZOS)
cv=Image.new("RGB",(w*2+16,max(a2.height,b2.height)),(0,0,0)); cv.paste(a2,(0,0)); cv.paste(b2,(w+16,0))
cv.save("previews/theme-comparison.jpg","JPEG",quality=90,optimize=True,progressive=True)
crop = ib.crop((185, 25, 700, 105)).resize((1030, 160), Image.LANCZOS)
crop.save("previews/nav-logo.jpg","JPEG",quality=92,optimize=True,progressive=True)
print("updated", cv.size, crop.size)
