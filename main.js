"use strict";
// ============================================================
// Excellent Vision Real Estate — main.ts
// Structured for easy migration to Angular:
//   - Listing interface → Angular model
//   - ListingService   → Angular @Injectable service
//   - ModalComponent   → Angular @Component
//   - BookingService   → Angular @Injectable service
// ============================================================
// ── ListingService (becomes Angular @Injectable) ─────────────
class ListingService {
    constructor() {
        this.listings = [
            {
                id: 'newport-a',
                badge: 'Available Jun 16',
                location: 'Newport Beach, CA',
                title: 'Luxurious Stay — 10 min from Airport & Beach',
                price: 3495,
                priceUnit: 'month',
                beds: '1 Bedroom · Queen Bed',
                baths: '1 Private Bath',
                utilitiesIncluded: true,
                minStay: 30,
                cleaningFee: 150,
                description: 'Elegant apartment with direct terrace access and garden views in Newport Beach. ' +
                    'Fully equipped kitchen, flat-screen TV, queen-sized bed plus futon, and air conditioning. ' +
                    'Access to private pool, hot tub, basketball/tennis court, and free private parking. ' +
                    'Located just 10 minutes from John Wayne Airport and 1.1 miles from North Star Beach. ' +
                    'Walking distance to top restaurants and shopping.',
                amenities: ['🏊 Private Pool', '♨️ Hot Tub', '📶 Free WiFi', '🚗 Free Parking', '🌿 Garden View', '❄️ A/C', '🏸 Tennis Court', '🛗 Elevator', '🧺 Washer/Dryer'],
                furnishedFinderUrl: 'https://www.furnishedfinder.com/property/522051_1',
                photos: [
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132677-full.jpg', alt: 'Living area' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132654-full.jpg', alt: 'Bedroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132664-full.jpg', alt: 'Kitchen' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132666-full.jpg', alt: 'Bathroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132668-full.jpg', alt: 'Terrace' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132669-full.jpg', alt: 'Pool area' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132670-full.jpg', alt: 'View' },
                ],
            },
            {
                id: 'newport-b',
                badge: 'Available Now',
                location: 'Newport Beach, CA',
                title: 'Luxurious Stay — 10 min from Airport & Beach',
                price: 3495,
                priceUnit: 'month',
                beds: '1 Bedroom · Queen Bed',
                baths: '1 Private Bath',
                utilitiesIncluded: true,
                minStay: 30,
                cleaningFee: 150,
                description: 'Sister unit to Unit A — same building, same premium amenities. ' +
                    'Direct terrace access and garden views, fully equipped kitchen, flat-screen TV, and air conditioning. ' +
                    'Shared access to private pool, hot tub, basketball/tennis court, and free private parking. ' +
                    '10 minutes from John Wayne Airport, 1.1 miles from North Star Beach.',
                amenities: ['🏊 Private Pool', '♨️ Hot Tub', '📶 Free WiFi', '🚗 Free Parking', '🌿 Garden View', '❄️ A/C', '🏸 Tennis Court', '🛗 Elevator', '🧺 Washer/Dryer'],
                furnishedFinderUrl: 'https://www.furnishedfinder.com/property/522051_1',
                photos: [
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132671-full.jpg', alt: 'Living area' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132674-full.jpg', alt: 'Bedroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132675-full.jpg', alt: 'Kitchen' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132676-full.jpg', alt: 'Bathroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132678-full.jpg', alt: 'Pool' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/522051/1/522051_1_46132677-full.jpg', alt: 'Exterior' },
                ],
            },
            {
                id: 'ridgecrest',
                badge: 'Available Now',
                location: 'Ridgecrest, CA 93555',
                title: 'Spacious Desert Retreat — Near Red Rock Canyon',
                price: 3490,
                priceUnit: 'month',
                beds: '4 Bedrooms',
                baths: '2 Private Baths',
                utilitiesIncluded: true,
                minStay: 30,
                cleaningFee: 250,
                deposit: 1000,
                description: 'Spacious 4-bedroom, 2-bathroom house perfect for families, remote workers, or adventure seekers. ' +
                    'Master bedroom features a king bed; three additional rooms with queen beds. Sleeps up to 8 guests. ' +
                    'Minutes from Red Rock Canyon State Park and a scenic drive to Death Valley National Park. ' +
                    'Discover the Maturango Museum, China Lake, and stunning desert landscapes. ' +
                    'Modern amenities, washer/dryer, full kitchen, and a quiet neighborhood.',
                amenities: ['🏜️ Desert Views', '🛏 Sleeps 8', '🧺 Washer/Dryer', '❄️ A/C', '🔥 Heating', '🗄️ Storage', '🔇 Quiet Area', '💇 Hair Dryer'],
                furnishedFinderUrl: 'https://www.furnishedfinder.com/property/576592_1',
                photos: [
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042246-full.JPG', alt: 'Front exterior' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042241-full.JPG', alt: 'Living room' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042242-full.JPG', alt: 'Kitchen' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042264-full.JPG', alt: 'Master bedroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042247-full.JPG', alt: 'Bedroom 2' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042248-full.JPG', alt: 'Bedroom 3' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042249-full.JPG', alt: 'Bedroom 4' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042250-full.JPG', alt: 'Bathroom' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042251-full.JPG', alt: 'Bathroom 2' },
                    { url: 'https://www.furnishedfinder.com/_pdp_/576592/1/576592_1_51042252-full.JPG', alt: 'Desert view' },
                ],
            },
        ];
    }
    getAll() {
        return this.listings;
    }
    getById(id) {
        return this.listings.find((l) => l.id === id);
    }
}
// ── BookingService (becomes Angular @Injectable) ─────────────
class BookingService {
    constructor() {
        // Replace YOUR_FORM_ID with your Formspree form ID after signing up at formspree.io
        // e.g. https://formspree.io/f/abcd1234
        this.FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrevkqvo';
    }
    async submit(data) {
        try {
            const res = await fetch(this.FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                return { success: true, message: "Message sent! We'll be in touch within 24 hours." };
            }
            else {
                return { success: false, message: 'Something went wrong. Please email us directly.' };
            }
        }
        catch (_a) {
            return { success: false, message: 'Network error. Please email info@excellentvisionrealestate.com.' };
        }
    }
}
// ── ModalComponent (becomes Angular @Component) ──────────────
class ModalComponent {
    constructor() {
        this.currentSlide = 0;
        this.photos = [];
        this.overlay = document.getElementById('modal-overlay');
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay)
                this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape')
                this.close();
            if (e.key === 'ArrowRight')
                this.nextPhoto();
            if (e.key === 'ArrowLeft')
                this.prevPhoto();
        });
    }
    open(listing) {
        this.photos = listing.photos;
        this.currentSlide = 0;
        this.renderModal(listing);
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    nextPhoto() {
        this.currentSlide = (this.currentSlide + 1) % this.photos.length;
        this.updateGallery();
    }
    prevPhoto() {
        this.currentSlide = (this.currentSlide - 1 + this.photos.length) % this.photos.length;
        this.updateGallery();
    }
    updateGallery() {
        const track = document.getElementById('modal-track');
        track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        document.querySelectorAll('.modal-dot').forEach((d, i) => {
            d.classList.toggle('active', i === this.currentSlide);
        });
        const counter = document.getElementById('photo-counter');
        if (counter)
            counter.textContent = `${this.currentSlide + 1} / ${this.photos.length}`;
    }
    renderModal(listing) {
        const content = document.getElementById('modal-content');
        const fees = [];
        if (listing.cleaningFee)
            fees.push(`Cleaning fee: $${listing.cleaningFee}`);
        if (listing.deposit)
            fees.push(`Refundable deposit: $${listing.deposit}`);
        const photosHtml = listing.photos
            .map((p) => `<img src="${p.url}" alt="${p.alt}" onerror="this.src='';this.style.background='#e2e8f0';this.style.display='flex';" />`)
            .join('');
        const dotsHtml = listing.photos
            .map((_, i) => `<span class="modal-dot ${i === 0 ? 'active' : ''}" onclick="modalComponent.goToPhoto(${i})"></span>`)
            .join('');
        const amenitiesHtml = listing.amenities
            .map((a) => `<span class="amenity-tag">${a}</span>`)
            .join('');
        content.innerHTML = `
      <!-- Gallery -->
      <div class="modal-gallery">
        <div class="modal-track-wrap">
          <div id="modal-track" class="modal-track">${photosHtml}</div>
        </div>
        <button class="modal-arrow prev" onclick="modalComponent.prevPhoto()">&#8249;</button>
        <button class="modal-arrow next" onclick="modalComponent.nextPhoto()">&#8250;</button>
        <div class="modal-dots">${dotsHtml}</div>
        <span id="photo-counter" class="photo-counter">1 / ${listing.photos.length}</span>
      </div>

      <!-- Details -->
      <div class="modal-body">
        <div class="modal-info">
          <div class="modal-location">📍 ${listing.location}</div>
          <h2 class="modal-title">${listing.title}</h2>
          <div class="modal-price">$${listing.price.toLocaleString()} <span>/ ${listing.priceUnit}</span></div>
          <div class="modal-meta">
            <span>🛏 ${listing.beds}</span>
            <span>🚿 ${listing.baths}</span>
            <span>✅ Utilities Included</span>
            <span>📅 Min. ${listing.minStay} days</span>
          </div>
          ${fees.length ? `<div class="modal-fees">${fees.join(' &nbsp;·&nbsp; ')}</div>` : ''}
          <p class="modal-desc">${listing.description}</p>
          <div class="modal-amenities">${amenitiesHtml}</div>
          <a href="${listing.furnishedFinderUrl}" target="_blank" class="btn-ff">
            Also view on Furnished Finder ↗
          </a>
        </div>

        <!-- Booking Form -->
        <div class="modal-form-wrap">
          <h3>Request to Book</h3>
          <form id="booking-form" class="booking-form" data-listing="${listing.id}">
            <div id="form-status" class="form-status hidden"></div>
            <input type="text" name="name" placeholder="Full Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <input type="tel" name="phone" placeholder="Phone Number" />
            <label class="field-label">Desired Move-In Date</label>
            <input type="date" name="moveInDate" required />
            <textarea name="message" placeholder="Questions or anything we should know…" rows="4"></textarea>
            <button type="submit" class="btn-submit">
              <span class="btn-text">Send Booking Request</span>
              <span class="btn-loading hidden">Sending…</span>
            </button>
          </form>
        </div>
      </div>
    `;
        // Attach form submit handler
        const form = document.getElementById('booking-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await bookingService.handleSubmit(form, listing.id);
        });
    }
    goToPhoto(index) {
        this.currentSlide = index;
        this.updateGallery();
    }
}
// ── CardComponent — renders listing cards ────────────────────
class CardComponent {
    constructor() {
        this.slidePositions = new Map();
    }
    renderAll(listings) {
        const grid = document.getElementById('listings-grid');
        grid.innerHTML = listings.map((l) => this.renderCard(l)).join('');
        listings.forEach((l) => this.slidePositions.set(l.id, 0));
    }
    renderCard(l) {
        const photos = l.photos.slice(0, 5);
        const slidesHtml = photos
            .map((p, i) => `<img src="${p.url}" alt="${p.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.parentElement.style.background='#e8f5fc'" />`)
            .join('');
        const dotsHtml = photos
            .map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}" onclick="cardComponent.goTo('${l.id}',${i});event.stopPropagation()"></span>`)
            .join('');
        return `
      <div class="listing-card" onclick="modalComponent.open(listingService.getById('${l.id}'))">
        <div class="slider" id="slider-${l.id}">
          <div class="slides" id="slides-${l.id}">${slidesHtml}</div>
          <button class="slider-btn prev" onclick="cardComponent.slide('${l.id}',-1);event.stopPropagation()">&#8249;</button>
          <button class="slider-btn next" onclick="cardComponent.slide('${l.id}',1);event.stopPropagation()">&#8250;</button>
          <div class="slider-dots">${dotsHtml}</div>
          <div class="listing-badge">${l.badge}</div>
        </div>
        <div class="listing-body">
          <div class="listing-location">📍 ${l.location}</div>
          <h3 class="listing-title">${l.title}</h3>
          <div class="listing-price">$${l.price.toLocaleString()} <span>/ ${l.priceUnit}</span></div>
          <div class="listing-meta">
            <span>🛏 ${l.beds}</span>
            <span>🚿 ${l.baths}</span>
            <span>✅ Utilities Included</span>
          </div>
          <p class="listing-desc">${l.description.substring(0, 130)}…</p>
          <div class="card-actions">
            <button class="btn-details" onclick="modalComponent.open(listingService.getById('${l.id}'));event.stopPropagation()">
              View Details &amp; Book
            </button>
          </div>
        </div>
      </div>
    `;
    }
    slide(id, dir) {
        var _a;
        const slides = document.getElementById(`slides-${id}`);
        const count = slides.querySelectorAll('img').length;
        const current = (((_a = this.slidePositions.get(id)) !== null && _a !== void 0 ? _a : 0) + dir + count) % count;
        this.slidePositions.set(id, current);
        slides.style.transform = `translateX(-${current * 100}%)`;
        this.updateDots(id, current);
    }
    goTo(id, index) {
        const slides = document.getElementById(`slides-${id}`);
        this.slidePositions.set(id, index);
        slides.style.transform = `translateX(-${index * 100}%)`;
        this.updateDots(id, index);
    }
    updateDots(id, active) {
        const slider = document.getElementById(`slider-${id}`);
        slider.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === active));
    }
}
// ── Extended BookingService with form handling ───────────────
class BookingServiceExtended extends BookingService {
    async handleSubmit(form, listingId) {
        const statusEl = document.getElementById('form-status');
        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        statusEl.className = 'form-status hidden';
        const data = {
            name: form.elements.namedItem('name').value,
            email: form.elements.namedItem('email').value,
            phone: form.elements.namedItem('phone').value,
            listingId,
            moveInDate: form.elements.namedItem('moveInDate').value,
            message: form.elements.namedItem('message').value,
        };
        const result = await this.submit(data);
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        statusEl.textContent = result.message;
        statusEl.className = `form-status ${result.success ? 'success' : 'error'}`;
        if (result.success)
            form.reset();
    }
}
// ── Smooth scroll ─────────────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
// ── Bootstrap ─────────────────────────────────────────────────
const listingService = new ListingService();
const bookingService = new BookingServiceExtended();
const modalComponent = new ModalComponent();
const cardComponent = new CardComponent();
document.addEventListener('DOMContentLoaded', () => {
    cardComponent.renderAll(listingService.getAll());
    initSmoothScroll();
});
