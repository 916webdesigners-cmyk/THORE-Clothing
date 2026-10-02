/* THORE — shared UI: header, footer, cart, helpers */
(function () {
  const C = window.THORE_CONFIG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => C.currency + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const bySlug = (s) => window.THORE_PRODUCTS.find((p) => p.slug === s);
  const isDark = (k) => ['obsidian', 'moss'].includes(k);
  window.THORE = { money, bySlug, isDark, $, $$ };

  /* ---------- cart ---------- */
  const KEY = 'thore.cart.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} };
  let cart = load();
  const cartApi = window.THORE.cart = {
    items: () => cart,
    count: () => cart.reduce((n, i) => n + i.qty, 0),
    subtotal: () => cart.reduce((n, i) => n + i.qty * bySlug(i.slug).price, 0),
    add(slug, color, size, qty = 1) {
      const f = cart.find((i) => i.slug === slug && i.color === color && i.size === size);
      f ? (f.qty += qty) : cart.push({ slug, color, size, qty });
      commit(); toast('Added to bag');
    },
    setQty(idx, q) { q <= 0 ? cart.splice(idx, 1) : (cart[idx].qty = Math.min(q, 10)); commit(); },
    clear() { cart = []; commit(); }
  };
  function commit() { save(cart); renderDrawer(); $$('.bag b').forEach((b) => (b.textContent = cartApi.count())); document.dispatchEvent(new Event('cart:change')); }

  /* ---------- chrome ---------- */
  const page = document.body.dataset.page || '';
  const header = `
    <header class="header" id="hdr"><div class="announce">Complimentary shipping on orders over ${money(C.freeShippingOver)} · Heavyweight. Oversized. Made to last.</div><div class="wrap header-in">
      <nav class="nav"><a href="shop.html" class="${page === 'shop' ? 'on' : ''}">Shop</a><a href="shop.html?c=hoodies">Hoodies</a><a href="shop.html?c=sweatpants">Sweatpants</a><a href="shop.html?c=tees">Tees</a></nav>
      <button class="burger" aria-label="Menu" id="burger"><i></i><i></i></button>
      <a href="index.html" class="logo" aria-label="THORE home">THORE</a>
      <div class="hr"><a class="bag" href="#" id="bagBtn" aria-label="Open bag">Bag <b>0</b></a></div>
    </div></header>
    <div class="mnav" id="mnav"><a href="shop.html">Shop all</a><a href="shop.html?c=hoodies">Hoodies</a><a href="shop.html?c=sweatpants">Sweatpants</a><a href="shop.html?c=tees">Tees</a><a href="checkout.html">Checkout</a></div>`;
  const footer = `
    <footer><div class="wrap">
      <div class="fgrid">
        <div><div class="flogo">THORE</div><p style="color:var(--muted);max-width:34ch;margin-top:14px">Premium heavyweight essentials, cut oversized. Built to be worn hard and kept for years.</p></div>
        <div><h4>Shop</h4><ul><li><a href="shop.html">All products</a></li><li><a href="shop.html?c=hoodies">Hoodies</a></li><li><a href="shop.html?c=sweatpants">Sweatpants</a></li><li><a href="shop.html?c=tees">Tees</a></li></ul></div>
        <div><h4>Support</h4><ul><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Size guide</a></li><li><a href="#">Contact</a></li></ul></div>
        <div><h4>Follow</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">TikTok</a></li><li><a href="#">X</a></li></ul></div>
      </div>
      <div class="fine"><span>© ${new Date().getFullYear()} THORE. All rights reserved.</span><span>Privacy · Terms</span></div>
    </div></footer>
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping bag"><div class="dh"><h3>Your bag</h3><button id="dClose" aria-label="Close" style="font-size:12px;letter-spacing:.2em;text-transform:uppercase">Close</button></div><div class="dl" id="dl"></div><div class="df" id="df"></div></aside>
    <div class="toast" id="toast"></div>`;
  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  const hdr = $('#hdr');
  const hero = $('.hero');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('solid', y > 40 || !hero);
    hdr.classList.toggle('hide', y > 500 && y > lastY + 4 && !$('#drawer').classList.contains('open'));
    if (y < lastY - 4) hdr.classList.remove('hide');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#burger').onclick = () => { const o = $('#mnav').classList.toggle('open'); document.body.style.overflow = o ? 'hidden' : ''; };

  /* ---------- drawer ---------- */
  function openDrawer() { $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); document.body.style.overflow = ''; }
  window.THORE.openCart = openDrawer;
  $('#bagBtn').onclick = (e) => { e.preventDefault(); openDrawer(); };
  $('#dClose').onclick = $('#scrim').onclick = closeDrawer;
  addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawer());

  function renderDrawer() {
    const dl = $('#dl'), df = $('#df');
    if (!cart.length) {
      dl.innerHTML = `<div class="empty"><p class="display" style="font-size:32px;color:var(--text)">Your bag is empty</p><p style="margin:10px 0 26px">Start with something heavy.</p><a class="btn solid" href="shop.html">Shop all</a></div>`;
      df.innerHTML = ''; return;
    }
    dl.innerHTML = cart.map((it, i) => {
      const p = bySlug(it.slug);
      return `<div class="li"><a class="t" href="product.html?p=${p.slug}&c=${it.color}">${garmentSVG(p, it.color)}</a>
        <div><h4>${p.name}</h4><p>${window.THORE_COLORS[it.color].name} · ${it.size}</p>
        <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${it.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div>
        <button class="rm" data-rm="${i}">Remove</button></div><div>${money(p.price * it.qty)}</div></div>`;
    }).join('');
    const sub = cartApi.subtotal(), left = Math.max(0, C.freeShippingOver - sub);
    df.innerHTML = `<p style="font-size:12px;color:var(--muted)">${left > 0 ? `You're ${money(left)} away from complimentary shipping` : 'You’ve unlocked complimentary shipping'}</p>
      <div class="ship-bar"><i style="width:${Math.min(100, (sub / C.freeShippingOver) * 100)}%"></i></div>
      <div class="row tot"><span>Subtotal</span><span>${money(sub)}</span></div>
      <p class="note" style="margin:6px 0 18px">Taxes and shipping calculated at checkout.</p>
      <a class="btn solid full" href="checkout.html">Checkout</a>`;
    $$('[data-q]', dl).forEach((b) => (b.onclick = () => cartApi.setQty(+b.dataset.q, cart[+b.dataset.q].qty + +b.dataset.d)));
    $$('[data-rm]', dl).forEach((b) => (b.onclick = () => cartApi.setQty(+b.dataset.rm, 0)));
  }

  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1800); if (msg === 'Added to bag') setTimeout(openDrawer, 350); }
  window.THORE.toast = toast;

  /* ---------- shared product card ---------- */
  window.THORE.card = (p, colorKey) => {
    const k = colorKey || p.colors[0], d = isDark(k) ? ' d' : '';
    return `<a class="card reveal" href="product.html?p=${p.slug}&c=${k}">
      <div class="img${d}">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<div class="v f">${garmentSVG(p, k, 'front')}</div><div class="v b">${garmentSVG(p, k, 'back')}</div></div>
      <div class="meta"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
      <div class="dots">${p.colors.map((c) => `<i style="background:${window.THORE_COLORS[c].hex}" title="${window.THORE_COLORS[c].name}"></i>`).join('')}<em>${p.colors.length} colours</em></div></a>`;
  };

  /* reveal on scroll */
  window.THORE.observe = (root = document) => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.reveal:not(.in)', root).forEach((el) => io.observe(el));
  };
  renderDrawer(); $$('.bag b').forEach((b) => (b.textContent = cartApi.count()));
  document.addEventListener('DOMContentLoaded', () => window.THORE.observe());
})();
