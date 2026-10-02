/* THORE — procedural garment illustrations (SVG). No photo assets needed. */
(function () {
  let uid = 0;
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (a) => '#' + a.map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
  const mix = (h, t, k) => { const a = rgb(h), b = rgb(t); return hex(a.map((v, i) => v + (b[i] - v) * k)); };
  const dark = (h, k) => mix(h, '#000000', k);
  const light = (h, k) => mix(h, '#ffffff', k);
  const lum = (h) => { const [r, g, b] = rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

  function build(type, base, view, variant) {
    const id = 'g' + (++uid);
    const ink = lum(base) > 0.5 ? '#141414' : '#efe9dd';
    const inkSoft = lum(base) > 0.5 ? 'rgba(20,20,20,.55)' : 'rgba(239,233,221,.55)';
    const rib = dark(base, 0.14);
    const deep = dark(base, 0.5);
    const defs = `
      <defs>
        <linearGradient id="${id}s" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".22" stop-color="#000" stop-opacity=".04"/>
          <stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset=".78" stop-color="#000" stop-opacity=".05"/>
          <stop offset="1" stop-color="#000" stop-opacity=".38"/>
        </linearGradient>
        <linearGradient id="${id}v" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".18"/>
        </linearGradient>
        <filter id="${id}n" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="t"/>
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.38"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
        <filter id="${id}b"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>`;
    // a shaded fabric panel: base colour + side shading + grain
    const P = (d, tone = 0, extra = '') => {
      const f = tone > 0 ? light(base, tone) : tone < 0 ? dark(base, -tone) : base;
      return `<path d="${d}" fill="${f}" ${extra}/><path d="${d}" fill="url(#${id}s)"/><path d="${d}" fill="url(#${id}v)"/><path d="${d}" fill="#000" filter="url(#${id}n)" opacity=".28"/>`;
    };
    const L = (d, op = 0.22, w = 2, col = '#000', dash = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
    const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="16" fill="#000" opacity=".3" filter="url(#${id}b)"/>`;
    const mirror = (inner) => `<g transform="translate(600 0) scale(-1 1)">${inner}</g>`;
    const word = (x, y, size, sp, anchor = 'middle', op = 1, rot = '') =>
      `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="'Cormorant Garamond','Playfair Display',Georgia,serif" font-weight="600" font-size="${size}" letter-spacing="${sp}" fill="${ink}" fill-opacity="${op}" ${rot ? `transform="${rot}"` : ''}>THORE</text>`;
    const bolt = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M6 0 L-6 14 L0 14 L-5 28 L8 11 L1 11 Z" fill="${ink}" fill-opacity=".9"/>`;

    let vb = '0 0 600 720', body = '';

    if (type === 'hoodie') {
      const zip = variant === 'zip';
      const sleeve = (m) => m(`${P('M158 168 C112 180 82 202 72 262 C60 362 56 470 64 560 L140 568 C148 470 152 380 170 300 Z')}
        ${P('M62 552 L142 560 L141 594 L61 586 Z', -0.1)}${L('M70 560 L70 588 M82 561 L82 589 M94 562 L94 590 M106 563 L106 591 M118 564 L118 592 M130 565 L130 592', .25, 1.4)}
        ${L('M100 230 C112 300 112 420 106 520', .2, 3)}${L('M90 330 C98 360 96 420 92 470', .12, 3, '#fff')}`);
      if (view === 'back') {
        body = `${shadow(300, 668, 230)}
          ${P('M206 158 C186 104 236 62 300 62 C364 62 414 104 394 158 Z', -0.15)}
          ${sleeve((s) => s)}${sleeve(mirror)}
          ${P('M158 160 C200 148 250 146 300 146 C350 146 400 148 442 160 L468 582 C400 598 200 598 132 582 Z')}
          ${P('M132 576 C200 592 400 592 468 576 L468 616 C400 632 200 632 132 616 Z', -0.12)}
          ${L('M144 584 L144 616 M160 586 L160 618 M176 588 L176 620 M192 589 L192 621 M208 590 L208 622 M224 590 L224 622 M240 591 L240 623 M256 591 L256 623 M272 591 L272 623 M288 591 L288 623 M304 591 L304 623 M320 591 L320 623 M336 591 L336 623 M352 590 L352 622 M368 590 L368 622 M384 589 L384 621 M400 588 L400 620 M416 586 L416 618 M432 584 L432 616 M448 581 L448 613', .22, 1.4)}
          ${P('M222 154 C232 116 368 116 378 154 C366 214 234 214 222 154 Z', 0.04)}
          ${L('M222 154 C240 200 360 200 378 154', .3, 3)}${L('M300 168 L300 214', .22, 2)}
          ${word(300, 330, 82, 16)}${L('M196 352 L404 352', .5, 1.4, ink)}
          <text x="300" y="382" text-anchor="middle" font-family="Inter,Helvetica,Arial,sans-serif" font-size="11" letter-spacing="7" fill="${inkSoft}">HEAVYWEIGHT FLEECE</text>
          ${L('M180 260 C186 360 186 480 176 570', .14, 4)}${L('M420 260 C414 360 414 480 424 570', .14, 4)}`;
      } else {
        body = `${shadow(300, 668, 230)}
          ${P('M206 158 C186 104 236 62 300 62 C364 62 414 104 394 158 Z', -0.15)}
          ${sleeve((s) => s)}${sleeve(mirror)}
          ${P('M158 160 C200 148 250 146 300 146 C350 146 400 148 442 160 L468 582 C400 598 200 598 132 582 Z')}
          ${P('M132 576 C200 592 400 592 468 576 L468 616 C400 632 200 632 132 616 Z', -0.12)}
          ${L('M144 584 L144 616 M160 586 L160 618 M176 588 L176 620 M192 589 L192 621 M208 590 L208 622 M224 590 L224 622 M240 591 L240 623 M256 591 L256 623 M272 591 L272 623 M288 591 L288 623 M304 591 L304 623 M320 591 L320 623 M336 591 L336 623 M352 590 L352 622 M368 590 L368 622 M384 589 L384 621 M400 588 L400 620 M416 586 L416 618 M432 584 L432 616 M448 581 L448 613', .22, 1.4)}
          <path d="M232 160 C240 114 360 114 368 160 C352 198 248 198 232 160 Z" fill="${deep}"/>
          <path d="M214 150 C228 204 268 222 300 222 C332 222 372 204 386 150 C372 180 336 200 300 200 C264 200 228 180 214 150 Z" fill="${light(base, .02)}"/>
          ${L('M214 150 C228 204 268 222 300 222 C332 222 372 204 386 150', .35, 3)}
          ${zip
            ? `${L('M300 222 L300 584', .5, 3)}${L('M300 224 L300 582', .75, 1.2, '#cfcfcf', '3 3')}<rect x="293" y="226" width="14" height="26" rx="3" fill="#bdbdbd"/><rect x="296" y="246" width="8" height="14" rx="2" fill="#8a8a8a"/>
               ${L('M182 400 C176 450 174 500 172 548', .45, 3)}${L('M418 400 C424 450 426 500 428 548', .45, 3)}`
            : `${L('M281 214 C279 250 277 282 274 316', .85, 5, light(base, .55))}${L('M319 214 C321 248 324 280 327 312', .85, 5, light(base, .55))}
               <rect x="270" y="312" width="9" height="16" rx="3" fill="#bdbdbd" transform="rotate(4 274 320)"/><rect x="323" y="308" width="9" height="16" rx="3" fill="#bdbdbd" transform="rotate(-4 327 316)"/>
               ${P('M176 408 L424 408 L454 528 L146 528 Z', -0.05)}${L('M176 408 L424 408', .3, 2.5)}${L('M188 414 L160 520 M412 414 L440 520', .3, 2.5)}${L('M178 528 L422 528', .2, 2)}`}
          ${word(394, 262, 24, 5)}
          ${L('M200 300 C206 380 204 470 196 560', .12, 5)}${L('M400 300 C396 380 398 470 406 560', .1, 5, '#fff')}
          ${L('M176 220 C190 232 206 240 224 244', .18, 3)}${L('M424 220 C410 232 394 240 376 244', .18, 3)}`;
        if (view === 'detail') vb = '210 170 280 200';
      }
    }

    if (type === 'sweats') {
      const wide = variant === 'wide';
      vb = '0 0 600 820';
      const lx = wide ? 126 : 152, rx = wide ? 474 : 448; // hem outer edges
      const legs = `M188 116 L412 116 L${wide ? 452 : 440} 440 L${rx} 770 C${rx - 38} 786 ${rx - 88} 788 322 776 C316 600 308 440 300 306 C292 440 284 600 278 776 C${lx + 88} 788 ${lx + 38} 786 ${lx} 770 L${wide ? 148 : 160} 440 Z`;
      const hemL = `M${lx} 770 C${lx + 38} 756 ${lx + 88} 758 278 774 C${lx + 88} 790 ${lx + 38} 790 ${lx} 770 Z`;
      const hemR = `M${rx} 770 C${rx - 38} 756 ${rx - 88} 758 322 774 C${rx - 88} 790 ${rx - 38} 790 ${rx} 770 Z`;
      if (view === 'back') {
        body = `${shadow(300, 800, 230)}
          ${P(legs)}<path d="${hemL}" fill="${deep}" opacity=".75"/><path d="${hemR}" fill="${deep}" opacity=".75"/>
          ${P('M188 66 L412 66 L414 124 L186 124 Z', -0.1)}${L('M200 66 L198 124 M216 66 L215 124 M232 66 L231 124 M248 66 L248 124 M264 66 L264 124 M280 66 L280 124 M296 66 L296 124 M312 66 L312 124 M328 66 L328 124 M344 66 L344 124 M360 66 L360 124 M376 66 L376 124 M392 66 L392 124', .2, 1.4)}
          ${L('M300 124 L300 306', .3, 2.5)}${L('M216 220 L276 220 M222 214 L270 214', .35, 2)}${L('M324 220 L384 220 M330 214 L378 214', .35, 2)}
          ${word(300, 104, 22, 9)}${L('M240 640 C262 652 286 654 296 650 M360 640 C338 652 314 654 304 650', .2, 3)}`;
      } else {
        body = `${shadow(300, 800, 230)}
          ${P(legs)}<path d="${hemL}" fill="${deep}" opacity=".75"/><path d="${hemR}" fill="${deep}" opacity=".75"/>
          ${P('M188 66 L412 66 L414 124 L186 124 Z', -0.1)}${L('M200 66 L198 124 M216 66 L215 124 M232 66 L231 124 M248 66 L248 124 M264 66 L264 124 M280 66 L280 124 M296 66 L296 124 M312 66 L312 124 M328 66 L328 124 M344 66 L344 124 M360 66 L360 124 M376 66 L376 124 M392 66 L392 124', .2, 1.4)}
          ${L('M300 124 L300 306', .3, 2.5)}${L('M300 126 C288 170 290 230 300 262', .25, 2)}
          ${L('M198 132 C214 210 224 260 226 330', .38, 2.5)}${L('M402 132 C386 210 376 260 374 330', .38, 2.5)}
          ${L('M284 98 C280 150 274 190 268 236', .85, 5, light(base, .55))}${L('M316 98 C320 148 328 186 334 232', .85, 5, light(base, .55))}
          <rect x="262" y="234" width="9" height="16" rx="3" fill="#bdbdbd" transform="rotate(8 266 242)"/><rect x="329" y="230" width="9" height="16" rx="3" fill="#bdbdbd" transform="rotate(-8 334 238)"/>
          ${word(396, 400, 26, 7, 'middle', 1, 'rotate(90 396 392)')}
          ${L(`M${lx + 26} 676 C${lx + 60} 690 ${lx + 100} 690 262 676`, .2, 3)}${L(`M${rx - 26} 676 C${rx - 60} 690 ${rx - 100} 690 338 676`, .2, 3)}
          ${L(`M${lx + 34} 716 C${lx + 66} 728 ${lx + 100} 728 266 716`, .14, 3)}${L(`M${rx - 34} 716 C${rx - 66} 728 ${rx - 100} 728 334 716`, .14, 3)}
          ${L('M236 330 C240 420 236 520 230 600', .1, 5, '#fff')}${L('M364 330 C360 420 364 520 370 600', .1, 5, '#fff')}`;
        if (view === 'detail') vb = '300 300 190 150';
      }
    }

    if (type === 'tee') {
      vb = '0 0 600 700';
      const long = variant === 'long';
      const bot = long ? 636 : 590;
      const sl = long ? 322 : 296;
      const shape = `M222 112 C262 130 338 130 378 112 L512 170 L${long ? 566 : 556} ${sl} L474 ${sl + 32} L462 ${bot} C384 ${bot + 12} 216 ${bot + 12} 138 ${bot} L126 ${sl + 32} L${long ? 34 : 44} ${sl} L88 170 Z`;
      const collar = view === 'back'
        ? `${P('M222 112 C262 124 338 124 378 112 L374 128 C338 142 262 142 226 128 Z', -0.12)}`
        : `<path d="M232 114 C265 96 335 96 368 114 C336 142 264 142 232 114 Z" fill="${deep}"/>${P('M222 112 C256 150 344 150 378 112 L372 126 C340 172 260 172 228 126 Z', -0.12)}${L('M232 126 C262 160 338 160 368 126', .25, 1.4, '#000', '3 3')}`;
      const hems = `${L(`M${long ? 40 : 50} ${sl - 14} L466 ${sl + 18}`, 0, 0)}${L(`M${long ? 566 : 556} ${sl - 14} L${long ? 478 : 478} ${sl + 16}`, .22, 1.4, '#000', '4 3')}${L(`M${long ? 34 : 44} ${sl - 14} L${long ? 122 : 122} ${sl + 16}`, .22, 1.4, '#000', '4 3')}${L(`M140 ${bot - 12} C216 ${bot} 384 ${bot} 460 ${bot - 12}`, .22, 1.4, '#000', '4 3')}`;
      if (view === 'back') {
        body = `${shadow(300, 668, 220)}${P(shape)}${collar}${hems}
          ${word(300, long ? 330 : 300, long ? 104 : 90, long ? 18 : 15)}${L(`M150 ${long ? 354 : 324} L450 ${long ? 354 : 324}`, .45, 1.4, ink)}
          <text x="300" y="${long ? 384 : 354}" text-anchor="middle" font-family="Inter,Helvetica,Arial,sans-serif" font-size="11" letter-spacing="8" fill="${inkSoft}">THE VAULTED EDIT</text>
          ${L('M160 330 C164 420 162 500 156 570', .12, 5)}${L('M440 330 C436 420 438 500 444 570', .12, 5)}`;
      } else {
        body = `${shadow(300, 668, 220)}${P(shape)}${collar}${hems}
          ${word(392, 208, 24, 5)}
          ${L('M150 300 C156 400 154 500 148 570', .12, 5)}${L('M450 300 C446 400 448 500 454 570', .12, 5)}
          ${L('M120 190 C130 230 128 260 124 290', .18, 3)}${L('M480 190 C470 230 472 260 476 290', .18, 3)}`;
        if (view === 'detail') vb = '300 150 180 130';
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" preserveAspectRatio="xMidYMid meet">${defs}${body}</svg>`;
  }

  window.garmentSVG = (product, colorKey, view = 'front') =>
    build(product.type, window.THORE_COLORS[colorKey].hex, view, product.variant);
})();
