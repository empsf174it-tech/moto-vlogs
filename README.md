# MOTO VLOGZ — Adventure & Touring Moto Vlogger Single-Page Website

A premium, highly-optimized, responsive single-page creator website tailored for the **Adventure & Touring** moto vlogging vertical. Designed to show off expeditions, routes, gear, and official merchandise.

---

## 🚀 Features

- **Responsive Single-Page Layout**: Smooth scroll transition between anchor links (Home, About, Videos, Routes, Gear, Contact).
- **Dual-Language Translation System**: Fully integrated client-side language switching for English (default) and Spanish. Persists via `localStorage`.
- **System-Aware Theme Toggle**: Sleek Dark/Light mode integration with manual triggers and automatic `prefers-color-scheme` media checks.
- **Interactive Route & Videos Guides**: Custom grids, filterable video archives, and interactive SVG map path animations.
- **Client-Side Form Validation**: Real-time error alerts and visual boundaries on all contact and newsletter fields (Step 12 complaint).
- **SEO & Schema Integration**: Strict heading structures, lazy loaded images, meta descriptions, and Google Search JSON-LD schemas (`Person` and `VideoObject`).

---

## 📂 File Structure

```text
adventure-touring/
├── index.html            # Main site layout and semantic HTML
├── 404.html              # Custom themed 404 error page
├── README.md             # Project documentation (this file)
└── assets/
    ├── css/
    │   └── style.css     # Design tokens, grids, responsiveness, dark/light themes
    ├── js/
    │   └── main.js       # Dynamic translation loader, observer, form validation, toggles
    └── i18n/
        ├── en.json       # Default English copy database
        └── es.json       # Spanish copy database
```

---

## 🎨 Design System

| Token | Dark Mode (Default) | Light Mode (Desert Sand) |
|---|---|---|
| **Background** | `#090b0e` (Slate Obsidian) | `#faf7f2` (Desert Sand) |
| **Card / Surface** | `#12161c` (Obsidian Card) | `#f1ebd8` (Warm Sand Card) |
| **Primary Accent** | `hsl(28, 90%, 55%)` (Adventure Orange / Raw Amber) |
| **Secondary Accent** | `hsl(145, 25%, 42%)` (Muted Pine Green) |
| **Headings Font** | **Space Grotesk** (Google Font, weights ≤500) |
| **Body Font** | **Plus Jakarta Sans** (Google Font, weights ≤430) |

---

## 🌐 How to Add or Change Languages

Translation strings are handled via client-side JSON lookups.

### Editing Existing Translation Keys
1. Open `assets/i18n/en.json` (English) or `assets/i18n/es.json` (Spanish).
2. Locate the key path you want to modify (e.g., `"hero": { "title": "..." }`).
3. Update the value string. The changes will immediately reflect upon reloading the page.

### Adding a New Language (e.g., French - FR)
1. Create a new file `assets/i18n/fr.json`.
2. Copy the structure of `assets/i18n/en.json` into the new file and translate all text values.
3. Open `index.html`.
4. Locate the language switcher select dropdown elements (`#lang-select-desktop` and `#lang-select-mobile`).
5. Add a new option tag:
   ```html
   <option value="fr">FR</option>
   ```
6. Add "fr" to the supported languages array in `assets/js/main.js` inside the `initLanguage` function if system checks are updated:
   ```javascript
   const defaultLang = savedLang || (['en', 'es', 'fr'].includes(browserLang) ? browserLang : 'en');
   ```

---

## 📦 Contact Form & Newsletter Integration

- **Newsletter Sign Up Form**: Linked to `#newsletter-form`. Currently logs validation success to the UI. Integrates easily with Mailchimp/ConvertKit embeds by changing the form action attribute.
- **Business Collab / Inquiry Form**: Linked to `#collab-contact-form` with a default `https://formspree.io/f/placeholder` endpoint. Simply swap the URL in `action="..."` with your own active Formspree or Netlify forms identifier.
