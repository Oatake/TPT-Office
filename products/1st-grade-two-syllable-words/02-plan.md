# Product Plan: Two-Syllable Words — Compound Words & Closed Syllables (VC/CV) | Word Rockets

> ผู้วางแผน: Curriculum Designer agent | วันที่: 2026-11-06 | Pipeline step 3
> อ้างอิง: `01-research.md` (เจ้าของร้านเลือกไอเดีย #2, ~20–24 หน้า, $4.00), `02b-creative-brief.md` (**ต้องทำตาม**: คอนเซปต์ "Word Rockets: Split It! Read It! Blast Off!", ธีม `space-lab`, hero `board-game` "Race to the Moon" 2 กระดาน + Flight Log, supporting `maze` + `mini-book`, ไอคอนระดับ จันทร์เสี้ยว/ดาวเคราะห์/ดาวหาง), `docs/activity-library.md`, `docs/variety-policy.md`, `brand/style-guide.md`, `templates/worksheet-template.html`, `templates/themes/space-lab.css`
> หมายเหตุ: `brand/style-guide.md` ยังเป็น placeholder เกือบทั้งหมด ส่วนฟอนต์/สีใช้ตามธีม `space-lab` และ brief

---

## ข้อมูลพื้นฐาน

| รายการ | ค่า |
|---|---|
| **Working title** | Two-Syllable Words Worksheets: Compound Words & Closed Syllables (VC/CV) \| 1st Grade Phonics |
| **Concept** | Word Rockets: Split It! Read It! Blast Off! (คำ 2 พยางค์ = จรวด 2 ท่อน, ผู้ช่วยคือ Tinbot) |
| **Grade** | 1st grade (ใช้ทบทวน ป.2 และกลุ่ม intervention ได้) |
| **Subject** | ELA: Phonics / Reading Foundational Skills |
| **Topic** | อ่านคำ 2 พยางค์ด้วยการแบ่งพยางค์: (1) compound words ที่ประกอบด้วยคำพยางค์ปิด 2 คำ (2) VC/CV ที่ทั้ง 2 พยางค์เป็น closed syllable (สระเสียงสั้น) และ (3) นับพยางค์จากจำนวนเสียงสระ |
| **Resource type** | Worksheets + Board Games + Maze + Mini-Book + Quick Check (Printable, low prep) |
| **Format** | Printable PDF |
| **Page size** | US Letter (8.5 × 11 in), portrait ทุกหน้า (หน้า mini-book จัดเนื้อหาแนวนอนหมุน 90° อยู่ภายในหน้า portrait) |
| **Theme** | `space-lab` + CSS override ตาม brief (`html:root`) |
| **Color** | พิมพ์ขาวดำได้ทุกหน้า หน้านักเรียนพื้นขาว เส้นเป็น ink/ม่วงเท่านั้น |
| **Total pages** | **24 หน้า** = front matter 3 (ปก, Teacher Guide, What's Inside & Standards) + Mission Briefing (anchor chart สำหรับนักเรียน) 1 + **หน้ากิจกรรมนักเรียน 14** + Teacher Prep Guide 1 + Answer Keys 4 + Terms & Credits 1 |
| **Student pages (ใช้บนปก)** | **15 Student Pages** (กิจกรรม 14 + Mission Briefing 1) |
| **Suggested price** | **$4.00** (ยืนยันตาม research ดูเหตุผลท้ายไฟล์) |
| **Series** | `big-words` (ชิ้นแรกของ series) |

### ความต่างจาก brief (ปรับในขอบเขตของ curriculum-designer และคงผลตรวจกฎทุกข้อ)
1. **24 หน้าแทน 22:** เพิ่ม **p.19 Teacher Prep Guide** (กติกาเกม, วิธีหมุนสปินเนอร์, วิธีพับ mini-book) และขยาย Answer Key เป็น **4 หน้า** เพราะกระดานเกม 2 แผ่นมีคำรวม 46 คำ และ maze ต้องมีภาพเฉลยที่อ่านออก หน้านักเรียนยังเป็น p.5–18 **ตรงกับเลขหน้าใน brief** ดังนั้นการอ้างอิงหน้าใน thumbnail ไม่ต้องเปลี่ยน
2. **ระดับของ p.8/p.9:** brief ให้ p.8 = พยัญชนะซ้ำ (Planet) และ p.9 = พยัญชนะต่างกัน (Comet) แต่คำแบบ *napkin/picnic* (CVC|CVC ไม่มี blend) เป็นทักษะหลักของ ป.1 ซึ่งควรอยู่ระดับ on-level จึงปรับเป็น **p.8 (Planet) = พยัญชนะซ้ำ 4 ข้อ + พยัญชนะต่างกันแบบง่าย 4 ข้อ** และ **p.9 (Comet) = คำที่มี blend หรือ digraph อยู่ในพยางค์** (bas|ket, den|tist, plas|tic, pub|lish) ซึ่งเป็นจุดที่เด็กมักแบ่งผิด
3. **ชื่อหน้า:** ตัดให้ยาวไม่เกิน ~34 ตัวอักษรตามกติกาของ brief (ตัวอย่างใน brief บางชื่อยาวเกิน เช่น "Docking Station: Cut & Paste Compound Words" ยาว 43 ตัวอักษร) และทุกชื่อยังมีคำทักษะอยู่
4. **กระดานเกม 27 ช่อง** (อยู่ในช่วง 24–28 ที่ brief กำหนด) ประกอบด้วยช่องคำ 23 ช่อง + Boost 2 + Meteor 2 และคำบนกระดานยาว**ไม่เกิน 7 ตัวอักษร**เพื่อให้คงขนาด Andika Bold 20 pt ตาม brief ได้
5. **คำในตัวอย่างของ brief ที่ตัดออก:** *hotdog* (Merriam-Webster สะกดเป็น open compound "hot dog") และ *goblin* (brief บอกให้เลี่ยงอยู่แล้ว) ส่วน *rocket/planet/comet/robot/lemon* เป็นได้แค่ฉาก (ตามคำเตือนใน brief)

---

## Standards

> **สถานะการตรวจสอบ:** WebFetch ไปที่ `www.thecorestandards.org` และ `www2.cde.ca.gov` **ไม่ได้ (DNS ถูกบล็อกใน sandbox)** จึงตรวจข้อความด้วยการเทียบ search snippet หลายแหล่ง ได้แก่ Shmoop, Teach Starter, Super Teacher Worksheets, Twinkl, Amplify mCLASS skills map, Michigan Learning และ snippet ของหน้าทางการ thecorestandards.org/ELA-Literacy/RF/1/3/e และ /d ที่ search engine แสดง
> ข้อความของ RF.1.3, RF.1.3.b, RF.1.3.d และ RF.1.3.e **ตรงกันทุกแหล่ง** ส่วน RF.1.4.b และ L.2.4.d ยัง**ไม่พบข้อความเต็มใน snippet** (ข้อความด้านล่างมาจากความรู้เดิม) จึงติดธง **[QA verify]**
> **QA ต้องเปิดหน้าทางการตรวจซ้ำก่อนใส่รหัสใน listing/thumbnail** และถ้าต้องการให้ agent ตรวจเอง ต้องอนุญาตโดเมน `www.thecorestandards.org` ใน network settings
> ข้อควรระวัง: **California** ใช้ CCSS ฉบับที่ปรับ ซึ่ง RF.1.3 มีข้อย่อยและข้อความต่างจากฉบับกลาง (จาก snippet) **ห้ามอ้างว่าตรงกับมาตรฐาน CA** และ **ไม่ใส่ TEKS** เพราะยังไม่ได้ตรวจ

### Common Core: primary
| Code | Official wording | ใช้ในหน้า |
|---|---|---|
| **CCSS.ELA-LITERACY.RF.1.3** (parent) | "Know and apply grade-level phonics and word analysis skills in decoding words." | ทั้งชุด |
| **CCSS.ELA-LITERACY.RF.1.3.E** (**primary**) | "Decode two-syllable words following basic patterns by breaking the words into syllables." | 4–6, 8–18 |
| **CCSS.ELA-LITERACY.RF.1.3.D** | "Use knowledge that every syllable must have a vowel sound to determine the number of syllables in a printed word." | 4, 7, 8–9 (ขั้น "find the vowels"), 18 (ข้อ 1–2) |

### Supporting (ใส่เป็น secondary tag ได้ ไม่ใช่จุดขายหลัก)
| Code | Wording | เหตุผลที่ใช้ได้จริง | หน้า |
|---|---|---|---|
| **CCSS.ELA-LITERACY.RF.1.3.B** | "Decode regularly spelled one-syllable words." | ทุกส่วนของคำประสมเป็นคำพยางค์เดียวที่สะกดปกติ และการ์ดพยางค์เดียวใน sort ก็เป็นแบบเดียวกัน | 5, 6, 7, 12, 17 |
| **CCSS.ELA-LITERACY.RF.1.4.B** **[QA verify]** | "Read grade-level text orally with accuracy, appropriate rate, and expression on successive readings." | อ่านซ้ำ 3 รอบ (Countdown) และอ่าน mini-book ซ้ำ | 15, 16 |

### มาตรฐานที่พิจารณาแล้วแต่ไม่ tag
- **RF.1.2 (a–d):** ทุกข้อย่อยพูดถึง **spoken single-syllable words** จึงไม่ตรงกับชุดนี้ ส่วน warm-up ปรบมือนับพยางค์ใน Teacher Guide เกี่ยวกับ parent RF.1.2 ("Demonstrate understanding of spoken words, syllables, and sounds (phonemes).") เพียงเล็กน้อย จึง**ไม่ใส่ใน listing** เพื่อไม่ให้ดูเกินจริง
- **RF.1.3.A** (digraphs): คำบางคำมี sh/ch/th/ck แต่ไม่ได้สอนโดยตรง จึงไม่ tag
- **RF.1.3.F** (inflectional endings): ไม่อยู่ในขอบเขต (ห้ามใช้ -ed/-ing เป็นคำเป้าหมาย)
- **L.2.4.D** **[QA verify]** ("Use knowledge of the meaning of individual words to predict the meaning of compound words…"): ใช้ได้เฉพาะตอนเขียน**คำแนะนำสำหรับครู ป.2 ที่ใช้ทบทวน** ใน Teacher Guide (หน้า 11 และ 17 ใช้ความหมายของคำ) **ห้ามใส่ใน tag หลัก** เพราะสินค้านี้เป็นของ ป.1

---

## Learning Objectives

Students will be able to…
1. **find the vowels** in a printed word and use the number of vowel sounds to tell whether the word has **one or two syllables**. (RF.1.3.d)
2. **read a compound word** by finding the two smaller words, reading each one, and blending them into the whole word. (RF.1.3.e, RF.1.3.b)
3. **split a VC/CV word between the two middle consonants**, including double consonants (*kit | ten*), read each closed syllable with a **short vowel**, and blend the parts into a real word. (RF.1.3.e)
4. **keep blends and digraphs inside a syllable together** while still splitting between the two middle consonants (*bas | ket, pub | lish*). (RF.1.3.e, Comet level)
5. **tell a correct syllable split from an incorrect one** and choose the correct split. (RF.1.3.e)
6. **write (encode) two-syllable words one syllable at a time**. (RF.1.3.e)
7. **read two-syllable words in phrases, sentences, and a decodable mini-book** with accuracy over repeated readings. (RF.1.4.b, RF.1.3.e)
8. *(Extension)* **build a new compound word** from two one-syllable words and use it in a sentence.

**Key vocabulary (student-facing):** vowel, consonant, syllable, compound word, closed syllable, short vowel, split.
**Routine (ใช้ทุกหน้า):** **1. Find the vowels. 2. Split it. 3. Read each part. 4. Blast off! Read the whole word.** (ในขั้น Blast off ให้มีวลี *"Make it sound like a real word."* เพื่อรองรับการที่พยางค์ที่ 2 ออกเสียงเบาลง เช่น kit-ten)
**Marking convention (ต้องใช้แบบเดียวกันทุกหน้าและในเฉลย):** **จุด 1 จุดใต้สระทุกตัว** แล้ว**ขีดเส้นแนวตั้ง 1 เส้น**ตรงจุดแบ่ง ส่วนในข้อความที่พิมพ์ให้ใช้ `|` มีช่องว่างทั้งสองข้าง เช่น `nap | kin`

---

## Differentiation

ใช้ไอคอนระดับจาก brief (SVG #7) เป็นเส้นล้วน ขนาด 0.3 in วางมุมขวาบนข้างชื่อหน้า **หน้านักเรียนไม่มีคำว่า Easy/Hard** และคำอธิบายระดับมีเฉพาะในหน้าครู

| Level | Icon | ใคร | ประเภทคำ | Scaffold |
|---|---|---|---|---|
| **Level 1: Moon** | จันทร์เสี้ยว | intervention / ยังเพิ่งเริ่ม / ELL | **คำประสม** (คำพยางค์ปิด 2 คำ) + นับพยางค์ 1 หรือ 2 | มีตัวอย่างอยู่บนหน้า, มี word bank, ข้อ 1–2 จุดสระไว้ให้แล้ว, ครูอ่านคำสั่งให้ฟังได้ |
| **Level 2: Planet** | ดาวเคราะห์มีวงแหวน | ส่วนใหญ่ของห้อง (on level) | **VC/CV แบบพื้นฐาน**: พยัญชนะซ้ำ (*kit\|ten*) และพยัญชนะต่างกันที่ไม่มี blend (*pic\|nic*) | ข้อ 1–2 ของ p.8 จุดสระไว้ให้แล้ว และมีกล่อง stage 1 \| stage 2 ทุกข้อ |
| **Level 3: Comet** | ดาวหาง | นักเรียนที่คล่องแล้ว / ทบทวน ป.2 | **VC/CV ที่มี blend หรือ digraph ในพยางค์** (*bas\|ket, den\|tist, trum\|pet, pub\|lish*) และคำ 6–8 ตัวอักษร | ไม่มีการจุดสระให้ ต้องตัดสินใจเองว่าแบ่งตรงไหน |

**การใช้ระดับในแต่ละหน้า:** p.5–7 = Moon · p.8 = Planet · p.9 = Comet · p.10 = Planet + Comet · p.11 = Planet · p.12 = Moon · p.13 = Planet (ช่อง 1–13) → Comet (ช่อง 14–27) ยิ่งใกล้ดวงจันทร์ คำยิ่งยาก · p.16 = Planet · p.14, 15, 17 = ทุกระดับ (ไม่มีไอคอน) · p.18 = แบ่งส่วนตามระดับ (ไอคอนเล็กหน้าแต่ละส่วน) เพื่อให้ครูวิเคราะห์ได้ว่านักเรียนติดที่ระดับไหน

**เส้นทางที่แนะนำใน Teacher Guide**
- Moon group: 4 → 5 → 6 → 7 → 12 + 14 → 15 (ครูอ่านด้วยกัน) → 18 ข้อ 1–3
- Planet group: 4 → 7 → 8 → 10 → 11 → 13 (ช่อง 1–13) + 14 → 16 → 15 → 18
- Comet group: 8 (ทำเร็ว) → 9 → 10 → 13 (ทั้งกระดาน) → 17 → 18
- ป.2 review: 7 → 9 → 10 → 11 → 13 → 17 → 18

---

## Page-by-page Outline

**ตำแหน่งคำในคลังคำ:** C = compound, D = VC/CV พยัญชนะซ้ำ, S = VC/CV พยัญชนะต่างกันแบบง่าย, X = VC/CV Comet (ดูนิยามใน Word Bank Policy)

| หน้า | ชื่อหน้า (ตามที่จะพิมพ์) | activity ID (หมวด) | จำนวนข้อ | ทักษะ/มาตรฐาน | หมายเหตุสำหรับนักเขียน |
|---|---|---|---|---|---|
| 1 | **Cover**: "Two-Syllable Words" / "Compound Words & Closed Syllables (VC/CV)" | – | – | – | ใช้ตาม brief ทุกจุด: คำ **nap \| kin** และ **sun + set**, tagline "Split It! Read It! Blast Off!", Control Panel 5 บรรทัด ("2 Race to the Moon board games", "Asteroid maze & mystery riddles", "Fold-and-read mini-book", "Cut & paste compound words", "Answer keys included") และแถบล่าง **"15 Student Pages • No Prep • Answer Keys"** (ดูหมายเหตุเรื่องคำว่า No Prep ในข้อกำหนดของ Designer) |
| 2 | **Teacher Guide** | Teacher instructions | – | – | (1) แนะนำคอนเซปต์ 1 ประโยค (2) routine 4 ขั้น + marking convention (3) ความหมายของไอคอน 3 ระดับพร้อมภาพ (4) ตาราง suggested sequence 9 วัน วันละ 15–20 นาที (ดูด้านล่าง) (5) เส้นทางตามกลุ่ม (จากหัวข้อ Differentiation) (6) **Phonics notes for teachers** 4 ข้อ: ทุกคำในชุดนี้เป็นพยางค์ปิด ตัวสระ 1 ตัวจึงเท่ากับเสียงสระ 1 เสียง (ต่อไปจะเจอคำอย่าง *cake, rain* ที่มีสระ 2 ตัวแต่ 1 เสียง); พยางค์ที่ 2 อาจออกเสียงเบาลง (kit-ten) ให้ใช้ขั้น "make it sound like a real word"; ทำไมไม่มีคำ *rocket, planet, robot* (เป็น V/CV หรือ VC/V ซึ่งเป็นรูปแบบถัดไป); คำแนะนำสำหรับ ป.2 (7) warm-up ทางปาก: ปรบมือนับพยางค์ ใช้ภาษาครูตรง ๆ ได้ 11–12 pt และไม่มี flavor line |
| 3 | **What's Inside & Standards** | Table (teacher) | – | ทั้งหมด | ตารางทุกหน้า 4–18: หน้า / ชื่อหน้า (**ต้องตรงกับชื่อจริงทุกตัวอักษร**) / ไอคอนระดับ / ประเภทกิจกรรม / standard / prep (none, scissors+glue, paper clip, fold) / หน้าเฉลย ส่วนครึ่งล่างให้ใส่ข้อความ standard แบบเต็ม (primary + supporting) |
| 4 | **Mission Briefing: Syllables** (แบนเนอร์ใหญ่ใต้ชื่อ: "Split It! Read It! Blast Off!") | Reference / anchor chart (ไม่นับใน mix) | – | RF.1.3.d, RF.1.3.e | โปสเตอร์สำหรับนักเรียน ไม่มี name line (1) routine 4 ขั้น แต่ละขั้นมีไอคอนเส้น (2) **นิยามสั้น 3 บรรทัด**: *"A syllable is a word part with one vowel sound."* / *"A compound word is two small words put together."* / *"A closed syllable ends with a consonant. The vowel is short."* (3) ตัวอย่างจรวด 3 ลำ: **sun \| set** ("Split between the two small words."), **nap \| kin** ("Split between the two consonants."), **kit \| ten** ("Twin consonants? Split between the twins.") และ Tinbot ชี้พร้อม "tin \| bot" ในป้ายคำพูด (4) แถบสระ a e i o u ตัวอย่างคำในหน้านี้**ห้ามใช้เป็นข้อฝึก**ในหน้า 5–11 และ 18 (ใช้ได้เฉพาะหน้า review 12–16) |
| 5 | **Docking Words: Compound Words** · Moon | `fill-in` (A) | 8 | RF.1.3.e, RF.1.3.b | ตัวอย่าง 1 แถบใต้ directions (ใช้คำ C ใหม่ที่ไม่นับเป็นข้อ) **ข้อ 1–6**: ยาน 2 ลำ "word + word" → เส้นลายมือ "Blast off: ____" ให้เขียนคำเต็ม **ข้อ 7–8 (กลับทาง)**: แสดงคำประสมเต็ม → เขียน 2 คำเล็กลงในยาน 2 ลำ ข้อ 1–2 จุดสระไว้ให้ ใช้คำ C ใหม่ 8 คำ (+1 ตัวอย่าง) Directions: *"Read the two small words. Dock them. Write the big word."* |
| 6 | **Docking Station: Compound Words** · Moon | `cut-paste` (A) | 8 | RF.1.3.e, RF.1.3.b | ด้านบนเป็นยานซ้าย 8 ลำ (2 คอลัมน์ × 4 แถว) มี**คำแรก**พิมพ์ไว้ ข้างกันเป็นช่องแปะ (docking port) และใต้แต่ละคู่มีเส้นลายมือให้เขียนคำเต็ม ส่วนแถบตัดด้านล่างมี**คำหลัง 8 ชิ้น** (2 แถว × 4) **กติกา: คำแรกแต่ละคำต้องจับคู่กับชิ้นตัดได้เป็นคำจริงเพียง 1 แบบ** (ต้องส่งตาราง 8 × 8 ตรวจทุกคู่) ห้ามมีคำที่จับคู่ได้หลายแบบ เช่น sun+fish และ cat+fish ในชุดเดียวกัน ใช้คำ C ใหม่ 8 คำ Directions: *"Cut out the word parts. Glue each one to make a real word. Write the word."* |
| 7 | **Engine Count: 1 or 2 Syllables?** · Moon | `sort` (A) | 12 การ์ด | RF.1.3.d, RF.1.3.b | sort mat 2 คอลัมน์ (คอลัมน์ละ 6 ช่อง): **"1 vowel sound = 1 syllable"** และ **"2 vowel sounds = 2 syllables"** การ์ด 12 ใบอยู่แถบล่าง (3 แถว × 4) แบ่งเป็นคำพยางค์เดียว 6 คำ + คำ 2 พยางค์ 6 คำ (C 3 + D/S 3) **ห้ามให้ความยาวคำเป็นตัวช่วย**: คำพยางค์เดียวต้องยาว 5–6 ตัวอักษรด้วย blend/digraph (เช่น *splash, stomp, chest*) และคำ 2 พยางค์ต้องมีคำสั้น 5–6 ตัวอักษรอย่างน้อย 3 คำ ทุกคำต้องเป็นพยางค์ปิด Directions: *"Cut out the cards. Dot the vowels. Count them. Glue each card in the right engine."* ทางเลือกสำหรับครูที่ไม่อยากให้ตัด (เขียนไว้ใน p.19): ให้เขียน 1 หรือ 2 บนการ์ดแทน |
| 8 | **Split the Stages: VC/CV Words 1** · Planet | `fill-in` (A) | 8 | RF.1.3.e, RF.1.3.d | Flavor: *"Split between the two consonants."* ใช้กล่องจรวด (SVG #2): ด้านบนพิมพ์คำเต็ม → นักเรียนจุดสระ + ขีดแบ่งบนคำที่พิมพ์ → เขียน stage 1 \| stage 2 ลงในตัวจรวด → เขียนคำเต็มที่บรรทัด "Blast off:" **ข้อ 1–4 = D** (ข้อ 1–2 จุดสระไว้ให้แล้ว) **ข้อ 5–8 = S** ใช้คำใหม่ทั้ง 8 คำ |
| 9 | **Split the Stages: VC/CV Words 2** · Comet | `fill-in` (A) | 8 | RF.1.3.e, RF.1.3.d | Flavor: *"Keep blends together inside a stage."* เลย์เอาต์เดียวกับ p.8 แต่ไม่มีการจุดสระให้ ใช้คำ X ใหม่ 8 คำ: ต้องมีคำที่พยัญชนะตรงกลางดูเหมือน blend (*s\|k, s\|t*) อย่างน้อย 3 คำ, มี digraph ในพยางค์ (*-ish, ch-*) อย่างน้อย 1 คำ และมี blend ต้นหรือท้ายพยางค์ (*trum\|pet, in\|sect*) อย่างน้อย 2 คำ กล่องทิป 1 บรรทัด: *"bas \| ket: s and k are in different stages."* (ใช้คำ X ที่ไม่ใช่ข้อฝึกได้) |
| 10 | **Asteroid Maze: Syllable Splits** · Planet + Comet | `maze` (B) | 25 ช่อง (ทางถูก 11–13 ช่อง) | RF.1.3.e | ตาราง asteroid **5 × 5** แต่ละช่องมีคำที่แบ่งพยางค์แล้ว 1 คำ (เช่น `nap \| kin` หรือ `na \| pkin`) START อยู่มุมบนซ้าย (Tinbot ในยาน) และ Home Base อยู่มุมล่างขวา **เดินได้แค่ขึ้น/ลง/ซ้าย/ขวา (ไม่เดินทแยง)** และเดินผ่านได้เฉพาะช่องที่**แบ่งถูก** **ต้องมีทางถูกเพียง 1 ทาง:** ทุกช่องที่แบ่งถูกต้องอยู่บนทางเดินนั้น ทางเดินไม่มีกิ่ง ไม่มีวง และช่องบนทางเดินที่ไม่ได้อยู่ติดกันตามลำดับต้องไม่อยู่ติดกันแบบตั้งฉาก ช่องที่แบ่งผิดเป็น**ข้อผิดพลาดที่เด็กมักทำ** เช่น แบ่งหลังสระ (`ba \| sket`, `ki \| tten`) แบ่งหลังพยัญชนะ 2 ตัว (`bask \| et`, `kitt \| en`) หรือแบ่งคำประสมผิดที่ (`sa \| ndbox`) แต่ละคำใช้ได้ครั้งเดียวใน maze คำบนทางถูกต้องเป็น**คำใหม่** (C ~4, D/S ~4, X ~4) ส่วนช่องผิดใช้คำที่เคยฝึกในหน้า 5–9 ได้ ทุกคำยาวไม่เกิน 7 ตัวอักษร (ไม่นับ `\|` และช่องว่าง) ส่งเป็น **เมทริกซ์ 5 × 5** + พิกัดทางถูกตามลำดับ (เช่น A1→A2→B2…) Directions: *"Help Tinbot fly home. Move only on words split the right way."* |
| 11 | **Mystery Cargo: Syllable Riddles** · Planet | `mystery-number` (B) | 4 ลัง (12 clues) | RF.1.3.e (+ L.2.4.d สำหรับ ป.2) | แถบ "Cargo List" ด้านบนมีคำ 8 คำ (คำตอบ 4 คำ: C 2 + VC/CV 2 และตัวหลอก 4 คำ) แต่ละลังมี clue 3 ข้อ: **Clue 1 = โครงสร้าง** (*"I am a compound word."* / *"I have twin consonants."*) **Clue 2 = พยางค์/เสียง** (*"My first syllable rhymes with hat."*) **Clue 3 = ความหมาย** (*"You can wipe your hands with me."*) เมื่ออ่านครบ 3 clue ต้อง**เหลือคำตอบเดียว** และแต่ละ clue ต้องตัดตัวเลือกออกได้จริงอย่างน้อย 1 คำ (ส่งตาราง elimination: ลัง × clue → คำที่ยังเหลือ) นักเรียนเขียนคำตอบลงบรรทัดลายมือ แล้วขีดแบ่งพยางค์บนคำที่เขียน ใช้คำใหม่ทั้ง 8 คำ ประโยค clue ต้องใช้คำที่ถอดรหัสได้หรือ heart words ในรายการเท่านั้น และกลุ่ม Moon ให้ครูอ่าน clue ให้ฟัง Directions: *"Read the clues. Find the word in the Cargo List. Write it. Split it."* |
| 12 | **Race to the Moon: Compound Words** · Moon (**HERO**) | `board-game` (C) | 23 ช่องคำ | RF.1.3.e, RF.1.3.b | ไม่มี name line กระดาน 27 ช่อง (geometry ในข้อกำหนด Designer) **ช่อง Boost = 5, 16** ("Go ahead 2.") และ **ช่อง Meteor = 12, 24** ("Go back 1.") ช่องอื่นอีก 23 ช่องเป็นคำ C ยาวไม่เกิน 7 ตัวอักษร โดยต้องเป็นคำใหม่ **≥ 8 คำ** ส่วนที่เหลือเป็นคำ review จากหน้า 4–6 ได้ กล่องกติกา (นักเรียนอ่าน) 5 บรรทัด: *"1. Spin. Move. 2. Split it. Read it. Blast off! 3. Does your team agree? Stay. 4. Not sure? Check the strip. Wrong? Go back 1. 5. Get to the Moon first to win!"* แถบ **Split Check** (เฉลยแบ่งพยางค์ 23 คำ เรียงตามหมายเลขช่อง) อยู่ใต้เส้น "Fold under" |
| 13 | **Race to the Moon: Closed Syllables** · Planet → Comet (**HERO**) | `board-game` (C) | 23 ช่องคำ | RF.1.3.e | ใช้กติกา, ตำแหน่ง Boost/Meteor และ Split Check แบบเดียวกับ p.12 **ช่อง 1–13 ใช้คำ D/S** และ **ช่อง 14–27 ใช้คำ X** (ไอคอน Planet ที่ START และ Comet ที่ช่อง 14 เป็นป้ายเล็ก) คำใหม่ **≥ 8 คำ** ยาวไม่เกิน 7 ตัวอักษร ห้ามใช้คำ C บนกระดานนี้ |
| 14 | **Flight Log: Two-Syllable Words** | `board-game` (C) | 6 แถว | RF.1.3.e | หน้าบันทึกเกมใช้ได้กับทั้ง 2 กระดาน มี name line + *"Board: A B"* (ให้วง) ตาราง 6 แถว: # / stage 1 / stage 2 / Blast off (คำเต็ม) จากนั้น *"Circle your hardest word."* และ *"My best word was ____."* แถบล่างมี**ตัวเดินจรวดตัดได้ 2 ตัว** (0.7 in) พร้อมเส้นตัด เพื่อให้ผู้เล่นแต่ละคนตัดตัวเดินจาก Flight Log ของตัวเอง |
| 15 | **Mini-Book: Tinbot's Picnic** (บรรทัดรอง: "A Two-Syllable Word Reader") | `mini-book` (D) | 8 panels | RF.1.3.e, RF.1.4.b | เล่ม 8 หน้าจากกระดาษ 1 แผ่น (layout การพับอยู่ในข้อกำหนด Designer) **P1 ปก** = ชื่อเรื่อง + "by ____" + ภาพเส้นให้ระบาย **P2–P7 เรื่อง** ช่องละ 1–2 ประโยค ไม่เกิน 14 คำต่อช่อง **P8 ปกหลัง** = "Words I Can Read" มีคำเป้าหมาย 8 คำ แต่ละคำมีดาวเส้นให้ระบายหลังอ่าน คำสั่งบนปก: *"Read the book. Box each two-syllable word."* เรื่องต้องมีคำเป้าหมาย 8 คำ (C ≥ 2, VC/CV ≥ 4 ที่เหลือแล้วแต่ผู้เขียน และเป็นคำ review ได้แต่ต้องมีคำใหม่ ≥ 2 คำ) ชุดคำปิกนิกที่ brief เสนอ: picnic, basket, napkin, muffin, sunset, hilltop ฉากบนดวงจันทร์หรือเนินเขาตอนพระอาทิตย์ตกแสดงผ่าน**ภาพ** ห้ามใช้คำ *moon/star/rocket* ในข้อความ ตัวละครคือ Tinbot (+ ตัวเลือก: แมวหุ่นยนต์ชื่อ **Zigzag** ซึ่งเป็นคำ S) |
| 16 | **Countdown Reading: 2-Syllable Words** · Planet | `fill-in` (A) | 10 คำ + 5 วลี + 3 ประโยค | RF.1.4.b, RF.1.3.e | มี 3 ส่วนและแต่ละส่วนมีวงกลม countdown **3 – 2 – 1** ให้ระบายทีละรอบหลังอ่าน **Word Launch**: คำ 10 คำ (C 3, D/S 4, X 3) นักเรียนขีดแบ่งพยางค์บนคำก่อนแล้วจึงอ่าน **Phrase Launch**: 5 วลี (3–5 คำ เช่น *"a muffin in a basket"*) **Sentence Launch**: 3 ประโยค (6–10 คำ) ท้ายหน้ามี *"Blast off! I read to ____."* (ให้เพื่อนเซ็นชื่อ) คำ review ใช้ได้ทั้งหน้า |
| 17 | **Invent-a-Word Lab: Compound Words** | `open-ended` (E) | 2 + 1 | RF.1.3.e, RF.1.3.b (+ L.2.4.d สำหรับ ป.2) | Word bank: คำพยางค์ปิด 1 พยางค์ 12 คำ (เช่น sun, bug, jet, hat, fish, mud, box, pig, cup, web, bed, nut) **Part 1 "Real Words"**: สร้างคำประสมจริง 2 คำจาก bank เขียนแบบมีขีดแบ่ง (bank ต้องสร้างคำจริงได้ **≥ 4 คำ** และต้องส่งรายการที่เป็นไปได้ทั้งหมดไว้ทำเฉลย) **Part 2 "Silly Word"**: สร้างคำประสมใหม่ที่ไม่มีอยู่จริง เขียนแบบมีขีดแบ่ง วาดภาพลงกล่อง แล้วเติมประโยค *"A ________ is a ________ that ________."* ห้ามใช้คำใน bank ที่ประกอบกันแล้วได้คำไม่สุภาพ (ต้องตรวจ) |
| 18 | **Mission Check: Two-Syllable Words** + **My Star Chart** | `quick-check` + `self-assess` (F) | 8 ข้อ + I can 3 ข้อ | RF.1.3.d, RF.1.3.e | **Moon (ข้อ 1–3):** ข้อ 1–2 *"Dot the vowels. How many syllables? 1 or 2"* (คำพยางค์เดียว 1 คำ + คำ 2 พยางค์ 1 คำ) ข้อ 3 แบ่งคำประสมลงกล่อง stage **Planet (ข้อ 4–6):** ข้อ 4–5 แบ่ง D และ S ลงกล่อง stage ข้อ 6 *"Circle the right split."* 3 ตัวเลือก **Comet (ข้อ 7–8):** ข้อ 7 แบ่ง X ข้อ 8 วงตัวเลือกที่แบ่งถูกจาก 3 ตัวเลือก **ทุกคำในหน้านี้ต้องเป็นคำใหม่ที่ไม่ปรากฏในหน้าอื่นเลย** (วัดการถอดรหัส ไม่ใช่ความจำ) **My Star Chart:** *"I can find the vowels and count syllables."* / *"I can split and read compound words."* / *"I can split and read words like nap \| kin."* แต่ละข้อมีดาวเส้น 3 ดวงให้ระบาย 1–3 ดวง |
| 19 | **Teacher Prep Guide: Games & Mini-Book** | Teacher instructions | – | – | (1) วิธีเล่น Race to the Moon (2–4 คน, 10–15 นาที, ใช้กับ center, กลุ่มเล็ก, early finisher หรือส่งไปเล่นที่บ้าน) และ variation ได้แก่ เล่นแบบ partner reading หรือเล่นทั้งห้องผ่าน document camera (2) ภาพวิธีใช้สปินเนอร์ด้วยคลิปหนีบกระดาษ + ดินสอ (3) Split Check: พับไว้ใต้กระดาน แล้วเปิดดูเมื่อไม่แน่ใจ (4) **วิธีพับ mini-book 6 ขั้น** พร้อมภาพเส้นเล็ก ๆ และทางเลือก "cut the 8 panels apart and staple them in page order" (5) เคล็ดลับการพิมพ์: พิมพ์ p.15 ด้านเดียวที่ **Actual size / 100%**, กระดานพิมพ์บน cardstock หรือใส่ sheet protector ได้, ห้ามพิมพ์ p.6–7 สองหน้า (6) ทางเลือกสำหรับครูที่ไม่ใช้กรรไกรในหน้า 6–7 |
| 20 | **Answer Key: pp. 5–8** | Answer key | – | – | p.5 คำเต็ม/คำเล็กทั้ง 2 คำ · p.6 คู่ที่ถูก + คำเต็ม · p.7 รายการการ์ดตามคอลัมน์ (มีจุดใต้สระ) · p.8 `stage \| stage` + คำเต็ม |
| 21 | **Answer Key: pp. 9–11** | Answer key | – | – | p.9 การแบ่งพยางค์ · **p.10 ภาพ maze ย่อ (~4 × 4 in) แสดงทางถูกเป็นเส้นหนา + เส้นประ** (ห้ามใช้สีอย่างเดียว) และรายการช่องผิดพร้อมการแบ่งที่ถูก · p.11 คำตอบ 4 ลัง + การแบ่งพยางค์ |
| 22 | **Answer Key: pp. 12–15** | Answer key | – | – | ตาราง 2 ชุด (Board A / Board B) ได้แก่ ช่อง # / คำ / การแบ่ง (ตรงกับแถบ Split Check) · p.14 "Answers will vary. Check splits with the Split Check strips." · p.15 คำที่ต้องตีกรอบในแต่ละหน้าของ mini-book |
| 23 | **Answer Key: pp. 16–18** | Answer key | – | – | p.16 การแบ่งพยางค์ของคำ 10 คำ + รายการคำ 2 พยางค์ในวลี/ประโยค · p.17 คำประสมจริง**ทั้งหมด**ที่ทำได้จาก bank + ตัวอย่าง silly word ("Answers will vary.") · p.18 เฉลย 8 ข้อ + **Scoring guide**: 1 คะแนน/ข้อ; 7–8 = "Ready for liftoff"; 5–6 = ฝึกเพิ่มในหน้าระดับที่ผิด; 0–4 = สอนซ้ำด้วย Mission Briefing ในกลุ่มเล็ก และตาราง item → level → หน้าที่ใช้ฝึกซ้ำ (1–3 → p.5–7, 12; 4–6 → p.8, 10, 13; 7–8 → p.9, 13) |
| 24 | **Terms of Use & Credits** | ToU + Credits | – | – | ใช้ข้อความมาตรฐานจาก style guide/template + เครดิตฟอนต์ (Andika: SIL International, Baloo 2: The Baloo 2 Project Authors / Ek Type, ทั้งคู่ใช้ SIL OFL 1.1) + "Illustrations: original SVG artwork by [store]" |

### Suggested sequence (ใส่ใน Teacher Guide p.2)
| Day | Whole group (5 นาที) | Practice (10–15 นาที) |
|---|---|---|
| 1 | p.4 Mission Briefing + ปรบมือนับพยางค์ | p.7 Engine Count |
| 2 | Compound words ด้วย routine | p.5 Docking Words |
| 3 | สาธิตเกม (p.19) | p.6 Docking Station → p.12 Race to the Moon A + p.14 |
| 4 | VC/CV: twins & napkin words | p.8 Split the Stages 1 |
| 5 | Blends ที่อยู่คนละพยางค์ | p.9 (Comet) หรือทำ p.8 ซ้ำ (Moon/Planet) |
| 6 | Good split / bad split | p.10 Asteroid Maze |
| 7 | อ่าน clue ด้วยกัน 1 ลัง | p.11 Mystery Cargo → p.13 Race to the Moon B + p.14 |
| 8 | Repeated reading | p.16 Countdown Reading → p.15 Mini-Book |
| 9 | – | p.17 Invent-a-Word Lab (ใช้เป็น early finisher ได้) → p.18 Mission Check |

### Activity Mix Check (หน้ากิจกรรมนักเรียน p.5–18 = 14 หน้า ไม่นับ Mission Briefing)
| หมวด | หน้า | จำนวน |
|---|---|---|
| A Practice | 5 `fill-in`, 6 `cut-paste`, 7 `sort`, 8 `fill-in`, 9 `fill-in`, 16 `fill-in` | 6 |
| B Puzzle | 10 `maze`, 11 `mystery-number` | 2 |
| C Games | 12 `board-game`, 13 `board-game`, 14 `board-game` (Flight Log) | 3 |
| D Cards & Stations | 15 `mini-book` | 1 |
| E Thinking | 17 `open-ended` | 1 |
| F Assessment | 18 `quick-check` + `self-assess` | 1 |

| กฎ | ผล |
|---|---|
| ≥ 3 หมวด | ผ่าน: **6 หมวด** (A–F) |
| ≥ 4 กิจกรรมต่างกัน | ผ่าน: **10** (fill-in, cut-paste, sort, maze, mystery-number, board-game, mini-book, open-ended, quick-check, self-assess) |
| หมวด A ≤ 50% | ผ่าน: **6/14 = 43%** (ห้ามเพิ่มหน้า A ถ้าจะตัดหน้า ให้ตัด p.16 ก่อนตาม brief จะได้ 5/13 = 38%) |
| มี B หรือ C ≥ 1 | ผ่าน: maze, mystery-number, board-game × 3 |
| Hero ไม่ซ้ำ 5 ชิ้นล่าสุด | ผ่าน: `board-game` (ชิ้นก่อนใช้ `solve-shade`) |
| กิจกรรมใดไม่เกิน 6 ใน 10 ชิ้นล่าสุด | ผ่าน: fill-in, cut-paste และ sort ปรากฏ 2/2 ชิ้น |
| `activities` ใน catalog | ตรงกับรายการที่บันทึกไว้แล้วใน `products/catalog.json` (ไม่ต้องแก้) แต่ `standards` ควรเพิ่ม `RF.1.3.b` และ `RF.1.4.b` หลัง QA ยืนยัน (ให้ orchestrator เป็นคนแก้) |

---

## Word Bank Policy (บังคับ: Content Writer ต้องทำตามทุกข้อ)

### 1. ประเภทคำที่อนุญาต
| รหัส | ประเภท | นิยาม | ตัวอย่าง (ตัวอย่างเท่านั้น ต้องคัดรายการเอง ห้ามคัดลอก word list ของคู่แข่ง) |
|---|---|---|---|
| **C** | Compound | คำประสมแบบ**เขียนติดกัน (closed compound)** ที่ทั้ง 2 ส่วนเป็นคำจริงพยางค์เดียวแบบพยางค์ปิด สระเสียงสั้น (CVC, CCVC, CVCC, มี digraph sh/ch/th/ck/wh และ FLOSS ff/ll/ss/zz ได้) | sandbox, catfish, bathtub, backpack, laptop, pigpen, hilltop, desktop, sunspot, liftoff, eggshell, handbag, padlock, gumdrop, dustpan, chopstick |
| **D** | VC/CV twins | VC/CV ที่พยัญชนะตรงกลางเป็นตัวซ้ำ ทั้ง 2 พยางค์เป็นพยางค์ปิด | muffin, rabbit, mitten, puppet, tennis, hiccup, puffin, traffic, summit, attic |
| **S** | VC/CV simple | VC/CV ที่พยัญชนะตรงกลาง 2 ตัวต่างกัน, ไม่มี blend หรือ digraph ในคำ และทั้ง 2 พยางค์เป็น CVC | picnic, magnet, cactus, velvet, helmet, tablet, zigzag, mascot, tidbit, goblet |
| **X** | VC/CV Comet | VC/CV ที่มี blend หรือ digraph **อยู่ภายใน**พยางค์ หรือพยัญชนะตรงกลางเป็นคู่ที่ดูเหมือน blend (s\|k, s\|t) | basket, dentist, plastic, trumpet, publish, contest, insect, chipmunk, tantrum, skillet, frantic, splendid |

### 2. กติกาการแบ่งและขอบรอยแบ่ง
- **VC/CV:** แบ่งระหว่างพยัญชนะ 2 ตัวตรงกลางเสมอ (V C \| C V) **ห้ามแบ่ง digraph** (sh, ch, th, ck, wh, ng, tch) ดังนั้นคำอย่าง *jacket, rocket, kitchen, dishes* **ไม่ใช่ VC/CV และห้ามใช้**
- **Blend ตรงกลางต้องถูกแยก** (bas \| ket) ซึ่งเป็นจุดฝึกของระดับ Comet ส่วน blend ต้น/ท้ายพยางค์อยู่ในพยางค์เดิม (trum \| pet, in \| sect)
- **ห้ามใช้ VCCCV** (pumpkin, hundred, children, sandwich) และห้ามใช้ x หรือ qu ตรงจุดแบ่ง
- **Compound:** แบ่งระหว่างคำเล็ก 2 คำ และ**ทุกคำ C ต้องมีพยัญชนะทั้ง 2 ข้างของรอยแบ่ง** (sun \| set, bath \| tub) เพื่อให้สอดคล้องกับกฎ "split between consonants" เวลาปนกับ VC/CV ในหน้า 7, 10, 16, 18 ดังนั้น**ห้ามใช้** *within, setup, pickup, backup*
- **ห้ามมี digraph ปลอมที่รอยแบ่ง:** ตัวอักษร 2 ตัวที่ติดรอยแบ่งต้องไม่อ่านเป็น ph, sh, th, ch, wh, gh, ng หรือ ck (เช่น ห้าม *uphill* (p\|h), *mishap* (s\|h), *anthill* (t\|h))
- **nk/ng (welded sounds):** ใช้ได้เฉพาะคำระดับ X เท่านั้น (เช่น chip \| munk) และต้องอยู่**ภายใน**พยางค์ ห้ามอยู่ที่รอยแบ่ง (ห้าม *blanket, trinket*)

### 3. กติกาสระและการออกเสียงพยางค์ที่ 2
- พยางค์แรกต้องเป็นสระเสียงสั้นชัดเจน
- พยางค์ที่ 2 ต้องคงเสียงสระสั้นหรือเบาลงเพียงเล็กน้อย **รูปที่อนุญาต:** -it, -in, -ic, -ish, -id, -ip, -ix · -et, -en, -ent, -est, -ect, -ex · -us, -up, -um, -ub, -ug, -unk · และพยางค์ที่สระเต็มเสียง (zig \| zag, mas \| cot, cat \| nip, sun \| set)
- **ห้ามรูปที่กลายเป็น schwa ชัด:** -on, -om, -an, -al, -el, -il, -ol, -em (button, lesson, wagon, salad, tunnel, pencil, fossil, problem)

### 4. สิ่งที่ห้ามใช้เป็นคำเป้าหมาย
- **Open syllable / V/CV / VC/V:** robot, rocket, planet, comet, lemon, pilot, music, habit, wagon, tiger, seven
- **Vowel teams, diphthongs, r-controlled, silent e:** rainbow, sunshine, cupcake, football, snowman, starfish, popcorn, spaceship, moonlight, bedtime, inside, mailbox, astronaut
- **-y, -le, -ed, -ing, -es และพหูพจน์ -s** เป็นคำเป้าหมาย (ใน mini-book/Countdown มีพหูพจน์ -s ในประโยคได้ แต่ไม่นับเป็นคำเป้าหมาย)
- **ข้อยกเว้นเสียงยาว** เช่น -old, -ild, -ind, -ost (goldfish, behind), soft c/g (pencil, ginger, cent-), "all" และ "ull" (pinball, bulldog)
- **คำประสมแบบเว้นวรรคหรือมีขีด** ตาม Merriam-Webster (เช่น *hot dog*, *ice cream*) ถ้าไม่แน่ใจว่าเขียนติดกันไหม **ให้ตัดออก**
- **คำที่ไม่เหมาะกับเด็กหรือเสี่ยง:** ความรุนแรง/อาชญากรรม (bandit, suspect, kidnap, gunshot, handcuff), สิ่งน่ากลัว (goblin), เครื่องหมายการค้า (Muppet, Ziploc), คำที่อ่อนไหวทางวัฒนธรรม (wigwam), และคำว่า Rabbit/Tiger ในฐานะ "ชื่อกฎ"
- คำ *rocket, planet, moon, star, robot, astronaut* ใช้ได้แค่ในภาพและในคำของครู (Teacher Guide) **ห้ามอยู่ในข้อความที่นักเรียนต้องถอดรหัส** ยกเว้นชื่อหน้า/แบนเนอร์ที่เป็นชื่อแบรนด์ของกิจกรรม (Race to the Moon, Asteroid Maze) ซึ่งครูอ่านให้ฟัง

### 5. จำนวนขั้นต่ำและการไม่ซ้ำ
- **Master Word List ≥ 76 คำ 2 พยางค์ที่ไม่ซ้ำกัน:** C ≥ 34, D ≥ 12, S ≥ 14, X ≥ 16 และมีคำพยางค์เดียวสำหรับ p.7 (6 คำ), p.18 (1 คำ) และ bank ของ p.17 (12 คำ) แยกไว้
- **หน้าที่ต้องใช้คำใหม่ (ห้ามซ้ำกันข้ามหน้า):** 5, 6, 7, 8, 9, 10 (เฉพาะช่องทางถูก), 11 และ **18 (ต้องใหม่ 100% ไม่ปรากฏที่ไหนอีกในหน้านักเรียน)**
- **หน้าที่ตั้งใจให้เป็น review** (ใช้คำซ้ำได้ แต่ต้องระบุในตาราง): 10 (ช่องผิด), 12–13 (คำใหม่ ≥ 8 คำต่อกระดาน), 15 (คำใหม่ ≥ 2 คำ), 16
- **ภายในหน้าเดียวกันห้ามใช้คำซ้ำ** และ**ห้ามใช้คำเดียวกันบนกระดาน A และ B**
- ตัวอย่างบนปก/Mission Briefing (sunset, napkin, kitten, Tinbot) ใช้ซ้ำได้เฉพาะในหน้า review 12–16
- หน้าที่ต้องรู้ความหมาย (11, 15, 17, 18) ต้องใช้**คำที่เด็ก 6–7 ขวบรู้จัก** ส่วนคำที่คุ้นน้อยแต่ถอดรหัสได้ (dishpan, catnap, nutmeg, inkwell) ใช้ได้เฉพาะในหน้าที่เน้นการถอดรหัส (8–10, 12–13, 16)

### 6. ข้อความที่นักเรียนอ่าน (clues, mini-book, Countdown, directions)
- ใช้คำพยางค์ปิดที่ถอดรหัสได้ + คำเป้าหมาย + **heart words ไม่เกิน 15 คำ** จากรายการนี้: *the, a, to, said, of, is, his, has, was, you, I, he, she, me, my, we, for, have, what, do, go, no, put* (ถ้าจะเพิ่ม ต้องระบุเหตุผล)
- Directions ไม่เกิน 10 คำต่อประโยค และไม่เกิน 3 ประโยค ขึ้นต้นด้วยคำกริยา (Read, Cut, Dot, Split, Write, Glue, Circle)
- ชื่อตัวละคร: Tinbot (สำรอง: **Zipbot**) และตัวเลือก Zigzag **ห้ามใช้ชื่อคนจากชิ้นที่ 1** (Maya, Leo, Priya, Diego, Ava, Sam, Kenji, Zara, Amara, Jin, Rosa, Lucas, Mateo) ถ้าต้องมีชื่อคน ให้ใช้ชื่อพยางค์ปิดที่ถอดรหัสได้และยังไม่เคยใช้

---

## ข้อกำหนดสำหรับ Content Writer

ส่งงานเป็น `products/1st-grade-two-syllable-words/03-content.md` โดยใช้หัวข้อ `## Page N — Title` ตามชื่อหน้าใน outline ทุกตัวอักษร

1. **Master Word List อยู่ต้นไฟล์** (ตาราง): word / type (C, D, S, X) / split / letters / pages used / new หรือ review / checks (สระสั้นทั้ง 2 พยางค์? รูปพยางค์ที่ 2 อยู่ในรายการอนุญาต? ไม่มี digraph ปลอม? C: Merriam-Webster เขียนติดกัน?) ท้ายตารางให้สรุปจำนวน C/D/S/X ว่าผ่านขั้นต่ำหรือไม่ และ**ผลตรวจคำซ้ำข้ามหน้า**
2. ทุกหน้าที่มีคำเป้าหมายต้องมี**ตารางตรวจ**ท้ายหน้า: item / word / type / split / new หรือ review
3. ตารางตรวจเฉพาะหน้า: p.6 ตาราง 8 × 8 ยืนยันคู่เดียว · p.7 จำนวนตัวอักษรของการ์ดทุกใบ · p.10 เมทริกซ์ 5 × 5 + ลำดับพิกัดทางถูก + ยืนยันว่าไม่มีทางอื่น · p.11 ตาราง elimination · p.12–13 ช่อง 1–27 (ระบุ Boost/Meteor) และนับตัวอักษร ≤ 7 · p.17 รายการคำประสมจริงทั้งหมดที่ทำได้จาก bank
4. ภาพที่ต้องการให้เขียนเป็น `[IMAGE: …]` และต้องเป็นภาพเส้นที่ designer วาดเป็น SVG ได้ เช่น ฉาก mini-book: Tinbot, ตะกร้า, มัฟฟิน, เนินเขา, ดวงจันทร์ ส่วน p.5 **ไม่ต้องมีภาพประกอบคำ** (ใช้ยาน dock แทน) เพื่อไม่ให้ต้องวาดภาพจำนวนมาก
5. ข้อความครู (p.2, 3, 19, keys) เขียนเป็น American English ตรง ๆ ส่วนข้อความนักเรียนต้องทำตามข้อ 6 ของ Word Bank Policy
6. Flavor line ไม่เกิน 9 คำ (ไม่บังคับ) และห้ามใช้สัญลักษณ์ ★ ✓ ☆ ○ □ △ • → หรือ emoji ในเนื้อหา (ใช้ `|` ได้)
7. Mini-book: ส่งข้อความแยกตาม panel P1–P8 พร้อม `[IMAGE]` ของแต่ละช่อง และระบุคำที่ต้องตีกรอบในแต่ละช่อง
8. เมื่อเขียนเสร็จ ให้**ตรวจคำทุกคำซ้ำอีกรอบ**ตาม Word Bank Policy ข้อ 1–4 และระบุคำที่ไม่แน่ใจไว้ในหัวข้อ "Flags for QA"

---

## ข้อกำหนดสำหรับ Worksheet Designer

### พื้นฐาน
- ต่อยอดจาก `templates/worksheet-template.html` โดยใส่ `<meta name="tpt-theme" content="space-lab">` และ CSS override จาก brief ไว้ใน `<style>` ของ `worksheet.html` ด้วย `html:root` **ห้ามแก้ไฟล์ธีม**
- 1 `<section class="page">` = 1 หน้า US Letter (24 sections)
- **name-line** อยู่บนหน้า 5–11, 14, 16–18 ส่วนหน้า 4, 12, 13 ไม่มี name line และหน้า 15 มี "by ____" บนปกเล่ม
- Footer: ชื่อร้าน + เลขหน้า + **รหัสมาตรฐานตัวเล็ก** (เช่น "RF.1.3.e") บนหน้านักเรียน
- **ไอคอนระดับ** SVG #7 ขนาด 0.3 in เป็นเส้นล้วน วางมุมขวาบนข้างชื่อหน้า (และวางหน้าแต่ละส่วนของ p.18) ห้ามชนกับดาวมุมขวาบนของธีม (`.page::before`) ถ้าชน ให้เลื่อนไอคอนไปข้าง name-line

### ฟอนต์และขนาด (ป.1)
| ส่วน | ฟอนต์ / ขนาดขั้นต่ำ |
|---|---|
| ชื่อหน้า | Baloo 2 ExtraBold 24–26 pt บรรทัดเดียว (กระดานเกมใช้ 22–24 pt) |
| Flavor line | Andika Regular 12 pt สี `--brand-primary` **ห้ามใช้ italic** |
| Directions | Andika **13 pt** (สูงกว่า template 12.5) |
| **คำที่เด็กต้องถอดรหัส** | **Andika Bold**: หน้าฝึก/การ์ด/ป้ายจรวด ≥ 22 pt, กระดานเกมและ maze ≥ 20 pt, Split Check 12 pt |
| ประโยค (clues, mini-book, Countdown) | Andika 16–18 pt, line-height ≥ 1.4 |
| หน้าครู / เฉลย | Andika 11–12 pt / 12–14 pt ตัวหนา |
- ทุกคำที่เด็กอ่านต้องใช้ Andika (a/g หัวเดียว) ส่วน Baloo 2 ใช้ได้แค่ชื่อหน้า ปก และแบนเนอร์

### เส้นลายมือ ป.1 (primary lines)
- component `.primary-line`: เส้นบนทึบ + **เส้นกลางประ** + เส้นฐานทึบ ความสูงรวม **≥ 0.6 in** (ช่อง stage ในจรวดอย่างน้อย 0.55 in ซึ่งมากกว่าขั้นต่ำ 0.45 in ใน brief)
- ความกว้างช่องคิด **≥ 0.33 in ต่อตัวอักษรที่คาดว่าจะเขียน**: ช่อง stage (3–5 ตัวอักษร) ≥ 1.4 in, บรรทัด "Blast off:" (คำเต็ม 6–8 ตัวอักษร) ≥ 2.7 in
- ใช้เส้นสี `--ink` (เส้นกลางเป็นเส้นประสีเทาเข้มอย่างน้อย `#888`) เพื่อให้พิมพ์แล้วยังเห็น

### ขาว-ดำ / ประหยัดหมึก
- หน้านักเรียน**พื้นขาว** ห้ามใช้ `--night-sky` หรือพื้นสีทึบ และพื้นที่เทาต้องไม่เกิน ~10%
- **ข้อความต้องเป็น `--ink` หรือ `--brand-primary` เท่านั้น** ส่วนเทอร์ควอยซ์และ coral มี contrast ต่ำเมื่อเป็น grayscale จึงใช้ได้แค่กับเส้นตกแต่ง **ห้ามใช้สีเป็นตัวสื่อความหมายเพียงอย่างเดียว** (เช่น เส้นแบ่งพยางค์ในตัวอย่างต้องเป็นเส้นประด้วย ไม่ใช่แค่สีเทอร์ควอยซ์ และทางถูกในเฉลย maze ต้องเป็นเส้นหนา + เส้นประ)
- แนะนำ override `.directions b { color: var(--brand-primary); }` ใน worksheet.html เพราะคำว่า "Directions:" สีเทอร์ควอยซ์จะจางเมื่อพิมพ์ขาวดำ
- เปิด preview แบบ grayscale แล้วตรวจทุกหน้าก่อนส่ง QA
- Answer key ใช้ `.answer-key` (แดงตัวหนา) ซึ่งต้องยังอ่านออกเมื่อพิมพ์ขาวดำ

### เส้นตัด / เส้นพับ (ต้องต่างกันชัด ตาม SVG #15)
- **ตัด:** เส้นประ 2 px + ไอคอนกรรไกร · **พับ:** เส้น dot-dash 1.5 px + ป้ายเล็ก "fold" · ทุกเส้นตัดเป็นเส้นตรงและมุมฉาก
- ชิ้นที่ต้องตัด (p.6, p.7, ตัวเดินใน p.14) ต้องอยู่ห่างขอบกระดาษ ≥ 0.35 in และช่องแปะต้อง**ใหญ่กว่าชิ้นตัดอย่างน้อย 0.1 in ทุกด้าน**

### Components และ geometry รายหน้า
| Component / หน้า | สเปก |
|---|---|
| **Rocket stage box** (p.8, 9, 18) | SVG #2 กว้าง ~3.4 in รวมหัวและครีบ ช่อง stage 2 ช่อง ช่องละ ≥ 1.4 × 0.55 in มีเส้นประแบ่งตรงกลาง คำพิมพ์อยู่เหนือจรวด (22 pt) ใต้จรวดมีบรรทัด "Blast off:" ≥ 2.7 in ใช้ 2 คอลัมน์ × 4 แถว ช่องละ ~1.95 in (รวม 7.8 in + ส่วนหัว ≤ 1.6 in ซึ่งใส่ได้ในพื้นที่ 9.8 in) |
| **Docking ships** (p.5, 6) | SVG #3 ยานแต่ละลำ ~1.4 × 0.6 in มีคำ 22 pt อยู่ข้างใน 2 คอลัมน์ × 4 แถว ช่องแปะ (p.6) 1.5 × 0.7 in และชิ้นตัด 1.4 × 0.6 in |
| **Sort mat + cards** (p.7) | หัวคอลัมน์ 2 อันมีไอคอนเครื่องยนต์ 1 ตัว / 2 ตัว + ข้อความ ช่องแปะ 6 ช่องต่อคอลัมน์ (1.7 × 0.65 in) การ์ด 12 ใบ (1.6 × 0.55 in, 3 แถว × 4) อยู่แถบล่างเหนือ footer |
| **Asteroid maze** (p.10) | ตาราง 5 × 5 ช่องละ ~1.3 × 1.3 in (รวม 6.5 × 6.5 in) ช่องเป็นก้อนหินเส้น (SVG #9, 3–4 แบบสลับกัน) ข้อความ 20 pt มีป้าย START (ยาน Tinbot) ที่ A1 และ Home Base ที่ E5 |
| **Cargo crates** (p.11) | แถบ Cargo List สูง ~0.9 in (คำ 8 คำ 20 pt) ลัง 2 × 2 ลังละ ~3.55 × 3.3 in มี SVG #10 เป็นหัวลัง, clue 3 บรรทัด 16 pt และบรรทัดลายมือ 1 บรรทัด |
| **Race to the Moon board** (p.12, 13) | ระยะขอบ 0.4 in (เฉพาะหน้านี้) พื้นที่ใช้ได้ 7.7 × 10.2 in · หัวหน้า (ชื่อ + directions 1 บรรทัด) ≤ 0.85 in · **ด้านซ้าย = กระดาน 5 คอลัมน์ × 9 แถว** ช่องขนาด 1.15 × 0.75 in ห่างกัน 0.05 in (กว้าง ~6.0 × สูง ~7.15 in) · **ด้านขวา = คอลัมน์ข้าง 1.5 in** มีสปินเนอร์ (SVG #6, ⌀ 1.4 in, 1-2-3-1-2-3, Andika Bold 18 pt) + กล่องกติกา 5 บรรทัด (12 pt) + คำอธิบาย Boost/Meteor · **ทางเดิน serpentine จากล่างขึ้นบน**: แถว 1 (ล่าง) Earth START ที่คอลัมน์ 1 และช่อง 1–4 ที่คอลัมน์ 2–5 → แถว 2 ช่อง 5 ที่คอลัมน์ 5 → แถว 3 ช่อง 6–10 จากขวาไปซ้าย → แถว 4 ช่อง 11 ที่คอลัมน์ 1 → แถว 5 ช่อง 12–16 จากซ้ายไปขวา → แถว 6 ช่อง 17 ที่คอลัมน์ 5 → แถว 7 ช่อง 18–22 จากขวาไปซ้าย → แถว 8 ช่อง 23 ที่คอลัมน์ 1 → แถว 9 (บน) ช่อง 24–27 ที่คอลัมน์ 1–4 และ Moon FINISH ที่คอลัมน์ 5 · **Boost = 5, 16 / Meteor = 12, 24** (ผลที่ได้คือไปช่อง 7, 18, 11, 23 ซึ่งเป็นช่องคำทั้งหมด และไม่ต่อเนื่องเป็นลูกโซ่) · แต่ละช่องมีหมายเลขเล็ก 8 pt ที่มุม · ช่องว่างข้างช่องต่อ (แถว 2, 4, 6, 8) ใส่ดาวเส้นหรือ Tinbot ได้เล็กน้อย แต่ต้องเว้นพื้นขาวเป็นหลัก · **แถบ Split Check** อยู่ใต้เส้นพับ "Fold under" มี 3 แถว × 8 ช่อง แต่ละช่องเป็น "# word \| split" 12 pt สูงรวม ≤ 1.0 in · งบความสูง: 0.85 + 7.15 + 0.15 + 1.0 = ~9.2 in ซึ่งใส่ได้ใน 10.2 in |
| **Flight Log** (p.14) | ตาราง 6 แถว แถวละ 0.75 in (primary lines ในช่อง stage 1, stage 2, Blast off) แถบตัดล่างมีตัวเดินจรวด 2 ตัว (SVG #8, 0.7 in) |
| **Mini-book** (p.15) | ตั้ง `.page` นี้ padding 0 แล้ววางกล่องแนวนอน 11 × 8.5 in หมุน 90° ให้พอดีหน้า portrait · ตาราง **4 คอลัมน์ × 2 แถว** ช่องละ 2.75 × 4.25 in · **แถวบนกลับหัว (หมุน 180°)** · **ลำดับช่อง (มองในแนวนอน):** แถวบนจากซ้ายไปขวา = **5, 4, 3, 2** (กลับหัว) / แถวล่างจากซ้ายไปขวา = **6, 7, 8 (ปกหลัง), 1 (ปกหน้า)** · **เส้นตัดมีเส้นเดียว**: ตามเส้นกึ่งกลางแนวนอน**เฉพาะ 2 คอลัมน์กลาง** (ยาว 5.5 in) ส่วนเส้นอื่นเป็นเส้นพับ · safe area ห่างขอบกระดาษ 0.3 in และห่างเส้นพับ 0.15 in · ทุกช่องมีเลขหน้าเล็กมุมล่าง (เพื่อรองรับทางเลือกตัดแยกแล้วเย็บ) · ข้อความ 16–18 pt + ภาพเส้นให้ระบาย · **Designer ต้องตรวจลำดับด้วยการพิมพ์และพับจริง 1 ครั้ง** (หรือให้เจ้าของร้านพับทดสอบ) |
| **Countdown circles** (p.16) | วงกลมเส้น 3 วง (⌀ 0.35 in) มีเลข 3, 2, 1 ข้างในทุกส่วน |
| **Lab draw box** (p.17) | กล่องวาดภาพ ~3.5 × 2.5 in + primary lines 2 บรรทัดสำหรับประโยค |
| **Star Chart** (p.18) | ดาวเส้น SVG #11 ขนาด 0.4 in, 3 ดวงต่อ I can statement **ห้ามใช้ ★ ☆** |
| **Answer keys** | ใช้ภาพย่อหน้าจริงได้ (maze ต้องมีภาพย่อ) ส่วนหน้าอื่นใช้ตาราง/รายการ 2–3 คอลัมน์ |

### การพิมพ์ / preview / thumbnail
- p.6, p.7 และ p.15 ห้ามพิมพ์สองหน้า (เขียนไว้ใน p.19)
- หน้าสำหรับ thumbnail ตาม brief: 1, **12** (hero), 9 + 10, 15, 6, 7, 11, 17 และหน้าสำหรับ preview PDF ให้ใช้ 4, 8, 10, 12
- **คำว่า "No Prep" บนปก:** worksheet ส่วนใหญ่เป็น no prep แต่เกมต้องใช้คลิปหนีบกระดาษ และ cut & paste/mini-book ต้องตัด/พับ จึงแนะนำให้ marketing/QA ใช้ข้อความ listing ว่า **"No prep printables + low-prep games (just add a paper clip)"** เพื่อไม่ให้ดูเกินจริง ส่วนแถบปกจะคงตาม brief หรือเปลี่ยนเป็น "Print & Go" ก็ได้ ให้ creative-director ตัดสิน
- ตรวจ `pdffonts` ว่ามีแค่ Andika และ Baloo 2

---

## ราคาและความยาว

- **24 หน้า / $4.00** (15 หน้านักเรียน, เกมกระดาน 2 แบบ, mini-book, maze, เฉลยครบทุกหน้า) อยู่ในช่วง "Standard 20–40 หน้า" ของ style guide และตรงกับราคาที่ research แนะนำ **จึงยืนยัน $4.00 ไม่ปรับ**
- เหตุผลที่ไม่ขึ้นราคา: listing ป.1 หัวข้อนี้มีการแข่งขันระดับ M–H และมีของฟรี (ตาม research) ร้านยังไม่มีรีวิว และคู่แข่งตรงที่เห็นใน snippet มีราว 16 หน้า (ยังไม่ยืนยันราคา) การตั้ง $4.00 ทำให้ราคาต่ำกว่าชิ้นที่ 1 ($5.00 / 27 หน้า) ตามสัดส่วน และเหลือช่องให้ทำ bundle `big-words` ลด 20–30% ในอนาคต
- เหตุผลที่ไม่ลดราคา: มีเกม 2 กระดานพร้อม self-check, mini-book และ quick check ที่ใช้วิเคราะห์ระดับได้ ซึ่งคู่แข่งใน snippet ไม่ได้พูดถึง
- ถ้าต้องตัดหน้า (ตาม brief ให้ตัด p.16 ก่อน) ราคายังคงเป็น $4.00 ได้ (23 หน้า)
- Freebie ที่ brief เสนอ (Mission Briefing + Race to the Moon A + Flight Log) ทำได้ทันทีจาก p.4, 12, 14 + เฉลยของ Board A
