# Design Notes — Fractions on a Number Line: Winter Trail Mazes & Practice (3rd Grade)

> Designer: Worksheet Designer agent | Date: 2026-11-11
> Inputs: `03-content.md` (authoritative), `02-plan.md`, `02b-creative-brief.md`, `brand/style-guide.md`, `templates/worksheet-template.html`, `templates/themes/clean-minimal.css`, `brand/assets/LICENSES.md`

## Output files
| File | Notes |
|---|---|
| `worksheet.html` | 18 `<section class="page">`, `<meta name="tpt-theme" content="clean-minimal">`. The winter override (`html:root`: glacier `#2468a0`, berry `#c8325f`, ice `#dcebf7`, snow `#f7fafc` = `--thumb-bg`) is set in the product's own `<style>`. The theme file was not edited. |
| `trail-lib.js` | Shared by `worksheet.html` and `thumbnails.html`. It holds every original SVG symbol, the number-line engine (`TRAIL.line`, `TRAIL.parseNL`) and the cover scene (`TRAIL.scene`). |
| `output/3rd-grade-winter-fractions-number-line.pdf` | 18 pages, US Letter (612 × 792 pt) |
| `output/3rd-grade-winter-fractions-number-line-preview.pdf` | 6 pages with the PREVIEW watermark: `--select 1,3,7,8,10,12` (cover, Trail Guide, Maze 2, Same Spot, Fix the Trail Sign, game). These are the plan's recommended pages plus p.10. |
| `thumbnails.html` + `output/thumbnails/thumbnail-1…4.png` | 4 designed thumbnails, 1400 × 1400 (`--thumbnails --raw --pages 4`) |
| `thumb-src/page-01…18.png` | 150 dpi page snapshots used inside the thumbnails |

**Rebuild order** (run all of these after any page change):
```bash
S=products/3rd-grade-winter-fractions-number-line
node scripts/build-pdf.mjs $S/worksheet.html $S/output/3rd-grade-winter-fractions-number-line.pdf
node scripts/build-pdf.mjs $S/worksheet.html $S/output/3rd-grade-winter-fractions-number-line-preview.pdf --preview --select 1,3,7,8,10,12
rm -f $S/thumb-src/* && pdftoppm -r 150 -png $S/output/3rd-grade-winter-fractions-number-line.pdf $S/thumb-src/page
node scripts/build-pdf.mjs $S/thumbnails.html $S/output/thumbnails --thumbnails --raw --pages 4
```

## Fonts
| Font | Use | License | Credited on p.18 |
|---|---|---|---|
| Lexend (variable), from `brand/assets/fonts/lexend/` | All text: titles, body, every number and fraction | SIL OFL 1.1 | Yes |

- **`pdffonts` result:** the full PDF and the preview contain **only Lexend** (embedded and subset). There are no system-font fallbacks.
- Chrome embeds the variable font as Type 3 "Lexend-Regular" subsets. This is normal and prints correctly.
- "Italic" text, used only in teacher/key samples, is a synthetic slant. Lexend has no italic file.
- Andika is not used.

## Art (100% original inline SVG, in `trail-lib.js`; no clip art, no third-party assets)
`jun-jump`, `jun-point`, `jun-wave`, `jun-head` (Juniper, a snowshoe hare with dark ear tips, big hind feet and a striped scarf) · `birch-wave`, `birch-stride`, `birch-head` (Birch, a moose with palmate antlers and a knit hat; no reindeer cues) · `prints` / `prints-o` (hare track pairs: paws, bullets, color-in) · `hoof` · `flag` (Base Camp) · `cabin` (Cocoa Cabin, no festive decor) · `pine`, `mtn` · `flake`, `flake2` · `snowball`, `mitten` (game tokens) · `scissors` · `star` ("Try it!") · `arrow` (replaces every "→").
- On student pages the art is line-only (slate on white). Berry appears only as thin hop arcs (Trail Guide, p.8 example, faint Maze 1 scaffold arcs) and in the answer keys. Ice fill appears only on the cover and thumbnails.
- Level marks are filled footprint pairs (1/2/3) in the top-right corner of each page.
- **No placeholder images remain.** Every `[IMAGE: …]` in the content was drawn.

## Number lines (accuracy)
- Every line is generated from the `NL[...]` strings copied verbatim from `03-content.md`. `TRAIL.parseNL` reads them, and ticks use `x = x0 + (k / (b·(max−min)))·L`. Points use the same mapping, so nothing is hand-placed.
- Main line 2.7 px (≈2 pt). Ticks are 0.18 in, and whole-number ticks are 0.24 in. The point marker is a filled footprint whose pad is centered exactly on the tick.
- Fractions are always stacked: SVG `<text>` + bar, or the `.fr` HTML stack built from "a/b" text by a script. The PDF text was checked for ½ ¼ ¾ ⅛ ⁄ ★ ✓ ● ☐ × → ❄ and contains **none** of them.
- **Stacked lines** (p.8, Maze 3, game, p.10 Tobias, p.13–14, keys) share `x0` and `L`, so 0 and 1 line up exactly. Maze 3 and game "two trails" cells have **no point on the bottom line**. Their 0 and 1 labels are printed once, under the bottom line, with faint dotted guides at 0 and 1.
- **p.10 Emeka card:** ticks at 0, 0.2, 0.5 and 1 of the line length (deliberately unequal), with the footprint at 0.2.
- **p.12 game:** only the specified labels are printed: 0/1(/2/3), the top-line label on T squares, and the F/T/C tag.
- **Data check by script (scratch, not shipped):** the maze and game arrays in `worksheet.html` were checked against their NL specs.
  - Mazes 1–3: true cells = path cells, the path steps are adjacent with no shortcuts, it runs from R1C1 to R5C4, and it has 10/12/10 footprints. 0 errors.
  - Game: all 25 Answer Card entries equal the computed answer. Counts are F 15 / T 5 / C 5, with ≤ 8 hops per line. 0 errors.
  - The p.16 maze keys are drawn from the same arrays.

## Content rules followed
- The "Writer check (not printed)" tables are **not printed**.
- The **TEKS line on p.18 is omitted** because QA has not verified it. An HTML comment marks the spot.
- The banned-word search (Christmas, holiday, Santa, reindeer, Merry, December, gift, ornament) found nothing in the PDF text.
- Juniper = she, Birch = he.

## Layout decisions / deviations (math and wording unchanged)
| Page | Decision | Why |
|---|---|---|
| 2 | Upper text flows in 2 columns at 8 pt. What's Inside is a full-width table at 7.8 pt. | All of the Teacher Guide content fits on one page. |
| 4 | Answer prompts sit in a narrow column to the right of each 5.5 in line, with stacked answer boxes. | Six items plus writing space fit on one page. |
| 5 | Part A lines are 2.3 in (plan said ~3.2 in). | Two columns plus the stacked answer box. Eighths are still 0.29 in apart. |
| 8 | "Part A/B/C" headings are merged into the start of each directions box. Part B's four stacked lines are 4.2 in, and Part C uses two 3.05 in lines side by side. Part A lines are 5.5 in. | Needed to fit the whole page. Part A, where students draw, keeps ≥ 5.5 in. |
| 9 | Directions are 11 pt. Same-spot cells use 1.16 in lines with fractions in a right-hand column and the color circle under the bottom line. | Two stacked lines plus two fractions in one 1.7 in sign. |
| 12 | Squares are 1.45 × 1.48 in. The token key says "Snowball = O / Mitten = X". | The board fills the space. The rules text is unchanged. |
| 16 | Maze keys draw the berry path **under** white sign badges; true signs get a berry ring. Path lists use commas, not arrows. | Keeps every fraction readable. |
| Titles | Long titles are set at 20.5–22 pt (one line). | They do not fit at 24 pt in Lexend. |
| Thumb 2 | Subtitle shortened to "3 levels: unit to equivalent fractions". The magnifier crosses out the color circle, so the 3/5 sign stays readable. | The full brief text does not fit at ≥ 52 px. |
| Thumbs 2–4 | Headings are 86–92 px, not 120 px. | The 120 px rule is applied to the main product title on thumbnail 1 (132 px). |

## QA checks performed
- `pdfinfo`: 18 pages, Letter. Preview: 6 pages.
- A layout script measured every page against the footer. All 18 pages fit; the tightest are p.2, p.4 and p.8, each within a few px of the footer.
- Visual inspection at 70–200 dpi: cover, p.2–18, all three mazes (cell close-ups), the game board, the p.10 cards, and all 4 thumbnails, including thumbnail 1 at 400 px. No clipping or overflow.

## Owner to-do
1. **Store name (placeholder):** footers, the p.18 credits and the © line show **"Your Store Name"** (from `brand/style-guide.md`).
   - Edit `const STORE = { name: … }` near the top of the script in `worksheet.html`.
   - Update `brand/style-guide.md` too.
   - Then rerun the full rebuild order above. The thumbnails show page footers, so they must be rebuilt as well.
2. **TEKS:** add the "Supports TEKS 3.3A, 3.3B, 3.3F, 3.3G" line to p.18 only after QA verifies it with TEA / 19 TAC §111.5.
3. **Name check:** QA should confirm "Juniper the snowshoe hare" does not collide with a known character. The fallback name is "Tamarack". It appears in text on p.2 and p.3 and in several directions.
4. Upload all 4 thumbnails and the 6-page preview to TPT.
