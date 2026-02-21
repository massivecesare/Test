document.addEventListener('DOMContentLoaded', () => {

  // ==================== MENU MOBILE ====================
  const mobileBtn = document.querySelector('#mobile-btn, #mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileBtn.innerHTML = mobileMenu.classList.contains('hidden')
        ? '<i class="fas fa-bars"></i>'
        : '<i class="fas fa-times"></i>';
    });
  }

  // ==================== GALLERIE CON FRECCE ====================
  document.querySelectorAll('.sant-eusanio-gallery-wrapper, .experience-gallery-wrapper, .romantic-gallery-wrapper, .suite-gallery-wrapper').forEach(wrapper => {
    const gallery = wrapper.querySelector('.sant-eusanio-gallery, .experience-gallery, .romantic-gallery, .photo-gallery');
    const left = wrapper.querySelector('.gallery-arrow.left');
    const right = wrapper.querySelector('.gallery-arrow.right');

    if (!gallery || !left || !right) return;

    function updateArrows() {
      const atStart = gallery.scrollLeft <= 0;
      const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
      left.style.opacity = atStart ? '0.3' : '0.7';
      right.style.opacity = atEnd ? '0.3' : '0.7';
      left.style.pointerEvents = atStart ? 'none' : 'auto';
      right.style.pointerEvents = atEnd ? 'none' : 'auto';
    }

    left.addEventListener('click', () => gallery.scrollBy({left: -gallery.clientWidth * 0.85, behavior: 'smooth'}));
    right.addEventListener('click', () => gallery.scrollBy({left: gallery.clientWidth * 0.85, behavior: 'smooth'}));

    gallery.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });

  // ==================== CARRELLO BOTTEGA ====================
  let cartCount = 0;
  const cartEl = document.getElementById('cart-count');
  document.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (cartEl) cartEl.textContent = cartCount;
    });
  });

  // ==================== CALENDARIO (solo pagine calendario) ====================
  if (document.getElementById('calendar-1')) {
    const currentYear = 2026;
    let currentMonth = 2; // Marzo

    const bookedDates = {
      1: [3,8,13,18,23,30],
      2: [5,12,19,26],
      3: [6,11,17,22,28],
      4: [4,10,15,21,27]
    };

    function renderCalendar(suiteId, containerId) {
      const container = document.getElementById(containerId);
      const date = new Date(currentYear, currentMonth, 1);
      const monthName = date.toLocaleString('it-IT', { month: 'long', year: 'numeric' });

      let html = `
        <div class="flex justify-between items-center mb-4">
          <button onclick="prevMonth(${suiteId}, '${containerId}')" class="text-amber-400 hover:text-amber-300"><i class="fas fa-chevron-left"></i></button>
          <h4 class="font-bold text-xl capitalize">${monthName}</h4>
          <button onclick="nextMonth(${suiteId}, '${containerId}')" class="text-amber-400 hover:text-amber-300"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          <div class="text-amber-400">L</div><div class="text-amber-400">M</div><div class="text-amber-400">M</div>
          <div class="text-amber-400">G</div><div class="text-amber-400">V</div><div class="text-amber-400">S</div><div class="text-amber-400">D</div>
        </div>
        <div class="calendar-grid">`;

      const firstDay = date.getDay() || 7;
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 1; i < firstDay; i++) html += `<div></div>`;

      for (let day = 1; day <= daysInMonth; day++) {
        const today = new Date();
        const thisDate = new Date(currentYear, currentMonth, day);
        const isPast = thisDate < today.setHours(0,0,0,0);
        const isBooked = bookedDates[suiteId].includes(day);

        let cls = 'calendar-day ';
        if (isPast) cls += 'past';
        else if (isBooked) cls += 'booked';
        else cls += 'available';

        html += `<div onclick="${isPast || isBooked ? '' : `selectDate(${suiteId}, ${day}, '${monthName}')`}" class="${cls}">${day}</div>`;
      }
      html += `</div>`;
      container.innerHTML = html;
    }

    window.prevMonth = function(suiteId, containerId) {
      currentMonth--;
      if (currentMonth < 0) currentMonth = 11;
      renderCalendar(suiteId, containerId);
    };
    window.nextMonth = function(suiteId, containerId) {
      currentMonth++;
      if (currentMonth > 11) currentMonth = 0;
      renderCalendar(suiteId, containerId);
    };
    window.selectDate = function(suiteId, day, monthName) {
      const names = {1:"Bolla Deluxe Classic",2:"Bolla Deluxe Moonlight",3:"Bolla Prestige Family",4:"Bolla Prestige Romantic"};
      document.getElementById('modal-suite').textContent = names[suiteId];
      document.getElementById('modal-date').textContent = `${day} ${monthName} 2026`;
      document.getElementById('booking-modal').classList.remove('hidden');
    };
    window.closeModal = function() {
      document.getElementById('booking-modal').classList.add('hidden');
    };

    // Inizializza tutti i calendari presenti nella pagina
    renderCalendar(1, 'calendar-1');
    renderCalendar(2, 'calendar-2');
    renderCalendar(3, 'calendar-3');
    renderCalendar(4, 'calendar-4');
  }
});