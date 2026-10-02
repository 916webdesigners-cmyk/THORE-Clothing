/* THORE — product catalogue & site config. Edit prices, copy and colours here. */
window.THORE_CONFIG = {
  currency: '$',
  freeShippingOver: 200,
  shipping: { standard: 12, express: 28 },
  taxRate: 0.0875,
  heroVideo: '' // e.g. 'assets/hero.mp4' once a Veo/Runway clip is generated; canvas animation is the fallback
};

window.THORE_COLORS = {
  obsidian: { name: 'Obsidian', hex: '#121212' },
  bone:     { name: 'Bone',     hex: '#e6dfd1' },
  ash:      { name: 'Ash',      hex: '#85857f' },
  moss:     { name: 'Moss',     hex: '#3a3e32' },
  clay:     { name: 'Clay',     hex: '#7b5d4b' },
  fog:      { name: 'Fog',      hex: '#b9bcbd' }
};

window.THORE_PRODUCTS = [
  { slug: 'mjolnir-hoodie', name: 'Mjolnir Oversized Hoodie', category: 'hoodies', type: 'hoodie', variant: 'pullover',
    price: 178, colors: ['obsidian', 'bone', 'ash', 'moss'], badge: 'Bestseller',
    blurb: 'Heavyweight fleece, dropped shoulders, a roomy hood and a boxy cut that stacks over everything.',
    details: ['480 GSM brushed-back cotton fleece', 'Drop shoulder, boxy oversized fit', 'Double-layer hood with flat drawcord', 'Embroidered THORE chest mark, large back print', 'Garment dyed and enzyme washed'],
    fit: 'Cut oversized. True to size for the intended baggy fit — size down one for a closer silhouette.' },
  { slug: 'valhalla-zip-hoodie', name: 'Valhalla Zip Hoodie', category: 'hoodies', type: 'hoodie', variant: 'zip',
    price: 198, colors: ['obsidian', 'clay', 'fog'], badge: 'New',
    blurb: 'The oversized hoodie in full-zip form. Hand pockets, a heavy two-way zip, and a hood that holds its shape.',
    details: ['480 GSM brushed-back cotton fleece', 'Heavy two-way metal zip', 'Drop shoulder, boxy oversized fit', 'Vertical hand pockets', 'Embroidered THORE chest mark'],
    fit: 'Cut oversized. True to size for the intended baggy fit.' },
  { slug: 'bifrost-sweatpant', name: 'Bifrost Uncuffed Sweatpant', category: 'sweatpants', type: 'sweats', variant: 'straight',
    price: 148, colors: ['obsidian', 'bone', 'ash', 'moss'], badge: 'Bestseller',
    blurb: 'Straight, uncuffed and cut to fall over your shoes. Heavyweight fleece with a wide, relaxed leg.',
    details: ['450 GSM brushed-back cotton fleece', 'Open straight hem — no cuff', 'Wide relaxed leg, mid-rise', 'Flat drawcord, deep side pockets', 'Vertical THORE print on thigh'],
    fit: 'Relaxed through the leg with a long inseam. Size up for extra stack at the hem.' },
  { slug: 'ragnarok-wide-sweatpant', name: 'Ragnarok Wide-Leg Sweatpant', category: 'sweatpants', type: 'sweats', variant: 'wide',
    price: 158, colors: ['obsidian', 'clay', 'fog'], badge: '',
    blurb: 'Our widest leg yet. Pooling hem, heavy drape, and a clean waistband built for everyday wear.',
    details: ['450 GSM brushed-back cotton fleece', 'Extra-wide uncuffed leg', 'Long inseam for a pooled hem', 'Deep side pockets and back welt pocket', 'Vertical THORE print on thigh'],
    fit: 'Very wide leg, long inseam. True to size.' },
  { slug: 'odin-boxy-tee', name: 'Odin Boxy Tee', category: 'tees', type: 'tee', variant: 'boxy',
    price: 78, colors: ['obsidian', 'bone', 'ash', 'clay'], badge: '',
    blurb: 'A heavyweight boxy tee with a cropped body, wide sleeve and a thick ribbed collar.',
    details: ['280 GSM combed cotton jersey', 'Boxy cropped body, drop shoulder', 'Thick 1x1 ribbed collar', 'Embroidered THORE chest mark, back print', 'Garment dyed'],
    fit: 'Boxy and slightly cropped. True to size.' },
  { slug: 'storm-oversized-tee', name: 'Storm Oversized Tee', category: 'tees', type: 'tee', variant: 'long',
    price: 88, colors: ['obsidian', 'bone', 'moss', 'fog'], badge: 'New',
    blurb: 'Longer, looser and heavier. An oversized tee with a dropped hem and a statement THORE back print.',
    details: ['300 GSM combed cotton jersey', 'Extended length, drop shoulder', 'Thick ribbed collar', 'Oversized THORE back print', 'Garment dyed'],
    fit: 'Oversized and longline. Size down for a more standard oversized fit.' }
];

window.THORE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
