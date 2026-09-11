import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    trackingNumber: 'NP-QA-8941',
    customerName: 'Sheikh Tariq Al-Thani',
    company: 'Al Noor Parfums Qatar',
    phone: '77315415',
    email: 'production@alnoorparfums.qa',
    destinationCity: 'Lusail Marina Promenade, Building 14, Doha, Qatar',
    orderDate: '2025-05-10',
    estimatedDelivery: '2025-05-18 (Within 48h)',
    status: 'In Production',
    progressPercentage: 65,
    currentMilestone: 'Precision Hot Foil Stamping & Magnetic Flap Assembly',
    items: [
      {
        id: 'item-1',
        name: 'Oud Al-Noor Signature Rigid Box (160x160x65mm)',
        quantity: 2500,
        specs: '1400gsm Dutch Greyboard + Matte Soft-Touch Slate + 24k Gold Foil'
      },
      {
        id: 'item-2',
        name: 'Custom High-Density Velvet Flacon Inlays',
        quantity: 2500,
        specs: 'Laser-Cut EVA core lined with jet-black microsuede'
      }
    ],
    packagingSpecs: {
      boxStyle: 'Book-Style Magnetic Catch Rigid Box',
      material: '1400gsm Premium Rigid Board + Soft Touch Wrap',
      printFinish: 'Kurz 24k Metallic Hot Foil + Blind Debossing',
      batchSize: '2,500 Units (Lot 02/05)'
    },
    timeline: [
      {
        key: 'received',
        label: 'Order Confirmed & Approved',
        timestamp: 'May 10, 2025 - 09:30 AM',
        description: 'Purchase order verified. Structural die-line files signed off by client creative director.',
        location: 'Naspack Industrial Studio, Doha Zone 57',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'dieline',
        label: 'Die-Line CAD & Material Cutting',
        timestamp: 'May 11, 2025 - 02:15 PM',
        description: 'Kongsberg digital knife cutting completed. Greyboard scoring verified to ±0.1mm tolerance.',
        location: 'Naspack Structural Engineering Lab',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'production',
        label: 'Printing, Laminating & Foiling',
        timestamp: 'May 13, 2025 - 11:45 AM',
        description: 'Heidelberg offset printing passed spectrophotometer color check. Gold hot-foil stamping underway on Press 3.',
        location: 'Naspack Main Press Floor, Doha',
        isCompleted: false,
        isCurrent: true
      },
      {
        key: 'copacking',
        label: 'Rigid Assembly & Magnetic Inlay',
        timestamp: 'Pending (Scheduled May 15)',
        description: 'Hand-wrapping of velvet outer sheets and insertion of high-density laser foam trays.',
        location: 'Cleanroom Assembly Line B',
        isCompleted: false,
        isCurrent: false
      },
      {
        key: 'qc',
        label: 'HACCP & ISO Quality Inspection',
        timestamp: 'Pending (Scheduled May 16)',
        description: 'Drop testing, magnetic pull-force verification, and scratch resistance inspection.',
        location: 'Naspack Quality Assurance Wing',
        isCompleted: false,
        isCurrent: false
      },
      {
        key: 'dispatch',
        label: 'Dispatched for Doha Delivery',
        timestamp: 'Pending (Estimated May 17)',
        description: 'Palletized with tamper-evident film and loaded onto temperature-controlled delivery van.',
        location: 'Doha Fleet Logistics Hub',
        isCompleted: false,
        isCurrent: false
      }
    ],
    driverOrHandler: 'Hassan Al-Kuwari (Logistics Supervisor)',
    vehiclePlate: 'QA-58291 (Mercedes Sprinter Cargo)',
    proof: {
      proofId: 'PRF-NP-8941-V1',
      version: 'v1.4 - Press-Ready Master Proof',
      status: 'pending_review',
      artworkImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85',
      dielineImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
      rendering3dUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: 'Euroscale C:10 M:20 Y:30 K:95 (Velvet Carbon Black)',
        pantone: ['Pantone 871 C (Rich Metallic Gold)', 'Pantone Black 6 C'],
        finishingEffects: [
          'Kurz Luxor 24k Gold Hot Foil Stamping',
          'Soft-Touch Velvet Matte Scratch-Resistant Film',
          '0.8mm Blind Micro-Debossing on Arabic Crest',
          'Selective High-Build Gloss Spot UV on Calligraphy'
        ]
      },
      dimensions: '160mm (L) x 160mm (W) x 65mm (H) [Internal Cavity]',
      substrate: '1400gsm Premium Grade-A Dutch Greyboard + 157gsm Art Paper Outer Wrap + 120gsm Black Suede Liner',
      bleed: '3.0 mm Outer Bleed / 4.0 mm Inner Margin from Score Creases',
      tolerance: '±0.25 mm Precision Die-Cutting Standard',
      barcodeVerified: true,
      notesFromPrePress: 'Structural CAD verified on Kongsberg plotter. Die-line crease scoring calibrated for 1400gsm board folding without paper tensile cracking. Pantone 871 C hot foil die registration aligned with crest.',
      annotations: [
        {
          id: 'pin-1',
          xPercent: 52,
          yPercent: 42,
          note: 'Confirm that the Arabic calligraphy hot foil registration aligns with the micro-embossing die.',
          author: 'NasPack Pre-Press Doha',
          createdAt: 'May 11, 2025 - 10:20 AM',
          status: 'pending'
        }
      ]
    }
  },
  {
    trackingNumber: 'NP-QA-7723',
    customerName: 'Fatima Al-Mansoor',
    company: 'Doha Specialty Coffee Roasters',
    phone: '77315415',
    email: 'orders@dohaspecialtycoffee.qa',
    destinationCity: 'The Pearl-Qatar, Porto Arabia Tower 22, Qatar',
    orderDate: '2025-05-12',
    estimatedDelivery: '2025-05-15 (Tomorrow)',
    status: 'Quality Check',
    progressPercentage: 85,
    currentMilestone: 'Gas Degassing Valve Ultrasonic Seal Inspection',
    items: [
      {
        id: 'item-10',
        name: 'Single Origin 250g Stand-Up Coffee Pouches',
        quantity: 10000,
        specs: 'EVOH Bio-Barrier Multi-layer with Pocket Zip + Swiss Valve'
      }
    ],
    packagingSpecs: {
      boxStyle: 'Stand-Up Gusseted Pouch with Pocket Zipper',
      material: 'Compostable EVOH High-Barrier Film',
      printFinish: 'Tactile Matte Lacquer + Spot Metallic Gold',
      batchSize: '10,000 Units'
    },
    timeline: [
      {
        key: 'received',
        label: 'Order Confirmed',
        timestamp: 'May 12, 2025 - 08:00 AM',
        description: 'Artwork color proofs approved and bio-film roll allocated.',
        location: 'Naspack Commercial Hub',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'dieline',
        label: 'Film Slitting & Rotogravure Printing',
        timestamp: 'May 13, 2025 - 01:20 PM',
        description: '10-color high-speed gravure run with food-safe water-based inks.',
        location: 'Naspack Doha Flexo Plant',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'production',
        label: 'Pouch Converting & Zipper Attachment',
        timestamp: 'May 14, 2025 - 10:00 AM',
        description: 'Forming bottom gussets and ultrasonic weld of degassing one-way valves.',
        location: 'Conversion Unit 02',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'qc',
        label: 'Pressure & Hermetic Seal Testing',
        timestamp: 'May 14, 2025 - 04:30 PM',
        description: 'Vacuum chamber leak testing at -0.8 bar. Passed 100% seal integrity.',
        location: 'QA Testing Laboratory',
        isCompleted: false,
        isCurrent: true
      },
      {
        key: 'dispatch',
        label: 'Scheduled for Immediate Delivery',
        timestamp: 'Scheduled May 15 - 10:00 AM',
        description: 'Scheduled dispatch to The Pearl-Qatar retail roastery.',
        location: 'Zone 57 Distribution Bay 3',
        isCompleted: false,
        isCurrent: false
      }
    ],
    driverOrHandler: 'Tariq Mansoor (Doha Express Fleet)',
    vehiclePlate: 'QA-31940',
    proof: {
      proofId: 'PRF-NP-7723-V2',
      version: 'v2.1 - Approved for Press Run',
      status: 'approved',
      artworkImageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=85',
      dielineImageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=85',
      rendering3dUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: 'CMYK 4-Color Process + Matte Protective Lacquer',
        pantone: ['Pantone Warm Red C', 'Pantone 469 C (Coffee Earth)'],
        finishingEffects: [
          'Tactile Matte Lacquer Finish',
          'WICO Swiss Degassing Valve Integration',
          'Laser-Scored Easy-Tear Notch'
        ]
      },
      dimensions: '140mm (W) x 210mm (H) + 70mm Bottom Gusset',
      substrate: 'Recyclable Kraft / EVOH High-Oxygen Barrier Triple Laminate',
      bleed: '2.5 mm Bleed Margin',
      tolerance: '±0.5 mm Heat-Sealed Edge Tolerance',
      barcodeVerified: true,
      notesFromPrePress: 'Nitrogen flush sealing and one-way aroma degassing valve positioned exactly 35mm below top seal.',
      annotations: [],
      signOff: {
        signedBy: 'Fatima Al-Mansoor',
        jobTitle: 'Head of Roasting & Brand Director',
        company: 'Doha Specialty Coffee Roasters',
        email: 'orders@dohaspecialtycoffee.qa',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70"><path d="M20 45 Q 60 10 100 40 T 200 25" stroke="%23171717" stroke-width="2.5" fill="none"/></svg>',
        signedAt: 'May 12, 2025 - 11:15 AM (AST Doha)',
        approvalCertificateId: 'CERT-NP-QA-7723-APPROVED',
        notes: 'Color swatch matched against reference pouch. Approved for 10,000 unit production.'
      }
    }
  },
  {
    trackingNumber: 'NP-QA-5102',
    customerName: 'Gourmet Dates Qatar Co.',
    company: 'Rawnaq Al Nakheel Qatar',
    phone: '55219934',
    email: 'info@rawnaqdates.qa',
    destinationCity: 'Al Rayyan Commercial Complex, Gate 4, Qatar',
    orderDate: '2025-05-08',
    estimatedDelivery: '2025-05-16',
    status: 'Co-Packaging',
    progressPercentage: 75,
    currentMilestone: 'Gourmet Stuffed Date Hand-Kitting & Food-Safe Sealing',
    items: [
      {
        id: 'item-21',
        name: 'Royal Medjool Hexagonal Keepsake Hampers',
        quantity: 1200,
        specs: 'Emerald Buckram Fabric + Food Safe PET dividers + Ribbon'
      }
    ],
    packagingSpecs: {
      boxStyle: 'Hexagonal Rigid Hamper with Clear Internal Clamshell',
      material: 'Recycled Greyboard + Metallic Buckram Fabric',
      printFinish: 'Embossed Islamic Star Pattern + Metallic Gilt',
      batchSize: '1,200 Gift Boxes'
    },
    timeline: [
      {
        key: 'received',
        label: 'Order Confirmed',
        timestamp: 'May 08, 2025',
        description: 'Structural geometry finalized.',
        location: 'Naspack Doha Office',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'production',
        label: 'Hexagonal Box Manufacture',
        timestamp: 'May 11, 2025',
        description: 'Fabric lamination and gold hot-stamping completed.',
        location: 'Naspack Luxury Production Hall',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'copacking',
        label: 'Co-Packaging & Cleanroom Assembly',
        timestamp: 'May 14, 2025',
        description: 'Client date products received. Cleanroom team currently placing items in food-contact compartments.',
        location: 'Naspack Certified Cleanroom 01',
        isCompleted: false,
        isCurrent: true
      },
      {
        key: 'dispatch',
        label: 'Delivery to Al Rayyan',
        timestamp: 'Scheduled May 16',
        description: 'Awaiting final shrink-wrap sealing.',
        location: 'Doha Logistics Bay',
        isCompleted: false,
        isCurrent: false
      }
    ],
    driverOrHandler: 'Naspack Fleet 04',
    proof: {
      proofId: 'PRF-NP-5102-V1',
      version: 'v1.2 - Revisions Requested',
      status: 'revisions_requested',
      artworkImageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1400&q=85',
      dielineImageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=85',
      rendering3dUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: 'Deep Forest Emerald + Gilt Inks',
        pantone: ['Pantone 350 C (Royal Emerald)', 'Pantone 872 C (Rich Gold)'],
        finishingEffects: [
          'Embossed Geometric Islamic Star Lattice',
          'Metallic Gilt Border',
          'Clear Food-Safe PET Cavity Insert'
        ]
      },
      dimensions: '220mm (Diameter) x 75mm (H) Hexagonal',
      substrate: '1600gsm Heavy-Duty Rigid Greyboard + Buckram Texture Paper',
      bleed: '3.0 mm Bleed',
      tolerance: '±0.2 mm Clamshell Precision Fit',
      barcodeVerified: true,
      notesFromPrePress: 'Client requested slight adjustment to the ribbon pull notch depth.',
      annotations: [
        {
          id: 'pin-rev-1',
          xPercent: 78,
          yPercent: 30,
          note: 'Please widen the gold ribbon finger notch by 3mm for easier opening.',
          author: 'Gourmet Dates Brand Manager',
          createdAt: 'May 09, 2025 - 04:15 PM',
          status: 'pending'
        }
      ],
      revisionsHistory: [
        {
          requestedAt: 'May 09, 2025 - 04:18 PM',
          requestedBy: 'Gourmet Dates Qatar Lead',
          feedback: 'Widening the finger-pull notch and checking the PET clamshell compartment dividers.',
          pinsCount: 1
        }
      ]
    }
  },
  {
    trackingNumber: 'NP-QA-9044',
    customerName: 'Baladna Distribution Team',
    company: 'Baladna Retail Logistics',
    phone: '33120045',
    email: 'procurement@baladnaretail.qa',
    destinationCity: 'Al Khor Industrial Facility, Qatar',
    orderDate: '2025-05-02',
    estimatedDelivery: '2025-05-14 (Today)',
    status: 'Out for Delivery',
    progressPercentage: 95,
    currentMilestone: 'On Delivery Vehicle en route to Al Khor Facility',
    items: [
      {
        id: 'item-31',
        name: 'Secondary Corrugated Co-Packing Shipping Cartons',
        quantity: 50000,
        specs: 'Heavy-Duty B-Flute Master Outer Cases with Flexo Print'
      }
    ],
    packagingSpecs: {
      boxStyle: 'RSC Regular Slotted Corrugated Shipping Master Case',
      material: 'Double-Wall Recycled Kraft Corrugated',
      printFinish: 'High-Contrast Water-Based Flexo Barcoding',
      batchSize: '50,000 Units (Palletized in 40 Pallets)'
    },
    timeline: [
      {
        key: 'received',
        label: 'Bulk Contract Signed',
        timestamp: 'May 02, 2025',
        description: 'High volume order initiated.',
        location: 'Industrial Area Zone 57',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'production',
        label: 'High Speed Corrugator Run',
        timestamp: 'May 07, 2025',
        description: '50,000 cases printed, die-cut, and palletized.',
        location: 'Corrugating Plant Unit A',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'qc',
        label: 'Bursting Strength (Mullen) Lab Test',
        timestamp: 'May 11, 2025',
        description: 'Edge crush test verified to exceed 44 ECT specifications.',
        location: 'Testing Lab',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'dispatch',
        label: 'Out for Delivery (Al Khor)',
        timestamp: 'May 14, 2025 - 08:30 AM',
        description: '4 heavy trailers dispatched from Doha Industrial Area Zone 57.',
        location: 'En route via Al Shamal Road',
        isCompleted: false,
        isCurrent: true
      }
    ],
    driverOrHandler: 'Mansoor Al-Hajri (Heavy Fleet Lead)',
    vehiclePlate: 'QA-TRK-9812',
    proof: {
      proofId: 'PRF-NP-9044-V1',
      version: 'v1.0 - Master Shipper Sign-Off',
      status: 'approved',
      artworkImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85',
      dielineImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
      rendering3dUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: '2-Color Black & Reflex Blue High-Speed Flexo',
        pantone: ['Pantone Reflex Blue C', 'Process Black C'],
        finishingEffects: ['Abrasion-Resistant Outer Sizing', 'High-Scannability GS1-128 Barcodes']
      },
      dimensions: '400mm x 300mm x 280mm (RSC Master Shipper)',
      substrate: 'Double-Wall B/C Flute Recycled Kraft 275# Burst Strength',
      bleed: '2.0 mm Outer Bleed',
      tolerance: '±1.0 mm Heavy Converting Tolerance',
      barcodeVerified: true,
      notesFromPrePress: 'Meets automated palletizing height and Qatar dairy distribution center warehouse scanner specifications.',
      annotations: [],
      signOff: {
        signedBy: 'Mansoor Al-Khater',
        jobTitle: 'Supply Chain & Packaging Director',
        company: 'Baladna Retail Logistics',
        email: 'procurement@baladnaretail.qa',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70"><path d="M15 50 Q 70 5 110 45 T 205 30" stroke="%23171717" stroke-width="2.5" fill="none"/></svg>',
        signedAt: 'May 04, 2025 - 02:40 PM (AST Doha)',
        approvalCertificateId: 'CERT-NP-QA-9044-APPROVED',
        notes: 'Barcode scannability grade A verified. Released to corrugator line.'
      }
    }
  }
];

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem('naspack_orders_v1');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load orders from local storage', e);
  }
  return INITIAL_ORDERS;
};

export const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem('naspack_orders_v1', JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
};

export const SAMPLE_ORDERS = INITIAL_ORDERS;

