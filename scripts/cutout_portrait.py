"""Photograph cutout with soft hair edges + cinematic backdrop."""
import numpy as np
from PIL import Image, ImageFilter
import os
import sys

SRC = "assets/source/sabbir-poster.png"
OUT = "public/work"


def backdrop(h, w, glow=(0.52, 0.30)):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - glow[0] * w) / (0.62 * w)) ** 2 + ((yy - glow[1] * h) / (0.62 * h)) ** 2)
    halo = np.clip(1 - d, 0, 1) ** 2.0
    top = np.array([34, 22, 17], dtype=np.float32) / 255.0
    mid = np.array([15, 10, 8], dtype=np.float32) / 255.0
    bottom = np.array([8, 6, 5], dtype=np.float32) / 255.0
    t = (yy / h)[..., None]
    grad = np.where(
        t < 0.45,
        top[None, None, :] * (1 - t / 0.45) + mid[None, None, :] * (t / 0.45),
        mid[None, None, :] * (1 - (t - 0.45) / 0.55) + bottom[None, None, :] * ((t - 0.45) / 0.55),
    )
    warm = np.array([255, 98, 36], dtype=np.float32) / 255.0
    return np.clip(grad + warm * halo[..., None] * 0.22, 0, 1)


def feather(alpha, amount=1.0):
    a = Image.fromarray(np.uint8(np.clip(alpha, 0, 1) * 255))
    a = a.filter(ImageFilter.GaussianBlur(amount))
    return np.asarray(a, dtype=np.float32) / 255.0


def decontaminate(rgb, alpha, shrink=1.6):
    """Darken the edge fringe so the bright original background doesn't halo."""
    soft = feather(alpha, shrink)
    edge = np.clip((alpha - 0.02) * (1 - alpha) * 4.0, 0, 1)
    target = np.array([0.035, 0.025, 0.018], dtype=np.float32)
    rgb = rgb * (1 - edge[..., None] * 0.55) + target * (edge[..., None] * 0.55)
    return rgb, soft


def render(cut, size):
    w, h = cut.size
    arr = np.asarray(cut, dtype=np.float32) / 255.0
    rgb, alpha = arr[..., :3].copy(), arr[..., 3].copy()

    rgb = np.clip(rgb * 1.02 + 0.012, 0, 1)
    rgb = np.clip(rgb * rgb * (3 - 2 * rgb) * 0.14 + rgb * 0.86, 0, 1)
    rgb = rgb * np.array([1.012, 1.0, 0.99], dtype=np.float32)
    rgb, alpha = decontaminate(rgb, alpha)

    bg = backdrop(h, w)
    out = rgb * alpha[..., None] + bg * (1 - alpha[..., None])

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dv = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / 1.414
    out = out * np.clip(1 - 0.34 * dv ** 2.0 * 1.4, 0, 1)[..., None]

    im = Image.fromarray(np.uint8(np.clip(out, 0, 1) * 255))
    im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=22, threshold=4)).resize(size, Image.LANCZOS)
    return im


def main(model="isnet-general-use"):
    from rembg import remove, new_session

    src = Image.open(SRC).convert("RGB")
    crop = src.crop((300, 120, 1000, 1080))
    session = new_session(model)
    cut = remove(
        crop,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=250,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=6,
    )
    alpha = np.asarray(cut, dtype=np.uint8)[..., 3]
    ys, xs = np.where(alpha > 24)
    print("bbox", xs.min(), ys.min(), xs.max(), ys.max(), "of", cut.size)

    x0, x1 = max(0, xs.min() - 36), min(cut.width, xs.max() + 8)
    y0, y1 = max(0, ys.min() - 64), min(cut.height, ys.max() + 24)
    tight = cut.crop((x0, y0, x1, y1))

    # drop the poster's client card that sits at the far right of the crop
    tight = tight.crop((0, 0, int(tight.width * 0.88), tight.height))

    tw, th = tight.size
    ratio = 4 / 5
    if tw / th > ratio:
        nw = int(th * ratio)
        off = (tw - nw) // 2
        tight = tight.crop((off, 0, off + nw, th))
    else:
        nh = int(tw / ratio)
        off = max(0, int((th - nh) * 0.16))
        tight = tight.crop((0, off, tw, min(th, off + nh)))

    portrait = render(tight, (880, 1100))
    portrait.save(f"{OUT}/sabbir-portrait.webp", "WEBP", quality=90, method=6)
    print("portrait", os.path.getsize(f"{OUT}/sabbir-portrait.webp") // 1024, "KB")

    sw = min(tight.width, tight.height)
    square = tight.crop(
        (
            max(0, (tight.width - sw) // 2),
            max(0, int(tight.height * 0.03)),
            max(0, (tight.width - sw) // 2) + sw,
            max(0, int(tight.height * 0.03)) + sw,
        )
    )
    render(square, (820, 820)).save(f"{OUT}/sabbir-square.webp", "WEBP", quality=90, method=6)
    print("square", os.path.getsize(f"{OUT}/sabbir-square.webp") // 1024, "KB")

    edge = portrait.crop((60, 40, 540, 400)).resize((960, 720), Image.LANCZOS)
    edge.save("previews/audit/edge-check.png")
    print("edge crop saved")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "isnet-general-use")
