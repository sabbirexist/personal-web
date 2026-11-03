"""Render procedural cinematic loops + a montage showreel with ffmpeg."""
import os, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(HERE, "public", "work")
MEDIA = os.path.join(HERE, "public", "media")
os.makedirs(MEDIA, exist_ok=True)

ORANGE = (255, 92, 26)
AMBER = (255, 170, 100)
CREAM = (255, 235, 215)


def coords(h, w):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    return xx, yy


def blob(img, cx, cy, rx, ry, color, strength=1.0, power=2.0):
    h, w = img.shape[:2]
    xx, yy = coords(h, w)
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    m = (np.clip(1 - d, 0, 1) ** power * strength)[..., None]
    img += m * np.array(color, dtype=np.float32)
    return img


def streak(img, cx, cy, length, thickness, ang_deg, color, strength=1.0):
    h, w = img.shape[:2]
    yy, xx = coords(h, w)
    a = np.deg2rad(ang_deg)
    u = (xx - cx) * np.cos(a) + (yy - cy) * np.sin(a)
    v = -(xx - cx) * np.sin(a) + (yy - cy) * np.cos(a)
    m = np.exp(-(u / length) ** 2 * 3) * np.exp(-(v / thickness) ** 2)
    img += (m * strength)[..., None] * np.array(color, dtype=np.float32)
    return img


def vig(img, amount=0.6, power=2.4):
    h, w = img.shape[:2]
    xx, yy = coords(h, w)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / 1.414
    return img * np.clip(1 - amount * (d ** power) * 1.6, 0, 1)[..., None]


def grain(img, amt=6.0, rng=None):
    rng = rng or np.random.default_rng()
    h, w = img.shape[:2]
    return img + rng.normal(0, amt, (h, w, 1)).repeat(3, axis=2)


def finish(img):
    return Image.fromarray(np.uint8(np.clip(img, 0, 255)))


def ffmpeg_writer(path, w, h, fps=24, crf=26):
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{w}x{h}", "-r", str(fps), "-i", "-", "-an",
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", path,
    ]
    return subprocess.Popen(cmd, stdin=subprocess.PIPE)


# --------------------------------------------------------------- loops
def loop_rings(path, w=720, h=450, frames=48, fps=16):
    p = ffmpeg_writer(path, w, h, fps, 32)
    rng = np.random.default_rng(11)
    for i in range(frames):
        t = i / frames
        img = np.zeros((h, w, 3), dtype=np.float32)
        img += np.array([10, 8, 8], dtype=np.float32)
        img = blob(img, w * 0.5, h * 0.52, w * 0.7, h * 0.72, (46, 19, 9), 1.0, 1.7)
        img = blob(img, w * 0.5, h * 0.52, w * 0.22, h * 0.30, (255, 96, 28), 0.22 + 0.12 * np.sin(t * 6.28), 2.0)
        layer = Image.new("RGB", (w * 2, h * 2), (0, 0, 0))
        d = ImageDraw.Draw(layer)
        cx, cy = w, h
        for k in range(9):
            phase = (t + k / 9) % 1.0
            r = 40 + phase * 430
            alpha = int(230 * (1 - phase) ** 1.6)
            col = (255, 118, 44) if k % 2 == 0 else (150, 66, 32)
            col = tuple(int(c * alpha / 255) for c in col)
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=int(2 + (1 - phase) * 3))
        d.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=(255, 224, 195))
        layer = layer.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5))
        img += np.asarray(layer, dtype=np.float32)
        img = streak(img, w * 0.5 + np.sin(t * 6.28) * 140, h * 0.5, 300, 620, 0, (20, 9, 5), 0.5)
        img = vig(img, 0.6)
        img = grain(img, 4.5, rng)
        p.stdin.write(np.uint8(np.clip(img, 0, 255)).tobytes())
    p.stdin.close(); p.wait(); print("wrote", os.path.basename(path))


def loop_orb(path, w=720, h=450, frames=48, fps=16):
    p = ffmpeg_writer(path, w, h, fps, 32)
    rng = np.random.default_rng(5)
    xx, yy = coords(h, w)
    for i in range(frames):
        t = i / frames
        ang = t * 6.283
        hx = w * 0.62 + np.cos(ang) * 130
        hy = h * 0.44 + np.sin(ang) * 60
        img = np.zeros((h, w, 3), dtype=np.float32) + np.array([8, 7, 8], dtype=np.float32)
        img = blob(img, w * 0.62, h * 0.5, w * 0.55, h * 0.8, (40, 17, 10), 1.0, 1.7)
        d = np.sqrt((xx - w * 0.62) ** 2 + (yy - h * 0.47) ** 2) / (h * 0.33)
        mask = np.clip(1 - d, 0, 1)
        light = np.clip(1 - np.sqrt((xx - hx) ** 2 + (yy - hy) ** 2) / (h * 0.62), 0, 1) ** 2
        sphere = np.array([26, 13, 9], dtype=np.float32) * (1 - light[..., None]) + np.array([255, 150, 80], dtype=np.float32) * light[..., None]
        img = img * (1 - mask[..., None] * 0.98) + sphere * (mask[..., None] * 0.98)
        img = streak(img, w * 0.3, h * 0.75, 260, 240, -14, (255, 80, 20), 0.10)
        img = streak(img, w * 0.62, h * 0.47, w * 0.7, 90, 14, (40, 18, 10), 0.35)
        layer = Image.new("RGB", (w * 2, h * 2), (0, 0, 0))
        d2 = ImageDraw.Draw(layer)
        cx, cy = int(w), int(h * 0.94)
        for k in range(3):
            rx = int((h * 1.55 + k * 26)) if False else int(h * (0.95 + k * 0.13))
            ry = int(rx * 0.16)
            d2.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=(255, 130, 60), width=3)
        layer = layer.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.0))
        img += np.asarray(layer, dtype=np.float32) * 0.55
        img = vig(img, 0.62)
        img = grain(img, 4.5, rng)
        p.stdin.write(np.uint8(np.clip(img, 0, 255)).tobytes())
    p.stdin.close(); p.wait(); print("wrote", os.path.basename(path))


def loop_sweep(path, w=720, h=450, frames=48, fps=16):
    p = ffmpeg_writer(path, w, h, fps, 32)
    rng = np.random.default_rng(9)
    for i in range(frames):
        t = i / frames
        img = np.zeros((h, w, 3), dtype=np.float32) + np.array([7, 6, 7], dtype=np.float32)
        img = blob(img, w * 0.45, h * 0.62, w * 0.7, h * 0.6, (26, 13, 10), 1.0, 1.8)
        x = -0.3 * w + t * 1.6 * w
        img = streak(img, x, h * 0.5, w * 0.55, 22, -18, (255, 108, 40), 0.9)
        img = streak(img, x + 20, h * 0.5, w * 0.5, 5, -18, (255, 235, 215), 0.7)
        img = streak(img, x - 90, h * 0.6, w * 0.4, 120, -18, (90, 36, 14), 0.35)
        layer = Image.new("RGB", (w * 2, h * 2), (0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.polygon([int(w * 1.62), int(h * 0.66), int(w * 1.86), int(h * 0.54), int(w * 1.78), int(h * 0.82)], outline=(255, 150, 90), width=3)
        d.line([int(w * 0.12), int(h * 1.72), int(w * 0.5), int(h * 1.72)], fill=(90, 90, 90), width=2)
        layer = layer.resize((w, h), Image.LANCZOS)
        img += np.asarray(layer, dtype=np.float32) * 0.8
        img = vig(img, 0.55)
        img = grain(img, 4.5, rng)
        p.stdin.write(np.uint8(np.clip(img, 0, 255)).tobytes())
    p.stdin.close(); p.wait(); print("wrote", os.path.basename(path))


# --------------------------------------------------------------- montage
def showreel(path, w=1440, h=810, fps=24):
    stills = ["rings.webp", "ember.webp", "orb.webp", "grid.webp", "streak.webp", "arc.webp"]
    seg = 30  # frames per segment
    fade = 9
    total = len(stills) * (seg - fade) + fade
    p = ffmpeg_writer(path, w, h, fps, 27)
    rng = np.random.default_rng(2)
    imgs = {}
    for s in stills:
        im = Image.open(os.path.join(WORK, s)).convert("RGB")
        scale = max(w / im.width, h / im.height) * 1.35
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
        imgs[s] = im

    def sample(name, zoom, px, py):
        im = imgs[name]
        cw, ch = int(w * 1.24 / zoom), int(h * 1.24 / zoom)
        x = int(px * (im.width - cw)); y = int(py * (im.height - ch))
        x = max(0, min(im.width - cw, x)); y = max(0, min(im.height - ch, y))
        crop = im.crop((x, y, x + cw, y + ch)).resize((w, h), Image.BILINEAR)
        return np.asarray(crop, dtype=np.float32)

    prev = None
    for i in range(total):
        idx = i // (seg - fade)
        local = i - idx * (seg - fade)
        name = stills[min(idx, len(stills) - 1)]
        z = 1.0 + 0.16 * (local / max(1, seg - fade))
        px, py = 0.5 + 0.18 * np.sin(idx * 2.0), 0.5 - 0.12 * np.cos(idx * 1.3)
        frame = sample(name, z, px, py)
        t = i / total
        frame = blob(frame, w * 0.25 + t * w * 0.5, h * 0.35, w * 0.4, h * 0.5, (60, 24, 10), 0.25, 2.0)
        frame = streak(frame, (-0.2 + (i % seg) / seg * 0.9) * w, h * 0.45, w * 0.4, 90, -18, (50, 20, 8), 0.25)
        cur = finish(frame)
        if i % (seg - fade) < fade and idx > 0:
            a = (i % (seg - fade)) / fade
            cur = Image.blend(prev, cur, a)
        arr = np.asarray(cur, dtype=np.float32)
        arr = vig(arr, 0.5)
        arr = grain(arr, 7, rng)
        p.stdin.write(np.uint8(np.clip(arr, 0, 255)).tobytes())
        prev = cur
    p.stdin.close(); p.wait()
    print("wrote", os.path.basename(path), total, "frames")


if __name__ == "__main__":
    showreel(os.path.join(MEDIA, "showreel.mp4"))
    loop_rings(os.path.join(MEDIA, "loop-rings.mp4"))
    loop_orb(os.path.join(MEDIA, "loop-orb.mp4"))
    loop_sweep(os.path.join(MEDIA, "loop-sweep.mp4"))


