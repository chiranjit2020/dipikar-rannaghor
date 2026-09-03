import type { Resource } from '../types';

export const resources: Resource[] = [
  {
    id: 'fssai-portal',
    title: 'FSSAI — Food Licensing & Registration System (FoSCoS)',
    description: 'FSSAI registration/license-এর official portal। Category, fee ও document requirement এখান থেকেই যাচাই করবে।',
    url: 'https://foscos.fssai.gov.in/',
    kind: 'official',
    verifyNote: 'নিয়ম ও fee পরিবর্তনশীল — apply করার দিন portal-এর তথ্যই চূড়ান্ত।',
  },
  {
    id: 'gst-portal',
    title: 'GST — Goods and Services Tax portal',
    description: 'GST registration ও থ্রেশহোল্ড সংক্রান্ত official তথ্য। aggregator-related নিয়মের জন্য CA-র পরামর্শ নাও।',
    url: 'https://www.gst.gov.in/',
    kind: 'official',
    verifyNote: 'Aggregator (Zomato/Swiggy) কীভাবে GST collect করে তা পরিবর্তনশীল।',
  },
  {
    id: 'zomato-partner',
    title: 'Zomato for Business / Partner onboarding',
    description: 'Restaurant partner হওয়ার official তথ্য, commission ও payout structure।',
    url: 'https://www.zomato.com/partner-with-us',
    kind: 'official',
    verifyNote: 'Commission %, ads ও policy প্রায়ই বদলায় — onboarding-এর সময় partner dashboard-এর তথ্য দেখো।',
  },
  {
    id: 'swiggy-partner',
    title: 'Swiggy Partner onboarding',
    description: 'Swiggy-তে restaurant list করার official process।',
    url: 'https://partner.swiggy.com/',
    kind: 'official',
    verifyNote: 'Fee ও requirement পরিবর্তনশীল — official partner documentation যাচাই করো।',
  },
  {
    id: 'breakeven-calc',
    title: 'Break-even Calculator (এই app-এ)',
    description: 'Fixed cost, AOV ও variable cost/order দিয়ে break-even orders/day বের করো।',
    url: '#/calculators',
    kind: 'tool',
  },
  {
    id: 'foodcost-calc',
    title: 'Food Cost Calculator (এই app-এ)',
    description: 'Ingredient দাম বসিয়ে dish-এর food cost, contribution ও Food Cost % বের করো।',
    url: '#/calculators',
    kind: 'tool',
  },
];
