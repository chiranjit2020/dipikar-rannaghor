## Why does this matter?

"মনে হচ্ছে চলছে ভালো" কোনো তথ্য নয়। প্রতিদিন কয়েকটা সংখ্যা না লিখলে তুমি টের পাবে না কখন contribution negative হয়ে গেছে, বা কোন খরচ নিঃশব্দে বেড়েছে।

## Concept — তিন স্তরের tracking

### Daily (৫ মিনিট, প্রতিদিন close-এ)

```
তারিখ
Orders (Zomato / Swiggy আলাদা)
Gross sales
Discount (নিজের অংশ)
Cancellations / refunds
Complaints (সংখ্যা + কারণ)
আজকের purchase (raw material)
Wastage (₹ আনুমানিক)
```

### Weekly (রবিবার, ১৫ মিনিট)

```
মোট orders, মোট net revenue
গড় AOV
Food cost (সপ্তাহের purchase − closing stock পরিবর্তন)
Packaging cost
Platform commission (payout statement থেকে)
Marketing খরচ
Contribution = Net revenue − সব variable cost
```

### Monthly (P&L)

```
Revenue (net)
 − Food Cost
 − Packaging Cost
 − Platform Cost (commission + ads)
 − Discount (নিজের)
 − Rent
 − Salary
 − Utilities (gas, electric, water, internet)
 − Miscellaneous
 = Profit / Loss
```

Monthly-তে actual break-even orders/day মিলিয়ে দেখো — Break-even Calculator-এর অনুমানের সঙ্গে মেলে?

## Real-world Example

এক kitchen weekly করতে গিয়ে ধরল platform commission তাদের ধারণার চেয়ে ৪% বেশি কাটছে (ads auto-on ছিল)। এক সপ্তাহে ধরা পড়ল বলে ₹হাজার বাঁচল। Monthly-তে ধরলে অনেক দেরি হতো। *(Example।)*

## Cloud Kitchen Example

Dipikar Rannghor একটা simple Google Sheet: Tab 1 Daily, Tab 2 Weekly, Tab 3 Monthly P&L। কোনো fancy software নয় — শুধু নিয়মিত ভরা।

## Hands-on Task

1. একটা sheet বানাও উপরের তিন কাঠামো দিয়ে (বা খাতা)।
2. আজ থেকে **প্রতিদিন** Daily row ভরা শুরু করো — soft launch-এর আগেও (purchase, setup খরচ)।
3. প্রথম রবিবার Weekly করো; platform payout statement মিলিয়ে commission বসাও।
4. মাস শেষে P&L করে Break-even Calculator-এর অনুমানের সঙ্গে মেলাও; পার্থক্য থাকলে কারণ খোঁজো।

## Checklist

- [ ] Daily / Weekly / Monthly sheet তৈরি
- [ ] Daily row প্রতিদিন ভরা হচ্ছে
- [ ] Weekly-তে payout statement মিলিয়ে commission
- [ ] Monthly P&L সম্পন্ন
- [ ] Actual বনাম projected break-even তুলনা

## Common Mistakes

- শুধু gross sales দেখা, net (commission + discount বাদে) নয়।
- Owner-এর নিজের বেতন/সময় fixed cost-এ না ধরা।
- Wastage কখনো না লেখা — এটা নিঃশব্দ leak।
- Payout statement না মেলানো — deduction ধরা পড়ে না।
- মাসে একবার হিসাব — সমস্যা ধরতে ৩০ দিন দেরি।

## Verification

যেকোনো দিন জিজ্ঞাসা করলে তুমি বলতে পারো: গত সপ্তাহের net revenue, contribution, এবং চলতি মাসে তুমি break-even-এর উপরে না নিচে।

## Related Topics

- Break-even Basics
- Food Cost Fundamentals
- Customer & Review Management

---

🎯 **Goal**: প্রতিদিন সংখ্যায় ব্যবসা দেখা।
🧠 **Learn**: Daily / Weekly / Monthly কী track করে।
🛠 **Do**: Sheet তৈরি + Daily ভরা শুরু।
✅ **Verify**: গত সপ্তাহের contribution বলতে পারা।
📝 **Document**: Finance sheet (তিন tab)।
☐ **TODO**: `Break-even calculator-এ নিজের সংখ্যা বসিয়ে break-even orders/day বের করা`
