## Why does this matter?

Food Cost না জানলে তুমি জানো না প্রতিটা order থেকে আসলে কত টাকা থাকছে। "বিক্রি ভালো হচ্ছে" অথচ মাস শেষে টাকা নেই — প্রায় সবসময় এর কারণ food cost আর platform cost হিসাবের বাইরে ছিল।

## Concept

**Food Cost** = একটা dish বানাতে যত ingredient লাগে তার টাকা (শুধু কাঁচামাল)।

**Food Cost %** = (Food Cost ÷ Selling Price) × 100

Cloud Kitchen-এ শুধু food cost নয়, প্রতিটা order থেকে আরও কাটে:

```
Selling Price (menu price)
  − Platform commission (%)         ← Zomato/Swiggy, পরিবর্তনশীল
  − Packaging cost
  − Ingredient (food) cost
  − Variable overhead (gas ইত্যাদি, আনুমানিক)
  = Contribution / order
```

এই **Contribution**-ই fixed cost (rent, salary) মেটায় ও লাভ তৈরি করে।

## Worked Example (Hypothetical — তোমার দাম বসাও)

Chicken Biryani (1 plate):

```
Ingredient        Quantity   Price (₹/kg বা unit)   Cost
Chicken           180 g      ₹240/kg                ₹43.2
Basmati rice      150 g      ₹120/kg                ₹18.0
Onion             80 g       ₹40/kg                 ₹3.2
Oil / ghee        30 g       ₹200/kg                ₹6.0
Spices + curd     —          —                      ₹9.0
Egg + garnish     —          —                      ₹8.0
--------------------------------------------------------
Total Food Cost                                     ₹87.4
```

ধরা যাক:

```
Selling Price (menu)          ₹199
Platform commission @ 22%     −₹43.8      (Example %, নিজেরটা verify করো)
Packaging                     −₹12.0
Food Cost                     −₹87.4
Variable overhead (gas)       −₹6.0
--------------------------------------
Contribution / order          ₹49.8
Food Cost %                   ~44%  (87.4 / 199)
```

এই ৪৪% Food Cost % বেশি — দেখতে হবে portion, ingredient sourcing, বা price adjust করা যায় কিনা।

## Cloud Kitchen Example

Dipikar Rannghor প্রতিটা menu item-এর জন্য এই sheet রাখবে এবং **নিজের supplier price** বসাবে — বাজারদর বদলালে sheet আপডেট।

## Hands-on Task

1. Calculators → **Food Cost Calculator** খোলো।
2. তোমার hero dish-এর প্রতিটা ingredient, পরিমাণ (গ্রামে) ও দাম বসাও।
3. Menu price, packaging cost ও (আনুমানিক) platform commission % দাও।
4. Contribution ও Food Cost % দেখো। ৩০–৩৫%-এর অনেক বেশি হলে — portion / sourcing / price নিয়ে ভাবো।
5. সব hero dish-এর জন্য একই কাজ করো, একটা master sheet-এ রাখো।

## Checklist

- [ ] সব ingredient গ্রামে মাপা (আন্দাজে নয়)
- [ ] নিজের supplier-এর দাম ব্যবহার করা
- [ ] Packaging cost যোগ করা
- [ ] Platform commission % (আনুমানিক) যোগ করা
- [ ] প্রতিটা hero dish-এর Contribution ও Food Cost % লেখা

## Common Mistakes

- শুধু food cost দেখা, packaging ও commission বাদ দেওয়া।
- "চোখের আন্দাজে" ingredient — তাহলে food cost মানে নেই।
- একবার হিসাব করে ভুলে যাওয়া — বাজারদর বদলায়।
- Discount-কে হিসাবে না ধরা (₹199-তে ₹50 off মানে contribution আরও কমে)।

## Verification

তুমি এক লাইনে বলতে পারছ: "আমার Chicken Biryani-তে প্রতি order-এ contribution ≈ ₹___ এবং Food Cost % ≈ ___%।"

## Related Topics

- Menu Engineering Basics
- Break-even Basics
- Competitor Research

---

🎯 **Goal**: প্রতিটা dish-এর প্রকৃত contribution জানা।
🧠 **Learn**: Food Cost %, commission, packaging একসাথে হিসাব।
🛠 **Do**: Food Cost Calculator-এ নিজের সংখ্যা বসানো।
✅ **Verify**: Per-order contribution লেখা।
📝 **Document**: Master food-cost sheet।
☐ **TODO**: `প্রতিটি menu item-এর food cost ও Food Cost % হিসাব করা`
