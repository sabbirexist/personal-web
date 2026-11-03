from PIL import Image
import os
os.makedirs("docs", exist_ok=True)
im = Image.open("previews/theme-comparison.jpg").convert("RGB")
w = 1400
im = im.resize((w, int(im.height*w/im.width)), Image.LANCZOS)
im.save("docs/preview.jpg", "JPEG", quality=82, optimize=True, progressive=True)
print("docs/preview.jpg", round(os.path.getsize("docs/preview.jpg")/1024), "KB")
