# TPT-Office — AI Agent Team for Teachers Pay Teachers Worksheets

Repo นี้คือ "สำนักงาน" ของทีม AI agent ที่ช่วยสร้างใบงาน (worksheets) สำหรับขายบน Teachers Pay Teachers (TPT)

## กติกาสำหรับ Claude
- คุยกับเจ้าของร้านเป็น **ภาษาไทย**; เนื้อหาสินค้า, listing และการตลาดเป็น **American English**
- อ่าน `brand/style-guide.md` ก่อนเริ่มงานสินค้าทุกครั้ง
- สร้างสินค้าใหม่ผ่าน skill `/new-tpt-product`; หาไอเดียผ่าน `/tpt-niche-research`
- ใช้ agent ใน `.claude/agents/` ตามบทบาท อย่าข้ามขั้น QA (`quality-reviewer`) ก่อนเขียน listing
- ร้านออกสินค้าทุกวัน: ทุกชิ้นต้องผ่าน `docs/variety-policy.md` (ธีม/กิจกรรม/คอนเซปต์ไม่ซ้ำ) และบันทึกใน `products/catalog.json`
- เนื้อหาต้องเป็นต้นฉบับ ห้ามใช้ตัวละคร/แบรนด์/ภาพ/ฟอนต์ที่ไม่มีไลเซนส์เชิงพาณิชย์
- ห้ามแต่งตัวเลขยอดขายหรือข้อมูลตลาด — อ้างอิงแหล่งที่มาเสมอ

## โครงสร้าง
```
.claude/agents/        ทีม AI agent (8 ตำแหน่ง)
.claude/skills/        ขั้นตอนการทำงาน (/new-tpt-product, /tpt-niche-research)
brand/style-guide.md   ข้อมูลร้าน สี ฟอนต์ ราคา
brand/assets/          clip art / ฟอนต์ที่มีไลเซนส์ (+ LICENSES.md)
templates/             template HTML ของใบงาน (US Letter)
templates/themes/      ธีมดีไซน์ (CSS) + ภาพตัวอย่าง — เลือกด้วย <meta name="tpt-theme">
docs/activity-library.md  คลังรูปแบบกิจกรรม 40+ แบบ (activity ID)
docs/variety-policy.md    กติกากันซ้ำ
products/catalog.json  ทะเบียนสินค้าทั้งหมด (ธีม/กิจกรรม/คอนเซปต์ที่ใช้)
scripts/variety-report.mjs  สรุปสิ่งที่ใช้ไปล่าสุด + เช็กกติกากันซ้ำ
scripts/build-pdf.mjs  แปลง HTML → PDF / preview / thumbnails
scripts/listing-preview.mjs  หน้าจำลอง listing (desktop/mobile/search grid) + ตรวจ title/keyword/คำต้องห้าม
scripts/office-*.mjs   TPT-Office Live: hook บันทึกเหตุการณ์ + server หน้าจอดูสถานะทีม (office-ui/)
.office/               log เหตุการณ์จาก hooks (ไม่ commit; ลบโฟลเดอร์ = ปิดการบันทึก)
products/<slug>/       งานของแต่ละสินค้า (01-research … 07-marketing, output/)
products/_ideas/       ผลวิจัยไอเดียที่ยังไม่ได้สร้างสินค้า
```

## คำสั่ง
```bash
npm install                                   # ติดตั้ง playwright (ครั้งแรก)
npx playwright install chromium               # ดาวน์โหลด browser (ครั้งแรก บนเครื่องตัวเอง)
node scripts/build-pdf.mjs <in.html> <out.pdf>                       # PDF เต็ม
node scripts/build-pdf.mjs <in.html> <out.pdf> --preview --pages 4    # preview มีลายน้ำ
node scripts/build-pdf.mjs <in.html> <out-dir> --thumbnails --pages 4 # PNG 1400x1400
node scripts/build-pdf.mjs <in.html> <out.pdf> --theme space-lab     # ลองธีมอื่นโดยไม่แก้ไฟล์
node scripts/variety-report.mjs 10                                    # ดูความหลากหลาย 10 ชิ้นล่าสุด
node scripts/listing-preview.mjs products/<slug>                       # หน้าจำลอง listing + ตรวจ listing อัตโนมัติ
npm run office                                                         # หน้าจอดูสถานะทีมสด http://127.0.0.1:4777
```
