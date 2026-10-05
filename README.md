# Landsberger Medienagentur – Website

Neue, konversionsstarke Website für die **Landsberger Medienagentur** (Landsberg am Lech).
Statische Single-Page-Website – ohne Build-Schritt, ohne Framework, sofort deploybar.

## Übersicht

Modernes, animiertes One-Pager-Design mit Fokus auf Lead-Generierung. Die Inhalte
sind auf Deutsch und auf Kundengewinnung ausgerichtet (Verkaufspsychologie,
Premium-Branding, klare CTAs).

### Branding (aus der bestehenden Website übernommen)

| Element        | Wert                                                        |
|----------------|-------------------------------------------------------------|
| Primärfarbe (Cyan) | `#00CFE8` (Elementor `--e-global-color-0868745`)         |
| Brand-Verlauf  | `linear-gradient(137deg, #168BC8 0%, #00CFE8 100%)`         |
| Akzentfarbe    | Orange `#F26A2C`                                           |
| Hellblau       | `#6BC7FF`                                                  |
| Dunkel / Verlauf | Navy `#072a44` → Blau `#10679b` → Cyan `#00BFD8`         |
| Schrift        | Montserrat                                                 |

Sektionen wechseln bewusst zwischen **Weiß → Blau-Verlauf → Weiß**, wie gewünscht.

## Sektionen

1. **Hero** – Eyebrow-Text, Headline mit Highlight, Subheadline, animierte CTAs, Trust-Row, schwebendes Browser-Mockup *(Stil: optimierung.at)*
2. **Stats-Strip** – animierte Zähler (Blue-Gradient)
3. **Der Vergleich** – Standard-Website vs. Landsberger Medienagentur *(Stil: 321-webseite)*
4. **Unsere 3-Schritte-Methode** – Strategie · Branding · Launch *(Stil: optimierung.at)*
5. **Leistungen** – Webdesign, Shops, Video, Social Media, SEO, App
6. **Beispielprojekte** – Portfolio-Karten (Platzhalter, später durch echte Referenzen ersetzbar) *(Stil: 321-webseite)*
7. **Kundenstimmen** – in **zwei Designs** (Slider + Karten-Grid). Echte Bewertungen von Jessica Dins & Henry Maurer aus der aktuellen Website + Platzhalter
8. **Über uns** – lokales Team, Landsberg am Lech
9. **Ihr Risiko: keins** – Garantie/Seal-Sektion *(Stil: 321-webseite)*
10. **Obendrauf** – Inklusiv-Extras *(Stil: 321-webseite)*
11. **FAQ** – Akkordeon *(Stil: optimierung.at)*
12. **Kostenloses Erstgespräch** – 3-Schritte-Ablauf + Kontaktformular *(Stil: optimierung.at)*
13. **Footer** – Kontakt, Navigation, Impressum/Datenschutz/AGB

## Animationen

- Scroll-Reveal (IntersectionObserver, mit `prefers-reduced-motion`-Fallback)
- Animierte Zähler
- Button-Shine-/Lift-Effekte
- Schwebendes Hero-Mockup
- Testimonial-Slider (Autoplay, Pfeile, Dots, Touch-Swipe)
- FAQ-Akkordeon
- Sticky-Header mit Scroll-Zustand, „Nach oben"-Button, mobiles Menü

## Projektstruktur

```
.
├── index.html            # komplette Seite (Markup, alle Sektionen)
├── assets/
│   ├── css/styles.css    # Design-System & Styles
│   └── js/main.js         # Interaktionen & Animationen
└── README.md
```

## Lokal ansehen

Einfach `index.html` im Browser öffnen – oder mit einem kleinen Server:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## To-do / Anpassbar

- **Echte Referenzen**: Die Beispielprojekte sind Platzhalter (siehe Hinweis in der Sektion „Beispielprojekte").
- **Kontaktdaten**: Telefonnummer (`0 81 91 / 000 000`) und E-Mail im Markup durch echte Daten ersetzen.
- **Formular**: Das Kontaktformular validiert aktuell nur im Frontend und zeigt eine Erfolgsmeldung. Für den Live-Betrieb an einen Mail-Handler/Endpoint anbinden (siehe Kommentar in `assets/js/main.js`).
- **Rechtstexte**: Impressum, Datenschutz und AGB verlinken.
