# QA Report — 2nd-grade-regroup-or-not-subtraction

> ผู้ตรวจ: Quality Reviewer agent | วันที่: 2026-10-31
> ไฟล์ที่ตรวจ: `output/2nd-grade-regroup-or-not-subtraction.pdf` (27 หน้า), `worksheet.html`, `output/2nd-grade-regroup-or-not-subtraction-preview.pdf` (8 หน้า), `output/thumbnails/thumbnail-1…4.png` เทียบกับ `02-plan.md`, `02b-creative-brief.md`, `03-content.md`, `design-notes.md`
> วิธีตรวจ: `pdftotext -layout` ทีละหน้า, render ทุกหน้าด้วย `pdftoppm` (สีและ grayscale) และขยายดูภาพ base-ten, ใช้ script แก้โจทย์ทุกข้อเองแล้วเทียบกับหน้าเฉลย**ใน PDF**, ใช้ `pdffonts`, `node scripts/variety-report.mjs 10` และ WebSearch

**ผลการตรวจ:** **PASS WITH FIXES** (ต้องแก้ blocker ด้านเนื้อหา 1 ข้อ)
**⚠️ ยังไม่ควรเผยแพร่:** ต้องให้เจ้าของร้านตรวจนโยบาย AI ใหม่ของ TPT ก่อน (ดูหัวข้อ "ลิขสิทธิ์และนโยบาย") เรื่องนี้เป็นประเด็นของร้าน ไม่ใช่ข้อบกพร่องของไฟล์

---

## ปัญหาที่ต้องแก้ (Blocker)

| # | หน้า | ปัญหา | วิธีแก้ | ผู้รับผิดชอบ |
|---|---|---|---|---|
| 1 | 2 (Teacher Guide → Differentiation tips) | ข้อความ *"Assign only problems 1–2 on pp. 14, 15, 16, and 17. These problems do not need regrouping."* **ไม่ถูกต้อง** เพราะ p.15 ข้อ 2 (Sam, 81 − 47) **ต้อง regroup** (1 < 7) ครูที่ให้นักเรียน Level 1 ทำตามคำแนะนำนี้จะได้โจทย์ regroup ซึ่งเป็นการให้ข้อมูลผิด | เปลี่ยนเป็น: *"Assign only problems 1–2 on pp. 14, 16, and 17, and problem 1 on p. 15. These problems do not need regrouping."* แก้ใน `03-content.md` บรรทัด 75 แล้ว designer แก้ `worksheet.html` บรรทัด 578 และ rebuild PDF, preview และ `thumb-src`/thumbnails ถ้ามีหน้าที่เกี่ยวข้อง | content-writer (แก้ข้อความ) → worksheet-designer (แก้ HTML + rebuild) |

### ประเด็นที่ต้องให้เจ้าของร้านตัดสินใจก่อนเผยแพร่ (Owner gate, ไม่ใช่งานของ writer/designer)
| # | ประเด็น | รายละเอียด |
|---|---|---|
| G1 | **นโยบาย AI ของ TPT (ตุลาคม 2026)** | มีรายงานจากหลายแหล่งว่า TPT ประกาศใน Seller Town Hall วันที่ 8 ต.ค. 2026 ว่าจะ**แบน resource ที่สร้างด้วย generative AI** (ทั้งข้อความและภาพ ใน resource, ปก, preview และ listing) และให้ผู้ขายเริ่มเปลี่ยนเนื้อหา AI ในสินค้าเดิม รายงานบางแหล่งระบุว่ากฎปี 2025 ใช้วิธีให้เปิดเผยว่าเนื้อหา "substantially AI-generated" แต่กฎใหม่ไม่ได้พูดถึงการเปิดเผย ใช้คำว่า "AI-free" แทน **QA หาหน้านโยบายทางการของ TPT ไม่เจอ และเปิด chalkbeat.org ไม่ได้ (DNS ถูกบล็อกใน session นี้)** จึงยังยืนยันไม่ได้ว่ามีผลวันไหน ครอบคลุมงาน "AI-assisted" หรือไม่ และต้องเปิดเผยอย่างไร สินค้านี้เขียนและออกแบบโดยทีม AI agent (ข้อความ + SVG) **เจ้าของร้านต้องอ่านนโยบายทางการใน TPT Seller Help Center / Seller Agreement ก่อนอัปโหลด** และถ้านโยบายห้ามจริง ต้องให้คนเขียนข้อความและวาดภาพเองใหม่ หรือแก้ไขอย่างมีนัยสำคัญตามที่นโยบายกำหนด แหล่งข้อมูล: [Chalkbeat 2026-10-15](https://www.chalkbeat.org/2026/10/15/teachers-pay-teachers-to-ban-ai-generated-teaching-resources/), [Bright Learning](https://brightlearning.ai/articles/teachers-pay-teachers-bans-ai-generated-classroom-resources/), [Spylore](https://www.spylore.com/blog/teachers-pay-teachers-ai-ban-2026), [Mikel Lane](https://mikellane.com/tpt-ai-policy/), [Lit & More](https://lit-and-more.com/teachers-pay-teachers-the-cost-of-exclusivity/), [Chalkbeat 2026-08-03](https://www.chalkbeat.org/2026/08/03/ai-slop-on-teachers-curriculum-marketplace/) (ทุกแหล่งเป็นข้อมูลมือสอง) |

---

## ข้อเสนอแนะ (Nice to have)

| # | หน้า | ข้อเสนอแนะ | ผู้รับผิดชอบ |
|---|---|---|---|
| N1 | 4 (×2), 7, 24, 26 | ไวยากรณ์: "2 ones **is** not enough…", "3 ones **is** not enough", "9 ones **is** enough…" ครูที่เข้มงวดอาจทักได้ แนะนำให้ใช้ "**are**" ทุกจุด (หรือเขียนว่า "2 ones are not enough to take away 7 ones.") | content-writer → worksheet-designer |
| N2 | 10–11 | การ์ดสูง **1.38 in** (`.card`) แต่ช่องแปะบน mat สูงแค่ **1.35 in** (`.slot`) ทั้งที่ plan กำหนดให้ช่อง "ใหญ่กว่าการ์ด" และ design-notes ก็บอกว่าใหญ่กว่า ตอนนี้การ์ดจะทับเส้นประของช่องเล็กน้อย แก้โดยเพิ่ม `.slot` เป็น ≥ 1.45 in (มีที่เหลือในหน้า) หรือลดการ์ดเป็น 1.3 in | worksheet-designer |
| N3 | 2 | Teacher Guide ยังเรียก p.4 ว่า "Student Helper" (และ "Day 1: p. 4 Student Helper") แต่หัวหน้า p.4 และตาราง p.3 ใช้ "Crew Card" แนะนำให้เขียน "Crew Card (Student Helper, p. 4)" อย่างน้อยหนึ่งครั้ง | content-writer |
| N4 | 8 | Directions บอกว่า "Use the boxes to show your trade." แต่มีกล่องแค่ข้อ 1–6 (ถอด scaffold ตั้งใจ) แนะนำให้เขียน "Use the boxes on problems 1–6." หรือ "…if there are boxes." | content-writer |
| N5 | 23 | Teacher tip "…trades a ten but does not cross out the 8" ควรเขียนให้ชัดตามภาษาค่าประจำหลักว่า "…does not change the 8 tens to 7 tens" (ให้ตรงกับ p.24) | content-writer |
| N6 | 7, 21, 24 | วงรีรอบ rod ที่ "trade" ในภาพ base-ten ถูกตัดขอบล่างเล็กน้อย (เกิน viewBox) เพิ่ม padding ด้านล่างใน `renderBT()` | worksheet-designer |
| N7 | 24 | ตาราง p.14 คอลัมน์ Card ตัดบรรทัดกลางโจทย์ ("3 Diego, 72 − / 36") ใส่ `white-space: nowrap` หรือขยายคอลัมน์ | worksheet-designer |
| N8 | ทุกหน้า | Fredoka ถูกฝังเป็น **Type 3** (เพราะเป็น variable font) ซึ่งใช้ได้ แต่บาง viewer/printer จะแสดงขอบไม่คม ถ้าจะแก้ ให้ใช้ไฟล์ Fredoka แบบ static (SemiBold/Bold, OFL เหมือนเดิม) | worksheet-designer |
| N9 | design-notes.md | เอกสารบอกว่า preview มี 6 หน้า (pp.1–6) แต่ไฟล์จริงมี **8 หน้า** (pp. 1, 3, 4, 9, 11, 13, 14, 16 มีลายน้ำ PREVIEW) ซึ่งดีกว่าเดิม แต่ควรแก้เอกสารให้ตรงกับไฟล์ และข้อ Owner to-do #2 ("hero ไม่อยู่ใน preview") ไม่จริงแล้ว | worksheet-designer |
| N10 | 3 / listing | หน้า p.15 ข้อ 2 ใช้ sentence frame "There were not enough ones, so ___" ก่อน "The mistake is ___" อาจทำให้เด็กสับสนเรื่องลำดับ (ไม่ผิด) | content-writer (ไม่บังคับ) |

### Owner to-dos (ไม่ใช่ blocker)
1. **Store name/link:** ยังเป็น "Your Store Name" (28 จุดใน PDF) และ `https://www.teacherspayteachers.com/store/your-store` แก้ที่ `STORE` object ใน `worksheet.html` แล้ว rebuild PDF, preview, `thumb-src` และ thumbnails ตามที่เจ้าของร้านตัดสินใจไว้แล้ว
2. **Standards:** เปิด thecorestandards.org ไม่ได้ (DNS ถูกบล็อก ต้องอนุญาต `www.thecorestandards.org` ใน network settings) ข้อความ 2.NBT.B.5, 2.NBT.B.7, 2.NBT.B.9 (+ footnote) และ 2.OA.A.1 บน p.3 **ตรงกับข้อความ CCSS ที่ QA ทราบทุกคำ** และ 4.NBT.B.4 (standard algorithm) ที่อ้างใน p.2 ก็ถูกต้อง แต่ควรตรวจกับเว็บทางการอีกครั้งก่อนใส่ใน listing ส่วน TEKS ไม่ได้ใส่ในไฟล์ (ถูกต้องตาม plan)
3. **TPT AI policy:** ดู G1
4. Activity-mix exception (Category A = 9/16) **เจ้าของร้านอนุมัติแล้ว** จึงไม่นับเป็นปัญหา

---

## ผลการแก้โจทย์อิสระ (script เทียบกับหน้าเฉลยใน PDF)

| หน้า | จำนวนข้อ | ผล | สัดส่วน regroup (ตรวจเอง) | หมายเหตุ |
|---|---|---|---|---|
| 4 Crew Card | 52 − 27 = 25 | ✅ | Y | ภาพ base-ten: 5 rods + 2 → 4 rods + 12 → ขีดฆ่า 2 rods + 7 units เหลือ 25 ✅ |
| 5 | 12 | ✅ 12/12 ตรงกับ p.21 | 0 Y | ข้อ 1–6 เป็น 2d−1d, ข้อ 7–12 เป็น 2d−2d ✅ |
| 6 | 16 | ✅ 16/16 | 0 Y | มี 68−38 และ 93−43 (หลักหน่วยเท่ากัน), 80−40 ✅ |
| 7 | 6 | ✅ 6/6 | 6 Y | ภาพตัวอย่าง 43−7 และภาพตัวอย่างในเฉลย 34−8 นับได้ถูกต้อง ✅ |
| 8 | 12 | ✅ 12/12 | 12 Y | ตัวตั้งที่หลักหน่วยเป็น 0: 70, 60 / 2d−1d: 62−5, 81−6 ✅ |
| 9 | 12 | ✅ คำตอบและ YES/NO ตรงทุกข้อ | 6 Y / 6 N | ✅ |
| 10–11 Sort | 10 | ✅ Regroup = การ์ด 2, 3, 6, 7, 9 / No = 1, 4, 5, 8, 10 ตรงกับ p.22 | 5/5 | ✅ |
| 12 | 8 | ✅ ผลลบและผลบวกตรวจตรงทุกข้อ | 4/4 | ✅ |
| 13 Solve & Shade | 12 | ✅ คำตอบ 12 ค่า**ไม่ซ้ำ** | 6/6 | ดูด้านล่าง |
| 14 | 4 | ✅ Maya 83 (ผิด, วางหลักผิด), Leo 34 (ถูก), Diego 36 (ผิด, เอาเลขน้อยลบเลขมาก), Kenji 17 (ผิด, 13−6) และงานตัวอย่างที่แสดงไว้ (47, 34, 44, 18) ตรงกับประเภทข้อผิดพลาดที่ระบุ | – | ✅ |
| 15 | 3 | ✅ Zara 45 (งานตัวอย่าง "315" สอดคล้องกับการ regroup ที่ไม่จำเป็น), Sam 34 (งานตัวอย่าง 44 สอดคล้องกับการลืมลดหลักสิบ), 42−15 = YES, 27 ภาพเฉลยเหลือ 2 rods + 7 units ✅ | – | ✅ |
| 16 | 4 | ✅ 33, 31, 34, 36 + หน่วย / NO, NO, YES, YES | – | ✅ |
| 17 | 4 | ✅ 43 (85 − ☐ = 42), 68 (☐ − 23 = 45), 35, 31 (90−34=56, 56−25=31 ไม่มีค่าติดลบ) | – | ✅ |
| 18 | 12 | ✅ 12/12 ไม่ regroup = 1, 4, 7, 10 / trade a ten = 2, 3, 5, 8, 11, 12 / trade a hundred = 6, 9 ตรงกับป้ายในเฉลย ไม่มีการ regroup 2 ครั้งหรือข้ามศูนย์ | 4 / 6 / 2 ✅ | |
| 19 | 8 | ✅ ตำแหน่งกล่อง (ตรวจจากภาพ): 7☐, 6☐, ☐3 (ตัวลบ), 2☐ (ตัวลบ), 3☐ (ผลลบ), ☐8, ☐5 (ผลลบ), ☐1 ทุกข้อเป็นสมการเชิงเส้นตัวเดียว **มีคำตอบเดียว** 8, 5, 3, 9, 2, 6, 4, 7 ตรงกับเฉลย | 4/4 | ✅ |
| 20 | 7 | ✅ A 33, 45 / B 36, 34 / C NO 22, YES 35 / D 75 − 38 = 37 craft sticks | – | ✅ |

- ไม่มีผลลบติดลบหรือเป็น 0 ไม่มีผลลบหลักเดียว ไม่มีคำตอบซ้ำในหน้าเดียวกัน และ**ไม่มีโจทย์ซ้ำข้ามหน้า** (ตรวจด้วย script ทุกหน้า p.4–20)
- **Solve & Shade grid (p.13 / p.23):** ช่องที่มีค่าในชุดคำตอบตรงกับช่องที่ระบายในเฉลยทุกช่อง (0 mismatch) ช่องที่ไม่ระบายมี 12 ค่า (24, 26, 31, 33, 37, 39, 42, 44, 46, 48, 53, 57) ซึ่ง**ไม่มีค่าใดเท่ากับคำตอบที่ถูก** และทุกค่าคือคำตอบผิดแบบ "smaller-from-larger" หรือ "forgot to reduce the tens" ของโจทย์ในหน้า ภาพที่ได้คือบ้าน (หลังคา 4 แถว ตัวบ้าน 3 แถว ประตูกว้าง 2 ช่อง) ตรงกับ "a house." Teacher tip (44 และ 46 มาจาก 82 − 46) ถูกต้อง
- **Thumbnails:** #1 ใช้ 52 − 27 พร้อมเครื่องหมาย 4/12 ถูกต้อง และไม่แสดงคำตอบ / #2 คำตอบที่เขียนด้วยดินสอทั้ง 12 ข้อถูกต้อง ช่องที่ระบายเป็นคำตอบถูกทั้งหมดและไม่เผยภาพเต็ม / #3 การ์ด 2, 3, 6 (regroup) และ 1, 4 (no regroup) อยู่ถูกคอลัมน์ และคำตอบ 36, 27, 18, 35, 50 ถูกต้อง / #4 ข้อความ "16 student pages" ถูกต้อง

---

## Checklist (พร้อมผล ✅/❌)

**ความถูกต้อง**
- ✅ แก้โจทย์ทุกข้อเองด้วย script แล้วเทียบกับหน้าเฉลยใน PDF: **ตรงกันทุกข้อ** (ทุกคำตอบ, YES/NO, sort, grid, spot the mistake, word problems, missing digits, exit tickets)
- ❌ ข้อเท็จจริงในหน้าครู: p.2 อ้างว่าข้อ 1–2 ของ p.15 ไม่ต้อง regroup ซึ่งไม่จริง (Blocker #1) ส่วนข้อความมาตรฐานและการอ้าง 4.NBT.B.4 ถูกต้องตามที่ QA ทราบ (ยังตรวจกับเว็บทางการไม่ได้)
- ✅ ตัวสะกด American English: ไม่พบ colour/centre/grey/practise ฯลฯ ⚠️ มีจุดไวยากรณ์ "2 ones is" ที่ควรแก้ (N1)

**การสอน**
- ✅ ตรงกับ Learning Objectives 1–7 และ 2.NBT.B.5 / B.9 / B.7, 2.OA.A.1 (ตรวจตาราง p.3 และ footer ทุกหน้า)
- ✅ หน้านักเรียนใช้ "regroup / trade a ten" ไม่มีคำว่า "borrow" (มีแค่ใน p.2 หน้าครู เพื่ออธิบาย) ประโยค directions สั้น ใช้คำกริยานำ
- ✅ คำสั่งชัดเจน (มีข้อแนะนำเล็กน้อยใน N4)
- ✅ ระดับ ○ □ △ ☆ ตรงตาม plan และตาราง p.3

**การออกแบบ**
- ✅ ไม่มีข้อความล้นหรือตกขอบ (ดู render ทั้ง 27 หน้า) หน้านักเรียน 5–19 มี Name/Date และ Time Card ทุกใบใน p.20 มีช่อง Name
- ✅ พื้นที่เขียนพอ: ที่เขียนตัวเลข regroup ≈ 0.4 in, ที่เขียนคำตอบ ≥ 0.5 in, ช่อง Show your work ≥ 1.3 in
- ✅ พิมพ์ขาวดำแล้วอ่านได้ (ตรวจ contact sheet แบบ grayscale): เฉลยตัวหนาอ่านได้ และ grid ที่ระบายในเฉลยอ่านตัวเลขได้
- ✅ ลำดับหน้า 1–27 และเลขหน้าใน footer ถูกต้อง (ปกไม่มีเลขหน้า) PDF เป็น US Letter 612 × 792
- ⚠️ ช่องแปะการ์ดเล็กกว่าการ์ด 0.03 in (N2)
- ✅ Preview 8 หน้ามีลายน้ำ PREVIEW และไม่มีหน้าเฉลย

**ความสดใหม่ (Variety)**
- ✅ `node scripts/variety-report.mjs 10` → "✅ No violations" (ร้านมีสินค้านี้ชิ้นเดียว)
- ✅ Theme `playful-pop`, hero `solve-shade` และ concept "Join the Regroup Crew!" ตรงกับ `02b-creative-brief.md` และบันทึกไว้ใน `products/catalog.json` แล้ว (activities 10 รายการ, standards 4 รหัส, ราคา $5.00)
- ✅ ค้นโจทย์ตัวอย่างใน `products/*/03-content.md`: ยังไม่มีสินค้าอื่น จึงไม่มีโจทย์ซ้ำ (และไม่มีโจทย์ซ้ำข้ามหน้าในสินค้านี้)
- ✅ Activity mix: Category A = 9/16 เป็นข้อยกเว้นที่เจ้าของร้านอนุมัติแล้ว

**ลิขสิทธิ์และนโยบาย**
- ✅ ไม่มีตัวละคร แบรนด์ หรือโลโก้ที่ติดลิขสิทธิ์ ทีมช่างไม่มีหน้าตา เครนและหมวกเป็นรูปทรงเรขาคณิตต้นฉบับ
- ✅ `pdffonts` (PDF เต็มและ preview): มี**แค่ Andika (CID TrueType) และ Fredoka (Type 3)** ฝังและ subset ครบ ทั้งสองใช้ SIL OFL 1.1 มีใน `brand/assets/LICENSES.md` และหน้า Credits (p.27)
- ✅ ภาพทั้งหมดเป็น SVG ต้นฉบับ และ Credits ระบุ "Original SVG by [store]"
- ✅ มีหน้า Terms of Use (p.27)
- ❌/⚠️ นโยบาย AI ของ TPT: มีรายงานว่า TPT จะแบน resource ที่สร้างด้วย generative AI (ประกาศ 8 ต.ค. 2026) แต่ยังยืนยันจากหน้านโยบายทางการไม่ได้ **เจ้าของร้านต้องตรวจก่อนเผยแพร่ (G1)**
