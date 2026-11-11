# Market Research: 3rd Grade Halloween Fractions (+ ทางเลือกที่ขายได้ตอนนี้)

> วันที่วิจัย: 2026-11-11 | ผู้วิจัย: Market Researcher agent | slug ชั่วคราว: `3rd-grade-halloween-fractions`
> **ข้อจำกัดของข้อมูล (โปรดอ่าน):**
> - WebFetch เข้า `www.teacherspayteachers.com`, `im.kendallhunt.com` และ `www.nisd.net` ไม่ได้ (DNS ถูกบล็อกใน sandbox) ข้อมูลคู่แข่งทั้งหมดจึงมาจาก **search snippet** (WebSearch ที่จำกัดโดเมน teacherspayteachers.com) ราคา จำนวนหน้า และจำนวนรีวิวยังไม่ได้ยืนยันกับหน้าจริง ถ้าต้องการตัวเลขสด ต้องอนุญาตโดเมนเหล่านี้ใน network settings
> - รอบนี้ไม่มี Bash จึงรัน `node scripts/variety-report.mjs 30` ไม่ได้ ได้อ่าน `products/catalog.json` โดยตรงแทน (มี 2 ชิ้น ดูหัวข้อถัดไป)
> - **TPT ไม่เปิดเผยยอดขายหรือ search volume** ค่า H/M/L ทุกช่องจึงเป็น**ประมาณการ** และมีเหตุผลกำกับไว้

## สถานะความหลากหลายของร้าน (อ่านจาก catalog.json)
| date | slug | subject | grade | theme | hero | concept |
|---|---|---|---|---|---|---|
| 2026-11-06 | 1st-grade-two-syllable-words | ELA | 1 | space-lab | board-game | Word Rockets (space) |
| 2026-10-31 | 2nd-grade-regroup-or-not-subtraction | Math | 2 | playful-pop | solve-shade | Join the Regroup Crew! (construction) |

- **หัวข้อ + ระดับชั้น:** 3rd grade fractions ยังไม่เคยทำ จึง**ไม่ซ้ำ** และเป็นระดับชั้นใหม่ของร้าน (ป.3) ซึ่งช่วยเรื่องความหลากหลาย
- **ธีม:** ห้ามใช้ `space-lab` และ `playful-pop` ส่วนที่ใช้ได้คือ `adventure-quest`, `clean-minimal`, `doodle-notebook`, `garden-calm`
- **Hero activity:** ห้ามใช้ `board-game` และ `solve-shade` (กติกา 5 ชิ้นล่าสุด)
- **คอนเซปต์:** ต้องไม่ใช่ space/rocket หรือ construction
- **ข้อควรระวัง:** ไอเดียทั้ง 4 ข้างล่างเป็น "3rd grade fractions" ทั้งหมด จึง**ทำได้ทันทีแค่ 1 ชิ้น** ส่วนชิ้นที่เหลือต้องลงทะเบียนเป็น `series` (เช่น `fraction-monsters`) และต้องเปลี่ยนธีม บริบท และ hero ตาม `docs/variety-policy.md` ข้อ 1

## สรุป (TL;DR)
1. **ไม่ควรลง Halloween fractions ตอนนี้:** เลยฮาโลวีน 2026 มาแล้ว และดีมานด์ Halloween ส่วนใหญ่เกิดก่อนปลาย ต.ค. (ประมาณการ) อีกข้อคือห้อง ป.3 ส่วนใหญ่**สอนเศษส่วนช่วง ม.ค.–เม.ย.** ไม่ใช่ ต.ค. (pacing guide หลายเขต) สินค้าที่ทั้งตรงฤดูกาลและตรงช่วงสอนคือเศษส่วนที่**ไม่ผูกเทศกาล** และเริ่มขายช่วง ม.ค. 2027
2. **แนะนำให้ทำทันที:** **#1 "Fraction Monsters" (ธีม monster น่ารัก หลอนนิด ๆ แต่ไม่ใช่ Halloween)** ครอบคลุม 3.NF.A.1–A.3 + 3.G.A.2 ใช้ `riddle-code` เป็น hero ลงขายภายใน ~20–25 พ.ย. 2026 ให้ทัน Cyber Monday (30 พ.ย.) แล้วเก็บรีวิวช่วงพีคสอนเศษส่วน ม.ค.–มี.ค. 2027
3. **ยังคงทำตามคำขอเดิม:** **#2 "Halloween Fractions: Haunted House Escape"** เป็น series reskin ของ #1 ให้สร้างไว้ล่วงหน้า แล้วลงขาย **~10 ส.ค.–1 ก.ย. 2027** (ฮาโลวีน 2027 ตรงกับวันอาทิตย์ ปาร์ตี้ในห้องเรียนน่าจะเป็นศุกร์ 29 ต.ค. 2027) ติดป้าย "3rd & 4th grade" เพื่อเก็บกลุ่ม ป.4 ที่ทบทวนเศษส่วน ป.3 ช่วงต้นปีด้วย

## การประเมินปัญหาฤดูกาล (Seasonality assessment)

### 1) ครูซื้อของ Halloween เมื่อไร
- คำแนะนำสำหรับผู้ขาย TPT คือให้ของ Fall/Halloween **ขึ้นขายราวต้น ก.ย.** หรือ 4–6 สัปดาห์ก่อนเทศกาล ([Katie Brockmeyer, Seasonal Mockup Calendar](https://www.katiebrockmeyer.com/blog-1-1/seasonal-mockup-calendar)) และครูมักซื้อของตามฤดูกาลล่วงหน้าหลายสัปดาห์ ([Sell the Next Season, Not the Current One](https://roxysecondchance.substack.com/p/sell-the-next-season-not-the-current), [Lindsay Bowden, Seasonal TPT Products](https://lindsaybowden.com/seasonal-tpt-products/)) *แหล่งชุดนี้ได้จากวิจัยของร้านใน `products/2nd-grade-regroup-or-not-subtraction/01-research.md` รอบนี้ยังไม่ได้เปิดซ้ำ*
- แพลตฟอร์มที่ไม่ใช่ TPT (Etsy/Amazon) แนะนำให้ลงของตามฤดูกาล **8–12 สัปดาห์ก่อนพีค** และให้ลงของ Halloween ราวต้น ส.ค. เพราะ listing ใหม่ต้องใช้เวลาสะสมประวัติและ ranking ([The Modern Etsy Seller Podcast ep.34](https://themodernetsysellerpodcast.buzzsprout.com/2605329/episodes/19572111-ep-34-when-should-i-get-my-holiday-items-listed-tips-for-etsy-sellers), [SellerApp Amazon Halloween guide](https://www.sellerapp.com/blog/amazon-halloween-guide/)) ใช้เป็นแนวทางเท่านั้น เพราะไม่ใช่ข้อมูลของ TPT
- การค้นหาเรื่อง Halloween ทั่วไป (ไม่ได้เจาะใบงาน) เริ่มขึ้นช่วงปลาย ก.ย. และพุ่งในเดือน ต.ค. ([Think with Google Halloween infographic](https://www.thinkwithgoogle.com/_qs/documents/1176/e420f_Halloween_Trend_Infographic_V2_FINAL_1.pdf), [Google Frightgeist 2026](https://blog.google/products-and-platforms/products/search/frightgeist-halloween-trends-2026/)) ไม่พบข้อมูล Google Trends ของคำว่า "halloween worksheets" โดยตรง
- **ประมาณการ (ไม่ใช่ข้อมูลจริง):** ดีมานด์ Halloween บน TPT เกือบทั้งหมดเกิดระหว่าง **ต้น ก.ย.–~25 ต.ค.** แล้วตกเกือบเป็นศูนย์หลัง 31 ต.ค. จนถึง ส.ค. ปีถัดไป (ใช้เหตุผลเดียวกับวิจัยชิ้นแรกของร้าน)

### 2) ปัญหาที่หนักกว่า: เศษส่วน ป.3 ไม่ได้สอนตอน Halloween
| แหล่ง | ช่วงที่สอนเศษส่วน ป.3 |
|---|---|
| Fort Bend ISD (TX) | หน่วย Fractions 33 วัน **3 ม.ค.–17 ก.พ.** (Grading Period 3) ([FBISD Math At-A-Glance](https://www.fortbendisd.com//cms/lib/TX01917858/Centricity/Domain/6943/Math%20At-A-glance.pdf), [FBISD GP3 competencies](https://www.fortbendisd.com/cms/lib/TX01917858/Centricity/domain/80/grading%20pilot/2022-23%20overviews/Third%20Grade%20Math%20Competencies%2022-23-Grading%20Period%203.pdf)) |
| Orange Public Schools (NJ, Eureka Module 5) | **28 ม.ค.–29 มี.ค.** (2018-19) และ **10 ก.พ.–3 เม.ย.** (2019-20) ([2018-19](https://www.orange.k12.nj.us/cms/lib/NJ01000601/Centricity/Domain/26/2018-2019%203rd%20grade%20Module%205.pdf), [2019-20](https://www.orange.k12.nj.us/cms/lib/NJ01000601/Centricity/Domain/26/2019-20%203rd%20grade%20Module%205%20QSAC%20Revisions.pdf)) |
| Sudan ISD (TX) | Fractions & Geometry อยู่ใน 4th grading period ([Year at a glance](https://sites.google.com/sudanisd.net/mrsjohnson/year-at-a-glance)) |
| HEBISD (TX) | เริ่ม Fractions ใน 4th six weeks ([Mrs. Torres](https://sites.google.com/hebisd.edu/torres-math/4th-6-weeks)) |
| Illustrative Math K–5 | Fractions as Numbers เป็น **Unit 5 จาก 8 unit** (กลางปีค่อนไปท้าย) ([IM scope & sequence](https://curriculum.illustrativemathematics.org/k5/teachers/grade-3/course-guide/scope-and-sequence.html)) ราว 19–20 วัน ([Core Knowledge G3U5](https://www.coreknowledge.org/wp-content/uploads/2023/09/CKMath_G3U5_FractionsAsNumbers_TG_W2.pdf)) |

**ข้อสรุป:** ผู้ซื้อหลักของ "3rd grade fractions" น่าจะซื้อมากที่สุดช่วง **ม.ค.–เม.ย.** (ประมาณการจาก pacing guide ข้างบน แต่ละเขตต่างกัน) ส่วนในเดือน ต.ค. ห้อง ป.3 ส่วนใหญ่ยังไม่ได้เรียนเศษส่วน ซึ่ง**อาจเป็นเหตุผลที่ listing Halloween fractions จำนวนมากติดป้าย 3rd–4th, 4th–5th หรือ 5th–6th** (เช่น [Adding & Subtracting Fractions Halloween Grade 5, 6](https://www.teacherspayteachers.com/Product/Adding-Subtracting-Fractions-Halloween-Color-by-Number-14632185), [Twinkl Halloween unlike denominators 3–5](https://www.twinkl.com/resource/us-t2-m-1996-halloween-fractions-challenge-cards-english-united-states), [Halloween Color By Number Fractions Decimals Multiplication](https://www.teacherspayteachers.com/Product/Halloween-Color-By-Number-Fractions-Decimals-Multiplication-8674313)) ข้อนี้เป็นการอนุมาน
→ ใน ต.ค. กลุ่มที่น่าจะซื้อ Halloween fractions ระดับ ป.3 คือ (ก) ครู ป.4 ที่ทบทวนเศษส่วน ป.3 ก่อนเข้า 4.NF (ข) homeschool และ (ค) ห้อง ป.3 ที่ใช้หลักสูตรซึ่งสอนเศษส่วนเร็ว ทั้งหมดนี้เป็นการอนุมาน ยังไม่ยืนยัน

### 3) ตัวเลือกที่พิจารณา
| ตัวเลือก | ข้อดี | ข้อเสีย | คำตัดสิน |
|---|---|---|---|
| A. ลง Halloween fractions **ตอนนี้** เพื่อสะสมอายุ listing ไว้ใช้ปี 2027 | listing มีอายุ ~10 เดือน | ยอดแทบเป็นศูนย์จนถึง ก.ย. 2027 และได้รีวิวน้อย ส่วน TPT ไม่เปิดเผยว่าอายุของ listing ช่วยเรื่อง ranking หรือไม่ (ยืนยันไม่ได้) | **ไม่แนะนำ** ผลตอบแทนต่ำ |
| B. Thanksgiving fractions (Thanksgiving 2026 = 26 พ.ย.) | ยังทันพอได้บ้าง | เหลือเวลาขายแค่ ~1.5 สัปดาห์, ห้อง ป.3 ส่วนใหญ่ยังไม่เรียนเศษส่วน และมีคู่แข่งพร้อมแล้ว (เช่น [Thanksgiving Fractions Worksheets](https://www.teacherspayteachers.com/Product/Thanksgiving-Fractions-Worksheets-Thanksgiving-Math-Activities-1694914), [Thanksgiving Fractions by The Busy Class](https://www.teacherspayteachers.com/Product/Thanksgiving-Fractions-957670), [search: thanksgiving pie fractions](https://www.teacherspayteachers.com/browse?search=thanksgiving+pie+fractions)) | **ไม่แนะนำ** |
| C. **ทำ "engine" ที่ไม่ผูกเทศกาล (monster)** แล้วลงขายตอนนี้ ส่วน Halloween ใช้เป็น reskin ในปี 2027 | ขายได้ตั้งแต่ Cyber Monday ไปจนถึงพีค ม.ค.–เม.ย. และ monster ยังเชื่อมกับ "spooky" ที่เจ้าของร้านต้องการ ส่วน Halloween reskin ทำได้เร็ว | ช่อง "3rd grade fractions worksheets" แข่งกันสูง ต้องชนะด้วยคอนเซปต์และ puzzle | **แนะนำ** |
| D. Winter fractions (ม.ค.–ก.พ.) | ตรงกับช่วงสอนพอดี | ช่วงขายสั้นกว่า C | ทำเป็น series ภายหลัง (#3) |

> หมายเหตุ: ธีม monster ใช้ได้นานกว่า Halloween แท้ ๆ เช่น [Halloween Monsters Color By Number (Addition & Subtraction)](https://www.teacherspayteachers.com/Product/Halloween-Monsters-Math-Color-By-Number-Code-Addition-Subtraction-Regrouping-1210414) ที่ snippet ในวิจัยชิ้นแรกระบุว่ามี 1,300+ รีวิว (**ยังไม่ยืนยัน**) และมีเกมเศษส่วนธีม monster ที่ไม่ผูกเทศกาลอยู่แล้ว ([Catch the Monsters!](https://www.teacherspayteachers.com/Product/Catch-the-Monsters-An-Equivalent-Fraction-Game-1722129), [search: monster fractions](https://www.teacherspayteachers.com/browse?search=monster+fractions))

## ไอเดียสินค้าที่แนะนำ (3–5 ไอเดีย)

| # | ไอเดีย | ระดับชั้น | ประเภท | ความต้องการ (H/M/L) | การแข่งขัน (H/M/L) | ราคาแนะนำ (USD) | ซ้ำกับสินค้าเดิมไหม | เหตุผล |
|---|---|---|---|---|---|---|---|---|
| 1 (**แนะนำ ทำทันที**) | **"Fraction Monsters: 3rd Grade Fractions Worksheets – Unit Fractions, Number Lines, Equivalent & Comparing Fractions"** | 3 (+4 review, homeschool) | No-prep worksheets + puzzles, 26–32 หน้า, ขาวดำ | **H** ช่วง ม.ค.–เม.ย. (ประมาณการจาก pacing guide) | **H** สำหรับคำค้น generic, **M** สำหรับ monster/puzzle | **5.00** | ไม่ซ้ำ (หัวข้อใหม่ และ ป.3 ใหม่) | ขายได้ทันทีและตลอดหน่วยเศษส่วน และเป็น engine สำหรับ reskin |
| 2 (**ตรงกับคำขอ**) | **"Halloween Fractions Activities: Haunted House Escape Room – 3rd Grade Number Lines, Equivalent & Comparing Fractions"** | 3–4 | Printable escape room + worksheets, 18–22 หน้า | **H** เฉพาะ ก.ย.–ต.ค. (ประมาณการ) | **M–H** (มีหลายชิ้น แต่ส่วนใหญ่เป็น ป.4–6 หรือ color-by-number) | **4.50** | series reskin ของ #1 (ต้องระบุ `series`) | ทำตามคำขอเดิม แต่ลงขายในปี 2027 |
| 3 | **"Winter Fractions on a Number Line: Snowy Trail Mazes & Practice – 3rd Grade 3.NF.A.2"** | 3 | Worksheets + maze, 14–18 หน้า | **M–H** ช่วง ม.ค.–ก.พ. | **M** (search ไม่พบชุด number line ธีมฤดูหนาวสำหรับ ป.3 โดยตรง พบเพียง task card ฟรี 6 ใบและ Christmas maze) | **4.00** | series (topic ซ้ำกับ #1) | ตรงกับช่วงสอน number line พอดี |
| 4 | **"Comparing Fractions with the Same Numerator or Same Denominator: Fraction Face-Off Reasoning Pack – 3rd Grade 3.NF.A.3d"** | 3 | Worksheets + game + reasoning, 16–20 หน้า | **H** (evergreen ช่วง ม.ค.–เม.ย. รวม test prep) | **H** | **4.00** | series หรือทำหลัง 30 ชิ้น | เจาะทักษะที่มีคำค้นชัดเจนและเน้นการให้เหตุผล |

### รายละเอียดแต่ละไอเดีย

#### #1 Fraction Monsters (แนะนำทำทันที)
- **Working title:** *Fraction Monsters | 3rd Grade Fractions Worksheets | Unit Fractions, Fractions on a Number Line, Equivalent & Comparing Fractions | No Prep*
- **คอนเซปต์ / hook:** "The Fraction Monsters only eat **equal** shares!" แต่ละตัวมีนิสัยตามเศษส่วนของตัวเอง เช่น Halvsy กินแค่ 1/2, Thirdle กินแค่ 1/3 ไปจนถึง Eighto (ใช้แค่ตัวส่วน 2, 3, 4, 6, 8 ตามมาตรฐาน ป.3) เด็กแบ่งอาหารให้มอนสเตอร์ วางมอนสเตอร์บนเส้นจำนวน "Monster Bridge" แล้วตัดสินว่ามอนสเตอร์ตัวไหนได้มากกว่า ตอนท้ายจะไขรหัสมุกตลกของมอนสเตอร์ได้ ตัวละครหลอนแบบน่ารัก จึงใช้ได้ทั้งปี
- **มาตรฐาน:** 3.G.A.2 (แบ่งรูปเท่า ๆ กัน), 3.NF.A.1 (unit fractions และ a/b), 3.NF.A.2a/b (number line), 3.NF.A.3a–d (equivalence, whole numbers as fractions, compare)
- **Hero activity:** **`riddle-code`** ("Why did the monster eat the number line? …" แก้โจทย์ → ได้ตัวอักษร) 2–3 หน้า no-prep ภาพ thumbnail ชัด ส่วนตัวสำรองคือ `mystery-number` ("Which monster am I?" ให้คำใบ้เรื่องเศษส่วน)
- **กิจกรรมที่ผสม (≥3 หมวด):** A: `draw-model` (แบ่งรูป, วาด number line), `cut-paste` (วางมอนสเตอร์บนเส้นจำนวน), `sort` (equivalent หรือไม่) · B: `riddle-code` · E: `spot-mistake` (มอนสเตอร์แบ่งไม่เท่ากัน), `always-sometimes-never` ("A fraction with a bigger denominator is bigger.") · F: `exit-ticket`, `self-assess`
- **ธีมที่แนะนำ:** `doodle-notebook` (ลายเส้นมอนสเตอร์แบบสมุดวาดเล่น ประหยัดหมึก) ส่วน `clean-minimal` เป็นตัวสำรองถ้าต้องการให้ดูโตขึ้นสำหรับ ป.4
- **ทำไมชนะได้:** (1) ชุดคู่แข่งหลายชิ้นเล็กหรือเจาะทักษะเดียว เช่น [Print & Go 3.NF.A.2 แบบ 4 หน้า](https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Print-Go-Pack-for-3NFA2-1544967) และ [5 no-prep worksheets](https://www.teacherspayteachers.com/Product/Fraction-Worksheets-for-3rd-Grade-Equivalent-Fractions-Number-Line-Fractions-8792833) ชุดของเราครบทั้งหน่วย (3.G.A.2→3.NF.A.3) และมีเรื่องราวร้อยทั้งชุด (2) ชุด puzzle/mystery ส่วนใหญ่เป็นแบบ digital หรือ Google Slides/Form หรือเป็นชุด prep สูง (ดูหัวข้อคู่แข่ง) เราจึงขาย "no-prep, print B&W" (3) คุมตัวส่วนให้อยู่ที่ 2, 3, 4, 6, 8 ตามมาตรฐาน ป.3 ขณะที่บางชุดใช้ถึงตัวส่วน 10 ([Fraction Number Lines Worksheet halves through tenths](https://www.teacherspayteachers.com/Product/Fraction-Number-Lines-Worksheet-3NFA2-and-3NFA3-4127484))
- **ราคา:** $5.00 (26–32 หน้า = Standard ตาม style guide) อยู่ในช่วงราคาของคู่แข่งที่เห็น เช่น escape room ธีม monster $5.00, Under the Sea number line mystery $6.00 และ candy factory escape $6.95 (ราคาจาก snippet ยังไม่ยืนยัน)
- **ฤดูกาล:** evergreen ลงขายภายใน ~20–25 พ.ย. 2026 เพื่อเข้า Cyber Monday 30 พ.ย. 2026 ([ShopBack 2026 calendar](https://www.shopback.com/blog/finance/us-cyber-monday-nov-30-vs-black-friday-nov-27-2026-strategy)) ส่วนวัน TPT sale ปี 2026 **ยังไม่ยืนยัน** พีคคือ ม.ค.–เม.ย. 2027

#### #2 Halloween Fractions: Haunted House Escape (ตรงกับคำขอ, series reskin)
- **Working title:** *Halloween Fractions Activities | Haunted House Escape Room | 3rd & 4th Grade Number Lines, Equivalent & Comparing Fractions | Printable No Prep*
- **คอนเซปต์:** บ้านผีสิง 5 ห้อง แต่ละห้องล็อกด้วยรหัสเศษส่วน (ห้องครัวของแม่มด: แบ่งพาย 3.G.A.2 → ห้องค้างคาว: unit fractions → บันไดผี: number line → ห้องกระจก: equivalent fractions → ห้องใต้หลังคา: compare) ใช้ตัวละครคนละชุดกับ #1 (เช่น ผีน้อย Boo-Crew) เพื่อให้ผ่านกติกา reskin
- **มาตรฐาน:** 3.NF.A.1, 3.NF.A.2, 3.NF.A.3 (เน้น a, b, d) และ 3.G.A.2
- **Hero activity:** **`escape-room`** (printable, 1 หน้าต่อด่าน + recording sheet) เปลี่ยน hero จาก `riddle-code` ของ #1 ตามกติกา series ส่วนกิจกรรมเสริมคือ `color-by-code` แบบ ink-saving 1 หน้า และ `word-problems`
- **ธีมที่แนะนำ:** `adventure-quest` (ภารกิจ/แผนที่ เหมาะกับ escape)
- **ทำไมชนะได้:** (1) search ไม่พบ Halloween escape room แบบ printable ที่เจาะ number line และ comparing ของ ป.3 พบแต่ escape room เศษส่วนแบบไม่ผูกเทศกาลหรือแบบ digital ([search: fractions escape room](https://www.teacherspayteachers.com/browse?search=fractions+escape+room)) (2) Halloween fractions หลายชิ้นเป็นของ ป.4–6 (operations) หรือเป็น craft/color-by-number ([search: halloween fractions worksheets](https://www.teacherspayteachers.com/browse?search=halloween+fractions+worksheets)) (3) ไม่พบ cut-and-paste mystery ของ Halloween ที่เจาะ 3.NF.A.3 comparison (ตาม snippet การค้นหา)
- **ราคา:** $4.50 (18–22 หน้า) เทียบกับ Payhip Halloween color-by-code 10 แผ่นที่ $4.99 ([Payhip](https://payhip.com/b/SvE0P)) และ WeAreTeachers Halloween math bundle ที่ $9.99 ([WeAreTeachers](https://www.weareteachers.com/product/halloween-math-worksheets-and-activities-bundle/))
- **ฤดูกาล:** สร้างหลังจาก #1 ขายได้แล้ว (ช่วง มี.ค.–ก.ค. 2027) และ**ลงขาย ~10 ส.ค.–1 ก.ย. 2027** โปรโมตให้จบก่อน ~22 ต.ค. 2027 **ไม่แนะนำให้ลงตอนนี้** (ดูตัวเลือก A)

#### #3 Winter Fractions on a Number Line (series)
- **Working title:** *Winter Fractions on a Number Line Worksheets & Mazes | 3rd Grade 3.NF.A.2 | No Prep*
- **คอนเซปต์:** "Snowy Trail" เดินตามรอยเท้าบนเส้นจำนวนเพื่อไปถึงกระท่อม หลีกเลี่ยงคำว่า Christmas เพื่อให้ขายได้ตลอด ม.ค.–ก.พ.
- **มาตรฐาน:** 3.NF.A.2a/b (หลัก) + 3.NF.A.3a, 3.NF.A.3c (equivalent และ whole numbers บนเส้นจำนวน)
- **Hero activity:** **`maze`** (answer maze บนเส้นจำนวน) + `missing-digits`/`fill-in`, `four-in-row` ส่วนตัวสำรองคือ `spin-solve`
- **ธีมที่แนะนำ:** `clean-minimal` (โทนฟ้า/เทา)
- **ทำไมชนะได้:** search แบบจำกัดโดเมน TPT ไม่พบชุด worksheet ที่ติดป้ายธีม winter ชัด ๆ สำหรับ number line ของ ป.3 พบเพียง task card snowman ฟรี 6 ใบและ [Christmas Fractions on a Number Line Maze](https://www.teacherspayteachers.com/Product/Christmas-Fractions-on-a-Number-Line-Maze-3rd-Grade-No-Prep-Math-Game-17816671) (ผลจาก snippet ยังไม่ครบทุกหน้า)
- **ราคา:** $4.00 (14–18 หน้า)
- **ฤดูกาล:** ถ้าจะทำ ให้ลงขายภายในกลาง ธ.ค. 2026 เพื่อรับช่วง ม.ค.–ก.พ. 2027 (Fort Bend เริ่มเศษส่วน 3 ม.ค.) แต่ชนกับ #1 ในกติกา 30 ชิ้น จึงต้องลงเป็น series และเปลี่ยน hero/ธีม/บริบท

#### #4 Fraction Face-Off: Comparing Fractions Reasoning Pack (evergreen)
- **Working title:** *Comparing Fractions with Same Numerator or Same Denominator Worksheets & Game | 3rd Grade 3.NF.A.3d*
- **คอนเซปต์:** "Fraction Face-Off" แข่งร้านเบเกอรี่ (พาย บราวนี่ วาฟเฟิล) ใครได้ชิ้นใหญ่กว่า เด็กต้อง**อธิบายเหตุผล** (same denominator → more pieces, same numerator → bigger pieces) ไม่ได้แค่เติม < > =
- **มาตรฐาน:** 3.NF.A.3d (หลัก), 3.NF.A.1, 3.NF.A.2 (ใช้ number line เป็นหลักฐาน)
- **Hero activity:** **`four-in-row`** (เกม 2 คน no-prep) + `would-you-rather` ("Would you rather have 3/8 or 3/4 of a pizza?"), `spot-mistake`, `quick-check`
- **ธีมที่แนะนำ:** `garden-calm`
- **ทำไมชนะได้:** คู่แข่งที่เห็นเน้นการเติมสัญลักษณ์ เช่น [Comparing Fractions on a Number Line Set (40 questions)](https://www.teacherspayteachers.com/Product/Comparing-Fractions-on-a-Number-Line-Math-Worksheet-Set-1115043) และ [Comparing Fractions with Visual Models 3.NF.3D](https://www.teacherspayteachers.com/Product/Comparing-Fractions-on-a-Number-Line-with-Visual-Models-Worksheets-3NF3D-7623587) ช่องว่างคือ "justify" ตามที่มาตรฐาน 3.NF.A.3d กำหนด
- **ราคา:** $4.00
- **ฤดูกาล:** evergreen + ช่วง test prep (มี.ค.–เม.ย.) **แข่งสูง** จึงจัดเป็นอันดับหลัง

> **Series roadmap (ทางเลือก):** `fraction-monsters` → #1 (ทั้งปี) → #3 Winter → Valentine's (คู่แข่งมีอยู่แล้ว: [search valentines fractions](https://www.teacherspayteachers.com/browse?search=valentines%20fractions)) → #2 Halloween (ส.ค. 2027) → growing bundle ราคาลด 20–30% ตาม style guide

## คู่แข่งที่น่าสนใจ (พร้อมลิงก์)
> ข้อมูลทั้งหมดมาจาก search snippet ยังไม่ได้เปิดหน้าจริง ช่องที่ไม่มีราคาหรือรีวิวแปลว่า snippet ไม่ได้ระบุ

**Halloween fractions**
| สินค้า | รายละเอียดตาม snippet | ข้อสังเกต |
|---|---|---|
| [Halloween Fractions Worksheets: Write/Shade/Compare](https://www.teacherspayteachers.com/Product/Halloween-Fractions-Worksheets-WriteShade-Compare-Fractions-Math-Practice-14648169) | ป.3–4: identify numerator/denominator, shade, match, compare <>= | **คู่แข่งตรงที่สุด** แต่ snippet ไม่ได้พูดถึง number line, puzzle หรือ escape |
| [FREE Halloween Witches' Brew Fraction Math](https://www.teacherspayteachers.com/Product/FREE-Halloween-Math-Activity-Witches-Brew-Fraction-Math-No-Prep-Worksheets-160789) | ฟรี, ป.3–6, รวมการคูณ/หาร | ของฟรีที่แย่งความสนใจ |
| [Halloween Color By Number: Fractions, Decimals, Multiplication](https://www.teacherspayteachers.com/Product/Halloween-Color-By-Number-Fractions-Decimals-Multiplication-8674313) | color by number หลายทักษะ | ออกไปทาง ป.4–5 |
| [Adding & Subtracting Fractions Halloween Color by Number (Gr 5–6)](https://www.teacherspayteachers.com/Product/Adding-Subtracting-Fractions-Halloween-Color-by-Number-14632185) | ป.5–6 | แสดงว่า Halloween fractions เอียงไปทาง ป.ปลาย |
| [search: halloween equivalent fractions](https://www.teacherspayteachers.com/browse?search=halloween+equivalent+fractions) | mummy craft (tag 3.NF.A.3a/b), candy corn matching, board games 3 แบบ ป.3–4, free color-by-fractions 5 แผ่น | craft/เกมเยอะ ส่วนใบงานที่ครบหน่วยมีน้อย |
| [search: fraction halloween activities](https://www.teacherspayteachers.com/browse?search=fraction+halloween+activities) | cut & paste mystery picture bundle (3.NF.A.1, 3.NF.A.2) | ใกล้กับ #2 แต่ไม่ครอบคลุม 3.NF.A.3 |
| [search: fraction worksheets halloween](https://www.teacherspayteachers.com/Browse/Search:fraction%20worksheets%20halloween) | ชุด ป.4 แบบ 12 แผ่น (number line, visual models, comparison) | ป.4 ไม่ใช่ ป.3 |
| [4th Grade Halloween Math Review Packet](https://www.teacherspayteachers.com/Product/4th-Grade-Halloween-Math-Worksheets-Review-Packet-Morning-Work-Early-Finish-2131837) | spiral review หลายเรื่อง + mystery picture + riddle | แสดงว่าครู ป.4 ซื้อ Halloween review |
| นอก TPT: [Super Teacher Worksheets](https://www.superteacherworksheets.com/printable-pdf-worksheets/math/49629-Halloween-Fraction-Word-Problems), [Education.com](https://www.education.com/resources/fractions/halloween/), [TES Halloween fraction task cards](https://www.tes.com/teaching-resource/identifying-fractions-of-a-whole-task-cards-halloween-12193589), [TeachShare 3rd grade Halloween](https://teachshare.com/browse/grade-3/halloween/price_asc) | มีของฟรี/ราคาถูก และงานที่ทำด้วย AI บน TeachShare | ใบงานทั่วไปแข่งด้วยราคาไม่ได้ |

**3rd grade fractions (evergreen) / Puzzle / Escape**
| สินค้า | รายละเอียดตาม snippet |
|---|---|
| [Fractions on a Number Line – 3rd Grade Print & Go Pack 3.NF.A.2](https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Print-Go-Pack-for-3NFA2-1544967) | 4 หน้า ตัวส่วน 2/3/4/6/8 |
| [Fraction Worksheets for 3rd Grade: Equivalent, Number Line](https://www.teacherspayteachers.com/Product/Fraction-Worksheets-for-3rd-Grade-Equivalent-Fractions-Number-Line-Fractions-8792833) | 5 แผ่น no-prep |
| [3rd Grade Fractions Worksheets Identify Equivalent Comparing Number Lines](https://www.teacherspayteachers.com/Product/3rd-Grade-Fractions-Worksheets-Identify-Equivalent-Comparing-Number-Lines-Math-2196272) | 20 แผ่น (3.NF.2, 3.NF.3) **คู่แข่งตรงกับ #1** |
| [3rd Grade Fractions Worksheets – Unit Fractions, Equivalent and more](https://www.teacherspayteachers.com/Product/3rd-Grade-Fractions-Worksheets-Unit-Fractions-Equivalent-Fractions-and-more-9865330) | – |
| [3rd Grade Fractions on a Number Line – 10 worksheets](https://www.teacherspayteachers.com/Product/3RD-GRADE-FRACTIONS-ON-A-NUMBER-LINE-10-Skills-Boosting-Practice-Worksheets-4376966) | 10 แผ่น 3.NF.A.2 |
| [Fractions on a Number Line 3rd Grade Worksheets Games Activities Review](https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Fractions-on-Number-Lines-3NF2-2352897) | – |
| [Equivalent & Comparing Fractions 3rd Grade Escape Room](https://www.teacherspayteachers.com/Product/Equivalent-Fractions-Comparing-Fractions-3rd-Grade-Math-Escape-Room-Activity-8001751) | escape room ไม่ผูกเทศกาล |
| [Under the Sea 3rd Grade Math Mystery: Fractions on Number Lines](https://www.teacherspayteachers.com/Product/3rd-Grade-Ocean-Math-Mystery-Fractions-on-Number-Lines-Math-Activities-9135179) | ~$6.00, มีแบบ 3 และ 5 clues + Google Slides |
| [Basic Fractions Unlock the Box (Teach Without Tears)](https://www.teacherspayteachers.com/Product/Basic-Fractions-Unlock-the-Box-A-Fun-Math-Mystery-3569704) | escape/mystery |
| [Simplifying Fractions Math Mystery 3rd Grade (Easier)](https://www.teacherspayteachers.com/Product/Simplifying-Reducing-Fractions-Math-Mystery-Game-3rd-Grade-Easier-Edition-3432396) | ~$4.50, 5 clues |
| [Math Mystery Fraction Parts of Whole – 3rd Grade Color Sheets](https://www.teacherspayteachers.com/Product/Math-Mystery-Fraction-Parts-of-Whole-Fraction-Activities-3rd-Grade-Color-Sheets-2317918) | mystery picture |
| [search: fractions escape room](https://www.teacherspayteachers.com/browse?search=fractions+escape+room) | candy factory (3.NF.A.1 + 3.G.A.2) ~$6.95, monster-themed "Cracking the Classroom Code" ~$5.00, submarine Google Form ~$4.99 |
| [Catch the Monsters! Equivalent Fraction Game](https://www.teacherspayteachers.com/Product/Catch-the-Monsters-An-Equivalent-Fraction-Game-1722129) | เกมทอยลูกเต๋า 3.NF.A.3 ธีม monster |
| [TEKS 3.3F/3.3G/3.3H Fractions: Equivalency and Comparisons](https://www.teacherspayteachers.com/Product/TEKS-33f-33g-33h-Fractions-Equivalency-and-Comparisons-2255947) | กลุ่มครู Texas |

## จุดอ่อนของคู่แข่ง / สิ่งที่ครูบ่นในรีวิว
> **เปิดหน้ารีวิวบน TPT ไม่ได้** ข้อด้านล่างจึงเป็นช่องว่างที่อ่านได้จาก**คำอธิบายใน snippet** ไม่ใช่คำบ่นจากรีวิวจริง ควรตรวจซ้ำเมื่อเข้า TPT ได้
1. **Halloween fractions เอียงไปทาง ป.4–6** (operations ของเศษส่วนต่างตัวส่วน, ทศนิยม, การคูณ) ชุดที่ตรงมาตรฐาน ป.3 และครอบคลุม number line กับ comparing ในชุดเดียวมีน้อย ([halloween fractions worksheets](https://www.teacherspayteachers.com/browse?search=halloween+fractions+worksheets), [fraction worksheets halloween](https://www.teacherspayteachers.com/Browse/Search:fraction%20worksheets%20halloween))
2. **ชุดเล็กหรือแยกทักษะ:** 4–5 แผ่นต่อชุด ([ตัวอย่าง 1](https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Print-Go-Pack-for-3NFA2-1544967), [ตัวอย่าง 2](https://www.teacherspayteachers.com/Product/Fraction-Worksheets-for-3rd-Grade-Equivalent-Fractions-Number-Line-Fractions-8792833)) ครูต้องซื้อหลายชิ้น
3. **Puzzle/escape จำนวนมากเป็นแบบ digital** (Google Slides/Forms) หรือต้อง prep ([fractions escape room search](https://www.teacherspayteachers.com/browse?search=fractions+escape+room)) ช่องว่างจึงเป็น **printable, no-prep, ขาวดำ**
4. **ตัวส่วนเกินมาตรฐาน ป.3:** บางชุดใช้ถึงตัวส่วน 10 ([ตัวอย่าง](https://www.teacherspayteachers.com/Product/Fraction-Number-Lines-Worksheet-3NFA2-and-3NFA3-4127484)) ขณะที่ CCSS ป.3 และ TEKS จำกัดที่ 2, 3, 4, 6, 8 ([Brenham/Texas snippet ผ่าน TEKS unpacked](https://tx01918778.schoolwires.net/cms/lib/TX01918778/Centricity/domain/2184/elementary%20math%20documents/Grade%20Three%20unpacked%20TEKS.pdf)) ใช้เป็นจุดขาย "100% grade-3 aligned denominators" ได้
5. **Color-by-number ใช้หมึกมาก:** วิจัยชิ้นแรกพบว่า "black line" ถูกยกเป็นจุดขาย ([Turkey Math black line](https://www.teacherspayteachers.com/Product/Thanksgiving-Turkey-Math-2-Digit-Subtraction-With-Regrouping-black-line-1544243))
6. **การเปรียบเทียบไม่ค่อยให้ "justify":** ส่วนใหญ่เป็น <>= ล้วน ([comparing fractions in third grade](https://www.teacherspayteachers.com/browse?search=comparing+fractions+in+third+grade)) ทั้งที่ 3.NF.A.3d กำหนดให้ "justify the conclusions" (อนุมาน)
7. **ของฟรีเยอะ:** เช่น Witches' Brew, free color by fractions และ free pumpkin compare ([free pumpkin fractions](https://www.teacherspayteachers.com/browse/free?search=pumpkin+fractions)) สินค้าเสียเงินต้องชนะด้วยความครบ, puzzle และคุณภาพ answer key

## คีย์เวิร์ดหลัก & คีย์เวิร์ดรอง
> แหล่งที่มาคือหน้า `browse?search=` ที่ search engine เก็บไว้ (เป็นสัญญาณว่ามีคนค้นจริง) **ไม่มีตัวเลข search volume**

**#1 Fraction Monsters (หลัก)**
- 3rd grade fractions worksheets
- fractions on a number line worksheets 3rd grade
- equivalent fractions worksheet third grade
- comparing fractions in third grade
- monster fractions

**#1 (รอง / long-tail)**
- unit fractions / fractions no prep 3rd grade / fractions mystery picture / math mystery fractions / fractions number line puzzle / fractions on a number line games / comparing fractions on a number line worksheet / partitioning shapes equal parts / 3.NF.A.2 / 3.NF.A.3

**#2 Halloween (หลัก → รอง)**
- halloween fractions worksheets, halloween equivalent fractions, fraction halloween activities
- halloween math 3rd grade, halloween escape room math, fractions escape room, candy corn math, mummy math, halloween math worksheets third grade

**#3 Winter:** winter fractions, fractions on a number line maze, fractions on a number line worksheets 3rd grade
**#4 Comparing:** comparing fractions same numerator same denominator, comparing fractions with pictures, comparing fractions on a number line worksheet, 3.NF.A.3d
**อื่น ๆ (series):** valentines fractions, valentine day math fractions on a number line, thanksgiving pie fractions

## มาตรฐานหลักสูตรที่เกี่ยวข้อง
> เปิด thecorestandards.org ไม่ได้ในรอบนี้ ข้อความด้านล่างสรุปจากความรู้มาตรฐานและ snippet ([cpalms MAFS.3.NF.1.3](https://cpalms.org/PreviewStandard/Preview/5369), [IM Unit 5](https://curriculum.illustrativemathematics.org/k5/teachers/grade-3/unit-5/lessons.html)) **ให้ curriculum-designer ตรวจข้อความเต็มที่ [CCSS 3.NF](https://www.thecorestandards.org/Math/Content/3/NF/) ก่อนใส่ใน listing**

**CCSS (ป.3) ตัวส่วนจำกัดที่ 2, 3, 4, 6, 8**
- **3.G.A.2** แบ่งรูปเป็นส่วนที่มีพื้นที่เท่ากัน และบอกพื้นที่แต่ละส่วนเป็น unit fraction
- **3.NF.A.1** 1/b คือ 1 ส่วนจาก b ส่วนเท่ากัน และ a/b คือ a ส่วนขนาด 1/b
- **3.NF.A.2** เศษส่วนเป็นจำนวนบนเส้นจำนวน (a: วาง 1/b, b: วาง a/b)
- **3.NF.A.3** equivalence และ compare (a: เท่ากันถ้าเป็นจุดเดียวกันบนเส้นจำนวน, b: สร้าง equivalent อย่างง่าย, c: จำนวนเต็มเป็นเศษส่วน, d: เปรียบเทียบที่ตัวเศษหรือตัวส่วนเท่ากัน ใช้ <, >, = และ justify ด้วย visual model)

**TEKS (Texas) ป.3:** 3.3A–3.3H (fractions) โดย 3.3F/3.3G/3.3H คือ equivalence และ comparison ([ตัวอย่างสินค้าที่ tag](https://www.teacherspayteachers.com/Product/TEKS-33f-33g-33h-Fractions-Equivalency-and-Comparisons-2255947), [Grade Three unpacked TEKS](https://tx01918778.schoolwires.net/cms/lib/TX01918778/Centricity/domain/2184/elementary%20math%20documents/Grade%20Three%20unpacked%20TEKS.pdf)) **ข้อความเต็มต้องตรวจซ้ำ** ถ้าจะใส่ TEKS ใน listing

**Florida (B.E.S.T.):** ใช้รหัส MA.3.FR.x แทน MAFS เดิม ([cpalms](https://cpalms.org/PreviewStandard/Preview/5369) ระบุว่า MAFS.3.NF.1.3 เป็น Archived Standard) **ยังไม่ได้ตรวจรหัสใหม่** อย่าใส่จนกว่าจะยืนยัน

## ช่วงเวลาที่ควรลงขาย
| ช่วง | การกระทำ |
|---|---|
| 11–22 พ.ย. 2026 | สร้าง **#1 Fraction Monsters** → QA → listing |
| **ไม่เกิน ~25 พ.ย. 2026** | ลงขาย #1 + freebie 3–5 หน้า (เช่น riddle-code 1 หน้า + exit ticket) |
| 30 พ.ย. 2026 | Cyber Monday ([ShopBack](https://www.shopback.com/blog/finance/us-cyber-monday-nov-30-vs-black-friday-nov-27-2026-strategy)) วัน TPT sale ปี 2026 **ยังไม่ยืนยัน** |
| ธ.ค. 2026 | (ทางเลือก) #3 Winter Number Line เป็น series ลงก่อนกลาง ธ.ค. และปัก Pinterest ล่วงหน้าสำหรับ ม.ค. |
| **ม.ค.–เม.ย. 2027** | พีคการสอนเศษส่วน ป.3 (pacing guide: FBISD 3 ม.ค.–17 ก.พ., Orange NJ ปลาย ม.ค.–ต้น เม.ย.) โปรโมต #1 / #4 |
| มี.ค.–ก.ค. 2027 | สร้าง **#2 Halloween Haunted House Escape** (reskin จาก engine #1) |
| **~10 ส.ค.–1 ก.ย. 2027** | ลงขาย #2 Halloween (4–6 สัปดาห์ก่อนพีคการค้นหา ปลาย ก.ย.–ต.ค.) |
| ก.ย.–~22 ต.ค. 2027 | โปรโมต Halloween (ฮาโลวีน 31 ต.ค. 2027 = วันอาทิตย์ ปาร์ตี้ในห้องเรียนน่าจะเป็นศุกร์ 29 ต.ค.) |

## แหล่งอ้างอิง
**TPT (ผ่าน search snippet; WebFetch ถูกบล็อก)**
- https://www.teacherspayteachers.com/Product/Halloween-Fractions-Worksheets-WriteShade-Compare-Fractions-Math-Practice-14648169
- https://www.teacherspayteachers.com/Product/FREE-Halloween-Math-Activity-Witches-Brew-Fraction-Math-No-Prep-Worksheets-160789
- https://www.teacherspayteachers.com/Product/Halloween-Color-By-Number-Fractions-Decimals-Multiplication-8674313
- https://www.teacherspayteachers.com/Product/Adding-Subtracting-Fractions-Halloween-Color-by-Number-14632185
- https://www.teacherspayteachers.com/Product/4th-Grade-Halloween-Math-Worksheets-Review-Packet-Morning-Work-Early-Finish-2131837
- https://www.teacherspayteachers.com/Product/Halloween-Monsters-Math-Color-By-Number-Code-Addition-Subtraction-Regrouping-1210414
- https://www.teacherspayteachers.com/browse?search=halloween+fractions+worksheets
- https://www.teacherspayteachers.com/browse?search=halloween+equivalent+fractions
- https://www.teacherspayteachers.com/browse?search=fraction+halloween+activities
- https://www.teacherspayteachers.com/Browse/Search:fraction%20worksheets%20halloween
- https://www.teacherspayteachers.com/browse/free?search=pumpkin+fractions
- https://www.teacherspayteachers.com/Product/Catch-the-Monsters-An-Equivalent-Fraction-Game-1722129
- https://www.teacherspayteachers.com/browse?search=monster+fractions
- https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Print-Go-Pack-for-3NFA2-1544967
- https://www.teacherspayteachers.com/Product/Fraction-Worksheets-for-3rd-Grade-Equivalent-Fractions-Number-Line-Fractions-8792833
- https://www.teacherspayteachers.com/Product/3rd-Grade-Fractions-Worksheets-Identify-Equivalent-Comparing-Number-Lines-Math-2196272
- https://www.teacherspayteachers.com/Product/3rd-Grade-Fractions-Worksheets-Unit-Fractions-Equivalent-Fractions-and-more-9865330
- https://www.teacherspayteachers.com/Product/3RD-GRADE-FRACTIONS-ON-A-NUMBER-LINE-10-Skills-Boosting-Practice-Worksheets-4376966
- https://www.teacherspayteachers.com/Product/Fractions-on-a-Number-Line-3rd-Grade-Fractions-on-Number-Lines-3NF2-2352897
- https://www.teacherspayteachers.com/Product/Fraction-Number-Lines-Worksheet-3NFA2-and-3NFA3-4127484
- https://www.teacherspayteachers.com/Product/Comparing-Fractions-on-a-Number-Line-Math-Worksheet-Set-1115043
- https://www.teacherspayteachers.com/Product/Comparing-Fractions-on-a-Number-Line-with-Visual-Models-Worksheets-3NF3D-7623587
- https://www.teacherspayteachers.com/browse?search=comparing+fractions+in+third+grade
- https://www.teacherspayteachers.com/Product/Equivalent-Fractions-Comparing-Fractions-3rd-Grade-Math-Escape-Room-Activity-8001751
- https://www.teacherspayteachers.com/Product/3rd-Grade-Ocean-Math-Mystery-Fractions-on-Number-Lines-Math-Activities-9135179
- https://www.teacherspayteachers.com/Product/Basic-Fractions-Unlock-the-Box-A-Fun-Math-Mystery-3569704
- https://www.teacherspayteachers.com/Product/Simplifying-Reducing-Fractions-Math-Mystery-Game-3rd-Grade-Easier-Edition-3432396
- https://www.teacherspayteachers.com/Product/Math-Mystery-Fraction-Parts-of-Whole-Fraction-Activities-3rd-Grade-Color-Sheets-2317918
- https://www.teacherspayteachers.com/browse?search=fractions+escape+room
- https://www.teacherspayteachers.com/Product/Christmas-Fractions-on-a-Number-Line-Maze-3rd-Grade-No-Prep-Math-Game-17816671
- https://www.teacherspayteachers.com/Product/TEKS-33f-33g-33h-Fractions-Equivalency-and-Comparisons-2255947
- https://www.teacherspayteachers.com/Product/Thanksgiving-Fractions-Worksheets-Thanksgiving-Math-Activities-1694914
- https://www.teacherspayteachers.com/Product/Thanksgiving-Fractions-957670
- https://www.teacherspayteachers.com/browse?search=thanksgiving+pie+fractions
- https://www.teacherspayteachers.com/browse?search=valentines%20fractions
- https://www.teacherspayteachers.com/Product/Thanksgiving-Turkey-Math-2-Digit-Subtraction-With-Regrouping-black-line-1544243

**นอก TPT (คู่แข่ง/ราคา)**
- https://payhip.com/b/SvE0P
- https://www.weareteachers.com/product/halloween-math-worksheets-and-activities-bundle/
- https://www.twinkl.com/resource/us-t2-m-1996-halloween-fractions-challenge-cards-english-united-states
- https://www.superteacherworksheets.com/printable-pdf-worksheets/math/49629-Halloween-Fraction-Word-Problems
- https://www.education.com/resources/fractions/halloween/
- https://www.tes.com/teaching-resource/identifying-fractions-of-a-whole-task-cards-halloween-12193589
- https://teachshare.com/browse/grade-3/halloween/price_asc

**ฤดูกาล / pacing**
- https://www.katiebrockmeyer.com/blog-1-1/seasonal-mockup-calendar (จากวิจัยชิ้นก่อน)
- https://roxysecondchance.substack.com/p/sell-the-next-season-not-the-current (จากวิจัยชิ้นก่อน)
- https://lindsaybowden.com/seasonal-tpt-products/ (จากวิจัยชิ้นก่อน)
- https://themodernetsysellerpodcast.buzzsprout.com/2605329/episodes/19572111-ep-34-when-should-i-get-my-holiday-items-listed-tips-for-etsy-sellers
- https://www.sellerapp.com/blog/amazon-halloween-guide/
- https://www.thinkwithgoogle.com/_qs/documents/1176/e420f_Halloween_Trend_Infographic_V2_FINAL_1.pdf
- https://blog.google/products-and-platforms/products/search/frightgeist-halloween-trends-2026/
- https://www.shopback.com/blog/finance/us-cyber-monday-nov-30-vs-black-friday-nov-27-2026-strategy
- https://www.fortbendisd.com//cms/lib/TX01917858/Centricity/Domain/6943/Math%20At-A-glance.pdf
- https://www.fortbendisd.com/cms/lib/TX01917858/Centricity/domain/80/grading%20pilot/2022-23%20overviews/Third%20Grade%20Math%20Competencies%2022-23-Grading%20Period%203.pdf
- https://www.orange.k12.nj.us/cms/lib/NJ01000601/Centricity/Domain/26/2018-2019%203rd%20grade%20Module%205.pdf
- https://www.orange.k12.nj.us/cms/lib/NJ01000601/Centricity/Domain/26/2019-20%203rd%20grade%20Module%205%20QSAC%20Revisions.pdf
- https://sites.google.com/sudanisd.net/mrsjohnson/year-at-a-glance
- https://sites.google.com/hebisd.edu/torres-math/4th-6-weeks
- https://curriculum.illustrativemathematics.org/k5/teachers/grade-3/course-guide/scope-and-sequence.html
- https://www.coreknowledge.org/wp-content/uploads/2023/09/CKMath_G3U5_FractionsAsNumbers_TG_W2.pdf

**มาตรฐาน**
- https://www.thecorestandards.org/Math/Content/3/NF/ (ยังไม่ได้เปิด ต้องตรวจซ้ำ)
- https://curriculum.illustrativemathematics.org/k5/teachers/grade-3/unit-5/lessons.html
- https://cpalms.org/PreviewStandard/Preview/5369
- https://tx01918778.schoolwires.net/cms/lib/TX01918778/Centricity/domain/2184/elementary%20math%20documents/Grade%20Three%20unpacked%20TEKS.pdf
