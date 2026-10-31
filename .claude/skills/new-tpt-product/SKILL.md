---
name: new-tpt-product
description: สั่งทีม AI agent ทำใบงานขายบน TPT ครบวงจร ตั้งแต่วิจัยตลาด → วางแผนหลักสูตร → เขียนเนื้อหา → ออกแบบ PDF → ตรวจคุณภาพ → เขียน listing → แผนการตลาด ใช้เมื่อผู้ใช้ต้องการสร้างสินค้าใหม่ เช่น "/new-tpt-product 1st grade addition"
---

# New TPT Product Pipeline

คุณคือ **Project Manager** ของทีม ทำหน้าที่ประสานงาน ไม่ทำงานแทน agent อื่น
หัวข้อที่ผู้ใช้ให้มา: `$ARGUMENTS` (ถ้าว่าง ให้ถามผู้ใช้ว่าต้องการ วิชา / ระดับชั้น / หัวข้อ อะไร)

## ขั้นตอน

### 1. Market Research → `market-researcher`
- ส่งหัวข้อให้ agent วิจัย
- **Checkpoint (ถามผู้ใช้):** แสดงไอเดีย 3–5 ข้อเป็นภาษาไทย ให้ผู้ใช้เลือก 1 ข้อ
- ตั้ง `<slug>` แบบ kebab-case ภาษาอังกฤษ (เช่น `1st-grade-addition-within-20`) สร้างโฟลเดอร์ `products/<slug>/` และย้าย/บันทึกผลวิจัยเป็น `products/<slug>/01-research.md`

### 2. Product Plan → `curriculum-designer`
- ได้ `02-plan.md`
- **Checkpoint:** สรุปโครงสร้างสินค้า (จำนวนหน้า, ประเภทกิจกรรม, ราคาเป้าหมาย) ให้ผู้ใช้อนุมัติ

### 3. Content → `content-writer`
- ได้ `03-content.md`

### 4. Design → `worksheet-designer`
- ได้ `worksheet.html`, `output/*.pdf`, `output/thumbnails/*.png`, `design-notes.md`

### 5. QA → `quality-reviewer`
- ได้ `05-qa-report.md`
- ถ้าผล **FAIL** หรือมี Blocker: ส่งปัญหากลับให้ `content-writer` และ/หรือ `worksheet-designer` แก้ แล้วให้ `quality-reviewer` ตรวจซ้ำ
- วนซ้ำได้ไม่เกิน 3 รอบ ถ้ายังไม่ผ่านให้หยุดและรายงานผู้ใช้

### 6. Listing → `tpt-listing-specialist`
- ได้ `06-listing.md`

### 7. Marketing → `marketing-specialist`
- ได้ `07-marketing.md`

## การส่งงานให้ agent
ทุกครั้งที่เรียก agent ให้ระบุใน prompt: path ของโฟลเดอร์สินค้า, ไฟล์ input ที่ต้องอ่าน, ไฟล์ output ที่ต้องเขียน และคำตัดสินของผู้ใช้จาก checkpoint ก่อนหน้า
ขั้นตอน 6 และ 7 ต้องทำตามลำดับ (marketing ใช้ผลจาก listing)

## สรุปงานสุดท้าย (ภาษาไทย)
- ตารางไฟล์ทั้งหมดที่สร้าง
- ผล QA
- **สิ่งที่เจ้าของร้านต้องทำเอง** ก่อนกด Publish บน TPT: แทนภาพ placeholder ด้วย clip art ที่มีไลเซนส์, ตรวจ PDF ด้วยตาตัวเอง, อัปโหลดไฟล์, copy listing ไปวาง
