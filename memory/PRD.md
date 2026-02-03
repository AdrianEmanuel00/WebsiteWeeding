# PRD - Website Nuntă Sara & Adrian

## Original Problem Statement
Website de nuntă în română, elegant, modern, mobile-first, pentru Sara & Adrian, data 28 iunie 2026. Scopul site-ului: informare invitați, RSVP cu meniu, galerie foto cu upload de la invitați, notificări pe email și QR code.

## User Personas
- **Invitați**: Persoane de toate vârstele care vor accesa site-ul pentru confirmare prezență și încărcare poze
- **Miri (Admin)**: Sara & Adrian care gestionează RSVP-urile și moderează galeria foto

## Core Requirements (Static)
1. Homepage one-page cu Hero, Detalii, Locații, Program, Galerie, Footer
2. Formular RSVP multi-step cu selecție meniu per persoană
3. Galerie foto cu upload de la invitați și moderare
4. Panou admin pentru gestionare RSVP și poze
5. QR code pentru invitații
6. Notificări email pentru RSVP
7. GDPR compliant

## What's Been Implemented ✅
**Date: 3 Feb 2026**

### Frontend
- ✅ Homepage elegant cu hero section, navigare, secțiuni detalii/locații/program/galerie/footer
- ✅ RSVP formular 3-pași (info bază → invitați & meniu → mesaj & submit)
- ✅ Galerie foto cu upload și lightbox
- ✅ Panou admin cu login, statistici, listă RSVP, moderare poze
- ✅ Pagina de confidențialitate GDPR
- ✅ Design romantic cu culori alb/crem și verde salvie/auriu

### Backend
- ✅ API RSVP (create, list, delete, export CSV)
- ✅ API Galerie (upload, list, moderate, delete)
- ✅ API Admin (login cu JWT)
- ✅ API Statistici (total invitați, meniuri, alergii)
- ✅ QR Code generation (1024x1024 PNG)
- ✅ Rate limiting anti-spam
- ✅ Integrare Resend pentru email

### Locații configurate
- Biserica Adventistă Brâncoveanu, București
- Domeniul Monato, Bolintin-Vale

### Credențiale Admin
- Username: admin
- Password: sara&adrian2026

## Prioritized Backlog

### P0 - Critical (Done ✅)
- [x] Homepage complet
- [x] RSVP flow complet
- [x] Admin panel funcțional
- [x] Galerie cu upload

### P1 - Important
- [ ] Configurare Resend API key pentru email-uri efective
- [ ] Countdown timer pe homepage
- [ ] Notificări email pentru aprobare poze

### P2 - Nice to Have
- [ ] Export Excel pentru RSVP (în plus față de CSV)
- [ ] Slideshow pentru galerie
- [ ] Integrare calendar (add to calendar)
- [ ] Multi-language support

## Next Tasks
1. Adăugare Resend API key valid în .env pentru email notifications
2. Test end-to-end al flow-ului complet RSVP
3. Upload poze test și verificare moderare
