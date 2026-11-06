# QA Report — 1st-grade-two-syllable-words

> ผู้ตรวจ: Quality Reviewer agent | วันที่: 2026-11-06
> ไฟล์ที่ตรวจ: `output/1st-grade-two-syllable-words.pdf` (24 หน้า), `output/1st-grade-two-syllable-words-preview.pdf` (8 หน้า), `output/thumbnails/thumbnail-1…4.png` เทียบกับ `02-plan.md`, `02b-creative-brief.md` (รวม Owner Decisions), `03-content.md` (รวม Flags for QA / Deviations), `design-notes.md`
> วิธีตรวจ: `pdftotext -layout` ทีละหน้า, render ทุกหน้าด้วย `pdftoppm` (สี 90 dpi + grayscale contact sheet + zoom 150–200 dpi ในหน้าที่แน่น: maze, กระดานเกม, mini-book, Mission Check), script Python ตรวจคำซ้ำข้ามหน้าและ**สร้าง maze 5 × 5 ใหม่จาก PDF แล้วค้นทุกทางเดิน (DFS)**, `pdffonts`, `pdfinfo`, `node scripts/variety-report.mjs 10`, WebSearch (thecorestandards.org, merriam-webster.com, superteacherworksheets.com **ถูกบล็อกใน session นี้** จึงใช้ search snippet หลายแหล่ง + ความรู้ของ QA)

**ผลการตรวจ:** **PASS WITH FIXES** (blocker 3 ข้อ ทั้งหมดแก้ได้เร็ว ไม่ต้องแก้เนื้อหาคำศัพท์หรือเฉลย)

เนื้อหาหลักถูกต้องทั้งหมด: การแบ่งพยางค์ทุกคำ เฉลยทุกหน้า maze มีทางเดียว ปริศนาทุกลังมีคำตอบเดียว และกระดานเกมตรงตาม plan รายละเอียดอยู่ด้านล่าง

---

## ปัญหาที่ต้องแก้ (Blocker)

| # | หน้า | ปัญหา | วิธีแก้ | ผู้รับผิดชอบ (content-writer / worksheet-designer) |
|---|---|---|---|---|
| 1 | 1 (แถบล่างของปก), thumbnail-1 (แถบล่าง) | **คำว่า "No Prep" ทำให้เข้าใจผิด** หน้านักเรียน 6 จาก 15 หน้าต้องเตรียมของ: p.6, 7 ต้องตัดและติดกาว, p.12, 13 ต้องใช้คลิปหนีบกระดาษ + ดินสอ (และแนะนำให้พิมพ์บน cardstock), p.14 ต้องตัดตัวเดิน, p.15 ต้องพับและตัด 1 ครั้ง ในไฟล์เองก็ขัดกัน: p.3 คอลัมน์ "Prep" ระบุการเตรียมไว้ 6 แถว, p.19 ชื่อ **"Teacher Prep Guide"** และ thumbnail-2 เขียนว่า "Just add a paper clip!" ครูที่ซื้อเพราะคำว่า "No Prep" อาจให้รีวิวว่าโฆษณาเกินจริง ส่วนคำว่า "Print & Go" ก็สื่อว่าไม่ต้องเตรียมเหมือนกัน จึงไม่ควรใช้ | ปก: เปลี่ยนแถบเป็น **"15 Student Pages • Low Prep • Answer Keys"** · thumbnail-1: เปลี่ยน `.bar1` เป็น **"Low Prep • 2 Board Games • Answer Keys"** · listing/marketing ภายหลัง: ใช้ "Mostly no-prep printables + low-prep games (just add a paper clip)" ตามที่ plan เสนอ แล้ว rebuild PDF, preview (มีปก), `thumb-src` และ thumbnails | worksheet-designer (`worksheet.html` cover strip + `thumbnails.html` `.bar1`) โดยให้ creative-director รับทราบ เพราะ brief เป็นผู้กำหนดคำนี้ |
| 2 | ทุกหน้าที่ใช้ Andika/Baloo (ชัดที่สุดคือ p.18 ข้อ 6, p.10, p.11, p.5, p.12, p.16, p.17, p.21–23 และ thumbnails) | **Chrome ใช้ ligature ของฟอนต์ (fi, ffi, ff, fl)** ทำให้ตัวอักษรติดกันเป็น glyph เดียว และ **i ไม่มีจุด** ในสินค้าที่สอนเด็ก ป.1 ให้ "Dot the vowels" และนับตัวอักษร ตรวจจากภาพที่ zoom 200 dpi แล้ว: p.18 ข้อ 6 **"tra \| ffic", "traf \| fic", "traff \| ic"** (ข้อสอบ: ตัวเลือก ffi กลายเป็นรูปร่างตัวเดียว), p.10 **"puf\|fin"**, p.11 **muffin, sunfish**, p.5 ข้อ 7 **catfish**, p.12 ช่อง 26 **flatbed** (fl) และ 13 **catfish**, p.16 **catfish**, p.17 **fish** ใน word bank, p.15/16 **muffin** และ "Blast off" (ff) ทุกหน้า | เพิ่มใน `<style>` ของ `worksheet.html` **และ** `thumbnails.html`: `html, body, body * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "clig" 0, "dlig" 0; }` แล้ว rebuild PDF, preview, `thumb-src` และ thumbnails ทั้งหมด และ zoom ตรวจ p.18 ข้อ 6, p.10 C3 และ p.11 Cargo List ว่า i มีจุดทุกตัว | worksheet-designer |
| 3 | 19 (หัวข้อ 4 "Folding the mini-book") | **ไม่ได้บอกทิศการพับครั้งที่ 2** ขั้น 1 เขียนว่า "Fold the page in half the long way (top edge to bottom edge)" ซึ่งเท่ากับพับ**เอาด้านที่พิมพ์เข้าข้างใน** แล้วขั้น 5 บอกแค่ "fold it the long way again" ครูที่พับซ้ำแบบขั้น 1 จะได้เล่มที่ด้านนอกเป็นกระดาษเปล่า และหน้าเรื่องทั้งหมดถูกพับซ่อนไว้ข้างใน (QA ไล่การพับแล้ว: เล่มนี้ต้องพับครึ่งแนวยาว**โดยให้ด้านที่พิมพ์อยู่ข้างนอก** แถวบนจึงจะพลิกมาเป็นหน้า 2–5 ที่ตั้งตรง) ภาพขั้นตอนเล็กมาก (~0.4 in) และไม่ได้แสดงทิศการพับ | ขั้น 1: *"Fold the page in half the long way with the printing on the outside (fold the top half back, behind the bottom half). Crease and unfold."* · ขั้น 5: *"Open the page. Fold it the long way again with the printing on the outside, so the cut is along the top fold."* และถ้าทำได้ ให้ใส่ลูกศรโค้งไปด้านหลังในภาพ Step 1 และ Step 5 | content-writer (แก้ข้อความใน `03-content.md`) → worksheet-designer (แก้ HTML/ภาพ + rebuild) |

### ประเด็นที่เจ้าของร้านต้องทำก่อนอัปโหลด (Owner gate, ไม่ใช่ blocker ของไฟล์)
| # | ประเด็น | รายละเอียด |
|---|---|---|
| G1 | ชื่อร้าน | ยังเป็น "Your Store Name" อยู่ **25 จุด** (footer ทุกหน้า, p.24 และ footer ใน thumbnails) ให้แก้ที่ `STORE` object แล้ว rebuild ตามลำดับใน `design-notes.md` |
| G2 | นโยบาย AI ของ TPT | ตรวจซ้ำวันนี้ (2026-11-06) ด้วย WebSearch 2 รอบ (รวม `site:help.teacherspayteachers.com`): **ไม่พบหน้านโยบายทางการ** (Help Center / Seller Agreement) พบแต่ข่าวและบล็อก (Chalkbeat 15 ต.ค. 2026 เรียกนโยบายนี้ว่า "forthcoming" ส่วน Mike Lane, Spylore, EFI, Bright Learning เป็นข้อมูลมือสอง) **จึงผ่าน gate ตาม Owner Decision (Approach A)** ใน `docs/tpt-ai-policy.md` และไฟล์ไม่มีคำว่า "handmade", "AI-free" หรือ "teacher-written" (ตรวจ `worksheet.html` + `thumbnails.html` แล้ว) ความเสี่ยงที่เจ้าของร้านรับไว้แล้วยังคงอยู่: Tinbot และภาพประกอบทั้งหมดเป็น SVG ที่ agent วาด |
| G3 | ทดลองพับ p.15 | QA ไล่ลำดับการพับด้วยเหตุผลแล้ว (ดูหัวข้อ mini-book) และลำดับถูกต้อง แต่ plan ยังให้พิมพ์และพับจริง 1 ครั้งที่ 100% (ให้ทำหลังแก้ Blocker 3) |
| G4 | `products/catalog.json` | `standards` ยังมีแค่ `RF.1.3.e`, `RF.1.3.d` ควรเพิ่ม **`RF.1.3.b`, `RF.1.4.b`** ตามที่ plan บอกไว้ว่าจะเพิ่มหลัง QA ยืนยัน (ผลการยืนยันอยู่ด้านล่าง) ให้ orchestrator เป็นคนแก้ |

---

## ข้อเสนอแนะ (Nice to have)

| # | หน้า | ข้อเสนอแนะ | ผู้รับผิดชอบ |
|---|---|---|---|
| N1 | 12, 13 | กระดานไม่มีป้าย **"Board A" / "Board B"** แต่ p.14 ให้เด็กวง "Board: A B" และ p.2/p.19 เรียกกระดานด้วยตัวอักษร ควรใส่ป้ายเล็ก "Board A" / "Board B" ข้างชื่อกระดานหรือที่ START | worksheet-designer |
| N2 | 19 | "Comet (spaces 14–27 have blends **and digraphs**)" ไม่ตรงกับกระดาน เพราะช่อง 14–27 ไม่มี digraph เลย (basket, insect, frantic, plastic, brisket, trumpet, discus, contest, segment, absent, classic, pigment) แนะนำให้แก้เป็น "have blends, or consonant pairs that look like blends (bas \| ket, dis \| cus)" | content-writer |
| N3 | 2 (Phonics note 1) | "**Every word** in this resource is made of closed syllables" ไม่จริงทุกคำ เพราะมี heart words (go, the, to) และคำใน directions ควรแก้เป็น "Every **target** word…" | content-writer |
| N4 | 2 (Oral warm-up) | warm-up ใช้ **mit-ten** (p.8 ข้อ 1) และ **splash** (การ์ดใน p.7) ซึ่งเป็นคำฝึกที่ plan ให้เป็นคำใหม่ แนะนำให้ใช้คำที่ไม่อยู่ในหน้าฝึก เช่น kit-ten (มีใน Mission Briefing แล้ว) หรือ *stamp* (1 clap) | content-writer |
| N5 | 22 (เฉลย mini-book) | ปกมีคำ "**Reader**" ซึ่งมี 2 พยางค์ และอยู่ใต้คำสั่ง "Box each two-syllable word." แต่เฉลยไม่ได้พูดถึง ควรเพิ่มหมายเหตุ "Accept *Reader* on the cover." หรือเปลี่ยนคำสั่งเป็น "Box each two-syllable word in the story." | content-writer |
| N6 | 11 (Crate 4 clue 1) | "I have twin consonants." ก็จริงกับ **sundress** (ss) ด้วย ซึ่งตาราง elimination ของ writer นับไว้แล้ว และคำตอบยังเหลือคำเดียว (hiccup) แต่ถ้าจะให้ตรงกับความหมาย "twin" ในบทเรียน ควรเขียนว่า "My two middle consonants are twins." | content-writer (ไม่บังคับ) |
| N7 | thumbnail-3 | เส้น coral บน maze เผยทางถูก 7 จาก 13 ช่อง (A1→A4→B4→C4→C3) ควรลากแค่ 2–3 ช่องแรก เพื่อไม่ให้เฉลยปรากฏบนหน้าร้าน | worksheet-designer |
| N8 | 3, 19 | p.3: หัวตาราง "Page" ชิดเส้นคอลัมน์ "Title" · p.19: ป้าย "Step 1…6" ติดกับบรรทัด "No-fold option" ด้านล่างแทบไม่มีช่องว่าง ควรเพิ่มระยะ 4–6 pt | worksheet-designer |
| N9 | 6 | หน้า Moon (intervention) ให้เด็ก "make a real word" ด้วยคำที่เด็ก 6 ขวบอาจไม่รู้จัก (**logjam, webcam, hubcap, catnip**) ทุกคู่ยังมีคำตอบเดียว จึงไม่ผิด แต่ควรเพิ่ม tip ใน p.19 ว่า "Read the 8 word parts aloud first and talk about any new words." | content-writer (ไม่บังคับ) |
| N10 | 10 | เครื่องหมายแบ่งใน maze เป็นเส้นตั้งไม่มีช่องว่าง (`hill|top`) ขณะที่ marking convention คือ `nap | kin` ซึ่ง design-notes อธิบายเหตุผลไว้แล้ว (คำกว้าง 1.3 in ที่ 20 pt) ยอมรับได้ | – |

---

## ผลการตรวจละเอียด

### 1) Word bank: ตรวจคำเป้าหมายทุกคำใน PDF
ตรวจทุกคำใน p.4–18 ตามกฎใน plan: พยางค์ปิด สระเสียงสั้น ไม่มี vowel team / r-controlled / silent-e / -y / -le, ไม่มี digraph ปลอมที่รอยแบ่ง, VC/CV มีพยัญชนะระหว่างสระ**ตรง 2 ตัว** และพยางค์ที่ 2 อยู่ในรูปที่อนุญาต
- **VC/CV (60 คำ) มีพยัญชนะกลางตรง 2 ตัวทุกคำ:** mitten, happen, possum, sudden, magnet, cactus, velvet, tidbit, trumpet, insect, plastic, goblet, mascot, publish, chipmunk (p\|m), splendid, nugget, hectic, public, contest, puffin, nutmeg, summit, rustic, absent, muffin, hidden, hiccup, dentist, attic, bonnet, wombat, comment, kitten, hamlet, pollen, bonbon, cutlet, tactic, pellet, basket, frantic, brisket, discus, segment, classic, pigment, puppet, helmet, traffic, tablet, skillet, napkin, picnic, zigzag ✅ ไม่มี VCCCV ไม่มี x/qu ที่รอยแบ่ง และ nk อยู่ใน chip\|**munk** (ระดับ X) เท่านั้น ✅
- **Compound: รอยแบ่งเป็นพยัญชนะ–พยัญชนะทุกคำ และไม่มี digraph ปลอม** (เช่น bath\|tub = h\|t, dish\|pan = h\|p, dish\|rag = h\|r, egg\|shell = g\|s, back\|pack = k\|p) ✅
- **คำที่ถูกถามมาเป็นพิเศษ:**

| คำ | ผล | เหตุผล |
|---|---|---|
| sundress | ✅ | MW มี headword "sundress" (noun, ยืนยันจาก search snippet ของ merriam-webster.com/dictionary/sundress) |
| flatbed | ✅ | MW มี "flatbed" (adj. + noun) จาก snippet |
| lapdog | ✅ | MW มี headword "lapdog" (มีความหมายเชิงการเมืองด้วย แต่ใช้แค่บนกระดาน A ซึ่งเป็นหน้าถอดรหัส ไม่มีบริบท) |
| logjam | ✅ (จากความรู้ของ QA) | search ไม่พบ snippet ของ MW แต่ QA มั่นใจว่า MW เขียนติดกันว่า "logjam" |
| dentist | ✅ ยอมรับได้ | "-ist" ไม่อยู่ในรายการอนุญาตตรง ๆ แต่ i เป็นเสียงสั้นชัด เป็นพยางค์ปิด และ plan ยกตัวอย่าง den \| tist เอง |
| himself / itself | ✅ | เป็นคำประสมแบบเขียนติดกัน (him/it + self) ทุกส่วนเป็นพยางค์ปิด และ "self" ไม่ใช่รูป schwa "-el" |
| webcam | ✅ | MW เขียนติดกัน |
| dishrag / dishpan | ✅ | MW มีทั้ง 2 คำ (จาก snippet) |
| bobsled, hatbox, potluck, sunlit, sunspot, tomcat, catnap, bobcat, catnip, hubcap, bedrock, suntan, cobweb, desktop | ✅ | เขียนติดกันใน MW (hatbox ยืนยันผ่าน OneLook ซึ่งอ้าง MW ส่วนคำอื่นจากความรู้ของ QA) |
| wombat | ✅ | /ˈwɑm.bæt/ w ไม่เปลี่ยนเสียงสระ |
| pollen, possum, happen, sudden | ✅ | รูป -en/-um อยู่ในรายการอนุญาต (ออกเสียงเบาลงได้ ตามหมายเหตุใน p.2) |
| nugget | ✅ | g ก่อน e เป็นเสียงแข็ง |
- **หมายเหตุ:** merriam-webster.com ถูกบล็อกใน session นี้ (proxy 403) ผลด้านบนจึงมาจาก search snippet ร่วมกับความรู้ของ QA

### 2) Split points
- การแบ่งที่พิมพ์ทุกจุดถูกต้อง: ปก (nap \| kin, sun + set), p.4 (sun\|set, nap\|kin, kit\|ten, tin \| bot), p.9 tip (bas \| ket), p.12–13 Split Check 46 คำ, p.18 ตัวเลือก (ถูก = traf \| fic, skil \| let) และ Star Chart (nap \| kin) ✅
- **การแบ่งที่ผิดโดยตั้งใจมีเฉพาะช่องผิดของ maze** (12 ช่อง: mi\|tten, sa\|ndbox, pla\|stic, velv\|et, ins\|ect, gu\|mdrop, sudd\|en, ma\|gnet, lapt\|op, masc\|ot, cact\|us, tru\|mpet) และตัวเลือกหลอกของ p.18 ข้อ 6, 8 ✅ ไม่มีการแบ่งผิดบนช่องทางถูก ✅
- เฉลย p.20–23 แบ่งพยางค์ถูกทุกคำ ✅

### 3) ความไม่ซ้ำของคำ (ตรวจด้วย script บนข้อความใน PDF)
- คำเป้าหมายใน p.5, 6, 7, 8, 9, 10 (ช่องทางถูก), 11 และ 18 **ไม่ซ้ำกันเลย** (0 คำซ้ำ) ✅
- คำจากหน้า 5–9 ที่ไปปรากฏใน p.10 อยู่**บนช่องผิดเท่านั้น** (sandbox, laptop, gumdrop, mitten, sudden, magnet, cactus, velvet, trumpet, insect, plastic, mascot) ซึ่ง plan อนุญาต ✅
- **p.18 ใหม่ 100%:** stump, cobweb, desktop, puppet, helmet, traffic, tablet, skillet ไม่ปรากฏในหน้าอื่นนอกจากเฉลย p.23 ✅
- คำตัวอย่างใน Mission Briefing (sunset, napkin, kitten, Tinbot) ปรากฏเฉพาะในหน้า review 12–16 (+ "nap \| kin" ใน Star Chart p.18 ซึ่งไม่ใช่ข้อสอบ) ✅
- กระดาน A และ B ไม่มีคำซ้ำกัน และแต่ละกระดานมีคำใหม่มากกว่า 8 คำ (A: catnap, bobcat, itself, dishpan, lapdog, sunlit, potluck, himself, bobsled, flatbed, dishrag / B: comment, hamlet, pollen, bonbon, cutlet, tactic, pellet, frantic, brisket, discus, segment, classic, pigment) ✅
- สุ่มคำ 10 คำไป grep ใน `products/*/03-content.md` ของสินค้าอื่น (napkin, sandbox, chipmunk, muffin, hiccup, dentist, trumpet, cobweb, skillet, Tinbot): **ไม่พบ** ✅

### 4) Maze p.10 (สร้างใหม่จาก PDF + DFS)
```
A: hill|top ✓  nug|get ✓  hec|tic ✓  pub|lic ✓  mi|tten ✗
B: sa|ndbox ✗  pla|stic ✗  velv|et ✗  sand|bag ✓ ins|ect ✗
C: gu|mdrop ✗  con|test ✓  puf|fin ✓  nut|meg ✓  sudd|en ✗
D: ma|gnet ✗   bed|bug ✓   lapt|op ✗  masc|ot ✗  cact|us ✗
E: tru|mpet ✗  sum|mit ✓   rus|tic ✓  tom|cat ✓  ab|sent ✓
```
- เดินขึ้น/ลง/ซ้าย/ขวา จาก A1 ไป E5: **มีทางเดียว** A1→A2→A3→A4→B4→C4→C3→C2→D2→E2→E3→E4→E5 (13 ช่อง) ✅
- ช่องที่แบ่งถูกทั้ง 13 ช่องอยู่บนทางนี้ทั้งหมด ไม่มีช่องบนทางที่ไม่ได้อยู่ติดกันตามลำดับแต่ติดกันแบบตั้งฉาก (ไม่มีทางลัดหรือกิ่ง) ✅
- เฉลย p.21 (ภาพย่อที่มีเส้นหนา + เส้นประ, ลำดับพิกัด และตารางช่องผิด → การแบ่งที่ถูก) ตรงกันทุกช่อง ✅

### 5) Mystery Cargo p.11
| ลัง | clue 1 | clue 2 | clue 3 | ผล |
|---|---|---|---|---|
| 1 | compound: lipstick, sunfish, drumstick, sundress | ends with stick: lipstick, drumstick | tap a drum: **drumstick** | ✅ คำตอบเดียว |
| 2 | not compound: muffin, hidden, hiccup, dentist | vowels e, i: hidden, dentist | check if you brush: **dentist** | ✅ |
| 3 | compound: 4 คำ | has sun: sunfish, sundress | can swim: **sunfish** | ✅ |
| 4 | twin consonants: muffin, hidden, hiccup (+ sundress ss) | vowels i, u: muffin, hiccup | gulp milk fast: **hiccup** | ✅ (ดู N6) |
ทุก clue ตัดตัวเลือกได้อย่างน้อย 1 คำ และข้อความ clue ใช้คำที่ถอดรหัสได้ + heart words + key vocabulary ✅ เฉลย p.21 ตรง ✅

### 6) กระดานเกม p.12–13
- 27 ช่อง: ช่องคำ 23 ช่อง + **Boost 5, 16** + **Meteor 12, 24** ✅ (Boost ไปช่อง 7, 18 และ Meteor ไปช่อง 11, 23 ซึ่งเป็นช่องคำทั้งหมด ไม่ต่อกันเป็นลูกโซ่)
- ทางเดิน serpentine ตรงกับ geometry ใน plan (แถวล่าง 1–4 → 5 → 10…6 → 11 → 12…16 → 17 → 22…18 → 23 → 24–27 → FINISH) ✅
- คำยาว ≤ 7 ตัวอักษรทุกช่อง ✅ · Board A เป็น C ทั้งหมด · Board B ช่อง 1–13 เป็น D/S ไม่มี blend และช่อง 14–27 เป็น X ✅ (ป้าย Planet ที่ START และ Comet ที่ช่อง 14 ✅)
- **Split Check strip ทั้ง 2 แผ่นตรงกับคำบนกระดานและเฉลย p.22 ทุกช่อง** (23/23 + 23/23) ✅
- สปินเนอร์ 6 ช่องเรียงตามเข็มนาฬิกาเป็น 1-2-3-1-2-3 ✅ · กล่องกติกา 5 บรรทัดตรงกับ plan ✅
- เลย์เอาต์ที่ต่างจาก plan (ช่อง 1.36 × 0.62 in, แถบสปินเนอร์อยู่ใต้กระดาน, Split Check 4 × 6, ไม่มี flavor line) มีเหตุผลใน design-notes และอ่านง่าย **ยอมรับได้**

### 7) Mini-book p.15
- **ลำดับ panel (หมุนเป็นแนวนอนให้ปกอยู่ขวาล่าง):** แถวบนกลับหัว **5 4 3 2** / แถวล่าง **6 7 8 1** มีเส้นตัดเส้นเดียวตามกึ่งกลางแนวนอน เฉพาะ 2 คอลัมน์กลาง ✅
- **QA ไล่การพับเอง:** เมื่อพับครึ่งแนวยาว (ด้านพิมพ์อยู่นอก) แล้วตัดช่องกลาง กระดาษจะกลายเป็นวง B4→T4→T3→T2→T1→B1→B2→B3 = หน้า 1→8 แถวบนที่พิมพ์กลับหัวจะพลิกมาตั้งตรงที่ด้านหลัง และเรียงจากซ้ายไปขวาเป็น T4 T3 T2 T1 จึงได้ spread 2\|3, 4\|5, 6\|7 และปกหลัง 8 อยู่ติดสันกับปกหน้า 1 **ถูกต้อง** ✅ (แต่ข้อความวิธีพับต้องบอกทิศการพับ ดู Blocker 3)
- **ข้อความ:** คำเป้าหมาย 8 คำ (picnic, basket, muffin, napkin, Zigzag, hilltop, catnap, sunset) ได้ C 3 / VC/CV 5 / คำใหม่ (picnic, Zigzag) ✅ · ทุกช่อง ≤ 14 คำ ✅ · คำอื่นถอดรหัสได้ทั้งหมด (packs, sets, hops, snack, then, sit, red, fun…) + heart words 8 คำ (a, for, I, go, to, the, has, is) ✅ · ไม่มีคำว่า moon/star/rocket ในข้อความ ✅
- เฉลย p.22 นับ Tinbot/Zigzag ทุกครั้ง และอธิบายไว้ ✅ (ดู N5 เรื่องคำว่า "Reader")

### 8) Answer keys p.20–23 เทียบกับหน้านักเรียนทุกหน้า
p.5 (8/8), p.6 (8 คู่: sunspot, dustpan, catnip, webcam, padlock, hubcap, logjam, chopstick โดย QA ตรวจทุกคู่ในตาราง 8 × 8 แล้วว่ามีคำจริงแบบเดียว), p.7 (6 + 6), p.8 (8/8), p.9 (8/8), p.10, p.11, p.12–13 (46/46), p.14, p.15, p.16 (10 คำ + คำ 2 พยางค์ในวลี/ประโยค), p.17 (คำจริงทั้งหมดจาก bank: sunfish, bedbug, hatbox, pigpen + boxfish, mudfish, pigfish, pignut และไม่มีคู่ที่ได้คำไม่สุภาพ), p.18 (8/8 + scoring guide + ตาราง item → level → หน้า): **ตรงกันทุกข้อ** ✅

### 9) Standards (p.3)
thecorestandards.org ถูกบล็อก (ต้องอนุญาตโดเมน `www.thecorestandards.org` ใน network settings) จึงตรวจกับ search snippet หลายแหล่ง (หน้า thecorestandards.org/ELA-Literacy/RF/1/3/e และ /RF/1/4/b, Shmoop, Smithsonian Learning Lab, Amplify mCLASS, CDE)
- RF.1.3, RF.1.3.b, RF.1.3.d, RF.1.3.e: **ตรงทุกคำ** ✅
- RF.1.4.b "Read **grade-level** text orally with accuracy, appropriate rate, and expression on successive readings.": ตรงกับ snippet ของหน้าทางการและ Amplify ✅ (ฉบับ California กับ Education.com ใช้คำว่า "on-level" ซึ่งเป็นฉบับที่รัฐปรับเอง และ p.3 ไม่ได้อ้างว่าตรงกับมาตรฐาน CA)
- L.2.4.d ถูกพูดถึงแค่ใน tip สำหรับครู ป.2 บน p.2 ไม่ได้อยู่ใน tag ✅

### 10) ชื่อ "Tinbot"
WebSearch: **ไม่พบเครื่องหมายการค้าหรือตัวละครชื่อ "Tinbot" ในตลาดการศึกษา/TPT** ที่พบมี (1) "TINYBOT" (เครื่องหมายการค้า class 16 สะกดต่างกัน) (2) หุ่นยนต์ AI ขององค์กรในบราซิลชื่อ Tinbot (DB1) (3) designer toy "TinBot" (4) หนังสืออ่านภาษาสเปนชื่อ "Tin Bot" ใน Rainbow Resource (เขียนแยกคำ, ระดับ 2–7) **ความเสี่ยงต่ำ** เพราะใช้เป็นชื่อตัวละครในเนื้อหา ไม่ได้ใช้เป็นชื่อสินค้าหรือแบรนด์ และหน้าตาเป็นหุ่นยนต์เรขาคณิตต้นฉบับ แนะนำให้เจ้าของร้านค้น USPTO "TINBOT" ก่อนใช้ชื่อนี้ใน**ชื่อสินค้าหรือ series** (ชื่อสำรองคือ Zipbot)

### 11) คำโฆษณา "No Prep"
ดู Blocker 1 สรุป: ตัดสินว่า**ทำให้เข้าใจผิด** ส่วน "Just add a paper clip!" (thumbnail-2), "Prints in B&W" และ "15 student pages" (thumbnail-4) **ถูกต้อง**

### 12) เทคนิค
- `pdfinfo`: **24 หน้า**, ทุกหน้า **Letter 612 × 792 pt**; preview 8 หน้า (1, 4, 8, 10, 12, 13, 15, 18) มีลายน้ำ PREVIEW และไม่มีหน้าเฉลย ✅
- ขนาด 100%: footer อยู่ตำแหน่งปกติทุกหน้า และไม่พบการย่อหน้าเพราะ mini-book ✅
- `pdffonts` (ทั้ง PDF เต็มและ preview): มี**แค่ Andika, Andika-Bold (CID TrueType) และ Baloo2 (Type 3 จาก variable font)** ฝังและ subset ครบ ✅ · Credits p.24 ระบุทั้ง 2 ฟอนต์ + OFL 1.1 ✅
- ขาว-ดำ: ดู contact sheet แบบ grayscale ทั้ง 24 หน้าแล้ว หน้านักเรียนพื้นขาว ข้อความและเส้นอ่านได้ และตัวแดงในเฉลยอ่านได้ ✅
- ไม่มีข้อความที่ไม่ควรพิมพ์หลุดออกมา (ค้นแล้วไม่พบ "not printed", "QA verify", "[IMAGE", "Writer check", "[Store", ★ ✓ ☆ → ฯลฯ) ✅
- ตัวสะกด American English: ไม่พบ colour/centre/grey/practise ✅

### 13) Variety
`node scripts/variety-report.mjs 10` → **✅ No violations** · theme `space-lab`, hero `board-game` และ concept "Word Rockets" ตรงกับ brief (Owner Decisions อนุมัติแล้ว) และบันทึกใน catalog แล้ว ✅

---

## Checklist (พร้อมผล ✅/❌)

**ความถูกต้อง**
- ✅ แก้โจทย์ทุกข้อเองแล้วเทียบกับเฉลย: การแบ่งพยางค์ทุกคำ, maze (DFS), ปริศนา 4 ลัง, cut-paste 8 × 8, sort 12 ใบ, กระดาน 46 ช่อง และ Mission Check 8 ข้อ **ตรงกันทุกข้อ**
- ✅ Word bank ผ่านกฎ decodability ทุกคำ (ข้อสงสัยทั้งหมดในหัวข้อ 1 ผ่าน) และไม่มีคำซ้ำในหน้าที่ต้องใช้คำใหม่
- ✅ ข้อเท็จจริง/มาตรฐาน: ข้อความ standard ถูกต้อง (ตรวจจาก snippet เพราะเว็บทางการถูกบล็อก) ⚠️ มีข้อความครูที่ไม่แม่นเล็กน้อย (N2, N3)
- ✅ ตัวสะกด American English

**การสอน**
- ✅ ตรงกับ Learning Objectives 1–8 และ RF.1.3.e / .d / .b, RF.1.4.b
- ✅ ระดับ Moon/Planet/Comet ตรงกับ plan ทุกหน้า (p.3 + ไอคอนบนหน้า + แยกส่วนใน p.18)
- ❌ คำสั่งชัดเจน: หน้านักเรียนชัดเจน แต่คำสั่งพับ mini-book ของครู (p.19) ไม่บอกทิศการพับ (Blocker 3)
- ❌ ตัวอักษรที่เด็กต้องจุดสระเป็น ligature จึงไม่มีจุดบน i (Blocker 2)

**การออกแบบ**
- ✅ ไม่มีข้อความล้นหรือตกขอบ (ดู render ทั้ง 24 หน้า และ zoom หน้าที่แน่น) ส่วนจุดที่ชิดกันอยู่ใน N8
- ✅ มี Name/Date บน p.5–11, 14, 16–18; p.4, 12, 13 ไม่มี; p.15 มี "by ____" และพื้นที่เขียนพอ
- ✅ พิมพ์ขาวดำแล้วอ่านได้
- ✅ ลำดับหน้า 1–24 และเลขหน้าถูกต้อง
- ✅ Preview มีลายน้ำ ไม่มีเฉลย ⚠️ thumbnail-3 เผยทาง maze บางส่วน (N7)

**ความสดใหม่ (Variety)**
- ✅ `variety-report` ไม่มี ⚠️
- ✅ theme/hero/concept ตรงกับ brief และอยู่ใน `products/catalog.json` ⚠️ standards ใน catalog ยังไม่ครบ (G4)
- ✅ สุ่มคำ 10 คำแล้ว ไม่ซ้ำกับสินค้าอื่น

**ลิขสิทธิ์และนโยบาย**
- ✅ ไม่มีตัวละคร แบรนด์ หรือภาพที่ติดลิขสิทธิ์ (Tinbot ความเสี่ยงต่ำ ดูหัวข้อ 10)
- ✅ ฟอนต์ OFL 1.1 ทั้งหมด และมี Credits
- ✅ มีหน้า Terms of Use (p.24)
- ❌ ความถูกต้องของคำโฆษณา: "No Prep" ทำให้เข้าใจผิด (Blocker 1)
- ✅ AI-policy gate: ไม่พบหน้านโยบายทางการของ TPT จึงผ่านตาม Owner Decision (Approach A) และไม่มีคำว่า handmade/AI-free (G2)

### แหล่งข้อมูล
- [thecorestandards.org RF.1.3.e](https://thecorestandards.org/ELA-Literacy/RF/1/3/e/) · [RF.1.4.b](https://thecorestandards.org/ELA-Literacy/RF/1/4/b/) (snippet) · [Amplify RF.1.4.b](https://amplify.com/remotelearning/mclass/first-grade-skills-map/rf-1-4-b-read-grade-level-text-orally-with-accuracy-appropriate-rate-and-expression-on-successive-readings) · [Smithsonian Learning Lab](https://learninglab.si.edu/standards/view/969) · [CDE RF.1.4](https://www2.cde.ca.gov/cacs/id/web/5580)
- [MW sundress](https://www.merriam-webster.com/dictionary/sundress) · [MW lapdog](https://merriam-webster.com/dictionary/lapdog) · [MW flatbed](https://www.merriam-webster.com/dictionary/flatbed) · [MW dishrag](https://www.merriam-webster.com/dictionary/dishrag) · [MW dishpan](https://www.merriam-webster.com/dictionary/dishpan) · [OneLook hatbox](https://www.onelook.com/?w=hatbox) (snippet)
- Tinbot: [markinton TINYBOT](https://markinton.com/trademark/tinybot-88232509) · [Convergência Digital (Tinbot, DB1)](https://convergenciadigital.com.br/?p=9014) · [Rainbow Resource "Tin Bot"](https://www.rainbowresource.com/product/sku/011486)
- นโยบาย AI ของ TPT: [Chalkbeat 2026-10-15](https://www.chalkbeat.org/2026/10/15/teachers-pay-teachers-to-ban-ai-generated-teaching-resources/) · [EFI](https://www.efinstitute.org/2026/10/teachers-pay-teachers-bans-ai-generated-resources-amid-backlash/) · [Mike Lane](https://mikellane.com/tpt-ai-policy/) · [Spylore](https://www.spylore.com/blog/teachers-pay-teachers-ai-ban-2026) · [Bright Learning](https://brightlearning.ai/articles/teachers-pay-teachers-bans-ai-generated-classroom-resources/)

## Fix Log

> Worksheet Designer agent · 2026-11-06 · Revision 2. Built in this order: full PDF → preview (`--select 1,4,8,10,12,13,15,18`) → thumb-src → thumbnails `--raw`.

| # | Source | Fix | Files |
|---|---|---|---|
| 1 | Blocker 1 + appeal R1 | "No Prep" removed everywhere. Cover strip: **15 Student Pages • Low Prep • Answer Keys**. Thumbnail 1 bar: **Low Prep • 2 Board Games • Answer Keys**. Separators are SVG dots. "Just add a paper clip!" on thumbnail 2 is unchanged. `pdftotext` and the HTML sources contain no "No Prep" or "no-prep". | `worksheet.html`, `thumbnails.html`, `03-content.md` |
| 2 | N7 + appeal R2 | Thumbnail 3 maze line shows only A1 → A2 → A3 as one straight segment inside row A (y = 0.71·H), with no turn, through the cells and not along the gutters. | `thumbnails.html` |
| 3 | Ligatures | Rebuilt with the global `font-variant-ligatures: none`. Checked at 400 dpi: "tra \| ffic", "traf \| fic", "muffin", "sunfish", "puf\|fin" show separate f's and a dotted i in the PDF and in thumb-src/thumbnails. | outputs |
| 4 | Blocker 3 | p.19 step 1: "Fold the page in half the long way with the printing on the outside (fold the top half back, behind the bottom half). Crease and unfold." Step 5: "Open the page. Fold it the long way again with the printing on the outside, so the cut is along the top fold. Hold the two ends and push them toward the middle so the cut opens up." The Step 1 diagram has a curved "back" arrow and Step 5 says "cut on top fold". Fold re-checked: the printing stays outside, the top row turns upright on the back face, and the pages read 1–8 in order. | `worksheet.html`, `03-content.md` |
| 5 | N2, N1 | p.19 Board B: "Comet (spaces 14–27 have blends, or consonant pairs that look like blends: bas \| ket, dis \| cus)". Added "Board A" / "Board B" pills in the board directions boxes (p.12/13); no overflow. | `worksheet.html`, `03-content.md` |
| 6 | Appeal O1, O2 | Thumbnail 1: "1st Grade" pill enlarged. Thumbnail 2: spinner, clip and pencil about 1.4×, rocket pieces 1.3× on START; no board words covered. | `thumbnails.html` |
| 7 | N8 | p.3 "Page" column widened. p.19 step labels have more space below them. | `worksheet.html` |

Checks after the fixes: `pdfinfo` 24 pages, Letter 612×792 (preview 8 pages). `pdffonts`: only Andika, Andika-Bold and Baloo2. Overflow script: no page past its footer. I viewed renders of pp. 1, 12, 13, 18, 19 and thumbnails 1–4.
Not changed in this round (items for the content writer that this request did not cover): N3, N4, N5, N6, N9.

