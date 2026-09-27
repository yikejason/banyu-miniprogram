#!/usr/bin/env python3
"""把心情小人立绘处理成小程序可用的透明底小图。

对 src/assets/companions/*.png 做：
1. 抠白底——只抠「与四边连通的近白色区域」，主体内部的白色保留；
2. 边缘轻度收缩 + 羽化，去掉白边锯齿；
3. 缩到 TARGET 尺寸并压缩保存（原图已有备份，直接覆盖）。

换了新立绘后重跑：python3 scripts/process-companions.py
"""

import os
import sys
from collections import deque

from PIL import Image, ImageFilter

SRC = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "companions")
TARGET = 480          # 输出尺寸（页面显示 320rpx≈160px，480 足够清晰）
WHITE_MIN = 225       # 近白判定：RGB 各通道下限
WHITE_SAT = 18        # 近白判定：通道间最大差值（排除彩色的浅色）
ERODE_BLUR = 1.2      # 边缘羽化半径


def is_white(r, g, b):
    return min(r, g, b) >= WHITE_MIN and max(r, g, b) - min(r, g, b) <= WHITE_SAT


def cut_background(rgb):
    """从四边向内洪泛标记连通白底，返回 0/255 蒙版（255=主体）。"""
    w, h = rgb.size
    px = rgb.load()
    bg = bytearray(w * h)  # 1 = 白底
    q = deque()

    def push(x, y):
        i = y * w + x
        if not bg[i] and is_white(*px[x, y]):
            bg[i] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        if x > 0: push(x - 1, y)
        if x < w - 1: push(x + 1, y)
        if y > 0: push(x, y - 1)
        if y < h - 1: push(x, y + 1)

    mask = Image.new("L", (w, h))
    mask.putdata([0 if bg[i] else 255 for i in range(w * h)])
    return mask


def process(path):
    im = Image.open(path).convert("RGB")
    mask = cut_background(im)
    # 收缩 1px 去白边，再羽化
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(ERODE_BLUR))
    rgba = im.convert("RGBA")
    rgba.putalpha(mask)
    out = rgba.resize((TARGET, TARGET), Image.LANCZOS)
    out.save(path, optimize=True)
    return out


def main():
    for name in sorted(os.listdir(SRC)):
        if not name.endswith(".png") or "original" in name:
            continue
        path = os.path.join(SRC, name)
        before = os.path.getsize(path)
        out = process(path)
        after = os.path.getsize(path)
        alpha = out.getchannel("A")
        transparent = sum(1 for v in alpha.getdata() if v < 10) / (TARGET * TARGET)
        print(f"{name}: {before/1e6:.2f}MB -> {after/1e3:.0f}KB, 透明区占 {transparent:.0%}")
        if transparent < 0.15:
            print(f"  ⚠️ {name} 抠掉的背景很少，请人工检查（主体可能不是白底）", file=sys.stderr)


if __name__ == "__main__":
    main()
