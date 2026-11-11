# QA Report — 3rd-grade-winter-fractions-number-line

> Reviewer: quality-reviewer | Date: 2026-11-11
> ไฟล์ที่ตรวจ: `output/3rd-grade-winter-fractions-number-line.pdf` (18 หน้า, Letter, build 13:13 ซึ่งใหม่กว่า `worksheet.html` และ `trail-lib.js`), preview 6 หน้า, `output/thumbnails/thumbnail-1…4.png`, `thumb-src/page-01…18.png` (ดูครบทุกหน้า + ซูม 300 dpi ที่ p.8, p.9), `03-content.md`, `02-plan.md`, `02b-creative-brief.md`, `design-notes.md`, `catalog.json`

**ผลการตรวจ:** PASS WITH FIXES

คณิตศาสตร์และเฉลย**ถูกทั้งหมด** ไม่มี Blocker แต่มี **Major 3 ข้อที่ต้องแก้ก่อนเขียน listing**: (1) label ชนกันและถูกตัดบนเส้นซ้อนใน p.8, (2) Teacher Guide อ้างข้อมูลผิดว่า "ทุก maze" มีกับดักนับขีด, (3) ข้อความ Credits บอกว่าภาพทั้งหมดวาดโดยร้าน ซึ่งขัดกับ guardrail เรื่อง AI ส่วนข้อ Minor แก้ตามสะดวกได้

---

## วิธีตรวจแบบอิสระ (ไม่อิงผลตรวจของ writer/designer)
- เปิด `worksheet.html` ใน Chromium (Playwright) แล้ว**อ่านเรขาคณิตจริงของ SVG ที่ render แล้ว** ทุกเส้นจำนวน ได้แก่ ตำแหน่ง tick, tick จำนวนเต็ม (ขีดยาว), ตำแหน่ง footprint/dot และข้อความเศษส่วนบนป้าย จากนั้นคำนวณค่าของทุกจุดเองว่าตรงกับ tick ที่ k/b หรือไม่ และระยะ tick เท่ากันหรือไม่ (สคริปต์อยู่ใน scratchpad ไม่ได้ส่งไปกับสินค้า)
- Maze: คำนวณว่าแต่ละป้าย TRUE/false จากภาพที่ render แล้วใช้ DFS หา**ทุกเส้นทาง**จาก R1C1 → R5C4 ที่เดินผ่านเฉพาะช่อง TRUE
- เกม: คำนวณคำตอบทั้ง 25 ช่องจากภาพ แล้วเทียบกับ Answer Card ที่ render บน p.17
- ทำโจทย์ p.4, 5, 8, 10, 11, 13, 14 เองแล้วเทียบกับ p.15 และ p.17

### ผลการคำนวณ
| รายการ | ผล |
|---|---|
| Maze 1 (p.6) | TRUE 10 ช่อง = path, **มี 1 เส้นทางเท่านั้น** (10 รอยเท้า) ตรงกับ key p.16 ทุกช่อง และไม่มีป้าย false ที่ค่าเท่ากับจุด |
| Maze 2 (p.7) | TRUE 12 ช่อง = path, **มี 1 เส้นทางเท่านั้น** (12 รอยเท้า) ตรงกับ key ทุกช่อง ส่วนเส้น 0–2 (3/2, 5/3, 6/4) วางจุดถูก |
| Maze 3 (p.9) | TRUE 10 ช่อง = path, **มี 1 เส้นทางเท่านั้น** (10 รอยเท้า) ตรงกับ key ทุกช่อง ช่อง S ทุกช่องตัวส่วนของ claim = จำนวน hop ของเส้นล่าง และ label บนเส้นบนตรงกับจุด |
| เกม Four-in-a-Row (p.12) | **25/25 ช่องตรงกับ Answer Card** (F 15 / T 5 / C 5, ไม่เกิน 8 hop ต่อเส้น) |
| เส้นจำนวนทุกเส้นในเล่ม | ระยะ tick เท่ากันทุกเส้น, footprint/dot อยู่บน tick พอดี และตรงกับเศษส่วนที่ตั้งใจ **ยกเว้น Emeka (p.10)** ซึ่งตั้งใจให้ไม่เท่ากัน: tick ที่ 0 / 0.2 / 0.5 / 1 และ footprint ที่ 0.2 ✅ |
| Spot-mistake p.10 | Nadia = Needs a fix (1/4), Emeka = Needs a fix (ช่วงไม่เท่ากัน), Lucia = Needs a fix (2/6), Tobias = Correct ✅ |
| Always/Sometimes/Never p.11 | 1 Always, 2 Sometimes, 3 Sometimes, 4 Never ✅ (ข้อ 4: b hops มี b+1 ขีดเสมอ) |
| p.4, 5, 8, 13, 14 | คำตอบใน key ถูกทุกข้อ รวมถึงคำตอบที่ยอมรับเพิ่ม (p.8 #4 และ #5) |
| CCSS wording p.18 | ตรงกับข้อความทางการ 3.NF.A, A.2, 2.A, 2.B, A.3, 3.A, 3.B, 3.C ทุกคำ รวมถึงหมายเหตุตัวส่วน 2, 3, 4, 6, 8 และ © notice ของ NGA/CCSSO ✅ |

---

## ปัญหาที่ต้องแก้ (Blocker)
ไม่มี

## ปัญหาที่ต้องแก้ก่อนลง listing (Major)

| # | หน้า | ปัญหา | วิธีแก้ | ผู้รับผิดชอบ |
|---|---|---|---|---|
| MJ-1 | 8 (อยู่ใน preview หน้า 4 ด้วย) | **Label ชนกันบนเส้นซ้อน** ใน Part A ข้อ 1–2 และ Part B ข้อ 3: label "0" และ "1" ของเส้นบนไปอยู่ในช่องว่างแคบ ๆ ระหว่างเส้น แล้ว tick ปลายของเส้นล่างลากทับ (ซูม 300 dpi แล้วเห็นว่า "0" ถูกตัดครึ่ง) ใน Part B ข้อ 3 มีเส้น 4 เส้น จึงเกิด "0"/"1" ซ้อนทับกัน 3 คู่ และ **label "1/2" บนเส้นบน เลข 2 ตัวส่วนถูกเส้นจำนวนตัดหาย** | ใน `p8()` ให้พิมพ์ 0/1 **เฉพาะใต้เส้นล่างสุด** และใช้เส้นประแนวตั้งที่ 0 และ 1 แบบเดียวกับ Maze 3 / เกม หรือเพิ่มระยะห่างระหว่างเส้นจนถึง ~0.5 in แล้วย้าย label "1/2" ขึ้นไปเหนือเส้น (ยก y ขึ้น ≥ 12 px) หรือวางข้าง icon Juniper จากนั้น rebuild PDF, preview, thumb-src และ thumbnails | worksheet-designer |
| MJ-2 | 2 (และ `03-content.md` Tips #2) | Tip 2 เขียนว่า *"This is the most common number line error, and **every maze** includes it as a trap."* ซึ่ง**ไม่จริง** Maze 3 ไม่มีช่อง M1 เลย (มีแค่ M2, M3, M7, M8, M9) | แก้เป็น *"…and Mazes 1 and 2 include it as a trap."* | content-writer |
| MJ-3 | 18 Credits | *"All illustrations are original SVG artwork by [Store Name]."* เป็นการระบุว่าร้าน (คน) เป็นผู้สร้างภาพ ทั้งที่ภาพวาดโดย agent ประโยคนี้ขัดกับ guardrail ข้อ 1 ใน `docs/tpt-ai-policy.md` (ห้ามอ้างว่า handmade / teacher-made "or similar") และเป็นจุดเสี่ยงที่สุดถ้า TPT ออกนโยบาย AI ทางการ | เปลี่ยนเป็นข้อความกลาง ๆ เช่น *"All illustrations are original SVG artwork made for this resource."* และคงบรรทัด © ร้านไว้ **เจ้าของร้านต้องยืนยัน** | content-writer → worksheet-designer (rebuild) / owner sign-off |

## ข้อเสนอแนะ (Minor / Nice to have)

| # | หน้า | ปัญหา | วิธีแก้ | ผู้รับผิดชอบ |
|---|---|---|---|---|
| mn-1 | 4, 5, 8, 10, 13, 14 | เศษส่วนแบบตั้งที่อยู่ในบรรทัดคำสั่ง/โจทย์ (`.fr` = 0.94em) ออกมาเล็กกว่ากฎ "ตัวเลขบนหน้านักเรียน ≥ 12 pt" ใน plan (ฐาน 12 pt ได้ ~11.3 pt, ฐาน 11 pt ได้ ~10.3 pt) เช่น "Draw a dot at 1/3" และป้าย 1/5, 1/3, 3/6 บน p.10 | ตั้ง `.fr { font-size: max(1em, 12pt) }` หรือ 1.05em บนหน้านักเรียน | worksheet-designer |
| mn-2 | 17 | Game Answer Card อยู่หน้าเดียวกับเฉลย Summit Check และ Exit Tickets ถ้าครูทำตาม "Print one per pair" โดยไม่ตัดก่อน นักเรียนจะเห็นเฉลยแบบทดสอบ | เพิ่มในโน้ตของการ์ดและ Teacher Guide (Printing Notes) ว่า *"Cut off the card before handing it out."* | content-writer |
| mn-3 | 17 Answer Card | วงเล็บ "also" ใส่ไม่สม่ำเสมอ: R1C2 3/6 และ R3C1 4/8 ไม่มี "also 1/2" แต่ R4C2/R5C1 มี, R1C1 1/4 ไม่มี "also 2/8" แต่ R3C2 2/8 มี "also 1/4", R5C4 มี "also 6/8" ส่วนประโยค *"If a player says an equal fraction with the trail's hops, it is correct"* อ่านแล้วงง (คณิตศาสตร์ถูกทุกช่อง) | เลือกแบบเดียว: ตัดวงเล็บ also ทั้งหมด แล้วเขียนว่า *"Also accept any equal fraction if the player explains it is the same point."* | content-writer |
| mn-4 | 13 #3, 14 Ticket B | โจทย์ถาม "What fraction names the **dot**?" แต่บนเส้นเป็น footprint | เปลี่ยนเป็น "names the footprint" | content-writer |
| mn-5 | 15 | Key p.5 Part B #7 และ #9 ขึ้นบรรทัดใหม่หลัง "(" ทำให้ "2/3)." / "3/8)." หลุดไปอยู่บรรทัดถัดไป | ใส่ `white-space: nowrap` ให้ "(a/b)" | worksheet-designer |
| mn-6 | 14 Ticket D | "1 =" อยู่ท้ายบรรทัด แล้วกล่องคำตอบ □/3 หลุดลงบรรทัดใหม่ | ให้ "1 = □/3" อยู่บรรทัดเดียวกัน (nowrap หรือย้ายลงบรรทัดของตัวเอง) | worksheet-designer |
| mn-7 | 8 #5 | เขามูสของ Birch ชิดหรือแตะขอบล่างของกล่องคำตอบกล่องที่ 2 | ย้าย icon ลงหรือไปทางซ้าย หรือย่อลง ~10% | worksheet-designer |
| mn-8 | 3 | กล่อง "Count the hops, not the marks!": เลข 1–5 สีเทาที่ถูกขีดฆ่า แทบอ่านไม่ออกเมื่อพิมพ์ขาวดำ เพราะเส้นขีดฆ่าพาดกลางตัวเลข แต่บทเรียนต้องให้เด็กเห็นว่ามี 5 ขีด | ขีดฆ่าแค่ข้อความ "5 marks → 1/5" หรือให้เส้นขีดบางลง/อยู่ต่ำลง แล้วทำตัวเลขเข้มขึ้น | worksheet-designer |
| mn-9 | Thumbnail 2 | เส้น path overlay พาดทับเศษส่วนบนป้าย (3/2, 7/8, 2/3) และคำว่า "Base Camp" | วาด path ให้ผ่านช่องว่างระหว่างการ์ด หรืออยู่ใต้ป้าย | worksheet-designer |
| mn-10 | Thumbnail 3 | หัวข้อ "Games + Real Reasoning" แต่ในชุดมีเกมเดียว | "Game + Real Reasoning" หรือ "Mazes, a Game + Real Reasoning" | worksheet-designer |
| mn-11 | Thumbnail 4 | "Prints in B&W" ซ้ำกับ "Black & white friendly" | เปลี่ยน bullet หนึ่งเป็น "Self-checking mazes" หรือ "Exit tickets + quiz" | worksheet-designer |
| mn-12 | 2 ตาราง Paws | แถว Base Camp เขียนว่า "Tick marks are given" แต่ p.4 ข้อ 3–6 (1 คู่) ให้เด็กวาด tick เอง | "Tick marks are given or guided by dots…" | content-writer |
| mn-13 | 11 | Directions: "Read each **trail sign**" แต่ข้อความ 4 ข้อไม่ได้อยู่ในป้าย | "Read each statement." | content-writer |
| mn-14 | 3, 9, 10, 11, 18, thumb 3 | ท่ายืน/ชี้/โบกมือของ Juniper (ตัวกลม + หัวกลม + ผ้าพันคอ + แขนเส้นเดียว) ดูคล้ายตุ๊กตาหิมะมีหู ไม่เหมือนกระต่ายใน cover/maze | (ไม่บังคับ) ปรับรูปร่างให้มีขาหลังยาวและลำตัวแบบกระต่ายให้ตรงกับท่ากระโดด | worksheet-designer |
| mn-15 | 4, 10, 14 | เส้นเศษส่วนของกล่องคำตอบ (p.4), กรอบการ์ด (p.10) และเส้นตัด (p.14) ยื่นเลยขอบขวาของเนื้อหา ~0.1 in (ยังห่างขอบกระดาษ ≥ 0.4 in) | แค่เรื่องความสวยงาม | worksheet-designer |

### ความเห็นต่อคำถามเฉพาะของ designer
- **ตัวอักษร 8 pt บน p.2 (ตาราง 7.8 pt):** **รับได้** เพราะเป็นหน้าครูไม่ใช่หน้านักเรียน, Lexend มี x-height สูง และที่ 150 dpi ยังอ่านชัด ถ้าวันหลังลดเนื้อหาได้ ควรขยับขึ้นเป็น 9 pt ขึ้นไป (Nice to have)
- **ระยะห่างจาก footer เหลือไม่กี่ px (p.2, 4, 8):** **รับได้** ไม่มีอะไรทับ footer และเนื้อหาส่วนล่างสุดยังห่างขอบกระดาษประมาณ 0.45 in (เครื่องพิมพ์ทั่วไปพิมพ์ไม่ได้แค่ ~0.25 in) พิมพ์แบบ "Fit to page" ก็ยังปลอดภัย

---

## Checklist

**ความถูกต้อง**
- ✅ แก้โจทย์ทุกข้อเองแล้วเทียบกับ Answer Key: ถูกทั้งหมด (maze 3 ชุดมีทางเดียว, เกม 25/25)
- ❌→แก้ MJ-2: ข้อเท็จจริงใน Teacher Guide ("every maze includes it") ผิด ส่วนตัวเลขอื่น ๆ (10/12/10 footprints, 11 student pages, เลขหน้าใน What's Inside, key on page) ถูก
- ✅ สะกดและไวยากรณ์ American English: ตรวจคำเฉพาะจาก text ของ PDF ทั้ง 540 คำแล้ว ไม่พบคำผิดหรือการสะกดแบบ British (color, colored, center, labeled)
- ✅ ไม่มีตัวอักษรต้องห้าม (½ ¼ ¾ ⅛ ⁄ ★ ✓ ● ☐ × → ❄) ใน PDF และไม่มีคำเทศกาล (Christmas, holiday, Santa, reindeer, December, gift, ornament, snowman)

**การสอน**
- ✅ ครบ Learning Objectives 1–7 และมาตรฐาน 3.NF.A.2a/b, 3.NF.A.3a/b/c ตาม `02-plan.md` (p.13 #5 ถาม "same point as 1/4" แทน "3/4" ตามที่ plan เขียนไว้ แต่ยังเป็น 3a เหมือนเดิม จึงรับได้)
- ✅ ภาษาและความยากเหมาะกับ ป.3, มีระดับ paws 1/2/3 และใช้ตัวส่วนตามขอบเขต (มีนอกขอบเขตเฉพาะ 1/5, 3/5, 3/7 ที่เป็นตัวลวงตามที่ plan อนุญาต)
- ✅ คำสั่งชัดเจน เด็กทำเองได้ (มีข้อเสนอแนะเล็กน้อย mn-4, mn-13)

**การออกแบบ**
- ❌→แก้ MJ-1: ข้อความล้นหรือทับกันบน p.8 ส่วนหน้าอื่นไม่มีอะไรล้นหรือตกขอบ
- ✅ มีช่อง Name ทุกหน้านักเรียน (p.12 เป็น Team names, p.14 มีทุกใบ)
- ✅ พื้นที่เขียนพอ
- ✅ พิมพ์ขาวดำแล้วอ่านได้ (ตรวจ grayscale p.3 และ p.6 แล้ว: arc scaffold สีจางยังมองเห็น) ยกเว้น mn-8
- ✅ ลำดับหน้าและเลขหน้า 1–18 ถูกต้อง, preview 6 หน้ามีลายน้ำ, thumbnail 1400×1400 ครบ 4 ภาพ
- ✅ pdffonts: มีเฉพาะ Lexend ที่ฝังแบบ subset

**ความสดใหม่ (Variety)**
- ✅ `node scripts/variety-report.mjs 10` ได้ "No violations" (ธีม clean-minimal และ hero maze ไม่ซ้ำ)
- ✅ ธีม, hero, คอนเซปต์ตรงกับ `02b-creative-brief.md` และบันทึกใน `catalog.json` แล้ว (standards มี 3.NF.A.3.b ครบ)
- ✅ สุ่ม 17 วลีหรือชื่อ (Count the hops, 1/4, 2/4, 3/6, Juniper, Birch, Base Camp, Cocoa Cabin, Nadia, Emeka, Lucia, Tobias, Four-in-a-Row, Always/Sometimes, same spot ฯลฯ) ไป Grep ใน `03-content.md` ของสินค้าอื่น: ไม่ซ้ำ ชื่อใน spot-mistake ก็ไม่ซ้ำกับสินค้าเดิม (Maya, Leo, Diego, Kenji, Zara, Sam)

**ลิขสิทธิ์และนโยบาย**
- ✅ ไม่มีตัวละคร/แบรนด์ที่ติดลิขสิทธิ์ ค้นชื่อ "Juniper" + snowshoe hare/rabbit แล้วไม่พบตัวละครกระต่ายชื่อ Juniper ที่มีชื่อเสียง (ใกล้สุดคือ Juniper Lee, Juniper Jungle, RWBY "Juniper" ที่เป็น jackalope และ Juniper the fox ซึ่งไม่ใช่กระต่ายและต่างบริบท) ชื่อสามัญไม่มีลิขสิทธิ์ **จึงใช้ "Juniper" ต่อได้ ไม่ต้องเปลี่ยนเป็น Tamarack**
- ✅ ฟอนต์ Lexend ใช้ SIL OFL 1.1 (มีใน `brand/assets/LICENSES.md`) และภาพทั้งหมดเป็น inline SVG ไม่มี clip art ภายนอก
- ❌→แก้ MJ-3: มีหน้า Credits แล้ว แต่ข้อความอ้างผู้สร้างภาพต้องแก้
- ✅ มีหน้า Terms of Use
- ✅ CCSS copyright notice ถูกต้อง
- ⚠️ **TEKS: ให้คงไว้แบบไม่ใส่** ตรวจกับแหล่งทางการ (TEA / 19 TAC §111.5) ไม่ได้ เพราะ fetch `law.cornell.edu` และ TEA ไม่ได้ (DNS ถูกบล็อก) มีแต่แหล่งรอง ซึ่งระบุว่า 3.3(A)/(B) ครอบคลุมเฉพาะเศษส่วน "greater than zero and less than or equal to one" ส่วนเนื้อหาในชุดที่เกิน 1 ไม่อยู่ใน 3.3(A)/(B) อยู่แล้ว ส่วน 3.3(F)/(G) ดูสอดคล้องแต่ยังไม่ได้ยืนยัน
- ⚠️ **นโยบาย AI ของ TPT (ตรวจซ้ำวันนี้ด้วย WebSearch):** **ยังไม่พบหน้านโยบายทางการ** (Help Center / Seller Agreement) ที่ประกาศแบน AI เป็นลายลักษณ์อักษร มีแต่ข่าว (Chalkbeat 15 ต.ค. 2026: "forthcoming") และบล็อกของผู้ขาย และไม่มีแหล่งไหนรายงานว่าออกประกาศในเดือนพฤศจิกายน แต่ fetch `help.teacherspayteachers.com` ตรงไม่ได้ (DNS ถูกบล็อก) **ตาม Owner Decision (Approach A) จึงยังไม่ FAIL** เจ้าของร้านควรเปิด Help Center ด้วยตัวเองก่อนอัปโหลด และ listing ต้องไม่อ้าง "handmade / AI-free / teacher-written"

**Owner TODO (ไม่ทำให้ตก)**
- "Your Store Name" ยังเป็น placeholder ใน footer ทุกหน้า, p.18 และ thumbnail (ใน thumbnail เห็นบน footer ของหน้าตัวอย่าง) แก้ `STORE.name` แล้ว rebuild ตามลำดับใน `design-notes.md`

---

## Sources (การตรวจออนไลน์)
- [Chalkbeat — TPT to ban AI-generated resources (Oct 15, 2026)](https://www.chalkbeat.org/2026/10/15/teachers-pay-teachers-to-ban-ai-generated-teaching-resources/)
- [AI Teacher Hacks — TPT AI Ban (help pages had no AI wording as of Oct 23)](https://aiteacherhacks.com/teachers-pay-teachers-ai-ban/)
- [Spylore — TPT AI Ban 2026](https://www.spylore.com/blog/teachers-pay-teachers-ai-ban-2026)
- [Mike Lane — TPT AI Policy 2026](https://mikellane.com/tpt-ai-policy/)
- [Bright Learning — TPT bans AI-generated resources](https://brightlearning.ai/articles/teachers-pay-teachers-bans-ai-generated-classroom-resources/)
- [EFI — TPT Bans AI-Generated Resources](https://www.efinstitute.org/2026/10/teachers-pay-teachers-bans-ai-generated-resources-amid-backlash/)
- [Graphene-edu — After the TPT Town Hall checklist](https://graphene-edu.com/tpt-sellers/tpt-town-hall-checklist/) (search snippet only)
- ค้นชื่อตัวละคร: [Juniper Jungle](https://www.Wikipedia.org/wiki/Juniper_Jungle), [RWBY Juniper](https://rwby.fandom.com/wiki/Juniper), [Princess Juniper (Lalaloopsy)](https://lalaloopsyland.fandom.com/wiki/Princess_Juniper), [Winter's Coming (hare "Lily")](https://kirkusreviews.com/book-reviews/jan-thornhill/winters-coming-thornhill), [Snowshoe the Hare](https://books.org/books/snowshoe-the-hare/kathryn-white/9780778726999/editions/)
- TEKS (แหล่งรอง ไม่ใช่ทางการ): [Teach Starter Math 3.3](https://www.teachstarter.com/us/teks/math-3-3/), [LessonMakerPro 3.3.A](https://lessonmakerpro.com/standards/teks-math/3-3-a), [Teacher Learning Report Grade 3](https://blessedschool.com/wp-content/uploads/2022/03/3-Math.pdf)
