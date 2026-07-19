# Check-In Guides

Luxurious, passcode-gated check-in pages for guests. Send one link per booking;
the guest enters a passcode and sees a branded, step-by-step arrival guide.

## How it works (security)

The page content (door code, WiFi, address, etc.) is **encrypted with the passcode**
using PBKDF2 + AES-GCM (Web Crypto). The sensitive details are **not** in the page
source or any search-engine cache — the page only decrypts when the correct passcode
is entered. `/checkin/` is also blocked in `robots.txt` and every page is `noindex`.

> **Honest limitation:** a 4-digit passcode has only 10,000 combinations, so a
> determined technical attacker could brute-force it offline. It reliably stops
> casual snooping, link-sharing leaks, and search indexing — but it is **not**
> bank-grade security. For stronger protection, use a longer passcode (e.g. 6–8
> digits or a word+number) — just change `"passcode"` in the JSON and rebuild.

## Files

- `_src/<slug>.json` — plaintext content for a unit. **Git-ignored** so real codes
  never land in the public repo. Keep these locally.
- `build.mjs` — renders + encrypts a page.
- `assets/<slug>/` — photos for that unit (committed; not sensitive), if any.
- `<slug>/index.html` — the built, encrypted page (committed; safe).

## Add or update a listing

1. Copy an existing source file:
   ```
   cp checkin/_src/ridgecrest.json checkin/_src/<new-slug>.json
   ```
2. Edit it — set `slug`, `passcode`, address, code note, WiFi, and any prose that
   differs. Put that unit's photos (if any) in `checkin/assets/<new-slug>/` and
   reference the filenames in the `steps`.
3. Build:
   ```
   node checkin/build.mjs <new-slug>
   ```
4. Commit `checkin/<new-slug>/` (and `checkin/assets/<new-slug>/` if used) and push.

The guest link is: `https://excellentvisionrealestate.com/checkin/<slug>/`

## Current guides

Guest-facing brand on these pages is **"Excellent Team"** (matches how the host
signs guest messages), and the page-unlock passcode is separate from the real
smart-lock door code (which is the guest's own phone digits, activated per booking
and never baked into the page).

| Property | Link | Passcode |
|----------|------|----------|
| 624 Randall St, Ridgecrest | `/checkin/ridgecrest/` | 0624 |
