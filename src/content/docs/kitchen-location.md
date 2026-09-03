## Why does this matter?

Location ভুল হলে বাকি সব ঠিক থাকলেও ব্যবসা কষ্ট পাবে: বেশি rent → বেশি break-even; খারাপ delivery coverage → কম order; LPG/exhaust অসম্ভব → kitchen-ই চলবে না।

## Concept

Cloud Kitchen-এ location মানে **customer-facing জায়গা নয়** — এটা operations ও delivery logistics-এর সিদ্ধান্ত। বিচার করো:

- **Delivery radius coverage** — এই বিন্দু থেকে ৩–৫ km-এ কত dense residential/office এলাকা পড়ছে
- **Rent ও deposit** — মাসিক fixed cost-এ সবচেয়ে বড় লাইন
- **LPG** — commercial LPG connection নেওয়া যাবে কিনা
- **Exhaust ও ventilation** — ধোঁয়া বের করার ব্যবস্থা, প্রতিবেশীর আপত্তি
- **Water** — নিরবচ্ছিন্ন potable water
- **Power** — load যথেষ্ট কিনা (fridge, exhaust, appliances)
- **Access** — delivery rider সহজে ঢুকে বেরোতে পারবে, পার্কিং
- **Ground floor** — সিঁড়ি দিয়ে বারবার ওঠা-নামা order time বাড়ায়

## Real-world Example

দুটো unit: (A) main-road ₹22k, কিন্তু পিছনে দুটো বড় apartment cluster; (B) ভেতরের গলি ₹12k, আশেপাশে ফাঁকা। A-এর rent বেশি হলেও তার radius-এ order density অনেক বেশি — per-order fixed cost কম পড়তে পারে। *(Example — নিজের এলাকায় হিসাব করো।)*

## Cloud Kitchen Example

Dipikar Rannghor: ground-floor ১৫০–২৫০ sq-ft, commercial LPG সম্ভব, ৩ km radius-এ অন্তত ৩টা বড় residential pocket, rider access ভালো।

## Hands-on Task

1. ৩টা সম্ভাব্য unit shortlist করো (TODO: *Kitchen location shortlist*)।
2. প্রতিটার জন্য এই টেবিল ভরো:

```
Unit | Rent | Deposit | sq-ft | Floor | LPG সম্ভব? | Exhaust সম্ভব? | Power load | 3km-এ residential density | Rider access | Pros | Cons
```

3. প্রতিটা unit-এর ঠিকানা map-এ বসিয়ে ৩ km circle এঁকে দেখো কতটা লোকালয় ঢাকছে।
4. একটা বেছে নাও, কারণসহ Decision Log-এ লেখো।

## Checklist

- [ ] ৩টা unit-এর তুলনামূলক টেবিল
- [ ] প্রতিটার delivery radius map-এ যাচাই
- [ ] LPG + exhaust feasibility প্রতিটার জন্য confirm
- [ ] চূড়ান্ত সিদ্ধান্ত Decision Log-এ

## Common Mistakes

- সস্তা rent দেখে এমন জায়গা নেওয়া যেখানে order density নেই।
- LPG/exhaust "পরে ব্যবস্থা হবে" ধরে rent agreement সই করা।
- Landlord-কে না জানিয়ে commercial cooking — পরে উচ্ছেদের ঝুঁকি।
- Deposit ও agreement-এর শর্ত (lock-in, notice period) না পড়া।

## Verification

তোমার নির্বাচিত unit-এ LPG ও exhaust দুটোই সম্ভব — এটা লিখিত/মৌখিকভাবে landlord থেকে নিশ্চিত, এবং radius map-এ যথেষ্ট লোকালয় দেখা যাচ্ছে।

## Related Topics

- Cloud Kitchen vs Restaurant
- FSSAI ও GST
- Break-even Basics

---

🎯 **Goal**: এমন location বাছা যেখানে operations সম্ভব ও order density আছে।
🧠 **Learn**: Rent বনাম radius coverage-এর trade-off।
🛠 **Do**: ৩-unit comparison + radius map।
✅ **Verify**: LPG + exhaust feasibility নিশ্চিত।
📝 **Document**: Decision Log + agreement-এর শর্ত নোট।
☐ **TODO**: `একটি practical kitchen layout আঁকা`
