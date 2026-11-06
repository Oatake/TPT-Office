# Design Notes — Two-Syllable Words (Word Rockets)

> Designer: Worksheet Designer agent | Date: 2026-11-06 | Pipeline step 5 (Design)
> Inputs: `03-content.md`, `02-plan.md`, `02b-creative-brief.md` (concept "Word Rockets", theme `space-lab`, hero `board-game`), `brand/style-guide.md`, `templates/worksheet-template.html`, `templates/themes/space-lab.css`

## Output files
| File | Notes |
|---|---|
| `worksheet.html` | 24 `<section class="page">`, `<meta name="tpt-theme" content="space-lab">`. Product overrides only in its own `<style>` (`html:root` beats the theme's `:root`). No theme file was edited. |
| `output/1st-grade-two-syllable-words.pdf` | 24 pages, US Letter (612 × 792 pt), printed at 100% (no shrink-to-fit) |
| `output/1st-grade-two-syllable-words-preview.pdf` | 8 pages with the PREVIEW watermark: **1, 4, 8, 10, 12, 13, 15, 18** (cover, Mission Briefing, Split the Stages 1, Asteroid Maze, both Race to the Moon boards, mini-book, Mission Check) |
| `thumbnails.html` + `output/thumbnails/thumbnail-1…4.png` | 4 designed 1400 × 1400 thumbnails |
| `thumb-src/thumbnail-1…18.png` | Page snapshots used inside the thumbnails |

### Rebuild commands (run from the repo root, in this order)
```bash
node scripts/build-pdf.mjs products/1st-grade-two-syllable-words/worksheet.html products/1st-grade-two-syllable-words/output/1st-grade-two-syllable-words.pdf
node scripts/build-pdf.mjs products/1st-grade-two-syllable-words/worksheet.html products/1st-grade-two-syllable-words/output/1st-grade-two-syllable-words-preview.pdf --preview --select 1,4,8,10,12,13,15,18
node scripts/build-pdf.mjs products/1st-grade-two-syllable-words/worksheet.html products/1st-grade-two-syllable-words/thumb-src --thumbnails --pages 18
node scripts/build-pdf.mjs products/1st-grade-two-syllable-words/thumbnails.html products/1st-grade-two-syllable-words/output/thumbnails --thumbnails --raw --pages 4
```
Environment note: `npm install` pulled playwright 1.65, which wants a Chromium build this machine does not have. I installed `playwright@1.63.0` with `--no-save` to match the installed browsers. `package.json` and the lockfile are unchanged.

## Fonts (all from `brand/assets/fonts/`, auto-loaded by `scripts/build-pdf.mjs`)
| Font | Use | License | Credited on p.24 |
|---|---|---|---|
| Andika Regular / Bold (SIL International) | Every word a child reads: board spaces, cards, rocket labels, mini-book, clues. Single-story a/g. | SIL OFL 1.1 | Yes |
| Baloo 2 (variable; The Baloo 2 Project Authors / Ek Type) | Page titles, cover, banners, "MISSION CONTROL" tab, thumbnails | SIL OFL 1.1 | Yes |

- Rebuilt after revision 2: 24 pages, Letter; preview 8 pages (same `--select`). The overflow script finds no page past its footer (tightest: p.12/13 at 0.01 in, p.9 at 0.03 in, p.18/19 at 0.05 in).
- `pdffonts` (full PDF and preview): only **Andika, Andika-Bold, Baloo2** are present, all embedded and subset. Chrome embeds variable Baloo 2 as Type 3 fonts named "Baloo2-Regular" (the default instance name). This is normal, and the weights render correctly.
- No italic is used anywhere (Andika has no italic file). `em/i` are forced to `font-style: normal`.
- No ★ ✓ • ○ □ △ ☆ → glyphs are used (checked with `pdftotext`). Bullets, buttons, stars, level icons, the "?" on the crates, the scissors and the vowel dots are all SVG or CSS shapes.

## Art (all original inline SVG drawn for this product: no clip art, no third-party assets)
Every concept SVG is in **one hidden `<svg class="hidden-defs"><defs>` block** at the top of `worksheet.html` and is reused with `<use href="#id">`. `thumbnails.html` has a verbatim copy, so if the art changes, update both.
- Level marks `lvl-moon`, `lvl-planet`, `lvl-comet`; outline `star`; `sparkle`; control-panel `btn`; `dot`
- Rocket parts: `rk-tail` / `rk-nose` (line-only stage box, pp. 8, 9, 18), `rk2-back` / `rk2-front` / `rk2-flame` (two-stage rocket, cover and thumbnails), `mini-rk`, `mini-rk-split`, `rk-up` (upright rocket: mini-book scene and cut-out game piece), `engine1` / `engine2` (p.7)
- Docking ship `ship` (cover and thumbnails). On worksheet pages the ships are CSS capsules with a docking port, so the 22 pt words always fit.
- **Tinbot** (original geometric robot: rounded-square head, one antenna, dot eyes, chest panel with a vertical split line, spring legs, no tracks or binocular eyes): `tb-wave`, `tb-point`, `tb-peek`, `tb-back`. **Zigzag** the robot cat: `zz-cat`, `zz-sleep`.
- Board pieces `earth`, `moon`, `boost`, `meteor`; maze `ast1…ast4`, `ship-tb` (START), `homebase`; `crate` with a drawn "?"; `scissors`, `arrow`, `flask`, `magnifier`, `soundmark`; picnic props `basket`, `muffin`, `napkin`, `sun`, `crescent`
- Student pages use line art only (ink/purple strokes, white fills). Night-sky fills appear only in the cover porthole and on the thumbnails. In a grayscale render of pp. 4–19, all text and line art stay readable. Turquoise and coral are used only for decoration; text is always ink or purple.
- **No placeholder images.** The owner does not need to replace any art.

## Concept text in one place
Titles and flavor lines live in the `CONCEPT` object near the bottom of `worksheet.html`. p.3 (What's Inside) and the answer-key headings read from it, so titles always match exactly. Store name and URL are in the `STORE` object. Word data for the boards, maze and keys is in `BOARD_A`, `BOARD_B`, `MAZE`, `MAZE_PATH` and `MAZE_WRONG`, copied from `03-content.md`.

## Mini-book (p.15) — imposition check
- The landscape sheet is turned 90° onto the portrait page. **Viewed landscape with the cover bottom-right:** top row (printed upside down) = **5 4 3 2**, bottom row = **6 7 8 1**. This matches the plan.
- There is **one cut line** (2 px dash + scissors + "cut" label) along the middle crease, across the **two middle columns only** (5.5 in). Every other line is a dot-dash fold with a "fold" label.
- Fold reasoning: after the long fold (top half folds behind), the back layer reads T4, T3, T2, T1 from left to right, and the upside-down panels become upright. Leaves form as cover 1 (B4) / 2 (T4) → spread 2|3 at the spine crease x = 8.25 in → 3|4 joined at the fore-edge (center crease) → spread 4|5 at crease x = 2.75 in → 5 (T1) / 6 (B1) share a leaf → spread 6|7 → 7|8 at the fore-edge → back cover 8 (B3) next to cover 1 at the spine. So the order is 1–8, all upright.
- Safe area: 0.3 in from the paper edges, about 0.15–0.2 in from the folds. Each panel has its page number in a small circle in the bottom corner (for the cut-and-staple option). The page footer (© store · standards · Page 15) sits inside panel 8.
- Technical note: each panel is rotated on its own and kept inside the page box before rotating. Rotating one 11-in-wide sheet made Chrome shrink the **whole PDF to about 92%**, and boxes crossing the page edge got split by print fragmentation. Both problems are fixed and checked: content now reaches the normal footer position on every page.
- **Owner to-do:** print p.15 once at 100%, fold it, and confirm the order (the plan asks for one physical test).

## Layout decisions / deviations (content and word lists unchanged)
| Page | Decision | Why |
|---|---|---|
| 2 → 3 | The **"Level icons" key table** moved from the Teacher Guide to p.3, right under the What's Inside table, so it also explains the icon-only Level column there. | At 11 pt the full Teacher Guide was about 3.5 in taller than the page. |
| 2 → 23 | **"Paths by group"** moved to p.23, under the Mission Check scoring guide and its item → level → practice-pages table. | It did not fit on p.2 or p.3 at 11 pt. It sits next to the related scoring guidance. Text unchanged. |
| 3 | The Level column shows **icons only** (text "All" / "–" where there is no icon). "Teacher pages" is one line instead of a 4-row table. Standards are in a 2-column table. Table text is 9.5–10 pt. | Fit on one page. The legend directly below explains the icons. |
| 3 | The note "*(QA verify wording before print)*" for RF.1.4.B is **not printed**, as the content note asks. The wording still needs QA (see owner to-dos). | — |
| 12, 13 | **Flavor line left off.** Cells are **1.36 × 0.62 in** (plan: 1.15 × 0.75) and the spinner, rules and key sit in a band **under** the board, not in a side column. | At 20 pt Andika Bold, "comment" is 1.21 in and "segment" 1.13 in, so they did not fit in 1.15 in cells. Wider cells leave no room for a 1.5 in side column. Font size stays at the 20 pt minimum. |
| 12, 13 | Split Check is **4 rows × 6** (plan: 3 × 8). Entries are in space order, at 12 pt. | "13 cat \| fish" at 12 pt does not fit in 8 columns. |
| 12 | Moon icon at the left of the title. p.13: Planet tag on START and Comet tag on space 14. | The theme's star cluster occupies the top-right corner. |
| 10 | Maze is 5 × 5, cells about **1.5 × 1.25 in** (grid 7.8 in wide, 0.35 in from the paper edges). The split is drawn as a thin vertical bar. | "gu \| mdrop" (the widest word) is about 1.3 in at 20 pt, so it needs about 1.5 in cells. Font kept at 20 pt. It fits, but closely: the asteroid outline is about 0.05–0.08 in from the text. |
| 6, 7 | Glue ports are 1.6 × 0.8 in for 1.4 × 0.6 in pieces (p.6) and 1.85 × 0.72 in for 1.6 × 0.55 in cards (p.7). | Ports are at least 0.1 in larger than the pieces. |
| 8, 9, 18 | Rocket stage boxes: stages are **1.45 × 0.66 in**, each with a 0.55 in primary line. "Blast off:" line is 2.7 in. | Matches the plan's minimums. |
| 16 | Word Launch is a 4-column grid (3 rows). | 10 words at 22 pt overlapped in 5 columns. |
| 17 | Part directions are plain lines, not the boxed Mission Control style. | Height. |
| 19 | Body text 11 pt with tighter spacing. Sections 1 and 4 are in two columns. The 6 fold diagrams are small line drawings. | Height. |
| p.11 | Cargo List is 2 rows × 4 at 20 pt. | 8 words in one row would need words under 20 pt. |
| Footer | © store name · standard code(s) · page number. Teacher pages and keys leave the standard blank. | Plan |

## Revision 2 (after QA "PASS WITH FIXES" + appeal review "REVISE")
| Item | Change |
|---|---|
| Prep claim | Cover strip "No Prep" → **"Low Prep"**. Thumbnail 1 bar → **"Low Prep • 2 Board Games • Answer Keys"**. Separators are SVG dots. `03-content.md` updated. |
| Thumbnail 3 | The coral pencil line now shows only **A1 → A2 → A3** (hill\|top → nug\|get → hec\|tic): one straight segment inside row A at y = 0.71·H (under the words, not in the gutter), with no turn. The rest of the solution is not shown. |
| Ligatures | Rebuilt after the `scripts/build-pdf.mjs` fix (`font-variant-ligatures: none`). At 400 dpi, p.18 "tra \| ffic" / "traf \| fic", "muffin", "sunfish" (p.11) and "puf\|fin" (p.10, thumb-src) show separate f's and a dotted i. Andika's f hook sits very close to the i dot, but they do not join. |
| p.19 mini-book folding | Steps 1 and 5 now state the direction: "with the printing on the outside (fold the top half back, behind the bottom half)" and "…so the cut is along the top fold". The Step 1 diagram has a curved "back" arrow; Step 5 is labeled "cut on top fold". "No-fold option" sits beside the diagrams. Fold re-checked: folding the top row back puts T1–T4 on the back face, upright, reading T4 T3 T2 T1. The order is still 1 (B4) / 2 (T4) / 3 (T3) / 4 (T2) / 5 (T1) / 6 (B1) / 7 (B2) / 8 (B3), all upright. |
| p.19 Board B wording | "…Comet (spaces 14–27 have blends, or consonant pairs that look like blends: bas \| ket, dis \| cus)". The old "and digraphs" was wrong. `03-content.md` updated. |
| Boards | Small **"Board A" / "Board B"** pill at the right end of each board's directions box. No overflow. |
| QA N8 | p.3 "Page" column widened. p.19 step labels have more space below them. |
| Thumbnail 1 (O1) | "1st Grade" pill enlarged (82 px). Title and subtitle moved down 18 px. |
| Thumbnail 2 (O2) | Spinner, paper clip and pencil redrawn at about 1.4× on top of the page, spilling onto the night sky. Rocket pieces at 1.3× standing on START. No board word is covered. The Board B mini page moved up. |

## QA checks performed
- `pdfinfo`: **24 pages, Letter 612 × 792 pt.** Preview: 8 pages.
- **No shrink-to-fit:** on p.5, content reaches 10.69 in (the footer line) on an 11 in render. Earlier builds were shrunk to 92% by the mini-book; that is fixed.
- **Overflow:** a layout script measured every page against its footer. No content overlaps a footer. The tightest pages are 2, 9, 12, 13 and 18, at 0.01–0.07 in. I opened page renders of all 24 pages, including the dense ones (2, 3, 12, 13, 15, 18, 19, 21, 22), and found no clipping.
- **Grayscale:** I rendered pp. 4–19 with `pdftoppm -gray` and checked contact sheets. All text, lines and icons stay readable. Gray areas are small (Split Check header, table headers).
- **Not printed anywhere:** writer-check tables, the master word list, Flags for QA, Deviations, and notes marked "not printed".
- **Thumbnails:** I checked each at 1400 px and at 250 px. No text is clipped. Main titles are 120–136 px and secondary text is 52 px or more.
  1. Night sky, "1st Grade" pill (82 px), "Two-Syllable Words" (136 px white), mint subtitle, a big nap | kin rocket splitting (coral vowels, Tinbot peeking from the nose window), sun + set ships, and the bar "Low Prep • 2 Board Games • Answer Keys".
  2. "Race to the Moon!" + "2 Board Games…", p.12 tilted −3° with a paper clip on the spinner, a pencil, and two rocket pieces on START (no board words covered), the coral bubble "Just add a paper clip!", and a small p.13 labeled "Board B".
  3. "Split It! Read It! Blast Off!", 4 routine cards rising along a dashed path, p.9 and p.10, with a short coral line on the first 3 maze cells only (A1→A3), under the words.
  4. "Practice, Play & Read Two-Syllable Words" (changed from "Everything for…", which overstated scope), a BIG WORDS wordmark, an open mini-book mockup showing the real pages 6 | 7, pp. 6/7/11/17, and the Control Panel ("15 student pages", "3 levels", "Prints in B&W", "Answer keys"). RF.1.3.e is not used because QA has not confirmed the standards yet.
  - The page images in the thumbnails come from 1× snapshots (`--thumbnails`), so the mini-book crop is slightly soft.

## Owner to-do
1. **Store name and link:** edit the `STORE` object in `worksheet.html` (now "Your Store Name"). Then rebuild everything in the order above, because the footers appear inside the thumbnails.
2. ~~"No Prep" claim~~ **Decided (QA + appeal review):** the cover reads "15 Student Pages • Low Prep • Answer Keys" and thumbnail 1 reads "Low Prep • 2 Board Games • Answer Keys". No "No Prep" claim appears in any printed page or thumbnail. Listing copy should follow the plan: "No-prep printables + low-prep games (just add a paper clip)", never "No Prep" for the whole set.
3. **Test-print and fold p.15** once at 100% and confirm the page order.
4. QA items carried over from the content: RF.1.4.b wording, the Tinbot name check (backup name: Zipbot), and the Merriam-Webster spot checks.
5. Optional: if the owner prefers the plan's original placement, "Level icons" and "Paths by group" can return to p.2, but p.2 would then need a smaller font (below the plan's 11 pt) or less text.
