import { Service } from '../types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'contract-copacking',
    title: 'Contract Co-Packaging & Assembly',
    shortDesc: 'End-to-end automated secondary packaging, product kitting, bundling, and shrink wrapping at our certified Doha industrial facility.',
    fullDesc: 'Naspack is Qatar’s trusted co-packing partner for local and multinational brands. We receive your bulk goods or components, run automated or hand-crafted assembly, blister packing, flow wrapping, promotional multi-pack collation, and barcoding with complete traceability under strict ISO and HACCP compliance.',
    iconName: 'Boxes',
    features: [
      'High-speed automated shrink-wrapping & heat tunnels',
      'Promotional bundling (Buy 1 Get 1, multi-pack sleeve collation)',
      'Hand-kitting and luxury gift box assembly',
      'Batch coding, inkjet expiry date printing, and GS1 barcoding',
      'Tamper-evident shrink bands and security holographic sealing'
    ],
    turnaround: '3 - 7 Business Days',
    minOrderQty: '500 units up to 1,000,000+ units',
    tags: ['Secondary Packaging', 'FMCG Co-Packing', 'Promotional Bundling', 'Industrial Area Doha'],
    suitableFor: 'Food & Beverage, Cosmetics, FMCG, Retail Brands, Importers & Distributors across Qatar.'
  },
  {
    id: 'luxury-rigid-boxes',
    title: 'Luxury Rigid & Magnetic Boxes',
    shortDesc: 'Bespoke hand-crafted presentation packaging with magnetic closures, book styles, velvet inlays, and hot foil stamping.',
    fullDesc: 'Engineered for Qatar’s discerning luxury market including royal oud brands, high-end jewelers, confectionery artisans, and corporate VIP giftings. We manufacture premium greyboard structures with pinpoint edge folding, concealed magnets, and custom precision laser-cut inserts.',
    iconName: 'Crown',
    features: [
      'Book-style, shoulder-and-neck, slide drawer, and collapsible rigid boxes',
      '24k metallic hot-foil stamping (Kurz precision foils)',
      'Sculptured multi-level embossing and micro-debossing',
      'Custom foam inserts, velvet wrapping, and silk ribbon pulls',
      'Certified food-contact grade internal trays'
    ],
    turnaround: '7 - 14 Business Days',
    minOrderQty: '250 units to 50,000 units',
    tags: ['Luxury Packaging', 'Oud & Perfume', 'VIP Hamper', 'Gold Foiling'],
    suitableFor: 'Perfume Houses, Gourmet Dates, Haute Couture, Jewellery & VIP National Events.'
  },
  {
    id: 'structural-design-cad',
    title: 'Structural CAD Design & Prototyping',
    shortDesc: 'Engineering custom packaging die-lines, 3D physical mockups, drop-test validation, and high-resolution pack photography.',
    fullDesc: 'From initial sketch to verified 3D prototype within 48 hours. Our industrial packaging engineers use Kongsberg digital sample-making tables to cut real substrate samples before plate making, guaranteeing zero assembly errors and maximum logistics pallet density.',
    iconName: 'Compass',
    features: [
      'Custom die-line generation (.ai, .dxf, .pdf structural files)',
      'Kongsberg digital flatbed table physical sample cuts (1:1 scale)',
      'Drop testing, compression tolerance, and vibration analysis',
      'High-resolution 3D CGI photorealistic rendering and staging',
      'Substrate thickness and flute optimization for weight savings'
    ],
    turnaround: '24 - 48 Hours for physical prototypes',
    minOrderQty: 'Prototype from 1 sample; Bulk from 500 units',
    tags: ['CAD Die-Line', 'Kongsberg Prototyping', 'Structural Engineering', '3D Pack Render'],
    suitableFor: 'Brands launching new product shapes or optimizing shipping footprint.'
  },
  {
    id: 'food-grade-hospitality',
    title: 'Food-Grade & Hospitality Packaging',
    shortDesc: 'Certified hygienic packaging for restaurants, cloud kitchens, bakeries, cafes, and catering in Qatar.',
    fullDesc: 'Compliant with Qatar Ministry of Public Health standards. We manufacture grease-resistant burger boxes, luxury cake boxes with crystal windows, soup containers, tamper-proof delivery paper bags, and foil-lined take-out trays.',
    iconName: 'Utensils',
    features: [
      'PE / PLA water-based biodegradable grease barriers',
      'Food-safe certified soy inks and odorless water-based varnishes',
      'Automated crash-lock folding cartons for rapid kitchen packing',
      'Anti-fog clear window films for cold display cases',
      'Full thermal insulation sleeves for hot item delivery'
    ],
    turnaround: '5 - 10 Business Days',
    minOrderQty: '1,000 units to 250,000+ units',
    tags: ['ISO 22000 Food Safe', 'Takeaway Packaging', 'Grease Resistant', 'Doha Cafes'],
    suitableFor: 'Doha Hospitality, Cloud Kitchens, Cafes, Bakeries & Hotel Catering.'
  },
  {
    id: 'eco-sustainable-solutions',
    title: 'Sustainable & Biodegradable Packaging',
    shortDesc: 'Zero-plastic honeycomb mailers, post-consumer recycled kraft cartons, and compostable films for Qatar 2030 sustainability.',
    fullDesc: 'Supporting Qatar’s environmental transition. Naspack provides certified FSC paperboards, agricultural-waste plant fiber molded trays, and marine-degradable bio-pouches that reduce brand carbon footprints while retaining superior structural strength.',
    iconName: 'Leaf',
    features: [
      'FSC certified virgin and 100% recycled unbleached kraft papers',
      'Molded sugarcane bagasse pulp protective inserts',
      'Plastic-free water-activated gummed paper shipping tapes',
      'Certified industrially and home compostable stand-up pouches',
      'Vegetable-oil based print coatings'
    ],
    turnaround: '5 - 12 Business Days',
    minOrderQty: '500 units to 100,000 units',
    tags: ['Qatar 2030 Vision', 'Plastic-Free', 'Recycled Kraft', 'Eco Packaging'],
    suitableFor: 'Eco-conscious brands, Green e-commerce, Sustainable Qatari enterprises.'
  },
  {
    id: 'warehousing-fulfillment',
    title: 'Doha Warehousing, Kitting & Fast Delivery',
    shortDesc: 'Secure pallet storage in Industrial Area Zone 57 with scheduled just-in-time dispatch across Doha and Qatar municipalities.',
    fullDesc: 'Never run out of packaging inventory. Naspack offers call-off storage agreements: we manufacture your annual packaging requirements at volume rates, store them in our climate-controlled Doha warehouse, and dispatch batches within 4 hours whenever your production lines demand.',
    iconName: 'Truck',
    features: [
      'Climate-controlled warehouse in Doha Industrial Area',
      'Just-In-Time (JIT) daily or weekly delivery scheduling',
      'Dedicated delivery fleet covering Doha, Lusail, Al Rayyan & Al Wakrah',
      'Real-time automated inventory alerts and digital order tracking',
      'Direct contact hotline: +974 77315415'
    ],
    turnaround: 'Same-day or next-day scheduled dispatch in Qatar',
    minOrderQty: 'Pallet lot call-offs',
    tags: ['Inventory Management', 'Doha Fleet Dispatch', 'Just-In-Time', 'Zone 57 Logistics'],
    suitableFor: 'FMCG manufacturers, busy restaurant chains, e-commerce fulfillment centers.'
  }
];
