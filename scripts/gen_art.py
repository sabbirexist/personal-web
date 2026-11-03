"""Generate cinematic placeholder posters (orange / charcoal palette)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "work")
os.makedirs(OUT, exist_ok=True)

W, H = 1600, 1000
SS = 2  # supersample for the shapes layer


def canvas(w, h, base=(9, 9, 11)):
    a = np.zeros((h, w, 3), dtype=np.float32)
    a[..., 0], a[..., 1], a[..., 2] = base
    return a


def coords(h, w):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    return xx, yy


def add_blob(img, cx, cy, rx, ry, color, strength=1.0, power=2.0):
    """Additive elliptical falloff light."""
    h, w = img.shape[:2]
    xx, yy = coords(h, w)
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    m = np.clip(1.0 - d, 0.0, 1.0) ** power
    m = (m * strength)[..., None]
    img += m * np.array(color, dtype=np.float32)
    return img


def add_streak(img, cx, cy, length, thickness, angle_deg, color, strength=1.0):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ang = np.deg2rad(angle_deg)
    dx, dy = xx - cx, yy - cy
    u = dx * np.cos(ang) + dy * np.sin(ang)
    v = -dx * np.sin(ang) + dy * np.cos(ang)
    m = np.exp(-(u / (length + 1e-6)) ** 2 * 3.0) * np.exp(-(v / (thickness + 1e-6)) ** 2)
    img += (m * strength)[..., None] * np.array(color, dtype=np.float32)
    return img


def shape_layer(draw_fn, w, h):
    im = Image.new("RGB", (w * SS, h * SS), (0, 0, 0))
    d = ImageDraw.Draw(im, "RGB")
    draw_fn(d, SS, w, h)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    return np.asarray(im, dtype=np.float32)


def screen(img, layer, opacity=1.0):
    img = img + layer * opacity
    return img


def vignette(img, amount=0.55, power=2.6):
    h, w = img.shape[:2]
    xx, yy = coords(h, w)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / 1.414
    m = np.clip(1.0 - amount * (d ** power) * 1.6, 0.0, 1.0)
    return img * m[..., None]


def grain(img, amount=7.0, softness=0.0):
    h, w = img.shape[:2]
    rng = np.random.default_rng(7)
    n = rng.normal(0, amount, (h, w, 1)).repeat(3, axis=2)
    if softness:
        n = np.asarray(
            Image.fromarray(np.uint8(np.clip(n + 128, 0, 255))).filter(
                ImageFilter.GaussianBlur(softness)
            ),
            dtype=np.float32,
        ) - 128.0
    return img + n


def bloom(img, radius=28, strength=0.55):
    h, w = img.shape[:2]
    im = Image.fromarray(np.uint8(np.clip(img, 0, 255)))
    small = im.resize((w // 3, h // 3), Image.BILINEAR).filter(
        ImageFilter.GaussianBlur(radius / 3)
    )
    b = np.asarray(small.resize((w, h), Image.BILINEAR), dtype=np.float32)
    lum = b.mean(axis=2, keepdims=True) / 255.0
    return img + b * (lum ** 2) * strength


def finish(img, path, w=W, h=H, q=84):
    img = np.clip(img, 0, 255)
    im = Image.fromarray(img.astype(np.uint8))
    if im.size != (w, h):
        im = im.resize((w, h), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)
    print("wrote", os.path.basename(path), im.size)


ORANGE = (255, 92, 31)
AMBER = (255, 168, 92)
DEEP = (255, 60, 0)
CREAM = (255, 226, 196)


# ---------------------------------------------------------------- posters
def poster_ember():
    img = canvas(W, H, (10, 8, 8))
    add_blob(img, 380, 300, 900, 780, (58, 24, 10), 1.0, 1.6)
    add_blob(img, 300, 250, 420, 340, (110, 44, 14), 0.9, 2.0)
    add_blob(img, 330, 300, 150, 130, AMBER, 0.85, 2.4)
    add_blob(img, 340, 320, 46, 40, CREAM, 0.95, 2.0)

    def shapes(d, s, w, h):
        d.ellipse([160 * s, 130 * s, 520 * s, 490 * s], outline=(255, 255, 255), width=2 * s)
        d.arc([200 * s, 100 * s, 700 * s, 600 * s], 200, 330, fill=(255, 255, 255), width=3 * s)
        d.line([900 * s, 0, 1400 * s, 1000 * s], fill=(70, 70, 70), width=1 * s)
        d.rectangle([1180 * s, 640 * s, 1500 * s, 660 * s], fill=(30, 30, 30))

    img = screen(img, shape_layer(shapes, W, H), 0.55)
    img = add_streak(img, 900, 620, 900, 90, -18, (60, 22, 8), 0.5)
    img = bloom(img, 40, 0.5)
    img = vignette(img, 0.6)
    img = grain(img, 6.5)
    finish(img, os.path.join(OUT, "ember.webp"))


def poster_rings():
    img = canvas(W, H, (8, 7, 7))
    add_blob(img, 800, 500, 1100, 700, (34, 16, 10), 1.0, 1.5)
    add_blob(img, 800, 500, 300, 260, (255, 90, 20), 0.18, 2.2)

    def shapes(d, s, w, h):
        cx, cy = 800 * s, 500 * s
        for i, r in enumerate(range(70, 470, 46)):
            col = (255, 108, 32) if i % 3 == 0 else (120, 55, 28)
            d.ellipse([cx - r * s, cy - r * s, cx + r * s, cy + r * s], outline=col, width=(3 if i % 3 == 0 else 1) * s)
        d.ellipse([cx - 18 * s, cy - 18 * s, cx + 18 * s, cy + 18 * s], fill=(255, 220, 190))

    img = screen(img, shape_layer(shapes, W, H), 0.85)
    img = add_streak(img, 800, 500, 260, 700, 0, (24, 12, 7), 0.6)
    img = bloom(img, 36, 0.5)
    img = vignette(img, 0.62)
    img = grain(img, 6.0)
    finish(img, os.path.join(OUT, "rings.webp"))


def poster_grid():
    img = canvas(W, H, (9, 8, 8))
    add_blob(img, 1250, 180, 800, 600, (255, 96, 30), 0.32, 2.2)
    add_blob(img, 250, 850, 700, 500, (40, 18, 10), 1.0, 2.0)

    def shapes(d, s, w, h):
        hy = 560 * s
        for i in range(-14, 15):
            x = 800 * s + i * 120 * s
            d.line([x, hy, 800 * s + i * 340 * s, 1000 * s], fill=(150, 74, 34), width=1 * s)
        for i in range(1, 14):
            yy = hy + (i ** 1.75) * 10 * s
            if yy < h * s:
                d.line([0, yy, w * s, yy], fill=(96, 48, 26), width=1 * s)
        d.line([0, hy, w * s, hy], fill=(255, 130, 60), width=3 * s)
        d.ellipse([1180 * s, 250 * s, 1320 * s, 390 * s], outline=(255, 150, 80), width=3 * s)

    img = screen(img, shape_layer(shapes, W, H), 0.9)
    img = bloom(img, 34, 0.45)
    img = vignette(img, 0.6)
    img = grain(img, 6.0)
    finish(img, os.path.join(OUT, "grid.webp"))


def poster_orb():
    img = canvas(W, H, (7, 7, 8))
    add_blob(img, 1050, 480, 700, 620, (34, 16, 10), 1.0, 1.8)
    # sphere with light falloff
    xx, yy = coords(H, W)
    cx, cy, r = 1050, 470, 300
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    mask = np.clip(1 - d, 0, 1)
    shade = np.clip((1 - d) ** 0.35, 0, 1) * 0.9
    light = np.clip(1 - np.sqrt((xx - (cx - 110)) ** 2 + (yy - (cy - 130)) ** 2) / (r * 1.5), 0, 1) ** 2
    sphere = (np.array([28, 14, 10], dtype=np.float32) * (1 - light[..., None])
              + np.array([255, 150, 80], dtype=np.float32) * light[..., None])
    img = img * (1 - mask[..., None] * 0.97) + sphere * (mask[..., None] * 0.97)
    img = add_blob(img, 900, 620, 420, 240, (255, 80, 20), 0.10, 2.2)
    img = add_streak(img, 1050, 470, 700, 120, 12, (44, 20, 10), 0.35)

    def shapes(d, s, w, h):
        d.rectangle([140 * s, 700 * s, 640 * s, 703 * s], fill=(120, 120, 120))
        d.rectangle([140 * s, 700 * s, 330 * s, 703 * s], fill=(255, 120, 50))

    img = screen(img, shape_layer(shapes, W, H), 0.7)
    img = bloom(img, 40, 0.45)
    img = vignette(img, 0.62)
    img = grain(img, 6.0)
    finish(img, os.path.join(OUT, "orb.webp"))


def poster_streak():
    img = canvas(W, H, (6, 6, 7))
    add_blob(img, 500, 620, 800, 500, (26, 14, 10), 1.0, 1.8)
    img = add_streak(img, 700, 540, 800, 34, -24, (255, 110, 40), 0.95)
    img = add_streak(img, 700, 540, 780, 7, -24, (255, 235, 220), 0.85)
    img = add_streak(img, 500, 700, 500, 160, -24, (110, 44, 16), 0.45)

    def shapes(d, s, w, h):
        d.polygon([1300 * s, 380 * s, 1470 * s, 300 * s, 1420 * s, 470 * s], outline=(255, 150, 90), width=3 * s)
        d.line([120 * s, 860 * s, 420 * s, 860 * s], fill=(90, 90, 90), width=2 * s)

    img = screen(img, shape_layer(shapes, W, H), 0.8)
    img = bloom(img, 44, 0.6)
    img = vignette(img, 0.55)
    img = grain(img, 6.5)
    finish(img, os.path.join(OUT, "streak.webp"))


def poster_arc():
    img = canvas(W, H, (8, 8, 9))
    add_blob(img, 950, 700, 900, 600, (46, 20, 10), 0.9, 1.8)
    add_blob(img, 980, 660, 320, 260, (255, 92, 26), 0.30, 2.0)

    def shapes(d, s, w, h):
        for i in range(5):
            r = (240 + i * 70) * s
            d.arc([980 * s - r, 700 * s - r, 980 * s + r, 700 * s + r], 180, 360,
                  fill=(255, 128, 56) if i % 2 == 0 else (120, 60, 32), width=(4 if i % 2 == 0 else 2) * s)
        d.ellipse([300 * s, 250 * s, 420 * s, 370 * s], fill=(255, 92, 26))

    img = screen(img, shape_layer(shapes, W, H), 0.95)
    img = add_streak(img, 900, 900, 900, 300, 0, (30, 14, 8), 0.5)
    img = bloom(img, 38, 0.55)
    img = vignette(img, 0.6)
    img = grain(img, 6.0)
    finish(img, os.path.join(OUT, "arc.webp"))


def poster_type():
    img = canvas(W, H, (10, 9, 9))
    add_blob(img, 1200, 300, 800, 700, (30, 15, 10), 1.0, 1.8)
    add_blob(img, 1240, 340, 320, 300, (255, 96, 30), 0.22, 2.0)

    # abstract "S" built from two arcs
    def shapes(d, s, w, h):
        d.arc([380 * s, 140 * s, 900 * s, 560 * s], 300, 180, fill=(255, 120, 50), width=26 * s)
        d.arc([300 * s, 420 * s, 820 * s, 840 * s], 120, 0, fill=(255, 120, 50), width=26 * s)
        d.polygon([1240 * s, 560 * s, 1420 * s, 740 * s, 1060 * s, 740 * s], outline=(255, 170, 110), width=3 * s)
        d.line([140 * s, 900 * s, 1460 * s, 900 * s], fill=(60, 60, 60), width=2 * s)

    img = screen(img, shape_layer(shapes, W, H), 0.9)
    img = bloom(img, 40, 0.5)
    img = vignette(img, 0.6)
    img = grain(img, 6.5)
    finish(img, os.path.join(OUT, "monogram.webp"))


def poster_dust():
    img = canvas(W, H, (7, 7, 8))
    add_blob(img, 800, 560, 1000, 520, (30, 16, 11), 1.0, 1.7)
    h, w = H, W
    rng = np.random.default_rng(3)
    for _ in range(90):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        r = rng.uniform(0.6, 3.2)
        c = rng.uniform(0.25, 1.0)
        img = add_blob(img, x, y, r * 2.4, r * 2.4, (255, 150, 80), c * 0.5, 2.2)
    img = add_streak(img, 900, 200, 700, 260, 8, (120, 56, 22), 0.32)

    def shapes(d, s, w, h):
        d.rectangle([120 * s, 120 * s, 1480 * s, 880 * s], outline=(46, 46, 46), width=2 * s)

    img = screen(img, shape_layer(shapes, W, H), 0.8)
    img = bloom(img, 30, 0.5)
    img = vignette(img, 0.65)
    img = grain(img, 7.0)
    finish(img, os.path.join(OUT, "dust.webp"))


def portrait():
    w, h = 900, 1150
    img = canvas(w, h, (9, 8, 8))
    add_blob(img, 620, 300, 700, 700, (255, 96, 30), 0.28, 2.0)
    add_blob(img, 300, 900, 600, 500, (40, 18, 10), 1.0, 1.8)

    def shapes(d, s, ww, hh):
        # silhouette-ish abstract figure: head + shoulders
        d.ellipse([340 * s, 300 * s, 560 * s, 540 * s], fill=(24, 18, 16))
        d.rounded_rectangle([250 * s, 560 * s, 650 * s, 1150 * s], radius=170 * s, fill=(24, 18, 16))
        d.arc([340 * s, 300 * s, 560 * s, 540 * s], 190, 350, fill=(255, 130, 60), width=4 * s)
        d.rounded_rectangle([250 * s, 560 * s, 650 * s, 1150 * s], radius=170 * s, outline=(90, 44, 24), width=2 * s)

    img = screen(img, shape_layer(shapes, w, h), 0.95)
    img = bloom(img, 34, 0.4)
    img = vignette(img, 0.6)
    img = grain(img, 6.0)
    finish(img, os.path.join(OUT, "portrait.webp"), w=900, h=1150)


if __name__ == "__main__":
    poster_ember()
    poster_rings()
    poster_grid()
    poster_orb()
    poster_streak()
    poster_arc()
    poster_type()
    poster_dust()
    portrait()

