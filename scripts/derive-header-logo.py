"""Derive dark-header logos from the official Coconsult PNG.

Shapes, alpha and proportions stay as they are. Nothing is redrawn.
The monochrome file turns every opaque pixel white. The accent file
whitens only the wordmark and leaves the coloured mark untouched.
"""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "brand" / "coconsult-logo.png"
OUT_DIR = ROOT / "public" / "assets" / "brand"
MONO = OUT_DIR / "coconsult-logo-header-mono.png"
# Compared on the night header and not shipped: the blue nodes fall under 3:1.
ACCENT = ROOT / "docs" / "header-logo" / "coconsult-logo-header-accent.png"


def components(image: Image.Image, threshold: int = 24):
    width, height = image.size
    pixels = image.load()
    seen = [[False] * width for _ in range(height)]
    found = []
    for y in range(height):
        for x in range(width):
            if seen[y][x] or pixels[x, y][3] < threshold:
                continue
            queue = deque([(x, y)])
            seen[y][x] = True
            points = []
            red = green = blue = 0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                cx, cy = queue.popleft()
                r, g, b, a = pixels[cx, cy]
                points.append((cx, cy))
                red += r
                green += g
                blue += b
                min_x, max_x = min(min_x, cx), max(max_x, cx)
                min_y, max_y = min(min_y, cy), max(max_y, cy)
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < width and 0 <= ny < height and not seen[ny][nx] and pixels[nx, ny][3] >= threshold:
                        seen[ny][nx] = True
                        queue.append((nx, ny))
            count = len(points)
            box_w = max_x - min_x + 1
            box_h = max_y - min_y + 1
            found.append(
                {
                    "points": points,
                    "count": count,
                    "avg": (red // count, green // count, blue // count),
                    "fill": count / (box_w * box_h),
                    "box": (box_w, box_h),
                }
            )
    return found


def is_round_node(component) -> bool:
    box_w, box_h = component["box"]
    return component["fill"] >= 0.72 and abs(box_w - box_h) <= 8 and max(box_w, box_h) <= 80


def is_wordmark(component) -> bool:
    red, green, blue = component["avg"]
    return (
        red < 20
        and 95 <= green <= 125
        and 110 <= blue <= 140
        and component["count"] < 8000
        and not is_round_node(component)
    )


def wordmark_color(red: int, green: int, blue: int) -> bool:
    return red < 24 and abs(green - 109) <= 16 and abs(blue - 123) <= 16


def derive(source: Image.Image):
    mono = source.copy()
    accent = source.copy()
    mono_px = mono.load()
    accent_px = accent.load()
    width, height = source.size
    letter = [[False] * width for _ in range(height)]
    for component in components(source):
        if not is_wordmark(component):
            continue
        for x, y in component["points"]:
            letter[y][x] = True

    # One-pixel halo only. A wider flood follows the teal of the mark.
    halo = []
    for y in range(height):
        for x in range(width):
            if letter[y][x]:
                continue
            red, green, blue, alpha = accent_px[x, y]
            if alpha == 0 or not wordmark_color(red, green, blue):
                continue
            if any(
                0 <= x + dx < width and 0 <= y + dy < height and letter[y + dy][x + dx]
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
            ):
                halo.append((x, y))
    for x, y in halo:
        letter[y][x] = True

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = accent_px[x, y]
            if alpha == 0:
                continue
            mono_px[x, y] = (255, 255, 255, alpha)
            if letter[y][x]:
                accent_px[x, y] = (255, 255, 255, alpha)
    return mono, accent


def main():
    source = Image.open(SOURCE).convert("RGBA")
    mono, accent = derive(source)
    ACCENT.parent.mkdir(parents=True, exist_ok=True)
    mono.save(MONO, optimize=True)
    accent.save(ACCENT, optimize=True)
    print(MONO.name, MONO.stat().st_size)
    print(ACCENT.name, ACCENT.stat().st_size)


if __name__ == "__main__":
    main()
