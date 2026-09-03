## Why does this matter?

Customer শুধু দুটো জিনিস দেখে: খাবার **সময়ে** এল কিনা, আর **গরম ও ঠিকঠাক** এল কিনা। এই দুটো নির্ভর করে order আসার পর kitchen-এ কী হয় তার উপর। Flow পরিষ্কার না থাকলে প্রতিটা busy hour-এ ভুল হবে।

## Concept — একটা order-এর জীবনচক্র

```
Order Received → Accept → KOT / Ticket → Preparation → Cooking
→ Quality Check → Packaging → Handover (rider) → Delivered → Review
```

প্রতিটা stage-এ চারটে জিনিস ঠিক করে রাখো:

| Stage | Responsibility | Expected time | সম্ভাব্য failure | Checklist |
| --- | --- | --- | --- | --- |
| Accept | Order handler | < 60 sec | দেরিতে accept → auto-cancel, rating ↓ | Item stock আছে? |
| KOT | Order handler | সঙ্গে সঙ্গে | ভুল item/qty লেখা | Add-on, special note পড়া |
| Preparation | Prep station | 2–4 min | Base gravy শেষ | Prep par-level maintained |
| Cooking | Cook | dish অনুযায়ী | Under/over portion | গ্রামে মেপে plating |
| Quality Check | Cook/QC | 20–30 sec | Leak-prone lid, কম raita | Temp, portion, add-on, seal |
| Packaging | Packer | 30–60 sec | ভুল bag, label নেই | Correct combo, cutlery, tissue |
| Handover | Packer | rider আসার সাথে | ভুল rider-কে দেওয়া | Order ID mismatch check |
| Review | Owner (পরে) | দিন শেষে | Pattern মিস করা | Negative review → SOP fix |

## Real-world Example

একটা kitchen-এ প্রতি সন্ধ্যায় ২–৩টা "wrong add-on" complaint আসছিল। KOT-তে add-on আলাদা লাইনে হাইলাইট করা শুরু করতেই সেটা প্রায় শূন্যে নামল। ছোট process বদল, বড় rating প্রভাব। *(Example।)*

## Cloud Kitchen Example

Dipikar Rannghor-এ ২ জন লোক: একজন cook (prep + cooking + QC), একজন packer + order handler + handover। Peak hour-এ কে কী করবে সেটা লিখে দেয়ালে টাঙানো।

## Hands-on Task

1. উপরের টেবিলটা নিজের menu ও লোকবল দিয়ে আবার লেখো — কে কোন stage সামলাবে।
2. প্রতিটা stage-এর জন্য একটা "expected time" ধরো, যোগ করে দেখো total prep-to-handover time কত।
3. এই total কি platform-এর expected time-এর মধ্যে? না হলে কোথায় কমাবে?
4. একটা কাগজে "Peak Hour Roles" লিখে kitchen-এ টাঙাও।

## Checklist

- [ ] প্রতিটা stage-এ responsibility assign করা
- [ ] Total prep-to-handover time হিসাব করা
- [ ] QC step-এ কী কী দেখা হবে লেখা (temp, portion, seal, add-on)
- [ ] "Peak Hour Roles" শিট kitchen-এ টাঙানো
- [ ] Handover-এ order ID mismatch check নিয়ম

## Common Mistakes

- Accept করতে দেরি → auto-cancellation ও rating ক্ষতি।
- QC step না রাখা → leak, কম portion, ভুল add-on সরাসরি customer-এ।
- এক জনের উপর সব stage — peak-এ ভেঙে পড়ে।
- Handover-এ order মিলিয়ে না দেখা → ভুল customer-এ ভুল খাবার।

## Verification

তুমি stopwatch ধরে ৩টা mock order চালিয়ে দেখেছ prep-to-handover time platform-এর সীমার মধ্যে থাকছে।

## Related Topics

- SOP System
- Menu Engineering Basics
- Customer & Review Management

---

🎯 **Goal**: order আসার পর প্রতিটা ধাপ পরিষ্কার।
🧠 **Learn**: Stage-wise responsibility, time, failure, check।
🛠 **Do**: নিজের flow লেখা + mock order timing।
✅ **Verify**: Total time platform-সীমার ভেতরে।
📝 **Document**: "Peak Hour Roles" শিট।
☐ **TODO**: `২–৩ ধরনের packaging test করে score করা`
