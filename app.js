(() => {
  "use strict";

  // ====== CONFIG ======
  const WEDDING_DATE = new Date("2026-08-08T18:00:00+05:00"); // +05:00 = Almaty time
  const BACKEND_URL = "https://script.google.com/macros/s/AKfycby-rZ6GU_lk9ZWTzvkb8wcDYjKdjCh8ofdPBvmPM_Tsdm9bonJ1GUtbQpXHmtYsXeNrlg/exec";
  const AUDIO_VOLUME = 0.3;

  // ====== ELEMENTS ======
  const $ = (id) => document.getElementById(id);
  const intro = $("intro");
  const main = $("main");
  const openBtn = $("openBtn");
  const introGreeting = $("intro-greeting");
  const rsvpHello = $("rsvpHello");
  const audio = $("bgAudio");
  const musicToggle = $("musicToggle");
  const form = $("rsvpForm");
  const submitBtn = $("submitBtn");
  const formError = $("formError");
  const rsvpSuccess = $("rsvpSuccess");

  // ====== GUEST PERSONALIZATION ======
  const params = new URLSearchParams(location.search);
  const guestId = params.get("g");
  let guest = null;

  async function loadGuest() {
    if (!guestId) return;
    try {
      const res = await fetch("guests.json", { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      guest = data.guests?.[guestId] || null;
    } catch (e) {
      console.warn("Қонақ тізімі жүктелмеді:", e);
    }
  }

  function applyGuest() {
    if (!guest) return;
    const name = guest.firstName || "";
    introGreeting.textContent = `Сәлеметсіз бе, ${name}!`;
    rsvpHello.textContent = `Сәлем, ${name}! Төмендегі форманы толтырыңыз.`;
    $("firstName").value = guest.firstName || "";
    $("lastName").value = guest.lastName || "";
    if (guest.section) $("section").value = guest.section;
  }

  // ====== OPENING OVERLAY ======
  async function openInvitation() {
    intro.classList.add("is-leaving");
    main.hidden = false;
    musicToggle.hidden = false;

    audio.volume = AUDIO_VOLUME;
    try {
      await audio.play();
    } catch (e) {
      // Autoplay блокталса — toggle арқылы қосуға болады
      musicToggle.classList.add("is-muted");
    }

    setTimeout(() => { intro.hidden = true; }, 800);
  }

  openBtn.addEventListener("click", openInvitation);

  // ====== MUSIC TOGGLE ======
  musicToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      musicToggle.classList.remove("is-muted");
    } else {
      audio.pause();
      musicToggle.classList.add("is-muted");
    }
  });

  // ====== COUNTDOWN ======
  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE.getTime() - now;

    if (diff <= 0) {
      $("cdDays").textContent = "0";
      $("cdHours").textContent = "0";
      $("cdMins").textContent = "0";
      $("cdSecs").textContent = "0";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    $("cdDays").textContent = d;
    $("cdHours").textContent = String(h).padStart(2, "0");
    $("cdMins").textContent = String(m).padStart(2, "0");
    $("cdSecs").textContent = String(s).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ====== FORM SUBMIT ======
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.hidden = true;

    const data = {
      timestamp: new Date().toISOString(),
      firstName: $("firstName").value.trim(),
      lastName: $("lastName").value.trim(),
      section: $("section").value.trim(),
      attending: form.querySelector('input[name="attending"]:checked')?.value || "Иә",
      withPartner: $("withPartner").checked ? "Иә" : "Жоқ",
      message: $("message").value.trim(),
      userAgent: navigator.userAgent
    };

    if (!data.firstName || !data.lastName || !data.section) {
      formError.textContent = "Өрістерді толтырыңыз.";
      formError.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Жіберілуде...";

    try {
      if (!BACKEND_URL) {
        // Локалды тест кезінде
        console.log("RSVP (dev, backend-URL жоқ):", data);
        await new Promise((r) => setTimeout(r, 600));
      } else {
        const params = new URLSearchParams(data).toString();
        await fetch(BACKEND_URL + "?" + params, { mode: "no-cors" });
      }

      form.hidden = true;
      rsvpSuccess.hidden = false;
      rsvpSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error(err);
      formError.textContent = "Қате шықты. Қайталап көріңіз немесе тікелей хабарласыңыз.";
      formError.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Растау";
    }
  });

  // ====== INIT ======
  (async () => {
    await loadGuest();
    applyGuest();
  })();
})();
