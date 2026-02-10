# PRD - Website Nuntă Sara & Adrian

## Original Problem Statement
Website de nuntă în română, elegant, modern, mobile-first, pentru Sara & Adrian, data 28 iunie 2026. Scopul site-ului: informare invitați, RSVP cu meniu, galerie foto cu upload de la invitați, notificări pe email și QR code.

## User Personas
- **Invitați**: Persoane de toate vârstele care vor accesa site-ul pentru confirmare prezență și încărcare poze
- **Miri (Admin)**: Sara & Adrian care gestionează RSVP-urile și moderează galeria foto

## Core Requirements (Static)
1. Homepage one-page cu Hero, Detalii, Locații, Program, Galerie, Footer
2. Formular RSVP multi-step cu selecție meniu per persoană
3. Galerie foto cu upload de la invitați (aprobare automată)
4. QR code pentru invitații
5. Notificări email pentru RSVP
6. GDPR compliant

## What's Been Implemented ✅

### Frontend
- ✅ Homepage elegant cu hero section, navigare, secțiuni detalii/locații/program/galerie/footer
- ✅ RSVP formular dinamic (permite adăugare invitați multipli + meniu per persoană)
- ✅ **Termen limită confirmări: 15 Mai 2026** - afișat pe Homepage și pagina RSVP
- ✅ Galerie foto cu upload și lightbox
- ✅ Pagina de confidențialitate GDPR
- ✅ Design cu paleta de culori: Navy (#2F4156), Teal (#567C8D), Sky (#C8D9E6), Beige (#F5EFEB), Gold (#B8977E)

### Backend
- ✅ API RSVP (create, list)
- ✅ API Galerie (upload cu aprobare automată, list, download)
- ✅ Rate limiting anti-spam

### Locații configurate
- Biserica Adventistă Brâncoveanu, București
- Domeniul Monato, Bolintin-Vale

### Credențiale Admin (dacă pagina admin e reactivată)
- Username: admin
- Password: sara&adrian2026

## Prioritized Backlog

### P0 - Critical (Done ✅)
- [x] Homepage complet cu poze cuplului
- [x] RSVP flow complet cu invitați multipli
- [x] Galerie cu upload (aprobare automată)
- [x] Paleta de culori aplicată consistent
- [x] Termen limită confirmări (15 Mai 2026)

### P1 - Important
- [ ] Implementare și testare notificări email prin Resend la RSVP
- [ ] Generare QR code care duce la site
- [ ] Panou Admin simplificat (vizualizare RSVP, export CSV/Excel) - de clarificat cu utilizatorul

### P2 - Nice to Have
- [ ] Countdown timer pe homepage
- [ ] Slideshow pentru galerie
- [ ] Integrare calendar (add to calendar)

## Recent Updates
**Data: Decembrie 2025**
- Adăugat termen limită confirmări: 15 Mai 2026 (pe Homepage CTA și pagina RSVP)
- Aplicare consistentă paleta de culori pe întreg site-ul

## Technical Notes
- Pozele încărcate de invitați apar automat în galerie (fără moderare)
- Babel/JSX: evitați adăugarea de componente React foarte complexe pentru a preveni erori de build
- Pagina /admin a fost simplificată/eliminată din cauza erorilor de build anterioare

## Deployment
- **Recomandare**: Folosiți deployment-ul Emergent cu domeniu propriu pentru a păstra toate conexiunile intacte (RSVP, poze, MongoDB)
- Cost: 50 credite/lună
