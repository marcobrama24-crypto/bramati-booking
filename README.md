# Bramati — Biomeccanica & Meccanica Bici

Sito di prenotazioni per l'attività di biomeccanica e meccanica bici.

## Struttura

```
bramati-booking/
├── index.html   # Pagina principale
├── styles.css   # Stili (tema scuro con accento giallo/ambra)
└── script.js    # Logica: datepicker, Google Calendar, animazioni
```

## Personalizzazione

### 1. Indirizzo e Contatti
Cerca nei file `index.html` e `script.js` i placeholder seguenti e sostituiscili:
- `[Il Tuo Indirizzo]`, `[Città]`, `[CAP]` → il tuo indirizzo reale
- `+39 000 000 0000` → il tuo numero di telefono
- `info@bramati.it` → la tua email
- `[Il Tuo Numero]` (P.IVA) → la tua P.IVA

### 2. Google Calendar (disponibilità)
Per mostrare il calendario con gli slot disponibili:
1. Vai su [calendar.google.com](https://calendar.google.com)
2. **Impostazioni** → seleziona il tuo calendario → **Integra il calendario**
3. Copia il tuo **Calendar ID** (es. `nome@gmail.com`)
4. In `index.html`, nell'iframe con id `gcalEmbed`, sostituisci `TUO_CALENDAR_ID` con il tuo Calendar ID

### 3. Come funziona la prenotazione
Il cliente compila il modulo → si apre Google Calendar con tutti i dettagli pre-compilati → il cliente salva l'evento → tu lo vedi nel tuo calendario e puoi accettarlo/rifiutarlo.

### 4. Social Media
In `index.html`, sostituisci i link con i tuoi profili reali:
- `https://instagram.com/TUO_PROFILO`
- `https://facebook.com/TUO_PROFILO`
- `https://youtube.com/@TUO_CANALE`
- `https://tiktok.com/@TUO_PROFILO`
- `https://strava.com/clubs/TUO_CLUB`
- `https://wa.me/39000000000` → sostituisci `39000000000` con il tuo numero (prefisso IT + numero senza il `+`)

### 5. Google Maps
In `index.html`, nell'iframe della mappa:
1. Vai su [maps.google.com](https://maps.google.com)
2. Cerca il tuo indirizzo
3. Clicca **Condividi** → **Incorpora una mappa**
4. Copia l'URL dal `src` dell'iframe e sostituisci quello esistente

## Deploy

Il sito è puro HTML/CSS/JS — nessun build necessario.  
Puoi pubblicarlo su **GitHub Pages**, **Netlify** o qualsiasi hosting statico.

### GitHub Pages
1. Vai su **Settings** → **Pages**
2. Source: `main` branch, cartella `/ (root)`
3. Salva — il sito sarà online in pochi minuti
