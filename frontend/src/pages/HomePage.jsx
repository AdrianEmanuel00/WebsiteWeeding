import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Camera, Heart, ChevronDown, Navigation, ExternalLink } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function HomePage() {
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    axios.get(API + "/photos?status=approved")
      .then(res => setGalleryPhotos(res.data.slice(0, 6)))
      .catch(e => console.error(e));
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl text-[#2C3E30]" data-testid="nav-logo">S & A</Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("details")} className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="nav-details">Detalii</button>
            <button onClick={() => scrollTo("locations")} className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="nav-locations">Locatii</button>
            <Link to="/gallery" className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="nav-gallery">Galerie</Link>
            <Link to="/rsvp" className="px-6 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm hover:bg-[#1A261D]" data-testid="nav-rsvp">Confirma Prezenta</Link>
          </div>
          <Link to="/rsvp" className="md:hidden px-4 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm" data-testid="nav-rsvp-mobile">RSVP</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1647170353231-e053570a4a54?crop=entropy&cs=srgb&fm=jpg&q=85')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F2]/40 via-[#F9F7F2]/60 to-[#F9F7F2]" />
        <div className="relative z-10 px-6">
          <p className="text-sm tracking-[0.3em] uppercase text-[#5C6B5F] mb-6">Va invitam la nunta noastra</p>
          <h1 className="font-serif text-6xl md:text-8xl font-medium text-[#2C3E30] mb-4">Sara <span className="text-[#D4AF37]">&</span> Adrian</h1>
          <div className="flex items-center justify-center gap-4 text-[#5C6B5F] mb-12">
            <span className="w-12 h-px bg-[#8DA399]" />
            <span className="font-accent text-2xl italic">28 Iunie 2026</span>
            <span className="w-12 h-px bg-[#8DA399]" />
          </div>
          <Link to="/rsvp" className="inline-block px-10 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg hover:bg-[#1A261D]" data-testid="hero-rsvp-btn">Confirma Prezenta</Link>
        </div>
        <button onClick={() => scrollTo("details")} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#5C6B5F] animate-bounce" data-testid="scroll-down-btn">
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Details */}
      <section id="details" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Salveaza data</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">28 Iunie 2026</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Calendar className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Data</h3>
              <p className="text-[#5C6B5F]">Duminica, 28 Iunie 2026</p>
            </div>
            <div className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Clock className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Ora</h3>
              <p className="text-[#5C6B5F]">Ceremonia: 15:00</p>
              <p className="text-[#5C6B5F]">Petrecerea: 18:00</p>
            </div>
            <div className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Heart className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Dress Code</h3>
              <p className="text-[#5C6B5F]">Elegant / Semi-formal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 md:py-32 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Unde ne vedem</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Locatii</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="location-card p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E3EBE6] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#8DA399]" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#8DA399] mb-1">Ceremonia religioasa</p>
                  <h3 className="font-serif text-2xl text-[#2C3E30]">Biserica Adventista Brancoveanu</h3>
                </div>
              </div>
              <p className="text-[#5C6B5F] mb-6">Bucuresti, Romania</p>
              <p className="text-[#5C6B5F] mb-8">Ora: 15:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://maps.google.com/?q=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm" data-testid="church-maps-btn">
                  <ExternalLink size={16} /> Google Maps
                </a>
                <a href="https://waze.com/ul?q=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif text-sm hover:bg-[#2C3E30] hover:text-[#F9F7F2]" data-testid="church-waze-btn">
                  <Navigation size={16} /> Waze
                </a>
              </div>
            </div>
            <div className="location-card p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E3EBE6] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#8DA399]" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#8DA399] mb-1">Petrecerea</p>
                  <h3 className="font-serif text-2xl text-[#2C3E30]">Domeniul Monato</h3>
                </div>
              </div>
              <p className="text-[#5C6B5F] mb-6">Bolintin-Vale, Giurgiu</p>
              <p className="text-[#5C6B5F] mb-8">Ora: 18:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://maps.google.com/?q=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm" data-testid="venue-maps-btn">
                  <ExternalLink size={16} /> Google Maps
                </a>
                <a href="https://waze.com/ul?q=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif text-sm hover:bg-[#2C3E30] hover:text-[#F9F7F2]" data-testid="venue-waze-btn">
                  <Navigation size={16} /> Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Programul zilei</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-12">Program</h2>
          <div className="p-12 bg-white border border-[#2C3E30]/5">
            <p className="font-accent text-2xl italic text-[#5C6B5F]">Programul detaliat va fi publicat in curand.</p>
            <p className="text-[#8DA399] mt-4">Va multumim pentru rabdare!</p>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 md:py-32 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Amintiri</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Galerie</h2>
          </div>
          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {galleryPhotos.map((photo, idx) => (
                <div key={photo.id} className="aspect-square overflow-hidden">
                  <img src={API + "/photos/file/" + photo.filename} alt={"Gallery " + (idx+1)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white border border-[#2C3E30]/5 mb-12">
              <Camera className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
              <p className="text-[#5C6B5F]">Galeria va fi populata cu poze in curand.</p>
            </div>
          )}
          <div className="text-center">
            <Link to="/gallery" className="inline-flex items-center gap-2 px-10 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg hover:bg-[#1A261D]" data-testid="gallery-upload-btn">
              <Camera size={20} /> Incarca Poze
            </Link>
          </div>
        </div>
      </section>

      {/* RSVP CTA */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528696466037-2883fc6c2d4a?crop=entropy&cs=srgb&fm=jpg&q=85')" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-6">Va asteptam cu drag!</h2>
          <p className="text-[#5C6B5F] text-lg mb-10 max-w-xl mx-auto">Confirmati participarea voastra pentru a ne ajuta cu organizarea acestei zile speciale.</p>
          <Link to="/rsvp" className="inline-block px-12 py-5 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg hover:bg-[#1A261D]" data-testid="cta-rsvp-btn">Confirma Prezenta</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#2C3E30] text-[#F9F7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl mb-2">Sara & Adrian</h3>
            <p className="text-[#8DA399]">28 Iunie 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
            <Link to="/" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2]" data-testid="footer-home">Acasa</Link>
            <Link to="/rsvp" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2]" data-testid="footer-rsvp">RSVP</Link>
            <Link to="/gallery" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2]" data-testid="footer-gallery">Galerie</Link>
            <Link to="/privacy" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2]" data-testid="footer-privacy">Confidentialitate</Link>
          </div>
          <div className="text-center text-[#F9F7F2]/50 text-sm">
            <p>Made with love for Sara & Adrian</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
