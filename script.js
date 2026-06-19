// ==============================================
// BRAMATI — BIOMECCANICA & MECCANICA BICI
// ==============================================

// Durate in ore per servizio (usate per calcolare l'orario di fine evento)
const SERVICE_DURATIONS = {
  'Bike Fitting Completo':  2.5,
  'Fitting Express':        1.5,
  'Consulenza Posturale':   1,
  'Revisione Completa Bici':3,
  'Messa a Punto':          1,
  'Montaggio Componenti':   2
};

// Slot mattina (Lun–Ven)
const SLOTS_WEEKDAY = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00'
];

// Slot mattina (Sab)
const SLOTS_SATURDAY = ['09:00','09:30','10:00','10:30','11:00','11:30'];

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Chiudi mobile menu al click su un link
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

// ---- Scroll to section ----
function scrollToSection(id) {
  closeMobileMenu();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ---- Select service from card ----
function selectService(name) {
  const sel = document.getElementById('service');
  sel.value = name;
  scrollToSection('prenotazione');
  // Flash del bordo per guidare l'utente
  setTimeout(() => {
    sel.style.borderColor = 'var(--accent)';
    sel.style.boxShadow   = '0 0 0 3px var(--accent-light)';
    setTimeout(() => { sel.style.borderColor = ''; sel.style.boxShadow = ''; }, 1800);
  }, 600);
}

// ---- Intersection observer (animazioni scroll) ----
const ioObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.animate-up').forEach(el => ioObserver.observe(el));

// ---- Flatpickr ----
let datePicker;

document.addEventListener('DOMContentLoaded', () => {

  // Inizializza datepicker con locale italiano
  datePicker = flatpickr('#data', {
    locale: 'it',
    dateFormat: 'd/m/Y',
    minDate: 'today',
    disable: [date => date.getDay() === 0],  // niente domeniche
    onChange: ([selected]) => rebuildTimeSlots(selected)
  });

  // Mostra il placeholder del calendario se non configurato
  const gcalIframe = document.getElementById('gcalEmbed');
  const calPlaceholder = document.getElementById('calPlaceholder');
  if (gcalIframe && gcalIframe.src.includes('TUO_CALENDAR_ID')) {
    gcalIframe.style.display = 'none';
    calPlaceholder.style.display = 'flex';
  }

  // Form submit
  document.getElementById('bookingForm').addEventListener('submit', onBookingSubmit);
});

// ---- Rigenera slot orari in base al giorno ----
function rebuildTimeSlots(date) {
  const sel   = document.getElementById('orario');
  const isSat = date && date.getDay() === 6;
  const slots = isSat ? SLOTS_SATURDAY : SLOTS_WEEKDAY;

  sel.innerHTML = '<option value="">— Seleziona orario —</option>';
  slots.forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot;
    opt.textContent = slot;
    sel.appendChild(opt);
  });
}

// ---- Formatta data per Google Calendar (YYYYMMDDTHHmmss) ----
function toGCalDate(dateStr, timeStr) {
  // dateStr: "19/06/2026" (formato flatpickr it), timeStr: "10:00"
  const [d, m, y] = dateStr.split('/');
  const [h, min]  = timeStr.split(':');
  return `${y}${m.padStart(2,'0')}${d.padStart(2,'0')}T${h.padStart(2,'0')}${min}00`;
}

// ---- Aggiunge ore a una data GCal ----
function addHours(gcalDate, hours) {
  const yr  = +gcalDate.slice(0,4);
  const mo  = +gcalDate.slice(4,6) - 1;
  const da  = +gcalDate.slice(6,8);
  const hr  = +gcalDate.slice(9,11);
  const mn  = +gcalDate.slice(11,13);

  const d = new Date(yr, mo, da, hr, mn);
  d.setTime(d.getTime() + hours * 3_600_000);

  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

// ---- Gestione submit prenotazione ----
function onBookingSubmit(e) {
  e.preventDefault();

  const form     = e.currentTarget;
  const service  = form.service.value;
  const nome     = form.nome.value.trim();
  const cognome  = form.cognome.value.trim();
  const email    = form.email.value.trim();
  const telefono = form.telefono.value.trim();
  const data     = form.data.value;
  const orario   = form.orario.value;
  const note     = form.note.value.trim();

  // Validazione custom
  if (!service || !nome || !cognome || !email || !data || !orario) {
    shakeForm(form);
    return;
  }

  const duration  = SERVICE_DURATIONS[service] ?? 1;
  const startDate = toGCalDate(data, orario);
  const endDate   = addHours(startDate, duration);

  const title   = `${service} – ${nome} ${cognome}`;
  const details = [
    `👤 Cliente: ${nome} ${cognome}`,
    `📧 Email: ${email}`,
    telefono ? `📞 Telefono: ${telefono}` : '',
    `🔧 Servizio: ${service}`,
    note ? `\n📝 Note: ${note}` : ''
  ].filter(Boolean).join('\n');

  // ╔══════════════════════════════════════════════════╗
  // ║  Personalizza con il tuo indirizzo reale         ║
  // ╚══════════════════════════════════════════════════╝
  const location = 'Via Roma 11, Sandrigo 36066 (VI)';

  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     title,
    dates:    `${startDate}/${endDate}`,
    details:  details,
    location: location,
  });
  if (email) params.append('add', email);

  const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  // Mostra stato successo
  form.style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
  document.getElementById('bookingSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---- Reset form ----
function resetForm() {
  const form = document.getElementById('bookingForm');
  form.reset();
  form.style.display = 'block';
  document.getElementById('bookingSuccess').style.display = 'none';
  if (datePicker) datePicker.clear();
}

// ---- Animazione shake su validazione fallita ----
function shakeForm(form) {
  form.style.animation = 'none';
  form.offsetHeight;  // reflow
  form.style.animation = 'shake .4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);

  // Evidenzia campi vuoti
  form.querySelectorAll('[required]').forEach(el => {
    if (!el.value) {
      el.style.borderColor = '#ff4444';
      el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
    }
  });
}
