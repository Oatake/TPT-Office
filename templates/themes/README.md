# Visual Themes (ธีมดีไซน์)

เลือกธีมด้วย `<meta name="tpt-theme" content="<ชื่อธีม>">` ใน `worksheet.html`
หรือสั่ง `--theme <ชื่อธีม>` ตอนรัน `scripts/build-pdf.mjs` สคริปต์จะโหลด `templates/themes/<ชื่อธีม>.css` ต่อท้ายให้อัตโนมัติ
ทุกธีมใช้ class เดียวกับ template จึงเปลี่ยนธีมได้โดยไม่ต้องแก้ HTML

ภาพตัวอย่าง: [`previews/all-themes-cover.png`](previews/all-themes-cover.png), [`previews/all-themes-worksheet.png`](previews/all-themes-worksheet.png)

| ธีม | ฟอนต์หัวข้อ | สีหลัก | บุคลิก | เหมาะกับ |
|---|---|---|---|---|
| `playful-pop` | Fredoka | น้ำเงิน / เหลือง / ชมพู | สดใส เด้ง ๆ จุด confetti | K–2 ทุกวิชา |
| `doodle-notebook` | Patrick Hand | กรมท่า / แดงคอรัล | สมุดจด ลายมือ เทปกาว | 1–4 ELA, writing, math |
| `adventure-quest` | Luckiest Guy | เขียวป่า / ทอง / น้ำตาล | แผนที่ล่าสมบัติ ภารกิจ | 1–5 แบบเกม, review, escape |
| `space-lab` | Baloo 2 | ม่วง / เทอร์ควอยซ์ | อวกาศ ดาว mission control | 1–5 math, science |
| `garden-calm` | Sniglet | เขียวอ่อน / ส้มคอรัล | นุ่มนวล ใบไม้ | PreK–2, reading, SEL |
| `clean-minimal` | Lexend | เทาเข้ม / teal | ทันสมัย สะอาด ประหยัดหมึก | 3–5, test prep |

เนื้อหาใช้ฟอนต์ **Andika** (ยกเว้น `clean-minimal` ใช้ Lexend) เพราะเด็กเล็กอ่านง่าย ฟอนต์ทั้งหมดอยู่ใน `brand/assets/fonts/` (ดูไลเซนส์ใน `brand/assets/LICENSES.md`)

## การเพิ่มธีมใหม่
1. คัดลอกธีมที่ใกล้เคียงเป็น `templates/themes/<ชื่อใหม่>.css`
2. เปลี่ยน `--brand-primary`, `--brand-accent`, `--font-heading`, `--thumb-bg` และของตกแต่ง (`.page::before`, `h1.title::after`, `.directions::before`)
3. ใช้ได้เฉพาะ `.page::before`, ห้ามใช้ `.page::after` (สงวนไว้สำหรับลายน้ำ PREVIEW)
4. ห้ามใช้อักขระพิเศษ (★ ✓ ♥ emoji) ใน `content:` หรือในหน้าใบงาน เพราะฟอนต์แบรนด์ไม่มีอักขระเหล่านี้ และ Chrome จะดึงฟอนต์ระบบมาฝังใน PDF ให้วาดเป็น SVG แทน
5. ภาพตกแต่งต้องเป็น SVG ที่วาดเอง หรือ asset ที่มีไลเซนส์ และต้องพิมพ์ขาว-ดำแล้วยังดูดี
6. เพิ่มแถวในตารางด้านบน
