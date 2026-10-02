# THORE

Static premium-apparel storefront (no build step). Open `index.html` or run `python3 -m http.server`.

- `index.html` home with animated lightning hero · `shop.html` · `product.html?p=<slug>&c=<colour>` · `checkout.html`
- `js/products.js` — products, prices, colours, copy, shipping/tax config (`THORE_CONFIG.heroVideo` for an optional hero video)
- `js/garments.js` — procedural SVG garment art (hoodie, sweatpant, tee; front/back/detail)
- `js/hero.js` — canvas storm/lightning animation · `css/styles.css` — design tokens at `:root`
- Cart persists in localStorage. Checkout is a **demo**: no payment is processed.
