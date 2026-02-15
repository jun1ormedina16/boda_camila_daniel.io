/* ─────────────────────────────────────────────
   🎵 AUDIO
───────────────────────────────────────────── */

const audio = document.getElementById('bg-audio');


/* ─────────────────────────────────────────────
   💌 ENVELOPE
───────────────────────────────────────────── */

function openEnvelope() {

  const env = document.getElementById('envelope');
  const screen = document.getElementById('envelope-screen');

  if (env.classList.contains('open')) return;

  env.classList.add('open');

  const playAudio = () => {
    audio.currentTime = 5;   // Empieza desde el segundo 5
    audio.volume = 0.4;      // Volumen elegante
    audio.play().catch(() => {});
  };

  if (audio.readyState >= 2) {
    playAudio();
  } else {
    audio.addEventListener('canplay', playAudio, { once: true });
  }

  // Fade out pantalla del sobre
  setTimeout(() => {
    screen.classList.add('hidden');
  }, 1800);
}


/* ─────────────────────────────────────────────
   🖱️ CURSOR PERSONALIZADO
───────────────────────────────────────────── */

const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animCursor() {
  if (cursor && ring) {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';

    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;

    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animCursor);
})();


/* ─────────────────────────────────────────────
   ⏳ COUNTDOWN
───────────────────────────────────────────── */

function updateCountdown() {

  const target = new Date('2026-05-30T15:00:00');
  const now = new Date();

  let diff = target - now;

  if (diff < 0) diff = 0;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const days   = document.getElementById('cd-days');
  const hours  = document.getElementById('cd-hours');
  const mins   = document.getElementById('cd-mins');
  const secs   = document.getElementById('cd-secs');

  if (days)  days.textContent  = String(d).padStart(2,'0');
  if (hours) hours.textContent = String(h).padStart(2,'0');
  if (mins)  mins.textContent  = String(m).padStart(2,'0');
  if (secs)  secs.textContent  = String(s).padStart(2,'0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ─────────────────────────────────────────────
   ✨ SCROLL REVEAL
───────────────────────────────────────────── */

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal')
  .forEach(el => observer.observe(el));


/* ─────────────────────────────────────────────
   📝 RSVP → GOOGLE SHEETS
───────────────────────────────────────────── */

const SCRIPT_URL = 'AQUI_TU_GOOGLE_SCRIPT_URL';

const form = document.getElementById('rsvpForm');

if (form) {

  form.addEventListener('submit', async function(e) {

    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.textContent = 'Enviando...';
      btn.disabled = true;
    }

    const payload = {
      nombre:     document.getElementById('nombre')?.value || '',
      telefono:   document.getElementById('telefono')?.value || '',
      asistencia: document.getElementById('asistencia')?.value || '',
      mensaje:    document.getElementById('mensaje')?.value || '',
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}

    form.style.display = 'none';

    const success = document.getElementById('form-success');
    if (success) success.style.display = 'block';

  });

}
