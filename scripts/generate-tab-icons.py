#!/usr/bin/env python3
"""生成伴语星球 tabBar 图标（81×81 PNG，灰/紫两态，选中态带轻微辉光）。

风格：细线条线性图标，圆头笔画，呼应应用内细环 + 玻璃描边的视觉语言。
用法：python3 scripts/generate-tab-icons.py
改风格（线宽/颜色/辉光强度）直接改下面 SPEC / PALETTE / GLOW 后重跑。
"""

import math
import os

from PIL import Image, ImageChops, ImageFilter

# ---- 画布参数（逻辑 81px，内部 4x 超采样抗锯齿）----
SIZE = 81
SS = 4
CANVAS = SIZE * SS
STROKE = 5.2  # 线条粗细（逻辑 px）

SRC = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "tab")
GRAY = (148, 143, 153)      # #948f99 未选中
PURPLE = (203, 189, 255)    # #cbbdff 选中
GLOW = 0.30                 # 选中态辉光强度（0 = 关）
BG_PREVIEW = (20, 19, 24)   # #141318 tabBar 背景，仅用于预览拼图


def s(v):  # logical -> supersampled
    return v * SS


# ---------- 基础笔画（全部白 on 黑，最后统一转 alpha 再上色） ----------

def line(d, p1, p2, w):
    x1, y1, x2, y2 = *p1, *p2
    d.line([x1, y1, x2, y2], fill=255, width=int(w))
    r = w / 2
    for cx, cy in ((x1, y1), (x2, y2)):  # 圆头
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)


def polyline(d, pts, w):
    for a, b in zip(pts, pts[1:]):
        line(d, a, b, w)


def circle(d, cx, cy, r, w):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=255, width=int(w))


def tilted_ellipse(d, cx, cy, rx, ry, deg, w, steps=180):
    a = math.radians(deg)
    pts = []
    for i in range(steps + 1):
        t = 2 * math.pi * i / steps
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * math.cos(a) - y * math.sin(a),
                    cy + x * math.sin(a) + y * math.cos(a)))
    polyline(d, pts, w)


def rounded_rect(d, x1, y1, x2, y2, r, w, top_gap=None):
    """描边圆角矩形；top_gap=(gx1,gx2) 时顶边在该区间留缺（分享箭头穿出用）。"""
    def arc(cx, cy, a0, a1, n=14):
        return [(cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
                for a in [a0 + (a1 - a0) * i / n for i in range(n + 1)]]

    if top_gap:
        gx1, gx2 = top_gap
        path = ([(gx2, y1), (x2 - r, y1)] + arc(x2 - r, y1 + r, 270, 360)
                + [(x2, y1 + r), (x2, y2 - r)] + arc(x2 - r, y2 - r, 0, 90)
                + [(x2 - r, y2), (x1 + r, y2)] + arc(x1 + r, y2 - r, 90, 180)
                + [(x1, y2 - r), (x1, y1 + r)] + arc(x1 + r, y1 + r, 180, 270)
                + [(x1 + r, y1), (gx1, y1)])
        polyline(d, path, w)
        return
    path = ([(x1, y1 + r)] + arc(x1 + r, y1 + r, 180, 270)
            + [(x1 + r, y1), (x2 - r, y1)] + arc(x2 - r, y1 + r, 270, 360)
            + [(x2, y1 + r), (x2, y2 - r)] + arc(x2 - r, y2 - r, 0, 90)
            + [(x2 - r, y2), (x1 + r, y2)] + arc(x1 + r, y2 - r, 90, 180)
            + [(x1, y2 - r), (x1, y1 + r)])
    polyline(d, path, w)


def star4(d, cx, cy, r_out, r_in, w=None):
    """四角星：w=None 填充，否则描边。"""
    pts = []
    for k in range(8):
        r = r_out if k % 2 == 0 else r_in
        a = math.pi / 2 + k * math.pi / 4
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    if w is None:
        d.polygon(pts, fill=255)
    else:
        polyline(d, pts + [pts[0]], w)


def heart(d, cx, cy, scale, w, steps=240):
    pts = []
    for i in range(steps + 1):
        t = 2 * math.pi * i / steps
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * scale, cy - y * scale))
    polyline(d, pts, w)
    dot(d, cx, cy + 17 * scale, w * 0.62)  # 尖端补圆头，避免 V 口断裂


def dot(d, cx, cy, r):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)


# ---------- 四个图标的线稿（逻辑坐标，中心约 (40.5, 41)） ----------

def draw_planet(d):
    w = s(STROKE)
    cx, cy = s(40.5), s(41)
    circle(d, cx, cy, s(15.5), w)
    tilted_ellipse(d, cx, cy, s(31), s(9), -20, w * 0.92)
    star4(d, s(64), s(13.5), s(5.5), s(1.9))


def draw_heart(d):
    heart(d, s(40.5), s(42.5), s(1.4), s(STROKE))
    dot(d, s(64.5), s(15), s(2.4))


def draw_journal(d):
    w = s(STROKE)
    rounded_rect(d, s(17), s(16), s(64), s(66), s(7), w)
    line(d, (s(27.5), s(22)), (s(27.5), s(60)), w * 0.82)  # 书脊
    star4(d, s(46), s(41), s(10), s(3.1))  # 封面星点（日记星母题）


def draw_share(d):
    w = s(STROKE)
    rounded_rect(d, s(18), s(34), s(63), s(66), s(6), w, top_gap=(s(33), s(48)))
    line(d, (s(40.5), s(50)), (s(40.5), s(13.5)), w)  # 上升箭头
    line(d, (s(40.5), s(13.5)), (s(32), s(22)), w)
    line(d, (s(40.5), s(13.5)), (s(49), s(22)), w)


ICONS = {"planet": draw_planet, "heart": draw_heart, "journal": draw_journal, "share": draw_share}


def render(draw_fn, color, glow=0.0):
    from PIL import ImageDraw
    mask = Image.new("L", (CANVAS, CANVAS), 0)
    draw_fn(ImageDraw.Draw(mask))
    mask = mask.resize((SIZE, SIZE), Image.LANCZOS)
    if glow > 0:
        halo = mask.filter(ImageFilter.GaussianBlur(2.2))
        mask = ImageChops.add(mask, halo.point(lambda v: int(v * glow)))
    img = Image.new("RGBA", (SIZE, SIZE), color + (255,))
    img.putalpha(mask)
    return img


def preview_sheet(images):
    pad, cell = 26, 81
    W, H = pad + 4 * (cell + pad), pad + 2 * (cell + pad) + 30
    sheet = Image.new("RGB", (W, H), BG_PREVIEW)
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    labels = ["星球", "情绪", "日记", "分享"]
    for row, (state, color) in enumerate((("未选中", GRAY), ("选中", PURPLE))):
        for col in range(4):
            x, y = pad + col * (cell + pad), pad + row * (cell + pad + 15)
            sheet.paste(images[row * 4 + col], (x, y), images[row * 4 + col])
            d.text((x + cell // 2 - 24, y + cell + 6), f"{labels[col]}·{state}", fill=color + (255,))
    return sheet


def main():
    os.makedirs(SRC, exist_ok=True)
    all_imgs = []
    for name, fn in ICONS.items():
        gray = render(fn, GRAY)
        purple = render(fn, PURPLE, GLOW)
        gray.save(os.path.join(SRC, f"{name}.png"))
        purple.save(os.path.join(SRC, f"{name}-on.png"))
        all_imgs += [gray, purple]
        print(f"✓ {name}.png / {name}-on.png")
    sheet = preview_sheet(all_imgs)
    out = "/tmp/banyu-tab-icons-preview.png"
    sheet.save(out)
    print(f"预览图：{out}")


if __name__ == "__main__":
    main()
