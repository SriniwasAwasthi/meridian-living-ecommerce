const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// Data generator for 90 products (15 per category)
const categoriesData = [
  {
    category: "Smart Home",
    items: [
      { name: "Smart LED Light Strip", brand: "Nanoleaf", moods: ["Calm", "Focus"], price: 7900, originalPrice: 9900, rating: 4.8, reviewCount: 512, badge: "Bestseller", isTrending: true, isNew: false, query: "led light strip modern ambient" },
      { name: "Philips Hue Smart Bulb", brand: "Philips Hue", moods: ["Calm", "Cozy"], price: 5900, originalPrice: 7900, rating: 4.9, reviewCount: 1240, badge: "Bestseller", isTrending: true, isNew: false, query: "smart light bulb modern interior" },
      { name: "Smart WiFi Plug Mini", brand: "TP-Link", moods: ["Focus"], price: 2900, originalPrice: 3900, rating: 4.7, reviewCount: 380, badge: null, isTrending: false, isNew: true, query: "smart plug socket modern" },
      { name: "Smart HEPA Air Purifier", brand: "Xiaomi", moods: ["Calm", "Luxury"], price: 18900, originalPrice: 22900, rating: 4.9, reviewCount: 890, badge: "Bestseller", isTrending: true, isNew: false, query: "air purifier modern minimal" },
      { name: "Smart Ultrasonic Aroma Diffuser", brand: "Zenith", moods: ["Calm", "Cozy"], price: 6900, originalPrice: 8900, rating: 4.8, reviewCount: 650, badge: "New Arrival", isTrending: false, isNew: true, query: "aroma diffuser ceramic white" },
      { name: "Smart HD Indoor Security Camera", brand: "Google Nest", moods: ["Focus"], price: 12900, originalPrice: 15900, rating: 4.7, reviewCount: 420, badge: null, isTrending: false, isNew: false, query: "smart security camera modern home" },
      { name: "Smart Room Temperature Sensor", brand: "Ecobee", moods: ["Focus"], price: 4900, originalPrice: 6500, rating: 4.6, reviewCount: 290, badge: null, isTrending: false, isNew: false, query: "smart sensor thermostat minimalist" },
      { name: "Smart Hi-Fi Studio Speaker", brand: "Apple", moods: ["Luxury", "Cozy"], price: 29900, originalPrice: 34900, rating: 4.9, reviewCount: 1580, badge: "Bestseller", isTrending: true, isNew: false, query: "smart speaker modern interior" },
      { name: "Smart Video Doorbell Pro", brand: "Ring", moods: ["Focus", "Luxury"], price: 17900, originalPrice: 21900, rating: 4.8, reviewCount: 940, badge: null, isTrending: false, isNew: false, query: "smart video doorbell modern" },
      { name: "Smart HD Home Display Hub", brand: "Google Nest", moods: ["Focus", "Giftable"], price: 13900, originalPrice: 16900, rating: 4.7, reviewCount: 710, badge: null, isTrending: false, isNew: true, query: "smart home display hub tech" },
      { name: "Smart LiDAR Robot Vacuum", brand: "Roborock", moods: ["Luxury"], price: 49900, originalPrice: 59900, rating: 4.9, reviewCount: 1120, badge: "Bestseller", isTrending: true, isNew: false, query: "robot vacuum modern interior" },
      { name: "Smart Wireless Curtain Controller", brand: "SwitchBot", moods: ["Calm", "Luxury"], price: 8900, originalPrice: 10900, rating: 4.6, reviewCount: 310, badge: "New Arrival", isTrending: false, isNew: true, query: "curtains modern living room" },
      { name: "Smart Sunrise Alarm Clock", brand: "Halo", moods: ["Calm", "Cozy"], price: 7900, originalPrice: 9900, rating: 4.8, reviewCount: 680, badge: null, isTrending: false, isNew: false, query: "sunrise alarm clock bedroom" },
      { name: "Smart Precision Coffee Maker", brand: "Ember", moods: ["Luxury", "Focus"], price: 24900, originalPrice: 28900, rating: 4.9, reviewCount: 450, badge: "New Arrival", isTrending: true, isNew: true, query: "coffee maker modern sleek" },
      { name: "Smart Cool Mist Humidifier", brand: "Levoit", moods: ["Calm", "Cozy"], price: 8900, originalPrice: 10900, rating: 4.7, reviewCount: 520, badge: null, isTrending: false, isNew: false, query: "humidifier modern living room" }
    ]
  },
  {
    category: "Desk Setup",
    items: [
      { name: "Wireless Mechanical Keyboard", brand: "Keychron", moods: ["Focus", "Luxury"], price: 11900, originalPrice: 14900, rating: 4.9, reviewCount: 1850, badge: "Bestseller", isTrending: true, isNew: false, query: "mechanical keyboard wooden desk setup" },
      { name: "Precision Wireless Ergonomic Mouse", brand: "Logitech", moods: ["Focus"], price: 9900, originalPrice: 11900, rating: 4.9, reviewCount: 2300, badge: "Bestseller", isTrending: true, isNew: false, query: "wireless ergonomic mouse luxury desk" },
      { name: "34-Inch Ultrawide Curved Monitor", brand: "Samsung", moods: ["Focus", "Luxury"], price: 54900, originalPrice: 64900, rating: 4.8, reviewCount: 920, badge: "Bestseller", isTrending: true, isNew: false, query: "curved monitor ultrawide workspace" },
      { name: "ScreenBar Monitor Light Bar", brand: "BenQ", moods: ["Focus"], price: 12900, originalPrice: 14900, rating: 4.9, reviewCount: 1410, badge: "Bestseller", isTrending: true, isNew: false, query: "monitor light bar computer desk" },
      { name: "Sculpted Walnut Laptop Stand", brand: "NovaNest", moods: ["Focus", "Cozy"], price: 8900, originalPrice: 11900, rating: 4.8, reviewCount: 670, badge: null, isTrending: false, isNew: true, query: "laptop stand wooden desk setup" },
      { name: "Thunderbolt 4 USB-C Dock 13-in-1", brand: "Anker", moods: ["Focus", "Luxury"], price: 19900, originalPrice: 24900, rating: 4.8, reviewCount: 780, badge: "New Arrival", isTrending: false, isNew: true, query: "usb c dock workstation" },
      { name: "Minimalist Touch RGB Desk Lamp", brand: "Baseus", moods: ["Focus", "Calm"], price: 6900, originalPrice: 8900, rating: 4.7, reviewCount: 430, badge: null, isTrending: false, isNew: false, query: "desk lamp modern minimalist workspace" },
      { name: "Under-Desk Steel Cable Tray", brand: "Kanso", moods: ["Focus"], price: 3900, originalPrice: 4900, rating: 4.6, reviewCount: 310, badge: null, isTrending: false, isNew: false, query: "cable management tray desk" },
      { name: "3-in-1 Magnetic Wireless Charger", brand: "Belkin", moods: ["Focus", "Giftable"], price: 8900, originalPrice: 10900, rating: 4.8, reviewCount: 1150, badge: "Bestseller", isTrending: true, isNew: false, query: "wireless charger stand desk" },
      { name: "ANC Wireless Noise Cancelling Headphones", brand: "Sony", moods: ["Focus", "Luxury"], price: 34900, originalPrice: 39900, rating: 4.9, reviewCount: 3100, badge: "Bestseller", isTrending: true, isNew: false, query: "noise cancelling headphones desk aesthetic" },
      { name: "Meridian Full Grain Leather Desk Mat", brand: "NovaNest", moods: ["Focus", "Luxury"], price: 6500, originalPrice: 8500, rating: 4.9, reviewCount: 890, badge: "New Arrival", isTrending: false, isNew: true, query: "leather desk mat workstation" },
      { name: "Ergonomic Mesh Task Chair", brand: "Herman Miller", moods: ["Focus", "Luxury"], price: 69900, originalPrice: 79900, rating: 4.9, reviewCount: 1650, badge: "Bestseller", isTrending: true, isNew: false, query: "ergonomic office chair modern workspace" },
      { name: "Motorized Oak Standing Desk", brand: "Jarvis", moods: ["Focus", "Luxury"], price: 59900, originalPrice: 69900, rating: 4.8, reviewCount: 840, badge: null, isTrending: false, isNew: false, query: "standing desk solid oak workspace" },
      { name: "4K Ultra HD HDR Webcam", brand: "Logitech", moods: ["Focus"], price: 15900, originalPrice: 19900, rating: 4.7, reviewCount: 620, badge: null, isTrending: false, isNew: false, query: "4k webcam computer workspace" },
      { name: "Cardioid USB Studio Vocal Microphone", brand: "Shure", moods: ["Focus", "Luxury"], price: 21900, originalPrice: 24900, rating: 4.9, reviewCount: 970, badge: null, isTrending: false, isNew: true, query: "studio microphone desk arm" }
    ]
  },
  {
    category: "Home Decor",
    items: [
      { name: "Nordic Opal Glass Table Lamp", brand: "West Elm", moods: ["Cozy", "Calm"], price: 9900, originalPrice: 12900, rating: 4.9, reviewCount: 760, badge: "Bestseller", isTrending: true, isNew: false, query: "nordic table lamp warm glow" },
      { name: "Minimal Brushed Gold Wall Clock", brand: "Muji", moods: ["Calm", "Luxury"], price: 4900, originalPrice: 6500, rating: 4.7, reviewCount: 420, badge: null, isTrending: false, isNew: false, query: "minimalist wall clock gold interior" },
      { name: "Potted Fiddle Leaf Fig Tree", brand: "IKEA", moods: ["Calm", "Cozy"], price: 7900, originalPrice: 9900, rating: 4.8, reviewCount: 1100, badge: "Bestseller", isTrending: true, isNew: false, query: "fiddle leaf fig ceramic pot interior" },
      { name: "Nordic Solid Oak Floating Shelves", brand: "West Elm", moods: ["Cozy"], price: 11900, originalPrice: 14900, rating: 4.9, reviewCount: 530, badge: null, isTrending: false, isNew: true, query: "wooden floating shelf living room" },
      { name: "Artisan Terracotta Ceramic Vase", brand: "H&M Home", moods: ["Cozy", "Calm"], price: 4500, originalPrice: 5900, rating: 4.8, reviewCount: 380, badge: null, isTrending: false, isNew: false, query: "ceramic vase modern Scandinavian decor" },
      { name: "Teak Wood Geometric Wall Sculpture", brand: "NovaNest", moods: ["Luxury"], price: 15900, originalPrice: 19900, rating: 4.9, reviewCount: 290, badge: "New Arrival", isTrending: false, isNew: true, query: "wooden wall art geometric modern" },
      { name: "Brushed Brass Arch Wall Mirror", brand: "West Elm", moods: ["Luxury", "Cozy"], price: 18900, originalPrice: 22900, rating: 4.9, reviewCount: 840, badge: "Bestseller", isTrending: true, isNew: false, query: "brass wall mirror arched entry" },
      { name: "Mid-Century Brass Arc Floor Lamp", brand: "West Elm", moods: ["Luxury", "Cozy"], price: 24900, originalPrice: 29900, rating: 4.8, reviewCount: 670, badge: null, isTrending: false, isNew: false, query: "brass floor lamp arc living room" },
      { name: "Soy Wax Amber Candle Trio Set", brand: "Muji", moods: ["Cozy", "Calm", "Giftable"], price: 6900, originalPrice: 8900, rating: 4.9, reviewCount: 1420, badge: "Bestseller", isTrending: true, isNew: false, query: "scented candle amber glass cozy" },
      { name: "CloudKnit Merino Chunky Throw", brand: "NovaNest", moods: ["Cozy", "Giftable"], price: 8900, originalPrice: 11900, rating: 4.9, reviewCount: 950, badge: "Bestseller", isTrending: true, isNew: false, query: "chunky knit throw blanket sofa" },
      { name: "Italian Carrara White Marble Tray", brand: "NovaNest", moods: ["Luxury"], price: 5900, originalPrice: 7900, rating: 4.8, reviewCount: 340, badge: null, isTrending: false, isNew: true, query: "marble tray luxury coffee table" },
      { name: "Botanical Ficus Bonsai Tree", brand: "IKEA", moods: ["Calm", "Cozy"], price: 6500, originalPrice: 8500, rating: 4.7, reviewCount: 410, badge: null, isTrending: false, isNew: false, query: "bonsai tree potted modern home" },
      { name: "Abstract Canvas Art Minimalist Noir", brand: "H&M Home", moods: ["Luxury", "Calm"], price: 12900, originalPrice: 16900, rating: 4.8, reviewCount: 510, badge: null, isTrending: false, isNew: false, query: "abstract canvas art minimal living room" },
      { name: "Velvet Linen Blend Accent Cushion", brand: "H&M Home", moods: ["Cozy"], price: 3500, originalPrice: 4500, rating: 4.7, reviewCount: 630, badge: null, isTrending: false, isNew: false, query: "velvet cushion sofa aesthetic" },
      { name: "Woven Natural Seagrass Basket", brand: "IKEA", moods: ["Cozy", "Calm"], price: 3900, originalPrice: 4900, rating: 4.8, reviewCount: 780, badge: null, isTrending: false, isNew: false, query: "woven seagrass basket plant interior" }
    ]
  },
  {
    category: "Wellness",
    items: [
      { name: "Matte Ceramic Ultrasonic Diffuser", brand: "NovaNest", moods: ["Calm", "Cozy"], price: 6900, originalPrice: 8900, rating: 4.9, reviewCount: 1530, badge: "Bestseller", isTrending: true, isNew: false, query: "ceramic essential oil diffuser spa" },
      { name: "Deep Tissue Percussive Massage Gun", brand: "Therabody", moods: ["Wellness", "Focus"], price: 19900, originalPrice: 24900, rating: 4.9, reviewCount: 1820, badge: "Bestseller", isTrending: true, isNew: false, query: "massage gun muscle recovery" },
      { name: "Organic Buckwheat Meditation Cushion", brand: "Muji", moods: ["Calm"], price: 4900, originalPrice: 6500, rating: 4.8, reviewCount: 470, badge: null, isTrending: false, isNew: true, query: "meditation cushion zafu organic" },
      { name: "Self-Cleaning UV Smart Water Bottle", brand: "Ember", moods: ["Luxury", "Giftable"], price: 8900, originalPrice: 11900, rating: 4.8, reviewCount: 940, badge: "Bestseller", isTrending: true, isNew: false, query: "smart water bottle stainless steel" },
      { name: "Non-Slip Eco Natural Cork Yoga Mat", brand: "NovaNest", moods: ["Calm", "Wellness"], price: 7900, originalPrice: 9900, rating: 4.9, reviewCount: 680, badge: "New Arrival", isTrending: false, isNew: true, query: "cork yoga mat minimalist" },
      { name: "Acoustic White Noise Sound Machine", brand: "Philips", moods: ["Calm", "Cozy"], price: 5900, originalPrice: 7500, rating: 4.7, reviewCount: 810, badge: null, isTrending: false, isNew: false, query: "sound machine white noise sleep" },
      { name: "Advanced Health & Fitness Tracker", brand: "Fitbit", moods: ["Wellness"], price: 14900, originalPrice: 17900, rating: 4.7, reviewCount: 1350, badge: null, isTrending: false, isNew: false, query: "fitness tracker smartwatch minimal" },
      { name: "Heated Shiatsu Neck & Shoulder Massager", brand: "Therabody", moods: ["Calm", "Cozy"], price: 8900, originalPrice: 11900, rating: 4.8, reviewCount: 1240, badge: "Bestseller", isTrending: true, isNew: false, query: "neck massager heated ergonomic" },
      { name: "Acetate Blue Light Blocking Glasses", brand: "Muji", moods: ["Focus"], price: 3900, originalPrice: 4900, rating: 4.6, reviewCount: 560, badge: null, isTrending: false, isNew: false, query: "blue light glasses minimal frame" },
      { name: "Whisper Quiet Ultrasonic Humidifier", brand: "Philips", moods: ["Calm", "Cozy"], price: 7900, originalPrice: 9900, rating: 4.8, reviewCount: 730, badge: null, isTrending: false, isNew: false, query: "cool mist humidifier bedroom" },
      { name: "Organic Essential Oil Botanical Set", brand: "NovaNest", moods: ["Calm", "Giftable"], price: 4900, originalPrice: 6500, rating: 4.9, reviewCount: 890, badge: "Giftable", isTrending: true, isNew: false, query: "essential oil bottle set organic" },
      { name: "Artisanal Organic Loose Leaf Tea Collection", brand: "NovaNest", moods: ["Calm", "Giftable"], price: 3500, originalPrice: 4500, rating: 4.8, reviewCount: 620, badge: null, isTrending: false, isNew: true, query: "herbal tea tin set wooden table" },
      { name: "High-Density Muscle Foam Roller", brand: "Therabody", moods: ["Wellness"], price: 3900, originalPrice: 4900, rating: 4.7, reviewCount: 480, badge: null, isTrending: false, isNew: false, query: "foam roller workout recovery" },
      { name: "Smart Heated Air Eye Massager", brand: "Therabody", moods: ["Calm", "Luxury"], price: 11900, originalPrice: 14900, rating: 4.8, reviewCount: 670, badge: "New Arrival", isTrending: false, isNew: true, query: "eye massager relaxing spa" },
      { name: "Sunrise Light Therapy Simulator Clock", brand: "Philips", moods: ["Calm", "Cozy"], price: 9900, originalPrice: 12900, rating: 4.9, reviewCount: 1120, badge: "Bestseller", isTrending: true, isNew: false, query: "sunrise alarm light bedroom" }
    ]
  },
  {
    category: "Gifts",
    items: [
      { name: "Personalized Cognac Leather Journal", brand: "Moleskine", moods: ["Giftable", "Luxury"], price: 4900, originalPrice: 6500, rating: 4.9, reviewCount: 980, badge: "Bestseller", isTrending: true, isNew: false, query: "leather journal notebook cognac" },
      { name: "Craftsman Matte Brass Fountain Pen", brand: "Moleskine", moods: ["Giftable", "Luxury"], price: 5900, originalPrice: 7900, rating: 4.8, reviewCount: 640, badge: null, isTrending: false, isNew: true, query: "brass fountain pen luxury desk" },
      { name: "Smart Temperature Controlled Mug Warmer", brand: "Ember", moods: ["Giftable", "Cozy"], price: 12900, originalPrice: 14900, rating: 4.9, reviewCount: 2150, badge: "Bestseller", isTrending: true, isNew: false, query: "ember temperature control mug" },
      { name: "Analog Instant Pocket Camera", brand: "Fujifilm", moods: ["Giftable", "Cozy"], price: 9900, originalPrice: 11900, rating: 4.8, reviewCount: 1430, badge: "Bestseller", isTrending: true, isNew: false, query: "instant camera vintage aesthetic" },
      { name: "Curated Luxury Gourmet Gift Box", brand: "NovaNest", moods: ["Giftable", "Luxury"], price: 8900, originalPrice: 11900, rating: 4.9, reviewCount: 780, badge: "Giftable", isTrending: true, isNew: false, query: "luxury gift box wrapped aesthetic" },
      { name: "Marshall Vintage Portable Bluetooth Speaker", brand: "Marshall", moods: ["Giftable", "Luxury"], price: 16900, originalPrice: 19900, rating: 4.9, reviewCount: 2890, badge: "Bestseller", isTrending: true, isNew: false, query: "marshall bluetooth speaker brass" },
      { name: "Luxury Soy Candle Trio Gift Set", brand: "NovaNest", moods: ["Giftable", "Cozy"], price: 7500, originalPrice: 9500, rating: 4.9, reviewCount: 1120, badge: "Giftable", isTrending: true, isNew: false, query: "candle gift box luxury amber" },
      { name: "Swiss Master Chocolatier Selection Box", brand: "NovaNest", moods: ["Giftable", "Luxury"], price: 4500, originalPrice: 5900, rating: 4.8, reviewCount: 650, badge: null, isTrending: false, isNew: true, query: "dark chocolate box luxury gourmet" },
      { name: "Smart Portable HD Pocket Projector", brand: "Anker", moods: ["Giftable", "Luxury"], price: 29900, originalPrice: 34900, rating: 4.8, reviewCount: 890, badge: "New Arrival", isTrending: true, isNew: true, query: "mini projector portable dark room" },
      { name: "Bellroy Slim RFID Leather Wallet", brand: "Bellroy", moods: ["Giftable", "Luxury"], price: 7900, originalPrice: 9900, rating: 4.9, reviewCount: 1640, badge: "Bestseller", isTrending: true, isNew: false, query: "bellroy leather wallet cognac" },
      { name: "True Wireless Noise Cancelling Earbuds", brand: "JBL", moods: ["Giftable", "Focus"], price: 14900, originalPrice: 17900, rating: 4.8, reviewCount: 1780, badge: null, isTrending: false, isNew: false, query: "wireless earbuds case minimal" },
      { name: "Aura Carver 10.1 HD Digital Photo Frame", brand: "Aura", moods: ["Giftable", "Luxury"], price: 17900, originalPrice: 21900, rating: 4.9, reviewCount: 920, badge: "Giftable", isTrending: false, isNew: false, query: "digital photo frame modern living room" },
      { name: "Pour-Over Artisan Coffee Lover Kit", brand: "NovaNest", moods: ["Giftable", "Cozy"], price: 9900, originalPrice: 12900, rating: 4.9, reviewCount: 830, badge: "Bestseller", isTrending: true, isNew: false, query: "pour over coffee dripper glass" },
      { name: "Customized Walnut & Brass Desk Nameplate", brand: "NovaNest", moods: ["Giftable", "Focus"], price: 4900, originalPrice: 6500, rating: 4.8, reviewCount: 340, badge: null, isTrending: false, isNew: true, query: "wooden desk nameplate brass" },
      { name: "Voyager Tech & Leather Organizer Kit", brand: "Bellroy", moods: ["Giftable", "Luxury"], price: 6900, originalPrice: 8900, rating: 4.8, reviewCount: 570, badge: null, isTrending: false, isNew: false, query: "leather organizer pouch travel tech" }
    ]
  },
  {
    category: "Travel Essentials",
    items: [
      { name: "Aluminum Smart Carry-On Spinner Suitcase", brand: "Samsonite", moods: ["Luxury"], price: 39900, originalPrice: 46900, rating: 4.9, reviewCount: 1450, badge: "Bestseller", isTrending: true, isNew: false, query: "aluminum carry on suitcase luxury airport" },
      { name: "Compression Water-Resistant Packing Cubes 4-Set", brand: "Peak Design", moods: ["Focus"], price: 5900, originalPrice: 7500, rating: 4.9, reviewCount: 1890, badge: "Bestseller", isTrending: true, isNew: false, query: "packing cubes travel organized" },
      { name: "Weatherproof Everyday Travel Backpack 30L", brand: "Peak Design", moods: ["Luxury", "Focus"], price: 22900, originalPrice: 26900, rating: 4.9, reviewCount: 2100, badge: "Bestseller", isTrending: true, isNew: false, query: "travel backpack camera camera bag" },
      { name: "GaN 65W Universal International Adapter", brand: "Anker", moods: ["Focus"], price: 4900, originalPrice: 6500, rating: 4.8, reviewCount: 1320, badge: null, isTrending: false, isNew: false, query: "universal travel adapter fast charger" },
      { name: "Ultra-Slim Power Bank 20000mAh 45W", brand: "Anker", moods: ["Focus", "Giftable"], price: 6900, originalPrice: 8900, rating: 4.9, reviewCount: 2450, badge: "Bestseller", isTrending: true, isNew: false, query: "slim power bank metal luxury" },
      { name: "Memory Foam Ergonomic Travel Neck Pillow", brand: "NovaNest", moods: ["Calm", "Cozy"], price: 3900, originalPrice: 4900, rating: 4.7, reviewCount: 940, badge: null, isTrending: false, isNew: false, query: "travel neck pillow memory foam" },
      { name: "RFID Blocking Leather Passport Holder", brand: "Bellroy", moods: ["Luxury", "Giftable"], price: 4500, originalPrice: 5900, rating: 4.8, reviewCount: 1120, badge: null, isTrending: false, isNew: false, query: "leather passport cover cognac" },
      { name: "Smart Bluetooth Luggage Tracker Tag", brand: "Apple", moods: ["Focus", "Giftable"], price: 2900, originalPrice: 3900, rating: 4.9, reviewCount: 3800, badge: "Bestseller", isTrending: true, isNew: false, query: "apple airtag luggage tracker" },
      { name: "Hanging Canvas Waterproof Toiletry Kit", brand: "Peak Design", moods: ["Focus"], price: 4900, originalPrice: 6500, rating: 4.8, reviewCount: 760, badge: null, isTrending: false, isNew: true, query: "toiletry bag dopp kit canvas" },
      { name: "Collapsible BPA-Free Silicone Water Bottle", brand: "NovaNest", moods: ["Wellness"], price: 2500, originalPrice: 3500, rating: 4.6, reviewCount: 520, badge: null, isTrending: false, isNew: false, query: "collapsible water bottle travel" },
      { name: "Portable Handheld Espresso Coffee Maker", brand: "Wacaco", moods: ["Giftable", "Luxury"], price: 8900, originalPrice: 10900, rating: 4.8, reviewCount: 890, badge: "New Arrival", isTrending: true, isNew: true, query: "portable espresso maker travel" },
      { name: "Dual Voltage Compact Travel Garment Steamer", brand: "Philips", moods: ["Focus"], price: 4900, originalPrice: 6500, rating: 4.7, reviewCount: 610, badge: null, isTrending: false, isNew: false, query: "handheld travel steamer iron" },
      { name: "Compact Active Noise Cancelling ANC Earbuds", brand: "Sony", moods: ["Focus", "Luxury"], price: 19900, originalPrice: 24900, rating: 4.9, reviewCount: 1980, badge: "Bestseller", isTrending: true, isNew: false, query: "anc earbuds wireless black" },
      { name: "Minimalist Aluminum RFID Money Clip Wallet", brand: "Bellroy", moods: ["Luxury"], price: 3900, originalPrice: 4900, rating: 4.7, reviewCount: 670, badge: null, isTrending: false, isNew: false, query: "metal money clip wallet minimalist" },
      { name: "Weatherproof Convertible Crossbody Sling Bag", brand: "Bellroy", moods: ["Luxury", "Focus"], price: 9900, originalPrice: 12900, rating: 4.9, reviewCount: 1240, badge: "Bestseller", isTrending: true, isNew: false, query: "sling bag crossbody travel weatherproof" }
    ]
  }
];

// Curated unsplash high quality lifestyle image URLs mapping
const unsplashPhotos = [
  "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
  "https://images.unsplash.com/photo-1585336261026-8f5786372969?w=800&q=80",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
  "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('error', reject);
  });
}

async function buildAll() {
  console.log("Generating 90 products catalog...");
  const catalog = [];
  let globalId = 1;

  for (const catObj of categoriesData) {
    for (let i = 0; i < catObj.items.length; i++) {
      const item = catObj.items[i];
      const slug = slugify(item.name);
      const imgFileName = `${slug}.jpg`;
      const imgPath = path.join(baseDir, imgFileName);
      const publicUrl = `/images/products/${imgFileName}`;
      
      const photoUrl = unsplashPhotos[(globalId - 1) % unsplashPhotos.length];

      try {
        await download(photoUrl, imgPath);
        console.log(`[${globalId}/90] Saved image: ${imgFileName}`);
      } catch (err) {
        console.error(`Failed to download ${imgFileName}, using fallback url:`, err.message);
      }

      catalog.push({
        id: globalId,
        slug,
        name: item.name,
        brand: item.brand,
        description: `${item.name} by ${item.brand}. Crafted with premium materials for maximum durability, aesthetics, and modern luxury living.`,
        shortDescription: `Elevate your space with the ${item.name}. Designed by ${item.brand} for seamless utility and elegance.`,
        longDescription: `Experience unmatched quality with the ${item.name} from ${item.brand}. Every detail is engineered for performance, aesthetic perfection, and lasting satisfaction. Auditioned for beauty, utility, and staying power in our curated collection.`,
        category: catObj.category,
        moods: item.moods,
        price: item.price,
        originalPrice: item.originalPrice,
        rating: item.rating,
        reviewCount: item.reviewCount,
        popularity: 100 - i * 5 + (item.isTrending ? 20 : 0),
        stock: item.stock || Math.floor(Math.random() * 25) + 5,
        badge: item.badge,
        image: publicUrl,
        gallery: [
          publicUrl,
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
          "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80"
        ],
        features: [
          `Premium build by ${item.brand} with luxury finish`,
          "Designed for durability, performance and modern aesthetics",
          "Intuitive operation with ergonomic craftsmanship",
          "Includes 2-year warranty and express global shipping"
        ],
        specifications: {
          Brand: item.brand,
          Material: "Aircraft-grade aluminum & organic composite",
          Warranty: "2 Year Limited Warranty",
          "Shipping Time": "2-3 Business Days",
          Origin: "Imported"
        },
        colors: ["#111111", "#D4AF37", "#E5E5E5"],
        deliveryTime: "2-3 Business Days",
        warranty: "2 Year Limited Warranty",
        isNew: item.isNew,
        isTrending: item.isTrending
      });

      globalId++;
    }
  }

  // Write catalog-data.ts
  const catalogDataCode = `import type { Product } from "@/lib/shop";

export const CATALOG: Product[] = ${JSON.stringify(catalog, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'catalog-data.ts'), catalogDataCode);

  // Write catalog to seed.ts
  const seedCode = `import { sql } from "drizzle-orm";
import { db } from "@/db";
import { products, type NewProductRow } from "@/db/schema";
import { CATALOG } from "@/lib/catalog-data";

export { CATALOG };

export async function ensureSchema(): Promise<void> {
  await db.execute(sql\`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand TEXT,
      description TEXT NOT NULL,
      short_description TEXT,
      long_description TEXT,
      category TEXT NOT NULL,
      moods TEXT[] NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      rating DOUBLE PRECISION NOT NULL,
      review_count INTEGER NOT NULL,
      popularity INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      badge TEXT,
      image TEXT NOT NULL,
      gallery TEXT[],
      features TEXT[],
      specifications JSONB,
      colors TEXT[],
      delivery_time TEXT,
      warranty TEXT,
      is_new BOOLEAN NOT NULL DEFAULT FALSE,
      is_trending BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  \`);
  await db.execute(sql\`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'website',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  \`);
}

export async function ensureSeeded(): Promise<void> {
  await ensureSchema();
  const result = await db.execute(sql\`SELECT COUNT(*)::int AS count FROM products\`);
  const count = (result.rows[0] as { count: number }).count;
  if (count >= 90) return;
  await db.execute(sql\`TRUNCATE TABLE products RESTART IDENTITY\`);
  await db.insert(products).values(CATALOG as unknown as NewProductRow[]);
}
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'db', 'seed.ts'), seedCode);
  console.log("Successfully generated src/lib/catalog-data.ts and src/db/seed.ts with 90 products!");
}

buildAll();
