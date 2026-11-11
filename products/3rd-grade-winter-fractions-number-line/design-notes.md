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
`jun-jump`, `jun-stand` → `jun-point` / `jun-wave`, `jun-head` (Juniper, a snowshoe hare with dark ear tips, big hind feet and a striped scarf; standing poses redrawn in Fix Round 1) · `birch-wave`, `birch-stride`, `birch-head` (Birch, a moose with palmate antlers and a knit hat; no reindeer cues) · `prints` / `prints-o` (hare track pairs: paws, bullets, color-in) · `hoof` · `flag` (Base Camp) · `cabin` (Cocoa Cabin, no festive decor) · `pine`, `mtn` · `flake`, `flake2` · `snowball`, `mitten` (game tokens) · `scissors` · `star` ("Try it!") · `arrow` (replaces every "→").
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
3. **Name check:** done by QA (05-qa-report.md): "Juniper" is OK, no change to "Tamarack" needed.
4. Upload all 4 thumbnails and the 6-page preview to TPT.
5. **Credits wording (QA MJ-3):** p.18 now says "All illustrations are original SVG artwork made for this resource." The owner must sign off on this line.

## Fix Round 1 (2026-11-11)
Sources: `05-qa-report.md` (MJ-1 + visual minors), `02b-creative-brief.md` → Appeal Review (REVISE, fixes 1–4 + optional), `03-content.md` → Fix Round 1 Change Log. **No math, item values, maze grids or answers were changed.**

### Text (Change Log #1–15, applied verbatim)
- `worksheet.html`: #1 Tip 2 ("Mazes 1 and 2 include it as a trap"), #2 p.18 Credits ("…made for this resource", `js-store` span removed from that line only; © line kept), #3 Paws table, #4 Printing Notes, #5 p.11 directions, #6–7 p.13 #3 / Ticket B "names the footprint", #8 p.17 card note, #9–13 `GAME_CARD` "also" entries removed.
- `thumbnails.html`: #14 "Game + Real Reasoning", #15 bullet "Self-checking mazes" ("Prints in B&W" label kept).

### Worksheet layout
| QA item | Page | Fix |
|---|---|---|
| MJ-1 | 8 | `STACK()` got two options: `labBottom` (0/1 printed only under the bottom line) and `guides` (faint dotted lines at 0 and 1, like Maze 3). Used on the example, #1, #2 (guides) and #3 (bottom labels only; the 4 lines are 29 px apart so the whole-number ticks already almost touch). #3: `top` 30 → 40 and the "1/2" label raised so its bar is 25 px above the line (the 2 is fully clear). To pay for the extra height: example gap 46 → 43, #1/#2 gap 37 → 35. Same treatment applied to Tobias's two lines on p.10 for consistency. |
| mn-1 | 3–14 | Student pages (p.3–14) have class `stu`; `.stu .fr { font-size: max(1em, 12pt) }`, so every in-line stacked fraction there is ≥ 12 pt. Teacher pages and keys keep the smaller `.tp/.key .fr` size on purpose (not student-facing). Not changed: SVG labels on the number lines themselves (13–16 px) – QA did not flag them and enlarging them would break the line spacing. |
| mn-5 | 15 (and everywhere) | The fraction text pass now wraps a leading "(" and trailing `).,;:` together with the fraction in a `nowrap` span, so "(2/3)." can never split. |
| mn-6 | 14 Ticket D | "1 = □/3" is one `nowrap` unit (it moves to its own line as a whole). |
| mn-7 | 8 #5 | Birch 42×38 → 36×33, moved 8 px down / 2 px left: clear gap under the answer box. |
| mn-8 | 3 | Mark counts 1–5 are now dark slate (#475569, 13 px, semibold) with no strike-through; only the wrong conclusion "5 marks → 1/5" is struck out (moved 8 px right so it does not crowd the "5"). |
| mn-14 | 3, 9, 10, 11, 18, thumb 3 | New `jun-stand` symbol (3/4 side view: pear body with a haunch line, long hind feet, cotton tail, snout, single eye, whiskers, outlined paws). `jun-point` = mirrored `jun-stand` (faces left, toward 0) + forward paw; `jun-wave` = `jun-stand` + raised paw. No more "two stacked circles + stick arms". `jun-jump` unchanged except `overflow="visible"` so its ear tips are no longer clipped flat. |
| mn-15 | 4, 5, 8, 10, 14 | Right overflow removed (measured 0 px past the right margin): smaller SVG side padding on p.4/5/10/14 lines (line lengths unchanged), tighter `.fbox` margins in `.ansc` and `.eqn`, `.tix` columns `minmax(0, 1fr)`. |
| Appeal (optional) | 1 cover | `.cv-scene svg { overflow: hidden }`: the mountain/pine drawn at x < 0 no longer spill onto the 0.14 in glacier band (nothing moved). |

**Footer check (script, print media):** gap between lowest content and footer: p.2 6 px (same as before, new text still fits), p.3 17 px, p.4 6 px, p.8 4 px, all others ≥ 18 px. No page overflows; no element past the right margin (maze/game SVGs 2 px, as before = their 7.25 in width).

### Thumbnails (`thumbnails.html`)
- **Thumb 2 (Appeal fixes 1–3):** the berry trail now runs only on cell frames and in gutters: from the START arrow along the top edge of row 1 → down the outside right edge of column 4 → along the bottom edge of R3C4 → stops in the C3/C4 gutter. It crosses no fraction, label, footprint or "Base Camp" (inside a cell the free band between labels and the sign is only 9 px, too thin for a 7 px stroke at thumbnail scale, so the edge route was chosen). Berry dots on the 6 visited circles. Decoy outline on R2C3 is slate `#1e293b`. The slate connector leaves R2C3's right edge, climbs the C3/C4 gutter, runs right in the row 1/2 gutter and only then goes to the lens (it crosses the berry trail once, inside the gutter; berry is drawn on top). Page-to-thumbnail mapping now accounts for the 2 px `.shot` border. Maze 1/3 minis removed (they were hidden behind the page; the subtitle already says "3 levels").
- **Thumb 3 (Appeal fix 4):** tokens = 4 snowballs : 3 mittens (snowball went first, mitten to play). The new mitten sits on R1C1, blocking the snowball diagonal R2C2–R4C4; nobody has 4 in a row; no token covers an F/T/C tag.
- **Thumb 1 (optional):** Juniper +20% (`T.scene({ junScale: 1.2, junDx: -12 })`, feet kept at the same height); she still clears the hop arcs and the 3/4 label.

### Rebuilt
Full PDF (18 pp.), preview (`--select 1,3,7,8,10,12`, 6 pp.), `thumb-src/page-01…18.png`, `output/thumbnails/thumbnail-1…4.png`. `pdffonts`: Lexend only. PDF text: no ½ ¼ ¾ ⅛ ⁄ ★ ✓ ● ☐ × → ❄, no festive words, no "handmade/teacher-made" claims. Visually checked: p.2, 3, 4, 8 (300 dpi on #3 and #5), 10, 13, 14, 15, 17, cover, thumbnails 1–4.

### Not changed
- QA mn-2/3/4/12/13 were wording items (done via the Change Log). mn-10/11 done via Change Log #14/15.
- p.13 #3 and Ticket B: the longer question ("…names the footprint?") now pushes the answer box to the next line. It reads fine and matches Ticket D, so it was left that way.
