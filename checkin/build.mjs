// ============================================================
// Excellent Vision Real Estate — Check-In page builder
// Renders a passcode-gated check-in page whose content is
// ENCRYPTED with the passcode (PBKDF2 + AES-GCM). The sensitive
// details (door code, WiFi, address) never appear in the page
// source or search-engine cache — the page only decrypts when
// the correct passcode is entered.
//
// Usage:  node checkin/build.mjs ridgecrest
// Reads:  checkin/_src/<slug>.json   (plaintext — git-ignored)
// Writes: checkin/<slug>/index.html  (encrypted — safe to commit)
// ============================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as crypto } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PBKDF2_ITERATIONS = 310000;

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node checkin/build.mjs <slug>   (e.g. ridgecrest)');
  process.exit(1);
}

const data = JSON.parse(readFileSync(join(__dirname, '_src', `${slug}.json`), 'utf8'));

// ── Small HTML helpers ──────────────────────────────────────
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Body copy in the JSON may contain intentional <strong>/<em>/<a>; keep it.
const rich = (s = '') => String(s);

// ── Content renderer (the part that gets encrypted) ─────────
function renderContent(d) {
  const assets = `../assets/${d.slug}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.checkin.geo || d.checkin.address)}`;

  const codeChip = (value, note) =>
    value
      ? `<button class="code-chip" data-copy="${esc(value)}"><span class="code-chip-val">${esc(value)}</span><span class="code-chip-copy">Tap to copy</span></button>`
      : `<span class="code-chip code-chip-pending">${esc(note)}</span>`;

  const figures = (list, fallbackAlt) =>
    (list || [])
      .map(
        (p) => `<figure class="step-figure">
             <img src="${assets}/${esc(p.src)}" alt="${esc(p.caption || fallbackAlt)}" decoding="async" />
             ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}
           </figure>`
      )
      .join('');

  const steps = d.steps
    .map((s, i) => {
      const body = s.body.map((p) => `<p>${rich(p)}</p>`).join('');
      const photoList = s.photos || (s.photo ? [{ src: s.photo, caption: s.caption }] : []);
      return `
        <article class="step">
          <div class="step-num">${i + 1}</div>
          <div class="step-body">
            <h3>${esc(s.title)}</h3>
            ${body}
            ${figures(photoList, s.title)}
          </div>
        </article>`;
    })
    .join('');

  const amenities = d.amenities
    .map(
      (a) => `
      <div class="info-card">
        <div class="info-card-head"><span class="info-ico">${a.icon}</span><h4>${esc(a.title)}</h4></div>
        ${a.lines.map((l) => `<p>${rich(l)}</p>`).join('')}
      </div>`
    )
    .join('');

  const rules = d.rules
    .map(
      (r) => `
      <details class="rule">
        <summary class="rule-sum">
          <span class="rule-ico">${r.icon}</span>
          <span class="rule-title">${esc(r.title)}</span>
          <span class="rule-chev" aria-hidden="true"></span>
        </summary>
        <div class="rule-text">${rich(r.text)}</div>
      </details>`
    )
    .join('');

  const nearbyGroup = (group) => `
      <div class="nearby-group">
        <h4>${esc(group.title)}</h4>
        <ul class="nearby-list">
          ${group.items.map((it) => `<li><span class="nearby-name">${esc(it.name)}</span><span class="nearby-meta">${esc(it.meta)}</span></li>`).join('')}
        </ul>
      </div>`;
  const nearby = (d.nearby || []).map(nearbyGroup).join('');

  const co = d.checkout;
  const coFees = (co.fees || [])
    .map((f) => `<li><span>${esc(f.item)}</span><span class="fee-amt">${esc(f.amount)}</span></li>`)
    .join('');
  const coChecklist = (co.checklist || [])
    .map((c) => `<li>${rich(c)}</li>`)
    .join('');

  return `
    <header class="ck-hero">
      <div class="ck-hero-inner">
        <div class="brandmark">${esc(d.brand)}</div>
        <span class="ck-eyebrow">📍 ${esc(d.unitTag)}</span>
        <h1>${esc(d.unitTitle)}</h1>
        <p class="ck-lead">${rich(d.welcomeLead)}</p>
      </div>
    </header>

    <div class="ck-wrap">

      <section class="facts">
        <div class="fact">
          <span class="fact-label">Self Check-In</span>
          <span class="fact-value">${esc(d.checkin.window)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Address</span>
          <span class="fact-value">${esc(d.checkin.address)}</span>
          <a class="fact-link" href="${mapsUrl}" target="_blank" rel="noopener">Open in Google Maps →</a>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Access Code</span>
        <h2>Your front door code</h2>
        <div class="codes-row codes-row-single">
          <div class="code-item">
            <span class="code-label">Keyless Entry Code</span>
            ${codeChip(d.codes.door, d.codes.doorNote)}
            <span class="code-hint">${rich(d.codes.hint)}</span>
          </div>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Step by Step</span>
        <h2>Getting inside</h2>
        <div class="steps">${steps}</div>
      </section>

      <section class="block wifi-block">
        <span class="block-eyebrow">Stay Connected</span>
        <h2>Wi-Fi</h2>
        <div class="wifi-card">
          <div class="wifi-row">
            <span class="wifi-label">Network</span>
            <button class="code-chip" data-copy="${esc(d.wifi.name)}"><span class="code-chip-val">${esc(d.wifi.name)}</span><span class="code-chip-copy">Tap to copy</span></button>
          </div>
          <div class="wifi-row">
            <span class="wifi-label">Password</span>
            <button class="code-chip" data-copy="${esc(d.wifi.pass)}"><span class="code-chip-val">${esc(d.wifi.pass)}</span><span class="code-chip-copy">Tap to copy</span></button>
          </div>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Good to Know</span>
        <h2>Around the house</h2>
        <div class="info-grid">${amenities}</div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Good Neighbours</span>
        <h2>House rules</h2>
        <div class="rules-grid">${rules}</div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Just In Case</span>
        <h2>Emergency &amp; nearby</h2>
        <div class="info-card emergency-card">
          <p>${rich(d.emergency.intro)}</p>
          <ul class="emergency-list">
            ${d.emergency.contacts.map((c) => `<li><span>${esc(c.label)}</span><span class="fee-amt">${esc(c.value)}</span></li>`).join('')}
          </ul>
        </div>
        <div class="nearby-grid">${nearby}</div>
      </section>

      <section class="block depart-block">
        <span class="block-eyebrow">Before You Go</span>
        <h2>Checking out</h2>
        <p>${rich(co.intro)}</p>
        <div class="checkout-facts">
          <div class="co-fact"><span class="co-fact-label">Check-out by</span><span class="co-fact-value">${esc(co.time)}</span></div>
          <div class="co-fact"><span class="co-fact-label">Late check-out</span><span class="co-fact-value">${esc(co.lateFee)}</span></div>
        </div>
        ${co.returnItems ? `<div class="return-callout"><span class="return-ico">🔑</span><p>${rich(co.returnItems)}</p></div>` : ''}
        <h3 class="co-sub">Your check-out checklist</h3>
        <ul class="checklist">${coChecklist}</ul>
        ${coFees ? `<h3 class="co-sub">Fees to know about</h3><ul class="fee-list">${coFees}</ul>` : ''}
        ${co.note ? `<p class="depart-note">${esc(co.note)}</p>` : ''}
      </section>

      <footer class="ck-foot">
        ${d.manualUrl ? `<a class="area-guide-btn" href="${esc(d.manualUrl)}" target="_blank" rel="noopener">📖 Download the full welcome manual →</a>` : ''}
        <p class="ck-closing">${esc(d.closing)}</p>
        <p class="ck-sign">— The ${esc(d.brand)}</p>
      </footer>
    </div>`;
}

// ── Encrypt the content with the passcode ───────────────────
async function encrypt(plaintext, passcode) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  const b64 = (buf) => Buffer.from(buf).toString('base64');
  return { salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}

// ── Page shell (unlock UI + decryptor) ──────────────────────
function shell(payload, d) {
  const digits = String(d.passcode).length;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Private Check-In · ${esc(d.brand)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500..800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#0A2540; --gold:#C7924B; --gold-dk:#B07E3A;
    --beige:#FAF6EF; --cream:#FDFBF6; --white:#fff; --ink:#1A1D20; --muted:#64748B;
    --border:#e9e0d0; --shadow:0 10px 40px rgba(10,37,64,.10);
    --serif:'Playfair Display',Georgia,serif; --sans:'Plus Jakarta Sans',system-ui,sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--sans);color:var(--ink);background:var(--beige);-webkit-font-smoothing:antialiased;line-height:1.6}
  img{max-width:100%;display:block}

  /* ── Lock screen ── */
  #lock{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px;
    background:radial-gradient(1200px 600px at 50% -10%, #163a5e 0%, var(--navy) 55%, #061424 100%)}
  .lock-card{width:100%;max-width:420px;background:var(--cream);border-radius:18px;box-shadow:var(--shadow);
    padding:44px 34px;text-align:center;border:1px solid rgba(199,146,75,.35)}
  .lock-brand{font-family:var(--serif);font-size:1.5rem;color:var(--navy);letter-spacing:.5px}
  .lock-brand span{display:block;font-family:var(--sans);font-size:.62rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-dk);margin-top:6px;font-weight:600}
  .lock-rule{width:54px;height:2px;background:var(--gold);margin:22px auto}
  .lock-h{font-family:var(--serif);font-size:1.45rem;color:var(--ink);margin-bottom:6px}
  .lock-sub{font-size:.9rem;color:var(--muted);margin-bottom:26px}
  .pin{display:flex;gap:10px;justify-content:center;margin-bottom:8px}
  .pin input{width:56px;height:66px;text-align:center;font-size:1.7rem;font-weight:600;font-family:var(--serif);
    color:var(--navy);background:var(--white);border:1.5px solid var(--border);border-radius:12px;outline:none;transition:.15s}
  .pin input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(199,146,75,.2)}
  .lock-err{min-height:20px;color:#b4232a;font-size:.85rem;margin:10px 0 4px;opacity:0;transition:.2s}
  .lock-err.show{opacity:1}
  .lock-btn{width:100%;margin-top:14px;padding:15px;border:none;border-radius:12px;background:var(--navy);color:#fff;
    font-family:var(--sans);font-size:.95rem;font-weight:600;letter-spacing:.02em;cursor:pointer;transition:.2s}
  .lock-btn:hover{background:#123252}
  .lock-btn:disabled{opacity:.6;cursor:default}
  .lock-hint{margin-top:18px;font-size:.78rem;color:var(--muted)}

  /* ── Content ── */
  #content{display:none}
  #content.show{display:block;animation:fade .5s ease}
  @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

  .ck-hero{background:radial-gradient(900px 500px at 50% -30%, #1b3f66 0%, var(--navy) 60%, #061424 100%);color:#fff;padding:64px 24px 72px;text-align:center}
  .ck-hero-inner{max-width:760px;margin:0 auto}
  .brandmark{font-family:var(--serif);font-size:1.25rem;letter-spacing:.5px;color:#fff;opacity:.95}
  .ck-eyebrow{display:inline-block;margin:22px 0 12px;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
  .ck-hero h1{font-family:var(--serif);font-size:2.5rem;line-height:1.15;font-weight:700}
  .ck-lead{margin:20px auto 0;max-width:600px;color:#cdd9e6;font-size:1.02rem;font-weight:300}

  .ck-wrap{max-width:760px;margin:-40px auto 0;padding:0 20px 80px}
  .facts{display:grid;grid-template-columns:1fr 1.4fr;gap:16px;background:var(--white);border:1px solid var(--border);
    border-radius:16px;padding:24px;box-shadow:var(--shadow)}
  .fact-label{display:block;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-dk);font-weight:600;margin-bottom:6px}
  .fact-value{display:block;font-family:var(--serif);font-size:1.12rem;color:var(--navy);line-height:1.35}
  .fact-link{display:inline-block;margin-top:8px;font-size:.85rem;color:var(--gold-dk);text-decoration:none;font-weight:600}
  .fact-link:hover{text-decoration:underline}

  .block{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:32px 28px;margin-top:20px;box-shadow:0 4px 20px rgba(10,37,64,.05)}
  .block-eyebrow{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-dk);font-weight:700}
  .block h2{font-family:var(--serif);font-size:1.7rem;color:var(--navy);margin:6px 0 22px;font-weight:700}
  .block p{color:#3c4552;margin-bottom:12px}
  .block p:last-child{margin-bottom:0}
  .block a{color:var(--gold-dk)}

  /* codes */
  .codes-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .codes-row-single{grid-template-columns:1fr;max-width:340px}
  .code-item{display:flex;flex-direction:column;gap:10px}
  .code-label{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600}
  .code-hint{font-size:.82rem;color:var(--muted)}
  .code-chip{appearance:none;text-align:left;cursor:pointer;border:1.5px dashed var(--gold);background:linear-gradient(180deg,#fffdf8,#fbf3e6);
    border-radius:12px;padding:14px 16px;transition:.18s;font-family:inherit}
  .code-chip:hover{border-style:solid;transform:translateY(-1px)}
  .code-chip-val{display:block;font-family:var(--serif);font-size:1.7rem;font-weight:700;letter-spacing:.14em;color:var(--navy)}
  .code-chip-copy{display:block;font-size:.72rem;color:var(--gold-dk);font-weight:600;margin-top:2px}
  .code-chip.copied .code-chip-copy::after{content:' ✓ copied'}
  .code-chip-pending{border-style:solid;border-color:var(--border);background:var(--beige);cursor:default}
  span.code-chip-pending{display:block;font-size:.92rem;color:var(--muted);font-family:var(--sans);font-weight:500;letter-spacing:normal}

  /* steps */
  .steps{display:flex;flex-direction:column;gap:26px}
  .step{display:grid;grid-template-columns:44px 1fr;gap:18px}
  .step-num{width:44px;height:44px;border-radius:50%;background:var(--navy);color:var(--gold);font-family:var(--serif);
    font-size:1.25rem;font-weight:700;display:flex;align-items:center;justify-content:center}
  .step-body h3{font-family:var(--serif);font-size:1.28rem;color:var(--navy);margin-bottom:8px}
  .step-figure{margin-top:14px;border-radius:12px;overflow:hidden;border:1px solid var(--border);cursor:zoom-in}
  .step-figure img{width:100%;height:auto}
  .step-figure figcaption{font-size:.8rem;color:var(--muted);padding:10px 14px;background:var(--beige)}

  /* wifi */
  .wifi-card{display:flex;flex-direction:column;gap:16px}
  .wifi-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .wifi-label{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600}
  .wifi-row .code-chip{flex:1;max-width:320px}
  .wifi-row .code-chip-val{font-size:1.15rem;letter-spacing:.06em}

  /* info grid + rules */
  .info-grid{display:grid;grid-template-columns:1fr;gap:16px}
  .info-card{border:1px solid var(--border);border-radius:12px;padding:18px 20px;background:var(--cream)}
  .info-card-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .info-ico{font-size:1.3rem}
  .info-card h4{font-family:var(--serif);font-size:1.15rem;color:var(--navy)}
  .info-card p{font-size:.92rem}
  .rules-grid{display:flex;flex-direction:column;gap:10px}
  .rule{border:1px solid var(--border);border-radius:12px;background:var(--cream);overflow:hidden;transition:.18s}
  .rule[open]{border-color:var(--gold);box-shadow:0 4px 16px rgba(10,37,64,.06)}
  .rule-sum{display:flex;align-items:center;gap:12px;padding:15px 18px;cursor:pointer;list-style:none;user-select:none}
  .rule-sum::-webkit-details-marker{display:none}
  .rule-ico{font-size:1.2rem;line-height:1;flex-shrink:0}
  .rule-title{flex:1;font-family:var(--serif);font-size:1.05rem;color:var(--navy);font-weight:600}
  .rule-chev{width:11px;height:11px;border-right:2px solid var(--gold-dk);border-bottom:2px solid var(--gold-dk);
    transform:rotate(45deg);transition:transform .2s;flex-shrink:0;margin-right:4px}
  .rule[open] .rule-chev{transform:rotate(-135deg)}
  .rule-text{padding:0 18px 16px 48px;font-size:.9rem;color:#3c4552;line-height:1.6}

  /* emergency + nearby */
  .emergency-card{margin-bottom:20px}
  .emergency-list{list-style:none;margin-top:10px}
  .emergency-list li{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.92rem}
  .emergency-list li:last-child{border-bottom:none}
  .nearby-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
  .nearby-group h4{font-family:var(--serif);font-size:1.05rem;color:var(--navy);margin-bottom:10px}
  .nearby-list{list-style:none;display:flex;flex-direction:column;gap:8px}
  .nearby-list li{display:flex;flex-direction:column;font-size:.86rem;color:#3c4552;border-bottom:1px dashed var(--border);padding-bottom:8px}
  .nearby-name{font-weight:600;color:var(--navy)}
  .nearby-meta{color:var(--muted);font-size:.8rem}

  /* departure */
  .fee-list{list-style:none;margin:16px 0 0;border-top:1px solid var(--border)}
  .fee-list li{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);font-size:.92rem}
  .fee-amt{font-weight:700;color:var(--navy)}
  .depart-note{margin-top:16px;font-size:.85rem;color:var(--muted);font-style:italic}
  .checkout-facts{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}
  .co-fact{background:var(--beige);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .co-fact-label{display:block;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-dk);font-weight:700;margin-bottom:4px}
  .co-fact-value{display:block;font-family:var(--serif);font-size:1.35rem;color:var(--navy);font-weight:700}
  .return-callout{display:flex;gap:14px;align-items:center;background:linear-gradient(180deg,#fffdf8,#fbf3e6);border:1.5px solid var(--gold);border-radius:12px;padding:16px 18px;margin:6px 0 4px}
  .return-callout .return-ico{font-size:1.5rem}
  .return-callout p{margin:0;color:var(--navy);font-size:.95rem}
  .co-sub{font-family:var(--serif);font-size:1.15rem;color:var(--navy);margin:24px 0 12px}
  .checklist{list-style:none;display:flex;flex-direction:column;gap:10px}
  .checklist li{position:relative;padding-left:34px;color:#3c4552;font-size:.95rem;line-height:1.5}
  .checklist li::before{content:'';position:absolute;left:0;top:1px;width:22px;height:22px;border-radius:50%;
    background:var(--navy);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C7924B' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-size:14px;background-repeat:no-repeat;background-position:center}

  .area-guide-btn{display:inline-block;margin-bottom:22px;padding:14px 26px;border:1.5px solid var(--gold);border-radius:12px;
    color:var(--navy);text-decoration:none;font-weight:600;font-size:.95rem;transition:.2s;background:var(--white)}
  .area-guide-btn:hover{background:var(--navy);color:#fff;border-color:var(--navy)}
  .ck-foot{text-align:center;padding:44px 20px 8px}
  .ck-closing{font-family:var(--serif);font-size:1.5rem;color:var(--navy)}
  .ck-sign{color:var(--gold-dk);font-weight:600;margin-top:6px}

  /* lightbox */
  #lightbox{position:fixed;inset:0;z-index:200;background:rgba(6,20,36,.92);display:none;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
  #lightbox.show{display:flex}
  #lightbox img{max-width:100%;max-height:92vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5)}

  @media(max-width:620px){
    .ck-hero h1{font-size:2rem}
    .facts,.codes-row,.rules-grid,.checkout-facts{grid-template-columns:1fr}
    .block{padding:26px 20px}
    .pin input{width:52px;height:62px}
  }
</style>
</head>
<body>

  <div id="lock">
    <form class="lock-card" id="lock-form" autocomplete="off">
      <div class="lock-brand">${esc(d.brand)}<span>Private Check-In</span></div>
      <div class="lock-rule"></div>
      <h2 class="lock-h">Welcome</h2>
      <p class="lock-sub">Enter the ${digits}-digit access code from your booking message to view your check-in guide.</p>
      <div class="pin" id="pin">
        ${Array.from({ length: digits }).map(() => `<input type="tel" inputmode="numeric" maxlength="1" pattern="[0-9]" aria-label="code digit" />`).join('')}
      </div>
      <div class="lock-err" id="err">That code doesn't match. Please try again.</div>
      <button class="lock-btn" id="unlock" type="submit">Unlock my guide</button>
      <p class="lock-hint">Trouble getting in? Message your host and we'll help right away.</p>
    </form>
  </div>

  <main id="content" aria-live="polite"></main>
  <div id="lightbox"><img alt="" /></div>

<script>
(function(){
  var PAYLOAD = ${JSON.stringify(payload)};
  var ITER = ${PBKDF2_ITERATIONS};

  // Always require the passcode on every visit — including when the page
  // is restored from the browser's back/forward cache with content already
  // shown. Reloading drops the decrypted content and re-shows the lock.
  window.addEventListener('pageshow', function(e){
    if(e.persisted && document.getElementById('content').classList.contains('show')){
      location.reload();
    }
  });
  var pin = document.getElementById('pin');
  var inputs = Array.prototype.slice.call(pin.querySelectorAll('input'));
  var err = document.getElementById('err');
  var btn = document.getElementById('unlock');
  var form = document.getElementById('lock-form');

  inputs[0].focus();
  inputs.forEach(function(inp, i){
    inp.addEventListener('input', function(){
      inp.value = inp.value.replace(/[^0-9]/g,'').slice(0,1);
      if(inp.value && i < inputs.length-1) inputs[i+1].focus();
      err.classList.remove('show');
    });
    inp.addEventListener('keydown', function(e){
      if(e.key==='Backspace' && !inp.value && i>0) inputs[i-1].focus();
    });
    inp.addEventListener('paste', function(e){
      e.preventDefault();
      var t=(e.clipboardData||window.clipboardData).getData('text').replace(/[^0-9]/g,'');
      inputs.forEach(function(x,j){ x.value = t[j]||''; });
      (inputs[Math.min(t.length,inputs.length-1)]||inputs[0]).focus();
    });
  });

  function b64ToBytes(b64){ var s=atob(b64); var a=new Uint8Array(s.length); for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i); return a; }

  async function tryUnlock(code){
    var enc = new TextEncoder();
    var km = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      { name:'PBKDF2', salt:b64ToBytes(PAYLOAD.salt), iterations:ITER, hash:'SHA-256' },
      km, { name:'AES-GCM', length:256 }, false, ['decrypt']);
    var pt = await crypto.subtle.decrypt({ name:'AES-GCM', iv:b64ToBytes(PAYLOAD.iv) }, key, b64ToBytes(PAYLOAD.ct));
    return new TextDecoder().decode(pt);
  }

  function reveal(html){
    var c = document.getElementById('content');
    c.innerHTML = html;
    document.getElementById('lock').style.display='none';
    c.classList.add('show');
    document.title = ${JSON.stringify('Check-In Guide · ' + esc(d.brand))};
    window.scrollTo(0,0);
    wireContent();
  }

  function wireContent(){
    document.querySelectorAll('.code-chip[data-copy]').forEach(function(el){
      el.addEventListener('click', function(){
        var v = el.getAttribute('data-copy');
        navigator.clipboard && navigator.clipboard.writeText(v);
        el.classList.add('copied');
        setTimeout(function(){ el.classList.remove('copied'); }, 1600);
      });
    });
    var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
    document.querySelectorAll('.step-figure').forEach(function(fig){
      fig.addEventListener('click', function(){
        var img = fig.querySelector('img'); if(!img) return;
        lbImg.src = img.src; lb.classList.add('show');
      });
    });
    lb.addEventListener('click', function(){ lb.classList.remove('show'); lbImg.src=''; });
  }

  async function submit(){
    var code = inputs.map(function(i){return i.value;}).join('');
    if(code.length < inputs.length){ err.textContent="Please enter all "+inputs.length+" digits."; err.classList.add('show'); return; }
    btn.disabled = true; btn.textContent = 'Unlocking…';
    try {
      var html = await tryUnlock(code);
      reveal(html);
    } catch(e){
      err.textContent = "That code doesn't match. Please try again.";
      err.classList.add('show');
      inputs.forEach(function(i){ i.value=''; }); inputs[0].focus();
      btn.disabled = false; btn.textContent = 'Unlock my guide';
    }
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); submit(); });
})();
</script>
</body>
</html>`;
}

// ── Build ───────────────────────────────────────────────────
const contentHtml = renderContent(data);
const payload = await encrypt(contentHtml, String(data.passcode));
const outDir = join(__dirname, data.slug);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), shell(payload, data), 'utf8');
console.log(`✓ Built checkin/${data.slug}/index.html  (passcode: ${data.passcode}, content encrypted)`);
