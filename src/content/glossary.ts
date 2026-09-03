import type { GlossaryTerm } from '../types';

export const glossary: GlossaryTerm[] = [
  {
    id: 'food-cost',
    term: 'Food Cost',
    definition:
      'একটি dish তৈরি করতে যত raw material (ingredient) লাগে তার মোট টাকা। শুধু কাঁচামাল — gas, labour, packaging আলাদা ধরা হয়।',
    related: ['food-cost-pct', 'variable-cost'],
  },
  {
    id: 'food-cost-pct',
    term: 'Food Cost %',
    definition:
      'Selling Price-এর কত শতাংশ ingredient খরচ। সূত্র: (Food Cost ÷ Selling Price) × 100। Cloud Kitchen-এ সাধারণত ২৫–৩৫% লক্ষ্য রাখা হয় (example, নিজের সংখ্যা দিয়ে যাচাই করো)।',
    related: ['food-cost', 'contribution-margin'],
  },
  {
    id: 'aov',
    term: 'AOV',
    full: 'Average Order Value',
    definition:
      'প্রতি order-এ গড়ে কত টাকার বিক্রি হয়। মোট revenue ÷ মোট order সংখ্যা। Combo ও add-on দিয়ে AOV বাড়ানো যায়।',
    related: ['break-even'],
  },
  {
    id: 'break-even',
    term: 'Break-even',
    definition:
      'যে বিক্রির পরিমাণে লাভ-ও নেই, লোকসান-ও নেই — অর্থাৎ মোট contribution ঠিক fixed cost-এর সমান। এর পরের প্রতিটি order থেকে লাভ শুরু।',
    related: ['contribution-margin', 'fixed-cost', 'aov'],
  },
  {
    id: 'contribution-margin',
    term: 'Contribution Margin',
    definition:
      'Selling Price − Variable Cost (ingredient + packaging + platform commission ইত্যাদি)। এই টাকাটাই fixed cost মেটাতে ও লাভ তৈরিতে "contribute" করে।',
    related: ['variable-cost', 'break-even'],
  },
  {
    id: 'gross-revenue',
    term: 'Gross Revenue',
    definition: 'Discount ও commission বাদ দেওয়ার আগের মোট বিক্রি।',
    related: ['net-revenue'],
  },
  {
    id: 'net-revenue',
    term: 'Net Revenue',
    definition:
      'Discount, platform commission ও refund বাদ দেওয়ার পর হাতে আসা প্রকৃত টাকা।',
    related: ['gross-revenue'],
  },
  {
    id: 'fixed-cost',
    term: 'Fixed Cost',
    definition:
      'Order কম হোক বা বেশি — মাসে যে খরচ মোটামুটি একই থাকে: rent, base salary, internet, license amortization।',
    related: ['variable-cost', 'break-even'],
  },
  {
    id: 'variable-cost',
    term: 'Variable Cost',
    definition:
      'প্রতিটি order-এর সঙ্গে বাড়ে এমন খরচ: ingredient, packaging, gas (আংশিক), platform commission, delivery-related charge।',
    related: ['fixed-cost', 'contribution-margin'],
  },
  {
    id: 'sop',
    term: 'SOP',
    full: 'Standard Operating Procedure',
    definition:
      'একটি কাজ সবসময় একইভাবে করার লিখিত ধাপ-নির্দেশ। এতে quality consistent থাকে এবং নতুন লোককে দ্রুত train করা যায়।',
    related: ['recipe-standardization'],
  },
  {
    id: 'recipe-standardization',
    term: 'Recipe Standardization',
    definition:
      'প্রতিটি dish-এর ingredient, পরিমাণ (গ্রামে), ধাপ ও সময় লিখে fix করা — যাতে প্রতিবার স্বাদ ও portion এক থাকে এবং food cost হিসাব করা যায়।',
    related: ['sop', 'portion-size'],
  },
  {
    id: 'portion-size',
    term: 'Portion Size',
    definition:
      'এক serving-এ কতটা খাবার দেওয়া হবে তার নির্দিষ্ট পরিমাণ। এটি fix না থাকলে food cost ও customer expectation দুটোই এলোমেলো হয়।',
  },
  {
    id: 'inventory',
    term: 'Inventory',
    definition:
      'kitchen-এ কোন raw material কত পরিমাণে মজুত আছে তার হিসাব। Opening stock + Purchase − Consumption − Wastage = Closing stock।',
    related: ['fifo', 'reorder-level'],
  },
  {
    id: 'fifo',
    term: 'FIFO',
    full: 'First In, First Out',
    definition:
      'আগে কেনা/আগে আসা raw material আগে ব্যবহার করা — যাতে পুরনো stock নষ্ট না হয় এবং food safety বজায় থাকে।',
    related: ['inventory'],
  },
  {
    id: 'reorder-level',
    term: 'Reorder Level',
    definition:
      'যে stock পরিমাণে পৌঁছালে নতুন purchase order দিতে হবে — যাতে delivery আসার আগে stock শেষ না হয়।',
    related: ['inventory', 'moq'],
  },
  {
    id: 'moq',
    term: 'MOQ',
    full: 'Minimum Order Quantity',
    definition: 'একজন supplier যত কম পরিমাণ পর্যন্ত একবারে বিক্রি করতে রাজি।',
    related: ['procurement'],
  },
  {
    id: 'procurement',
    term: 'Procurement',
    definition:
      'সঠিক raw material, সঠিক দামে, সঠিক সময়ে, সঠিক quality-তে কেনার পুরো প্রক্রিয়া — supplier নির্বাচন থেকে payment পর্যন্ত।',
    related: ['supplier', 'moq'],
  },
  {
    id: 'supplier',
    term: 'Supplier',
    definition:
      'যিনি kitchen-কে raw material বা packaging সরবরাহ করেন। অন্তত একজন backup supplier রাখা জরুরি।',
    related: ['procurement'],
  },
  {
    id: 'packaging',
    term: 'Packaging',
    definition:
      'খাবার নিরাপদে, leak ছাড়া, গরম অবস্থায় customer পর্যন্ত পৌঁছানোর container ও উপকরণ। এটি brand experience-এরও অংশ।',
  },
  {
    id: 'fssai',
    term: 'FSSAI',
    full: 'Food Safety and Standards Authority of India',
    definition:
      'ভারতে খাদ্য ব্যবসার জন্য বাধ্যতামূলক regulator। Registration বা License লাগে। বর্তমান নিয়ম ও fee সবসময় official FSSAI portal থেকে যাচাই করবে।',
    related: ['gst'],
  },
  {
    id: 'gst',
    term: 'GST',
    full: 'Goods and Services Tax',
    definition:
      'ভারতের indirect tax। Aggregator (Zomato/Swiggy) restaurant service-এ কীভাবে GST handle করে তা পরিবর্তনশীল — official source থেকে যাচাই করবে।',
    related: ['fssai'],
  },
  {
    id: 'kot',
    term: 'KOT',
    full: 'Kitchen Order Ticket',
    definition:
      'একটি order kitchen-এ ঢোকার পর যে ticket/slip তৈরি হয় — কী রান্না হবে, কতগুলো, কোন add-on। রান্নার কাজ এটি ধরেই চলে।',
    related: ['order-operations-flow'],
  },
  {
    id: 'delivery-radius',
    term: 'Delivery Radius',
    definition:
      'kitchen থেকে কত km দূর পর্যন্ত order নেওয়া হবে। বেশি radius = ঠান্ডা খাবার ও খারাপ review-এর ঝুঁকি।',
  },
  {
    id: 'customer-acquisition',
    term: 'Customer Acquisition',
    definition:
      'একজন নতুন customer আনতে যত খরচ ও effort (offer, ad, listing optimization)। প্রথমে organic, তারপর paid।',
    related: ['retention'],
  },
  {
    id: 'retention',
    term: 'Retention',
    definition:
      'একবার order করা customer আবার order করছে কিনা। Repeat customer সবচেয়ে সস্তা ও লাভজনক।',
    related: ['customer-acquisition'],
  },
  {
    id: 'rating',
    term: 'Rating',
    definition:
      'Platform-এ customer-দের দেওয়া গড় স্কোর (সাধারণত ৫-এর মধ্যে)। কম rating সরাসরি order visibility কমায়।',
    related: ['review'],
  },
  {
    id: 'review',
    term: 'Review',
    definition:
      'Customer-এর লিখিত মতামত। Negative review হলো free operational feedback — প্যাটার্ন খুঁজে সমস্যা ঠিক করো।',
    related: ['rating'],
  },
];

export const glossaryById = Object.fromEntries(glossary.map((g) => [g.id, g]));
