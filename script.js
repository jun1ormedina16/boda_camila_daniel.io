/* ─── AUDIO ──────────────────────────────── */
  const audio = document.getElementById('bg-audio');

  /* ─── ENVELOPE ───────────────────────────── */
  function openEnvelope() {
    const env = document.getElementById('envelope');
    if (env.classList.contains('open')) return;
    env.classList.add('open');

    // Play audio from second 5
    const playAudio = () => {
      audio.currentTime = 5;
      audio.play().catch(() => {});
    };

    if (audio.readyState >= 2) {
      playAudio();
    } else {
      audio.addEventListener('canplay', playAudio, { once: true });
    }

    // Fade out envelope screen
    setTimeout(() => {
      document.getElementById('envelope-screen').classList.add('hidden');
    }, 1800);
  }

  /* ─── CURSOR ─────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * .15; ry += (my - ry) * .15;
    ring.style.left = rx + 'px'; ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  /* ─── COUNTDOWN ──────────────────────────── */
  function updateCountdown() {
    const target = new Date('2026-05-30T15:00:00');
    const now    = new Date();
    let diff = target - now;
    if (diff < 0) { diff = 0; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─── SCROLL REVEAL ──────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ─── RSVP FORM → GOOGLE SHEETS ─────────── */
  // ⚠️ INSTRUCCIONES para conectar Google Sheets:
  // 1. Ve a https://script.google.com y crea un nuevo proyecto
  // 2. Pega el siguiente código de Google Apps Script:
  //
  //    function doPost(e) {
  //      var sheet = SpreadsheetApp.openById('TU_SPREADSHEET_ID').getActiveSheet();
  //      var data = JSON.parse(e.postData.contents);
  //      sheet.appendRow([
  //        new Date(),
  //        data.nombre,
  //        data.telefono,
  //        data.asistencia,
  //        data.mensaje
  //      ]);
  //      return ContentService.createTextOutput(JSON.stringify({result: 'ok'}))
  //        .setMimeType(ContentService.MimeType.JSON);
  //    }
  //
  // 3. Haz clic en "Implementar" → "Nueva implementación" → tipo "App web"
  //    - Ejecutar como: Yo
  //    - Quién tiene acceso: Cualquiera
  // 4. Copia la URL del Web App y reemplaza AQUI_TU_GOOGLE_SCRIPT_URL abajo.

  const SCRIPT_URL = 'AQUI_TU_GOOGLE_SCRIPT_URL';

  document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const payload = {
      nombre:     document.getElementById('nombre').value,
      telefono:   document.getElementById('telefono').value,
      asistencia: document.getElementById('asistencia').value,
      mensaje:    document.getElementById('mensaje').value,
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(_) {}

    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });