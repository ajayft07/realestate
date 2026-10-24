import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'pdf');
const cacheDir = path.join(rootDir, 'tmp', 'img_cache');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

const properties = [
  {
    id: 1,
    title: "Auris Serenity Signature",
    location: "Malad West, Link Road, Mumbai",
    landmark: "Western Express Corridor & Inorbit Bay",
    category: "Luxury Sky Apartment",
    statusType: "For Sale",
    priceDisplay: "INR 4.85 Cr",
    emiText: "EMI approx. 3.4L/mo",
    reraId: "P51800008573",
    beds: 4,
    baths: 4,
    area: "3,450 sq.ft",
    superArea: "4,320 sq.ft",
    floor: "42nd of 54 Floors",
    facing: "West (Arabian Sea Facing)",
    parking: "3 Automated Pod Bays + 22kW EV Charger",
    possession: "Ready to Move",
    packageTitle: "Platinum Signature Interior & Wellness Package",
    packageHighlights: [
      "Italian Statuario Marble throughout & Boffi Designer Kitchen with Siemens Appliances",
      "3 Reserved Covered Automated Pod Parking Slots with 22kW EV Fast Charger",
      "3 Years Complimentary Society Maintenance & 24/7 White-Glove Concierge",
      "Bang & Olufsen Integrated Smart Acoustics + Lutron Automated Curtains & Climate"
    ],
    connectivity: [
      { label: "METRO / HIGHWAY", value: "Link Road Metro (2 mins)" },
      { label: "AIRPORT ACCESS", value: "Mumbai Int'l Airport (25 mins)" },
      { label: "BUSINESS DISTRICT", value: "BKC / Mindspace Park (10 mins)" },
      { label: "LEISURE & DINING", value: "5-Star Hotels & Clubs (5 mins)" }
    ],
    description: "Perched majestically on the 42nd floor, this architectural sky mansion provides unobstructed 180-degree panoramic views of the Arabian Sea. Designed for the most discerning luxury connoisseur, the residence seamlessly unites imported Italian stonework with state-of-the-art Lutron home automation and private biometric elevator access. The floor plan emphasizes natural ventilation, floor-to-ceiling acoustic glass curtains, and expansive sunset balconies. Residents enjoy exclusive membership to a 7-star 70,000 sq.ft private clubhouse featuring heated lap pools, squash arenas, spa retreats, and private screening rooms.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 2,
    title: "The Belvedere Private Estate Villas",
    location: "Whitefield, IT Corridor, Bengaluru",
    landmark: "Prestige Boulevard & Wooded Sanctuary",
    category: "Luxury Villa",
    statusType: "For Rent",
    priceDisplay: "INR 1,85,000 / mo",
    emiText: "Zero Brokerage Lease",
    reraId: "PRM/KA/RERA/1251/446/PR/171015",
    beds: 5,
    baths: 5,
    area: "5,600 sq.ft",
    superArea: "6,900 sq.ft",
    floor: "Independent G+2 Triplex Villa",
    facing: "East (Vastu Compliant)",
    parking: "4 Covered Garage Slots + EV Dock",
    possession: "Immediate Occupancy",
    packageTitle: "Royal Estate Living & Butler Package",
    packageHighlights: [
      "Fully Furnished by Restoration Hardware & bespoke handcrafted teakwood cabinetry",
      "Private Temperature-Controlled Swimming Pool & 1,500 sq.ft Zen Landscaped Garden",
      "Dedicated Villa Butler, Housekeeping & Professional Landscaping included",
      "10kW Solar Rooftop Power Grid (Zero Power Bills) & 100% DG Backup"
    ],
    connectivity: [
      { label: "TECH CORRIDOR", value: "ITPL & EPIP Zone (7 mins)" },
      { label: "AIRPORT ACCESS", value: "Kempegowda Int'l (40 mins)" },
      { label: "GLOBAL SCHOOLS", value: "Inventure / TISB (12 mins)" },
      { label: "HEALTH & CARE", value: "Manipal Hospital (8 mins)" }
    ],
    description: "An enclave of pure serenity nestled within Bengaluru's most sought-after ultra-luxury gated sanctuary. The Belvedere Estate represents the pinnacle of private living, featuring a secluded 1,500 sq.ft landscaped zen garden, private heated lap pool, wine cellar, and outdoor entertainment barbecue pavilion. Interiors boast double-height 22-foot great rooms framed by triple-glazed thermal windows, bespoke Italian walk-in wardrobes, and handcrafted teak accents. The residence operates with an independent 10kW rooftop solar grid guaranteeing net-zero power expenditures and continuous dual-generator backup.",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 3,
    title: "Trump Tower Sky Penthouse",
    location: "Worli Sea Face, Mumbai",
    landmark: "Arabian Waterfront Promenade",
    category: "Duplex Penthouse",
    statusType: "New Launch",
    priceDisplay: "INR 12.5 Cr",
    emiText: "Top 68th Sky Mansion",
    reraId: "P51900001339",
    beds: 5,
    baths: 6,
    area: "6,800 sq.ft",
    superArea: "8,400 sq.ft",
    floor: "68th (Top Duplex Mansion)",
    facing: "360 Panoramic Sea & Skyline",
    parking: "5 Reserved Basement Bays",
    possession: "Q4 2024 / Immediate Fit-out",
    packageTitle: "Trump Presidential Sky Suite Package",
    packageHighlights: [
      "Private Glass-Enclosed Rooftop Infinity Plunge Pool overlooking the sea",
      "Dedicated High-Speed Private Elevator opening straight into your private foyer",
      "Bespoke Armani/Casa Furnishings & Boffi Italian Designer Kitchen with Sub-Zero units",
      "5 Reserved Basement Parking Bays + 5 Years Zero Maintenance Charges"
    ],
    connectivity: [
      { label: "COASTAL ROAD", value: "Worli Interchange (3 mins)" },
      { label: "FINANCIAL HUB", value: "BKC Complex (15 mins)" },
      { label: "AIRPORT ACCESS", value: "BOM Airport VIP (22 mins)" },
      { label: "HOTELS & CLUBS", value: "St. Regis Mumbai (5 mins)" }
    ],
    description: "The definitive statement of South Mumbai luxury. Crowned on the 68th floor, this duplex sky penthouse redefines the limits of residential grandeur. Soaring 24-foot ceilings welcome the glittering waters of the Arabian Sea through structural glass facades. Features include a private glass-bottomed infinity plunge pool on the sky deck, customized climate-controlled wine gallery, private Turkish hammam spa, and high-speed elevator opening directly into the formal entry gallery. Backed by world-class 24/7 global white-glove concierge and private valet chauffeurs.",
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 4,
    title: "Oceanic Views Seafront Apartment",
    location: "Marine Drive, South Mumbai",
    landmark: "Iconic Queen's Necklace Promenade",
    category: "Heritage Waterfront Home",
    statusType: "For Sale",
    priceDisplay: "INR 3.2 Cr",
    emiText: "Queen's Necklace View",
    reraId: "P51900003412",
    beds: 3,
    baths: 3,
    area: "2,450 sq.ft",
    superArea: "3,100 sq.ft",
    floor: "14th of 20 Floors",
    facing: "West (Direct Ocean Frontage)",
    parking: "2 Covered Hydraulic Mechanical Bays",
    possession: "Ready for Title Transfer",
    packageTitle: "Heritage Marine Luxury Package",
    packageHighlights: [
      "Full Arabian Sea Bay Windows with unobstructed Sunset & Sea views",
      "Natural Teakwood Hardwood Flooring + Daikin Smart Central HVAC",
      "2 Covered Hydraulic Mechanical Car Parking Bays included",
      "Control4 iPad Home Automation Suite & 2-Yr Pre-paid Maintenance"
    ],
    connectivity: [
      { label: "CIVIC LANDMARK", value: "Nariman Point (4 mins)" },
      { label: "PRIVATE CLUBS", value: "CCI & Bombay Gym (6 mins)" },
      { label: "HERITAGE AREA", value: "Kala Ghoda Enclave (5 mins)" },
      { label: "COASTAL ACCESS", value: "Coastal Flyover (2 mins)" }
    ],
    description: "Commanding front-row prestige on the celebrated arc of Marine Drive, this Art Deco inspired residence celebrates the timeless romance of old Bombay with 21st-century opulence. Overlooking the legendary Queen's Necklace, the living and dining salon features 11.5-foot ceilings, imported Burmese teak parquet flooring, and soundproof bay windows welcoming golden sunsets. The master suite is configured with a walk-in wardrobe, Italian book-matched marble bath with ocean views, and integrated Daikin inverter central air conditioning. Fully verified clear title with zero encumbrance.",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 5,
    title: "Orchid Enclave Hillside Villa",
    location: "Road No. 36, Jubilee Hills, Hyderabad",
    landmark: "VIP Enclave & KBR Park Ridge",
    category: "Luxury Hillside Villa",
    statusType: "For Rent",
    priceDisplay: "INR 1,15,000 / mo",
    emiText: "Exclusive VIP Gated Enclave",
    reraId: "P02400001889",
    beds: 4,
    baths: 4,
    area: "4,800 sq.ft",
    superArea: "5,800 sq.ft",
    floor: "Independent G+1 Courtyard Villa",
    facing: "North-East (Vastu Compliant)",
    parking: "3 Covered Motorized Garages",
    possession: "Immediate Move-in",
    packageTitle: "Jubilee Executive Lifestyle Package",
    packageHighlights: [
      "Semi-Furnished with custom Italian walk-in wardrobes & modular kitchen",
      "Private Landscaped Courtyard with fountain and illuminated outdoor gazebo",
      "3 Covered Motorized Car Garages & 24/7 3-Tier Security with Biometric Access",
      "Full Garden Landscaping and Community Maintenance included"
    ],
    connectivity: [
      { label: "COMMERCIAL HUB", value: "HITEC City (12 mins)" },
      { label: "PARKLANDS", value: "KBR National Park (3 mins)" },
      { label: "AIRPORT ACCESS", value: "RGIA Int'l Airport (35 mins)" },
      { label: "DINING STRIP", value: "Road 36 Cafes (2 mins)" }
    ],
    description: "A sanctuary of quiet elegance nestled on the lush hill ridges of Jubilee Hills. Designed around a tranquil central courtyard with a carved stone water fountain, this independent residence harmonizes classic Mediterranean stone work with clean contemporary lines. The layout encompasses an opulent double-height foyer, dedicated private cinema room, gourmet chef's kitchen with secondary wet prep pantry, and an illuminated outdoor pavilion ideal for open-air entertaining. Features 24/7 private perimeter surveillance and round-the-clock estate maintenance.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 6,
    title: "Botanica Eco-Villas",
    location: "Electronic City Phase 1, Bengaluru",
    landmark: "Wooded Sanctuary Eco Park",
    category: "Sustainable Eco Villa",
    statusType: "New Launch",
    priceDisplay: "INR 1.5 Cr",
    emiText: "Net-Zero Solar Powered",
    reraId: "PRM/KA/RERA/1251/310/PR/190820",
    beds: 3,
    baths: 3,
    area: "2,900 sq.ft",
    superArea: "3,650 sq.ft",
    floor: "Independent Scandinavian Eco Villa",
    facing: "East Facing (Forest View)",
    parking: "2 Covered Bays with 22kW EV Station",
    possession: "Q1 2025 Handover",
    packageTitle: "Green Horizon Zero-Carbon Package",
    packageHighlights: [
      "100% Solar-Powered Net-Zero Energy Grid with Battery Storage (Zero electric bills)",
      "Organic Kitchen Garden plot, biological air filtration & Rainwater harvesting",
      "Smart Eco-Automation: Smart climate thermostats & 22kW EV car charger",
      "Zero Brokerage + Free First-Year Solar & Organic Landscape Care"
    ],
    connectivity: [
      { label: "IT HUBS", value: "Infosys & Wipro (5 mins)" },
      { label: "EXPRESSWAY", value: "Elevated Tollway (4 mins)" },
      { label: "AIRPORT ACCESS", value: "Direct KIA Shuttle (10 mins)" },
      { label: "ECO SANCTUARY", value: "Forest Ridge (15 mins)" }
    ],
    description: "Where conscious environmental design converges with luxury Scandinavian aesthetics. Spread across a 40-acre wooded forest retreat, each Botanica Villa is engineered for 100% net-zero energy consumption through integrated rooftop monocrystalline solar panels and battery storage. Natural cross-ventilation, double-insulated aerated brick walls, and private rainwater harvesting keep cooling costs to a minimum. Step directly into your personal organic herb and vegetable garden, shaded by mature indigenous teak and mahogany trees.",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 7,
    title: "Sunset Horizon Beach Mansion",
    location: "ECR (East Coast Road), Chennai",
    landmark: "Bay of Bengal Coastal Highway",
    category: "Beachfront Villa Compound",
    statusType: "For Sale",
    priceDisplay: "INR 8.9 Cr",
    emiText: "Direct Beach Access",
    reraId: "TN/01/Building/0192/2021",
    beds: 6,
    baths: 7,
    area: "7,500 sq.ft",
    superArea: "9,200 sq.ft",
    floor: "Private Beachfront Compound",
    facing: "East (Direct Bay of Bengal)",
    parking: "4 Covered Garages + Staff Quarters",
    possession: "Immediate Freehold Transfer",
    packageTitle: "Royal Coastal Sanctuary Package",
    packageHighlights: [
      "Direct Private Beach Access with secure gated pathway & private sand deck",
      "50-Foot Private Oceanfront Infinity Pool with submerged lighting & jacuzzi",
      "Fully Furnished by Scandinavian & Italian interior ateliers",
      "4 Garages + Separate Attendant Staff Quarters + 3-Yr Full Maintenance"
    ],
    connectivity: [
      { label: "SCENIC ROUTE", value: "East Coast Highway (Direct)" },
      { label: "AIRPORT ACCESS", value: "Chennai Int'l via OMR (35 mins)" },
      { label: "HERITAGE", value: "Mahabalipuram UNESCO (18 mins)" },
      { label: "LUXURY RESORTS", value: "Taj Fisherman's Cove (6 mins)" }
    ],
    description: "An extraordinary coastal estate commanding private ocean frontage along Chennai's picturesque East Coast Road. Wake up to the soothing rhythm of waves and golden sunrises over the Bay of Bengal. The compound features a private 50-foot infinity swimming pool with heated jacuzzi, private beach access through a secure dune path, separate staff and chauffeur quarters, and sprawling teakwood dining decks. Master suites feature outdoor rain showers, book-matched travertine stone, and direct oceanfront terraces.",
    images: [
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: 8,
    title: "Valley View Mountain Retreat",
    location: "Tiger Point Road, Lonavala, Pune",
    landmark: "Western Ghats Misty Ridge",
    category: "Cliffside Luxury Villa",
    statusType: "For Rent",
    priceDisplay: "INR 2,50,000 / mo",
    emiText: "High-Altitude Hilltop Haven",
    reraId: "P52100004901",
    beds: 5,
    baths: 5,
    area: "5,400 sq.ft",
    superArea: "6,600 sq.ft",
    floor: "Independent Cantilevered Cliff Villa",
    facing: "Panoramic Valley & Waterfall View",
    parking: "3 Covered Car Ports",
    possession: "Available for Immediate Lease",
    packageTitle: "Alpine Wellness & Mountain Retreat Package",
    packageHighlights: [
      "270 Panoramic Valley & Waterfall Cliff Views from cantilevered glass deck",
      "Heated Infinity Pool overlooking Western Ghats mountain ridges",
      "Wood-burning stone fireplace + Handcrafted Teak & Pine wood interiors",
      "On-site full-time caretaker, chef on call & high-speed Starlink WiFi included"
    ],
    connectivity: [
      { label: "EXPRESSWAY", value: "Mumbai-Pune Expressway (15 mins)" },
      { label: "MUMBAI DRIVE", value: "Bandra / South Mumbai (90 mins)" },
      { label: "PUNE CITY", value: "Koregaon Park / Pune (60 mins)" },
      { label: "HELIPAD", value: "Lonavala Helipad (10 mins)" }
    ],
    description: "Perched high on the misty cliffs of Lonavala overlooking deep emerald valleys and seasonal monsoon waterfalls, this retreat is an alpine haven of high-altitude privacy. Built with locally quarried basalt stone, natural pine timbers, and double-height glass walls, the villa features an outdoor heated infinity pool that seems to float over the clouds. Relax around the wood-burning stone fireplace in the main lodge room, enjoy stargazing through the cantilevered glass observatory deck, or host intimate family gatherings catered by your on-site chef.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

function getJpegDimensions(buf) {
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) break;
    const marker = buf[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7)
      };
    }
    const len = buf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return { width: 1200, height: 800 };
}

async function fetchImageBuffer(url, cacheKey) {
  const cachePath = path.join(cacheDir, `${cacheKey}.jpg`);
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    fs.writeFileSync(cachePath, buf);
    return buf;
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

function escapePdf(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[—–]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[•✦·✓]/g, '*')
    .replace(/[^\x20-\x7E]/g, ' ');
}

class RobustPdfDoc {
  constructor() {
    this.objects = [];
    this.pages = [];
  }

  alloc() {
    const num = this.objects.length + 1;
    this.objects.push(null);
    return num;
  }

  set(num, content) {
    this.objects[num - 1] = { num, content };
    return num;
  }

  addImage(buf) {
    const dim = getJpegDimensions(buf);
    const num = this.alloc();
    const content = `<<
  /Type /XObject
  /Subtype /Image
  /Width ${dim.width}
  /Height ${dim.height}
  /ColorSpace /DeviceRGB
  /BitsPerComponent 8
  /Filter /DCTDecode
  /Length ${buf.length}
>>
stream
${buf.toString('binary')}
endstream`;
    this.set(num, Buffer.from(content, 'binary'));
    return num;
  }

  addPage(streamStr, xobjects = {}) {
    const comp = zlib.deflateSync(Buffer.from(streamStr, 'utf8'));
    const contentNum = this.alloc();
    this.set(contentNum, Buffer.from(`<< /Filter /FlateDecode /Length ${comp.length} >>\nstream\n${comp.toString('binary')}\nendstream`, 'binary'));

    let xobjs = '';
    for (const [k, v] of Object.entries(xobjects)) {
      if (v) xobjs += `/${k} ${v} 0 R `;
    }

    const pageNum = this.alloc();
    this.pages.push(pageNum);
    this.set(pageNum, `<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595.28 841.89]
  /Resources <<
    /Font <<
      /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
      /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
      /F3 << /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>
      /F4 << /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>
      /F5 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>
    >>
    /XObject << ${xobjs}>>
  >>
  /Contents ${contentNum} 0 R
>>`);
    return pageNum;
  }

  build() {
    let out = '%PDF-1.4\n%\xFF\xFF\xFF\xFF\n';
    const offsets = [];
    for (let i = 0; i < this.objects.length; i++) {
      offsets.push(Buffer.byteLength(out, 'binary'));
      out += `${this.objects[i].num} 0 obj\n`;
      if (Buffer.isBuffer(this.objects[i].content)) {
        out += this.objects[i].content.toString('binary');
      } else {
        out += this.objects[i].content;
      }
      out += '\nendobj\n';
    }
    const startXref = Buffer.byteLength(out, 'binary');
    out += `xref\n0 ${this.objects.length + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) {
      out += `${String(off).padStart(10, '0')} 00000 n \n`;
    }
    out += `trailer\n<< /Size ${this.objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;
    return Buffer.from(out, 'binary');
  }
}

// Layout text helper using Tm
function textAt(font, size, x, y, str, [r, g, b] = [0, 0, 0]) {
  return `
q
${r} ${g} ${b} rg
BT
/${font} ${size} Tf
1 0 0 1 ${x} ${y} Tm
(${escapePdf(str)}) Tj
ET
Q
`;
}

function wrapWords(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function paragraphAt(font, size, lineHeight, x, startY, lines, [r, g, b] = [0, 0, 0]) {
  let s = `
q
${r} ${g} ${b} rg
BT
/${font} ${size} Tf
${lineHeight} TL
1 0 0 1 ${x} ${startY} Tm
`;
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) s += 'T*\n';
    s += `(${escapePdf(lines[i])}) Tj\n`;
  }
  s += `
ET
Q
`;
  return s;
}

async function generateBrochureForProperty(prop) {
  console.log(`Generating premium brochure for Property [${prop.id}] ${prop.title}...`);
  const doc = new RobustPdfDoc();
  const rootNum = doc.alloc();  // 1
  const pagesNum = doc.alloc(); // 2

  const imgObjs = {};
  for (let i = 0; i < prop.images.length; i++) {
    const buf = await fetchImageBuffer(prop.images[i], `prop_${prop.id}_img_${i}`);
    if (buf) {
      imgObjs[`Im${i + 1}`] = doc.addImage(buf);
    }
  }

  // ==========================================
  // PAGE 1: COVER & EXECUTIVE OVERVIEW
  // ==========================================
  let p1 = `
q
0.039 0.039 0.102 rg
0 0 595.28 841.89 re f
Q

q
0.065 0.065 0.150 rg
0 780 595.28 61.89 re f
0.831 0.604 0.125 rg
0 780 595.28 2.5 re f
Q
`;

  // Top header text
  p1 += textAt('F1', 11, 36, 804, 'ELITE ESTATES', [0.941, 0.753, 0.251]);
  p1 += textAt('F2', 9, 135, 804, '|  PRIVATE LUXURY RESIDENCE CATALOGUE', [0.85, 0.84, 0.92]);
  p1 += textAt('F1', 8, 430, 804, 'OFFICIAL MONOGRAPH', [0.831, 0.604, 0.125]);

  // Status & Category badges
  const statusColor = prop.statusType === 'For Sale' ? [0.75, 0.15, 0.15] : [0.15, 0.55, 0.3];
  p1 += `
q
${statusColor[0]} ${statusColor[1]} ${statusColor[2]} rg
36 745 78 20 re f
0.12 0.12 0.28 rg
120 745 140 20 re f
Q
`;
  p1 += textAt('F1', 8.5, 46, 751, prop.statusType.toUpperCase(), [1, 1, 1]);
  p1 += textAt('F1', 8.5, 128, 751, prop.category.toUpperCase(), [0.941, 0.753, 0.251]);
  p1 += textAt('F2', 8.5, 435, 751, `RERA ID: ${prop.reraId}`, [0.75, 0.75, 0.85]);

  // Title & Location
  p1 += textAt('F3', 23, 36, 715, prop.title, [1, 1, 1]);
  p1 += textAt('F2', 10, 36, 696, `Location: ${prop.location}  (${prop.landmark})`, [0.88, 0.85, 0.95]);

  // Main Hero Image (Height 315pt, Width 523.28pt)
  const heroY = 360;
  const heroH = 315;
  const heroW = 523.28;
  if (imgObjs['Im1']) {
    p1 += `
q
36 ${heroY} ${heroW} ${heroH} re W n
q
${heroW} 0 0 ${heroH} 36 ${heroY} cm
/Im1 Do
Q
Q

q
0.831 0.604 0.125 RG
1.8 w
36 ${heroY} ${heroW} ${heroH} re S
Q
`;
  }

  // Bottom overlay on image
  p1 += `
q
0.04 0.04 0.08 rg
36 ${heroY} ${heroW} 26 re f
0.831 0.604 0.125 rg
36 ${heroY + 25} ${heroW} 1 re f
Q
`;
  p1 += textAt('F1', 8.5, 48, heroY + 8, 'FIGURE 1.0  |  PRIMARY ARCHITECTURAL VIEW & SIGNATURE PERSPECTIVE', [0.941, 0.753, 0.251]);
  p1 += textAt('F2', 8, 410, heroY + 8, 'VERIFIED PHOTOGRAPHIC RECORD', [0.8, 0.8, 0.88]);

  // Key Valuation Bar
  const valBarY = 278;
  p1 += `
q
0.071 0.071 0.165 rg
36 ${valBarY} ${heroW} 70 re f
0.831 0.604 0.125 RG
1.2 w
36 ${valBarY} ${heroW} 70 re S

0.2 0.2 0.35 RG
0.8 w
215 ${valBarY + 8} 0.5 54 re S
375 ${valBarY + 8} 0.5 54 re S
Q
`;
  p1 += textAt('F1', 7.5, 52, valBarY + 52, 'ACQUISITION VALUATION', [0.831, 0.604, 0.125]);
  p1 += textAt('F3', 20, 52, valBarY + 26, prop.priceDisplay, [0.941, 0.753, 0.251]);
  p1 += textAt('F2', 8.5, 52, valBarY + 12, 'Inclusive of all statutory taxes', [0.75, 0.75, 0.85]);

  p1 += textAt('F1', 7.5, 230, valBarY + 52, 'ESTIMATED OUTLAY / FINANCIALS', [0.831, 0.604, 0.125]);
  p1 += textAt('F1', 12.5, 230, valBarY + 30, prop.emiText, [1, 1, 1]);
  p1 += textAt('F2', 8.5, 230, valBarY + 14, 'Custom private banking options', [0.75, 0.75, 0.85]);

  p1 += textAt('F1', 7.5, 390, valBarY + 52, 'TITLE & POSSESSION TIMELINE', [0.831, 0.604, 0.125]);
  p1 += textAt('F1', 12, 390, valBarY + 30, prop.possession, [1, 1, 1]);
  p1 += textAt('F2', 8.5, 390, valBarY + 14, 'Title Deeds 100% Certified Clear', [0.35, 0.85, 0.45]);

  // 8 Key Specs Grid (4 columns x 2 rows)
  const gridY = 88;
  const colW = (heroW - 18) / 4;
  const rowH = 85;

  const specs = [
    { label: "BEDROOMS", val: `${prop.beds} BHK Luxury`, sub: "Master + En-suite" },
    { label: "BATHROOMS", val: `${prop.baths} Bathrooms`, sub: "Italian Marble Finish" },
    { label: "CARPET AREA", val: prop.area, sub: "RERA Certified Net" },
    { label: "SUPER BUILT-UP", val: prop.superArea, sub: "Total Architectural Area" },
    { label: "ELEVATION", val: prop.floor, sub: "Optimum Privacy" },
    { label: "ORIENTATION", val: prop.facing, sub: "Vastu Harmonized" },
    { label: "PARKING", val: "Covered Reserved", sub: prop.parking.split('+')[0].trim() },
    { label: "LEGAL STATUS", val: "Ready Title", sub: "Clear Marketable Deed" }
  ];

  for (let i = 0; i < 8; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const bx = 36 + col * (colW + 6);
    const by = gridY + (1 - row) * (rowH + 6);

    p1 += `
q
0.075 0.075 0.165 rg
${bx} ${by} ${colW} ${rowH} re f
0.831 0.604 0.125 RG
0.8 w
${bx} ${by} ${colW} ${rowH} re S
0.831 0.604 0.125 rg
${bx} ${by + rowH - 3} ${colW} 3 re f
Q
`;
    p1 += textAt('F1', 7.2, bx + 8, by + rowH - 18, specs[i].label, [0.831, 0.604, 0.125]);

    // Handle multiline or smaller font for longer values so nothing clips
    const valLines = wrapWords(specs[i].val, 16);
    if (valLines.length === 1) {
      p1 += textAt('F1', 10, bx + 8, by + rowH - 36, valLines[0], [1, 1, 1]);
    } else {
      p1 += paragraphAt('F1', 8.8, 11, bx + 8, by + rowH - 34, valLines.slice(0, 2), [1, 1, 1]);
    }

    const subLines = wrapWords(specs[i].sub, 18);
    p1 += paragraphAt('F2', 7.2, 9.5, bx + 8, by + 22, subLines.slice(0, 2), [0.75, 0.74, 0.85]);
  }

  // Footer
  p1 += `
q
0.3 0.3 0.45 RG
0.6 w
36 70 ${heroW} 0 re S
Q
`;
  p1 += textAt('F2', 7.5, 36, 52, 'Elite Estates Confidential Investment Dossier  *  Private Client Group  *  All rights reserved', [0.6, 0.6, 0.75]);
  p1 += textAt('F1', 8, 480, 52, 'PAGE 01 / 03', [0.831, 0.604, 0.125]);

  doc.addPage(p1, { Im1: imgObjs['Im1'] });

  // ==========================================
  // PAGE 2: ARCHITECTURAL DETAILS, PACKAGES & NEIGHBORHOOD
  // ==========================================
  let p2 = `
q
0.984 0.980 0.965 rg
0 0 595.28 841.89 re f
Q

q
0.039 0.039 0.102 rg
0 780 595.28 61.89 re f
0.831 0.604 0.125 rg
0 780 595.28 2.5 re f
Q
`;
  p2 += textAt('F1', 11, 36, 804, 'ELITE ESTATES', [0.941, 0.753, 0.251]);
  p2 += textAt('F2', 9, 135, 804, `|  ${prop.title.toUpperCase()}  *  SPECIFICATIONS & PACKAGES`, [0.85, 0.84, 0.92]);
  p2 += textAt('F1', 8, 480, 804, 'PAGE 02 / 03', [0.831, 0.604, 0.125]);

  // Section 1: Architectural Narrative Box (Height 175pt)
  const sec1Y = 590;
  p2 += `
q
1 1 1 rg
36 ${sec1Y} ${heroW} 175 re f
0.88 0.85 0.76 RG
1.2 w
36 ${sec1Y} ${heroW} 175 re S
0.831 0.604 0.125 rg
36 ${sec1Y + 172} ${heroW} 3 re f
Q
`;
  p2 += textAt('F1', 8, 52, sec1Y + 152, 'SECTION 01  *  CURATED ARCHITECTURAL NARRATIVE', [0.7, 0.5, 0.1]);
  p2 += textAt('F3', 15, 52, sec1Y + 132, 'Architectural Vision & Spatial Concept', [0.039, 0.039, 0.102]);

  const descLines = wrapWords(prop.description, 84);
  p2 += paragraphAt('F4', 9.5, 14, 52, sec1Y + 105, descLines.slice(0, 7), [0.18, 0.16, 0.24]);

  // Section 2: Verified Signature Package (Height 215pt)
  const sec2Y = 360;
  p2 += `
q
1 0.992 0.975 rg
36 ${sec2Y} ${heroW} 215 re f
0.831 0.604 0.125 RG
1.5 w
36 ${sec2Y} ${heroW} 215 re S
0.831 0.604 0.125 rg
36 ${sec2Y + 211} ${heroW} 4 re f
Q
`;
  p2 += textAt('F1', 8, 52, sec2Y + 192, 'SECTION 02  *  INCLUSIVE SIGNATURE BENEFIT', [0.7, 0.5, 0.1]);
  p2 += textAt('F3', 15, 52, sec2Y + 172, prop.packageTitle, [0.039, 0.039, 0.102]);

  // 4 Inclusion detail cards (2x2 grid inside Section 2)
  const incW = (heroW - 36) / 2;
  const incH = 64;
  for (let j = 0; j < 4; j++) {
    const icol = j % 2;
    const irow = Math.floor(j / 2);
    const ix = 52 + icol * (incW + 12);
    const iy = sec2Y + 20 + (1 - irow) * (incH + 8);
    const itemText = prop.packageHighlights[j] || "Concierge VIP assistance & legal clearance warranty included";
    const wrappedItem = wrapWords(itemText, 44);

    p2 += `
q
1 1 1 rg
${ix} ${iy} ${incW} ${incH} re f
0.88 0.83 0.72 RG
0.8 w
${ix} ${iy} ${incW} ${incH} re S
0.831 0.604 0.125 rg
${ix} ${iy} 3.5 ${incH} re f
Q
`;
    p2 += textAt('F1', 8.5, ix + 12, iy + incH - 16, `INCLUSION 0${j + 1}`, [0.7, 0.5, 0.1]);
    p2 += paragraphAt('F2', 8.2, 11.5, ix + 12, iy + incH - 30, wrappedItem.slice(0, 3), [0.15, 0.14, 0.22]);
  }

  // Section 3: Strategic Connectivity (Height 135pt)
  const sec3Y = 210;
  p2 += `
q
1 1 1 rg
36 ${sec3Y} ${heroW} 135 re f
0.88 0.85 0.76 RG
1 w
36 ${sec3Y} ${heroW} 135 re S
0.831 0.604 0.125 rg
36 ${sec3Y + 132} ${heroW} 3 re f
Q
`;
  p2 += textAt('F1', 8, 52, sec3Y + 114, 'SECTION 03  *  STRATEGIC CONNECTIVITY & LANDMARKS', [0.7, 0.5, 0.1]);
  p2 += textAt('F3', 14, 52, sec3Y + 96, `Prime Location Coordinates: ${prop.location}`, [0.039, 0.039, 0.102]);

  // 4 Connectivity cards
  const connW = (heroW - 36) / 4;
  for (let k = 0; k < 4; k++) {
    const cx = 52 + k * (connW + 8);
    const cy = sec3Y + 16;
    const cItem = prop.connectivity[k];
    const cValLines = wrapWords(cItem.value, 18);

    p2 += `
q
0.975 0.975 0.96 rg
${cx} ${cy} ${connW} 64 re f
0.88 0.86 0.8 RG
0.6 w
${cx} ${cy} ${connW} 64 re S
Q
`;
    p2 += textAt('F1', 7.2, cx + 8, cy + 50, cItem.label, [0.7, 0.5, 0.1]);
    p2 += paragraphAt('F1', 8, 11, cx + 8, cy + 34, cValLines.slice(0, 2), [0.039, 0.039, 0.102]);
  }

  // Section 4: Title & Legal Assurance Banner (Height 90pt)
  const sec4Y = 105;
  p2 += `
q
0.039 0.039 0.102 rg
36 ${sec4Y} ${heroW} 90 re f
0.831 0.604 0.125 RG
1.2 w
36 ${sec4Y} ${heroW} 90 re S
0.831 0.604 0.125 rg
36 ${sec4Y + 87} ${heroW} 3 re f
Q
`;
  p2 += textAt('F1', 8, 52, sec4Y + 70, 'LEGAL INTEGRITY ASSURANCE  *  SENIOR LEGAL COUNSEL AUDIT', [0.831, 0.604, 0.125]);
  p2 += textAt('F3', 13, 52, sec4Y + 50, '100% Freehold / Clear Title Certified with Zero Encumbrance', [1, 1, 1]);
  p2 += textAt('F2', 8.5, 52, sec4Y + 34, `Registered RERA Project Registration Number: ${prop.reraId}`, [0.85, 0.84, 0.92]);
  p2 += textAt('F2', 8, 52, sec4Y + 18, 'Includes dedicated legal conveyancing, title transfer verification, and registration escrow concierge.', [0.65, 0.65, 0.75]);

  // Page 2 Footer
  p2 += `
q
0.85 0.83 0.78 RG
0.6 w
36 75 ${heroW} 0 re S
Q
`;
  p2 += textAt('F2', 7.5, 36, 56, 'Elite Estates  *  Luxury Residential Advisory Group  *  Confidential Client Brief', [0.4, 0.4, 0.5]);
  p2 += textAt('F1', 8, 480, 56, 'PAGE 02 / 03', [0.7, 0.5, 0.1]);

  doc.addPage(p2);

  // ==========================================
  // PAGE 3: FULL PHOTOGRAPHIC GALLERY & VIP TOUR BOOKING
  // ==========================================
  let p3 = `
q
0.039 0.039 0.102 rg
0 0 595.28 841.89 re f
Q

q
0.065 0.065 0.150 rg
0 780 595.28 61.89 re f
0.831 0.604 0.125 rg
0 780 595.28 2.5 re f
Q
`;
  p3 += textAt('F1', 11, 36, 804, 'ELITE ESTATES', [0.941, 0.753, 0.251]);
  p3 += textAt('F2', 9, 135, 804, `|  ${prop.title.toUpperCase()}  *  PHOTOGRAPHIC PORTFOLIO`, [0.85, 0.84, 0.92]);
  p3 += textAt('F1', 8, 480, 804, 'PAGE 03 / 03', [0.831, 0.604, 0.125]);

  // Image 2: Large Master Showcase (Height 230pt, Width 523.28pt)
  const gal1Y = 535;
  const gal1H = 230;
  if (imgObjs['Im2']) {
    p3 += `
q
36 ${gal1Y} ${heroW} ${gal1H} re W n
q
${heroW} 0 0 ${gal1H} 36 ${gal1Y} cm
/Im2 Do
Q
Q

q
0.831 0.604 0.125 RG
1.5 w
36 ${gal1Y} ${heroW} ${gal1H} re S
Q
`;
  }
  p3 += `
q
0.04 0.04 0.08 rg
36 ${gal1Y} ${heroW} 22 re f
Q
`;
  p3 += textAt('F1', 8, 48, gal1Y + 7, 'FIGURE 2.0  |  GRAND FORMAL LIVING SALON & ARCHITECTURAL INTERIORS', [0.941, 0.753, 0.251]);
  p3 += textAt('F2', 7.5, 420, gal1Y + 7, 'HIGH CEILING VOLUME', [0.8, 0.8, 0.9]);

  // Middle Row: Image 3 & Image 4 side-by-side
  const gal2Y = 330;
  const gal2H = 188;
  const midW = (heroW - 12) / 2;

  // Image 3 (Left)
  if (imgObjs['Im3']) {
    p3 += `
q
36 ${gal2Y} ${midW} ${gal2H} re W n
q
${midW} 0 0 ${gal2H} 36 ${gal2Y} cm
/Im3 Do
Q
Q

q
0.831 0.604 0.125 RG
1.2 w
36 ${gal2Y} ${midW} ${gal2H} re S
Q
`;
  }
  p3 += `
q
0.04 0.04 0.08 rg
36 ${gal2Y} ${midW} 22 re f
Q
`;
  p3 += textAt('F1', 7.5, 46, gal2Y + 7, 'FIGURE 3.0  |  MASTER SUITE SANCTUARY', [0.941, 0.753, 0.251]);

  // Image 4 (Right)
  const im4X = 36 + midW + 12;
  if (imgObjs['Im4']) {
    p3 += `
q
${im4X} ${gal2Y} ${midW} ${gal2H} re W n
q
${midW} 0 0 ${gal2H} ${im4X} ${gal2Y} cm
/Im4 Do
Q
Q

q
0.831 0.604 0.125 RG
1.2 w
${im4X} ${gal2Y} ${midW} ${gal2H} re S
Q
`;
  }
  p3 += `
q
0.04 0.04 0.08 rg
${im4X} ${gal2Y} ${midW} 22 re f
Q
`;
  p3 += textAt('F1', 7.5, im4X + 10, gal2Y + 7, 'FIGURE 4.0  |  DESIGNER MODULAR KITCHEN & DINING', [0.941, 0.753, 0.251]);

  // Bottom Row: Image 5 (Left) + VIP Tour Booking Card (Right)
  const gal3Y = 95;
  const gal3H = 215;

  // Image 5 (Left)
  if (imgObjs['Im5']) {
    p3 += `
q
36 ${gal3Y} ${midW} ${gal3H} re W n
q
${midW} 0 0 ${gal3H} 36 ${gal3Y} cm
/Im5 Do
Q
Q

q
0.831 0.604 0.125 RG
1.2 w
36 ${gal3Y} ${midW} ${gal3H} re S
Q
`;
  }
  p3 += `
q
0.04 0.04 0.08 rg
36 ${gal3Y} ${midW} 22 re f
Q
`;
  p3 += textAt('F1', 7.5, 46, gal3Y + 7, 'FIGURE 5.0  |  PRIVATE BALCONY / OUTDOOR DECK', [0.941, 0.753, 0.251]);

  // VIP Tour Booking Card (Right)
  p3 += `
q
0.071 0.071 0.165 rg
${im4X} ${gal3Y} ${midW} ${gal3H} re f
0.831 0.604 0.125 RG
1.8 w
${im4X} ${gal3Y} ${midW} ${gal3H} re S
0.831 0.604 0.125 rg
${im4X} ${gal3Y + gal3H - 4} ${midW} 4 re f

0.831 0.604 0.125 RG
0.6 w
${im4X + 8} ${gal3Y + 8} ${midW - 16} ${gal3H - 16} re S
Q
`;
  p3 += textAt('F1', 7.5, im4X + 20, gal3Y + gal3H - 26, 'PRIVATE CONCIERGE DESK', [0.831, 0.604, 0.125]);
  p3 += textAt('F3', 14, im4X + 20, gal3Y + gal3H - 46, 'Schedule Private Viewing', [1, 1, 1]);
  p3 += textAt('F2', 8, im4X + 20, gal3Y + gal3H - 62, 'Chauffeur-driven VIP inspection available on request.', [0.8, 0.8, 0.9]);

  p3 += `
q
0.11 0.11 0.22 rg
${im4X + 16} ${gal3Y + 54} ${midW - 32} 75 re f
0.831 0.604 0.125 RG
0.6 w
${im4X + 16} ${gal3Y + 54} ${midW - 32} 75 re S
Q
`;
  p3 += textAt('F1', 8, im4X + 26, gal3Y + 112, 'DIRECT CONCIERGE HOTLINE:', [0.831, 0.604, 0.125]);
  p3 += textAt('F1', 11, im4X + 26, gal3Y + 96, '+91 98765 43210', [1, 1, 1]);
  p3 += textAt('F2', 8, im4X + 26, gal3Y + 80, 'concierge@eliteestates.com', [0.85, 0.85, 0.95]);
  p3 += textAt('F2', 8, im4X + 26, gal3Y + 64, 'www.eliteestates.com', [0.85, 0.85, 0.95]);

  p3 += `
q
0.831 0.604 0.125 rg
${im4X + 16} ${gal3Y + 20} ${midW - 32} 24 re f
Q
`;
  p3 += textAt('F1', 8.5, im4X + 44, gal3Y + 28, 'RESERVE PRIVATE TOUR NOW', [0.039, 0.039, 0.102]);

  // Page 3 Footer
  p3 += `
q
0.3 0.3 0.45 RG
0.6 w
36 68 ${heroW} 0 re S
Q
`;
  p3 += textAt('F2', 7.5, 36, 50, 'Elite Estates  *  RERA Registered Luxury Brokerage  *  Copyright 2024  *  All Rights Reserved', [0.6, 0.6, 0.75]);
  p3 += textAt('F1', 8, 480, 50, 'PAGE 03 / 03', [0.831, 0.604, 0.125]);

  doc.addPage(p3, {
    Im2: imgObjs['Im2'],
    Im3: imgObjs['Im3'],
    Im4: imgObjs['Im4'],
    Im5: imgObjs['Im5']
  });

  // Finish PDF structure
  doc.set(rootNum, `<< /Type /Catalog /Pages ${pagesNum} 0 R >>`);
  doc.set(pagesNum, `<< /Type /Pages /Kids [ ${doc.pages.map(p => `${p} 0 R`).join(' ')} ] /Count ${doc.pages.length} >>`);

  const pdfBuf = doc.build();
  const destPath = path.join(outputDir, `property-${prop.id}-brochure.pdf`);
  fs.writeFileSync(destPath, pdfBuf);
  console.log(`Saved: ${destPath} (${pdfBuf.length} bytes)`);
}

async function run() {
  console.log('Generating high-density luxury brochures for all 8 properties...');
  for (const prop of properties) {
    try {
      await generateBrochureForProperty(prop);
    } catch (err) {
      console.error(`Error generating brochure for property ${prop.id}:`, err);
    }
  }
  console.log('All 8 property brochures generated successfully!');
}

run();
