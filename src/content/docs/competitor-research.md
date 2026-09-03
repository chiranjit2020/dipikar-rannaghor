## Why does this matter?

Menu ও price তুমি "মন থেকে" ঠিক করলে সেটা বাজারের সঙ্গে মিলবে না। তোমার এলাকার customer ইতিমধ্যে কোথা থেকে, কত টাকায়, কী খাচ্ছে — সেটাই তোমার শুরুর reference।

## Concept

Competitor research মানে শুধু "কে কে আছে" দেখা নয়। তুমি খুঁজছ:

1. **Price band** — একই dish কত থেকে কত টাকায় বিক্রি হচ্ছে
2. **Rating ও review pattern** — মানুষ কী নিয়ে খুশি, কী নিয়ে অভিযোগ
3. **Menu size** — কে ছোট menu-তে ভালো করছে
4. **Best-sellers** — platform-এ "Bestseller" tag কাদের কোন dish-এ
5. **Market gap** — কেউ যা দিচ্ছে না, অথচ চাহিদা আছে

## Real-world Example

একটা এলাকায় ১২টা biryani seller, সবাই ₹160–260 band-এ, প্রায় সবার রিভিউতে "কম raita / packaging leak" অভিযোগ। এখানে gap স্পষ্ট: **consistent packaging + always includes raita** — এটাই differentiation হতে পারে। *(Example।)*

## Cloud Kitchen Example

Dipikar Rannghor top 5 competitor-এর দুর্বলতা (দেরি, ঠান্ডা খাবার, portion কম) লিখে রেখে সেগুলোকেই নিজের SOP-তে "must-fix" বানাবে।

## Hands-on Task — ২০টা competitor

তোমার এলাকার Zomato **ও** Swiggy খুলে delivery address দাও। এই টেবিলটা ভরো (TODO: *নিজের এলাকার ২০টি competitor analyse করা*):

```
নং | Restaurant | Cuisine | Signature dish | Price | Rating | রিভিউ সংখ্যা | Menu size | Bestseller tag | সাধারণ অভিযোগ
1  | ...
...
20 | ...
```

তারপর:

- সব price নিয়ে **min / median / max** বের করো → তোমার price এই band-এ থাকা উচিত।
- সব "সাধারণ অভিযোগ" একসাথে দেখো → বারবার কোন শব্দ আসছে? সেটাই **gap**।
- Top 5 (rating × রিভিউ সংখ্যা) আলাদা করো → এরাই আসল প্রতিযোগী।

## Checklist

- [ ] ২০টা সারি ভরা (Zomato + Swiggy দুটো থেকেই)
- [ ] Price-এর min/median/max বের করা
- [ ] ৩টা market gap লেখা
- [ ] Top 5 competitor ও তাদের weakness চিহ্নিত

## Common Mistakes

- শুধু rating দেখা, রিভিউ সংখ্যা না দেখা (৪.৯ rating কিন্তু ৭টা রিভিউ = তথ্য নয়)।
- নিজের পছন্দের এলাকার বাইরের competitor ধরা — delivery radius-এর বাইরের data অপ্রাসঙ্গিক।
- Screenshot না রাখা — price/menu পরে বদলে যায়, তখন তুলনা করা যায় না।

## Verification

তোমার হাতে একটা ২০-সারির matrix আছে এবং তুমি এক বাক্যে বলতে পারছ "আমার এলাকায় সবচেয়ে বড় gap হলো ___"।

## Related Topics

- Cloud Kitchen vs Restaurant
- Food Cost Fundamentals
- Menu Engineering

---

🎯 **Goal**: বাজারের বাস্তব price ও gap জানা।
🧠 **Learn**: Rating নয়, pattern পড়তে হয়।
🛠 **Do**: ২০-সারির competitor matrix।
✅ **Verify**: এক-বাক্যের gap statement।
📝 **Document**: Matrix + screenshots সংরক্ষণ।
☐ **TODO**: `Competitor matrix থেকে ৩টি market gap লেখা`
