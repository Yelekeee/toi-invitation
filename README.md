# Алишер & Назым — Тойға шақырту

Статикалық тойға шақырту сайты.

- **Күні:** 25.06.2026 · 18:00
- **Хостинг:** GitHub Pages
- **Backend:** Google Apps Script → Google Sheet
- **Музыка:** Жар-жар (`assets/jar-jar.mp3`)

## URL форматы
- Жалпы сілтеме: `https://aleshdev.github.io/toi-invitation/`
- Жеке сілтеме: `https://aleshdev.github.io/toi-invitation/?g=<ID>`

Қонақ ID-лері `guests.json`-да. Аты-жөні автоматты толтырылады.

## Локалды іске қосу
```
python3 -m http.server 8080
# http://localhost:8080
```

## Конфиг
- `app.js` → `BACKEND_URL` — Google Apps Script Web App URL
- `guests.json` — қонақ тізімі
- `index.html` → `#venueName`, `#venueAddress` — той орны
