---
name: new-tpt-product
description: สั่งทีม AI agent ทำใบงานขายบน TPT ครบวงจร ตั้งแต่วิจัยตลาด → creative brief → วางแผนหลักสูตร → เขียนเนื้อหา → ออกแบบ PDF → ตรวจคุณภาพ+ความน่าดึงดูด → เขียน listing → แผนการตลาด ใช้เมื่อผู้ใช้ต้องการสร้างสินค้าใหม่ เช่น "/new-tpt-product 1st grade addition"
---

# New TPT Product Pipeline

คุณคือ **Project Manager** ของทีม ทำหน้าที่ประสานงาน ไม่ทำงานแทน agent อื่น
หัวข้อที่ผู้ใช้ให้มา: `$ARGUMENTS` (ถ้าว่าง ให้ถามผู้ใช้ว่าต้องการ วิชา / ระดับชั้น / หัวข้อ อะไร)

ร้านนี้ออกสินค้า **ทุกวัน** — ทุกชิ้นต้องไม่ซ้ำกับชิ้นก่อน ๆ ตาม `docs/variety-policy.md`
ก่อนเริ่ม รัน `node scripts/variety-report.mjs 10` เพื่อรู้บริบทของร้าน

## ขั้นตอน

### 1. Market Research → `market-researcher`
- ส่งหัวข้อให้ agent วิจัย (agent จะเช็ก catalog เพื่อไม่เสนอหัวข้อซ้ำ)
- **Checkpoint (ถามผู้ใช้):** แสดงไอเดีย 3–5 ข้อเป็นภาษาไทย ให้ผู้ใช้เลือก 1 ข้อ
- ตั้ง `<slug>` แบบ kebab-case ภาษาอังกฤษ (เช่น `1st-grade-addition-within-20`) สร้างโฟลเดอร์ `products/<slug>/` และย้าย/บันทึกผลวิจัยเป็น `products/<slug>/01-research.md`
- เพิ่มรายการสินค้าใน `products/catalog.json` (status `planning`, ใส่ subject/grades/topic/series/price ที่รู้แล้ว) ไว้บนสุดของ `products`

### 2. Creative Brief → `creative-director` (จังหวะที่ 1)
- ได้ `02b-creative-brief.md` + อัปเดต theme/concept/hero_activity ใน catalog

### 3. Product Plan → `curriculum-designer`
- ได้ `02-plan.md` (ต้องสอดคล้องกับ brief และผ่าน Activity Mix Rules)
- **Checkpoint:** สรุปให้ผู้ใช้อนุมัติ: คอนเซปต์ + ธีม (แนบภาพ `templates/themes/previews/` ได้), จำนวนหน้า, กิจกรรม, ราคาเป้าหมาย
- เปลี่ยน status ใน catalog เป็น `in-progress`

### 4. Content → `content-writer`
- ได้ `03-content.md`

### 5. Design → `worksheet-designer`
- ได้ `worksheet.html`, `output/*.pdf`, `output/thumbnails/*.png`, `design-notes.md`

### 6. QA + Appeal → `quality-reviewer` และ `creative-director` (จังหวะที่ 2) — เรียกพร้อมกันได้
- ได้ `05-qa-report.md` และส่วน Appeal Review ใน `02b-creative-brief.md`
- ถ้า QA **FAIL**/มี Blocker หรือ Appeal **REVISE**: ส่งปัญหากลับให้ `content-writer` และ/หรือ `worksheet-designer` แก้ แล้วตรวจซ้ำ
- วนซ้ำได้ไม่เกิน 3 รอบ ถ้ายังไม่ผ่านให้หยุดและรายงานผู้ใช้

### 7. Listing → `tpt-listing-specialist`
- ได้ `06-listing.md` + `listing-preview/` (หน้าจำลอง listing และผลตรวจ) — อัปเดต `title` และ `price` สุดท้ายใน catalog

### 8. Marketing → `marketing-specialist`
- ได้ `07-marketing.md`
- เปลี่ยน status ใน catalog เป็น `ready`

## การส่งงานให้ agent
ทุกครั้งที่เรียก agent ให้ระบุใน prompt: path ของโฟลเดอร์สินค้า, ไฟล์ input ที่ต้องอ่าน, ไฟล์ output ที่ต้องเขียน และคำตัดสินของผู้ใช้จาก checkpoint ก่อนหน้า
ขั้นตอน 7 และ 8 ต้องทำตามลำดับ (marketing ใช้ผลจาก listing)
หลังจบแต่ละขั้น commit ไฟล์ที่ได้ (git) เพื่อไม่ให้งานหาย

## สรุปงานสุดท้าย (ภาษาไทย)
- ตารางไฟล์ทั้งหมดที่สร้าง
- ผล QA และ Appeal Review
- ชิ้นนี้ต่างจากสินค้าก่อน ๆ อย่างไร (คอนเซปต์ / ธีม / hero activity)
- **สิ่งที่เจ้าของร้านต้องทำเอง** ก่อนกด Publish บน TPT: ตรวจ PDF ด้วยตาตัวเอง, แทนภาพ placeholder (ถ้ามี) ด้วย clip art ที่มีไลเซนส์, อัปโหลดไฟล์, copy listing ไปวาง แล้วเปลี่ยน status ใน catalog เป็น `published`
