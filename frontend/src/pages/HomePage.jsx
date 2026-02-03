import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Camera, ChevronDown, Navigation, ExternalLink, Heart } from "lucide-react";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";

// Pozele cuplului
var HERO_IMAGE = "https://customer-assets.emergentagent.com/job_nunta-romantic/artifacts/x1hpdxwb_IMG_0820.jpeg";
var CTA_IMAGE = "https://customer-assets.emergentagent.com/job_nunta-romantic/artifacts/b9p1pmyw_IMG_0813.jpeg";

function HomePage() {
  var [galleryPhotos, setGalleryPhotos] = useState([]);
  var [visible, setVisible] = useState(false);

  useEffect(function() {
    setVisible(true);
    axios.get(API + "/photos?status=approved").then(function(res) { setGalleryPhotos(res.data.slice(0, 6)); }).catch(function(e) { console.error(e); });
  }, []);

  function scrollTo(id) { 
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" }); 
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Navigation */}
      <nav className={"fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#3D4F4F]/5 transition-all duration-700 " + (visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0")}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl text-[#3D4F4F] hover:text-[#7D9B8C] transition-colors duration-300" data-testid="nav-logo">S & A</Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={function() { scrollTo("details"); }} className="text-sm tracking-widest uppercase text-[#6B7B7B] hover:text-[#7D9B8C] transition-colors duration-300" data-testid="nav-details">Detalii</button>
            <button onClick={function() { scrollTo("locations"); }} className="text-sm tracking-widest uppercase text-[#6B7B7B] hover:text-[#7D9B8C] transition-colors duration-300" data-testid="nav-locations">Locatii</button>
            <Link to="/gallery" className="text-sm tracking-widest uppercase text-[#6B7B7B] hover:text-[#7D9B8C] transition-colors duration-300" data-testid="nav-gallery">Galerie</Link>
          </div>
        </div>
      </nav>

      {/* Hero cu poza cuplului */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: "url('" + HERO_IMAGE + "')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/20 via-[#FAF8F5]/40 to-[#FAF8F5]"></div>
        <div className={"relative z-10 px-6 transition-all duration-1000 " + (visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
          <p className="text-sm tracking-[0.3em] uppercase text-[#5A6B6B] mb-6 animate-fade-in" style={{animationDelay: "0.2s"}}>Va invitam la nunta noastra</p>
          <h1 className="font-serif text-6xl md:text-8xl font-medium text-[#3D4F4F] mb-4">
            <span className="inline-block animate-fade-in" style={{animationDelay: "0.4s"}}>Sara</span>
            <span className="text-[#B8977E] mx-4 inline-block animate-pulse">&</span>
            <span className="inline-block animate-fade-in" style={{animationDelay: "0.6s"}}>Adrian</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-[#5A6B6B] mb-12 animate-fade-in" style={{animationDelay: "0.8s"}}>
            <span className="w-12 h-px bg-[#7D9B8C]"></span>
            <span className="font-accent text-2xl italic">28 Iunie 2026</span>
            <span className="w-12 h-px bg-[#7D9B8C]"></span>
          </div>
          <Link to="/rsvp" className="inline-block px-10 py-4 bg-[#3D4F4F] text-[#FAF8F5] font-serif text-lg rounded-full hover:bg-[#7D9B8C] hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{animationDelay: "1s"}} data-testid="hero-rsvp-btn">Confirma Prezenta</Link>
        </div>
        <button onClick={function() { scrollTo("details"); }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#5A6B6B] animate-bounce hover:text-[#7D9B8C] transition-colors" data-testid="scroll-down-btn">
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Details */}
      <section id="details" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#7D9B8C] mb-4">Salveaza data</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D4F4F]">28 Iunie 2026</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-[#E8E4DF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7D9B8C] group-hover:scale-110 transition-all duration-300">
                <Calendar className="w-8 h-8 text-[#7D9B8C] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-2xl text-[#3D4F4F] mb-3">Data</h3>
              <p className="text-[#6B7B7B] text-lg">Duminica, 28 Iunie 2026</p>
            </div>
            <div className="text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-[#E8E4DF] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7D9B8C] group-hover:scale-110 transition-all duration-300">
                <Clock className="w-8 h-8 text-[#7D9B8C] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-2xl text-[#3D4F4F] mb-3">Ora</h3>
              <p className="text-[#6B7B7B] text-lg">Ceremonia: 15:00</p>
              <p className="text-[#6B7B7B] text-lg">Restaurant: 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 md:py-32 px-6 bg-gradient-to-b from-[#F0EDE8] to-[#FAF8F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#7D9B8C] mb-4">Unde ne vedem</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D4F4F]">Locatii</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremonia */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7D9B8C] to-[#5A7A6B] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#7D9B8C] mb-1">Ceremonia religioasa</p>
                  <h3 className="font-serif text-2xl text-[#3D4F4F]">Biserica Adventista Brancoveanu</h3>
                </div>
              </div>
              <p className="text-[#6B7B7B] mb-2 text-lg">Bucuresti, Romania</p>
              <p className="text-[#7D9B8C] font-medium mb-8">Ora: 15:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D4F4F] text-[#FAF8F5] font-serif text-sm rounded-full hover:bg-[#7D9B8C] hover:scale-105 transition-all duration-300" data-testid="church-maps-btn"><ExternalLink size={16} /> Google Maps</a>
                <a href="https://waze.com/ul?q=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#3D4F4F] text-[#3D4F4F] font-serif text-sm rounded-full hover:bg-[#3D4F4F] hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="church-waze-btn"><Navigation size={16} /> Waze</a>
              </div>
            </div>
            {/* Restaurant */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B8977E] to-[#9A7D66] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#B8977E] mb-1">Restaurant</p>
                  <h3 className="font-serif text-2xl text-[#3D4F4F]">Domeniul Monato</h3>
                </div>
              </div>
              <p className="text-[#6B7B7B] mb-2 text-lg">Bolintin-Vale, Giurgiu</p>
              <p className="text-[#B8977E] font-medium mb-8">Ora: 18:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D4F4F] text-[#FAF8F5] font-serif text-sm rounded-full hover:bg-[#B8977E] hover:scale-105 transition-all duration-300" data-testid="venue-maps-btn"><ExternalLink size={16} /> Google Maps</a>
                <a href="https://waze.com/ul?q=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#3D4F4F] text-[#3D4F4F] font-serif text-sm rounded-full hover:bg-[#3D4F4F] hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="venue-waze-btn"><Navigation size={16} /> Waze</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP CTA cu poza cuplului */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('" + CTA_IMAGE + "')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/80 to-[#FAF8F5]/60"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7D9B8C] to-[#5A7A6B] rounded-full flex items-center justify-center mb-8 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D4F4F] mb-6">Va asteptam cu drag!</h2>
            <p className="text-[#6B7B7B] text-lg mb-10">Confirmati participarea voastra pentru a ne ajuta cu organizarea acestei zile speciale.</p>
            <Link to="/rsvp" className="inline-block px-12 py-5 bg-[#3D4F4F] text-[#FAF8F5] font-serif text-lg rounded-full hover:bg-[#7D9B8C] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="cta-rsvp-btn">Confirma Prezenta</Link>
          </div>
        </div>
      </section>

      {/* Program */}
      <section id="program" className="py-24 md:py-32 px-6 bg-gradient-to-b from-[#FAF8F5] to-[#F0EDE8]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-[#7D9B8C] mb-4">Programul zilei</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#3D4F4F] mb-12">Program</h2>
          <div className="p-12 bg-white rounded-3xl shadow-lg">
            <p className="font-accent text-2xl italic text-[#6B7B7B]">Programul detaliat va fi publicat in curand.</p>
            <p className="text-[#7D9B8C] mt-4">Va multumim pentru rabdare!</p>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 md:py-32 px-6 bg-[#F0EDE8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#7D9B8C] mb-4">Amintiri</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D4F4F]">Galerie</h2>
          </div>
          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {galleryPhotos.map(function(photo, idx) { return (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <img src={API + "/photos/file/" + photo.filename} alt={"Gallery " + (idx+1)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ); })}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-3xl shadow-lg mb-12">
              <Camera className="w-16 h-16 mx-auto mb-4 text-[#7D9B8C] animate-pulse" />
              <p className="text-[#6B7B7B] text-lg">Galeria va fi populata cu poze in curand.</p>
            </div>
          )}
          <div className="text-center">
            <Link to="/gallery" className="inline-flex items-center gap-3 px-10 py-4 bg-[#3D4F4F] text-[#FAF8F5] font-serif text-lg rounded-full hover:bg-[#7D9B8C] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="gallery-upload-btn"><Camera size={22} /> Incarca Poze</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#3D4F4F] text-[#FAF8F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl mb-2">Sara & Adrian</h3>
            <p className="text-[#7D9B8C]">28 Iunie 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
            <Link to="/" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="footer-home">Acasa</Link>
            <Link to="/rsvp" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="footer-rsvp">RSVP</Link>
            <Link to="/gallery" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="footer-gallery">Galerie</Link>
            <Link to="/privacy" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:scale-105 transition-all duration-300" data-testid="footer-privacy">Confidentialitate</Link>
          </div>
          <div className="text-center text-[#FAF8F5]/50 text-sm"><p>Made with love for Sara & Adrian</p></div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
