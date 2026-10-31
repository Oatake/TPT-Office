# TPT-Office 🍎 ทีม AI Agent สำหรับทำใบงานขายบน Teachers Pay Teachers

ทีม AI agent (Claude Code subagents) ที่แบ่งงานกันตามตำแหน่ง ช่วยคุณ **หาไอเดีย → ออกแบบ → เขียน → ทำ PDF → ตรวจ → ลงขาย → โปรโมต** ใบงานบน [TPT](https://www.teacherspayteachers.com)

## 👥 ตำแหน่งในทีม

| # | ตำแหน่ง | Agent | หน้าที่ | ไฟล์ที่ได้ |
|---|---------|-------|--------|-----------|
| 0 | **Project Manager** | skill `/new-tpt-product` | ประสานงานทั้งทีม, ถามความเห็นคุณที่จุดตัดสินใจ, ส่งงานกลับไปแก้ถ้า QA ไม่ผ่าน | — |
| 1 | **Market Researcher** นักวิจัยตลาด | `market-researcher` | หา niche ที่ขายได้, วิเคราะห์คู่แข่ง, คีย์เวิร์ด, ราคา, ฤดูกาล | `01-research.md` |
| 2 | **Curriculum Designer** นักออกแบบหลักสูตร | `curriculum-designer` | มาตรฐานหลักสูตร (Common Core ฯลฯ), วัตถุประสงค์, โครงสร้างหน้า | `02-plan.md` |
| 3 | **Content Writer** นักเขียนเนื้อหา | `content-writer` | เขียนโจทย์, คำสั่ง, เฉลย, คู่มือครู (American English) | `03-content.md` |
| 4 | **Worksheet Designer** นักออกแบบ/จัดหน้า | `worksheet-designer` | จัดหน้า HTML → PDF พร้อมพิมพ์, preview, thumbnail | `worksheet.html`, `output/` |
| 5 | **Quality Reviewer** ผู้ตรวจสอบคุณภาพ | `quality-reviewer` | ตรวจเฉลยทุกข้อ, ตัวสะกด, ความเหมาะสมกับวัย, ลิขสิทธิ์, นโยบาย TPT | `05-qa-report.md` |
| 6 | **TPT Listing & SEO** ผู้เชี่ยวชาญหน้าร้าน | `tpt-listing-specialist` | ชื่อสินค้า, คำอธิบาย, แท็ก, หมวดหมู่, ราคา, ข้อความ thumbnail | `06-listing.md` |
| 7 | **Marketing Specialist** การตลาด | `marketing-specialist` | Pinterest pins, โพสต์โซเชียล, อีเมลผู้ติดตาม, แผนโปรโมชัน | `07-marketing.md` |

### ทำไมต้องมีตำแหน่งเหล่านี้?
- **ขายได้หรือไม่** ขึ้นกับ Research + Listing/SEO (ครูต้องค้นเจอ และสินค้าต้องตอบโจทย์ที่ยังไม่มีใครทำดี)
- **รีวิวดีหรือไม่** ขึ้นกับ Curriculum + Content + QA (เฉลยผิดข้อเดียวก็ได้รีวิวแย่)
- **ดูน่าซื้อหรือไม่** ขึ้นกับ Designer (thumbnail และ preview คือหน้าร้าน)
- **ยอดขายต่อเนื่อง** ขึ้นกับ Marketing (Pinterest เป็นช่องทางหลักของผู้ขายบน TPT)

ถ้าเพิ่งเริ่ม ใช้แค่ตำแหน่ง 1–6 ก่อนก็พอ ส่วน Marketing ค่อยเพิ่มเมื่อมีสินค้าหลายชิ้นแล้ว

## 🔄 ขั้นตอนการทำงาน

```
คุณ: /new-tpt-product 1st grade addition
        │
        ▼
 [1] Market Researcher ──► เสนอ 3–5 ไอเดีย ──► ✋ คุณเลือก
        ▼
 [2] Curriculum Designer ──► แผนสินค้า ──► ✋ คุณอนุมัติ
        ▼
 [3] Content Writer ──► [4] Worksheet Designer ──► [5] Quality Reviewer
                ▲                                         │
                └──────────── ไม่ผ่าน: ส่งกลับแก้ (≤3 รอบ) ◄─┘
        ▼ ผ่าน
 [6] TPT Listing & SEO ──► [7] Marketing
        ▼
 ✅ ไฟล์พร้อมอัปโหลดใน products/<slug>/
```

## 🚀 เริ่มใช้งาน

1. **กรอกข้อมูลร้าน** ใน [`brand/style-guide.md`](brand/style-guide.md) (ชื่อร้าน, กลุ่มเป้าหมาย, สี, ฟอนต์)
   และแก้ค่า `--store-name`, สี, ฟอนต์ ใน [`templates/worksheet-template.html`](templates/worksheet-template.html) ให้ตรงกัน
2. **ติดตั้ง** (บนเครื่องตัวเอง ครั้งแรกครั้งเดียว)
   ```bash
   npm install
   npx playwright install chromium
   ```
3. **เปิด Claude Code** ในโฟลเดอร์นี้ แล้วสั่ง:
   ```
   /tpt-niche-research Halloween math 2nd grade      ← หาไอเดียอย่างเดียว
   /new-tpt-product 2nd grade Halloween subtraction  ← สร้างสินค้าครบวงจร
   ```
   หรือเรียก agent ทีละตัวก็ได้ เช่น
   ```
   ใช้ quality-reviewer ตรวจ products/2nd-grade-halloween-subtraction อีกรอบ
   ```

## 📁 ผลลัพธ์ของแต่ละสินค้า

```
products/<slug>/
├── 01-research.md      ผลวิจัยตลาด
├── 02-plan.md          แผนสินค้า + มาตรฐานหลักสูตร
├── 03-content.md       เนื้อหา + เฉลย
├── worksheet.html      ไฟล์ต้นฉบับ (แก้ไขได้)
├── design-notes.md     ฟอนต์/ภาพที่ใช้ + จุดที่ต้องใส่ภาพจริง
├── 05-qa-report.md     รายงานตรวจคุณภาพ
├── 06-listing.md       ชื่อ/คำอธิบาย/แท็ก/ราคา พร้อม copy-paste
├── 07-marketing.md     แผนโปรโมต
└── output/
    ├── <slug>.pdf          ไฟล์ขายจริง
    ├── <slug>-preview.pdf  ไฟล์ preview มีลายน้ำ
    └── thumbnails/*.png    ภาพหน้าปกสินค้า 1400×1400
```

## ⚠️ สิ่งที่คุณต้องทำเอง (AI ทำแทนไม่ได้)
- **ภาพประกอบ/ฟอนต์**: ซื้อหรือใช้ clip art และฟอนต์ที่อนุญาตให้ใช้ในสินค้าเชิงพาณิชย์ เก็บใน `brand/assets/` และบันทึกใน `brand/assets/LICENSES.md`
- **ตรวจ PDF ด้วยตาตัวเองก่อนขาย** แม้จะผ่าน QA แล้ว
- **ตรวจนโยบายล่าสุดของ TPT** (เช่น เรื่องการใช้ AI ช่วยสร้างเนื้อหา) และปฏิบัติตาม
- อัปโหลดไฟล์และกด Publish บน TPT

## 🛠️ ปรับแต่งทีม
แต่ละตำแหน่งคือไฟล์ Markdown ใน `.claude/agents/` แก้คำสั่งได้ตามต้องการ เช่น
- อยากได้ใบงานภาษาไทยขายในไทย → แก้ `content-writer.md` และ `curriculum-designer.md` ให้ใช้หลักสูตรแกนกลางฯ
- อยากเพิ่มตำแหน่ง เช่น **Digital Activity Designer** (Google Slides/Easel) หรือ **Customer Support** (ตอบคำถามผู้ซื้อ/รีวิว) → สร้างไฟล์ `.md` ใหม่ในรูปแบบเดียวกัน
