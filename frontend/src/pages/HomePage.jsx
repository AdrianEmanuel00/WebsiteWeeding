import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Camera, ChevronDown, Navigation, ExternalLink, Heart } from "lucide-react";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";

var HERO_IMAGE = "https://customer-assets.emergentagent.com/job_nunta-romantic/artifacts/x1hpdxwb_IMG_0820.jpeg";
var CTA_IMAGE = "https://customer-assets.emergentagent.com/job_nunta-romantic/artifacts/b9p1pmyw_IMG_0813.jpeg";

function HomePage() {
  var [galleryPhotos, setGalleryPhotos] = useState([]);
  var [visible, setVisible] = useState(false);
  var [scrolled, setScrolled] = useState(false);

  useEffect(function() {
    setVisible(true);
    axios.get(API + "/photos?status=approved").then(function(res) { setGalleryPhotos(res.data.slice(0, 6)); }).catch(function(e) { console.error(e); });
    
    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll);
    return function() { window.removeEventListener("scroll", handleScroll); };
  }, []);

  function scrollTo(id) { 
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" }); 
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      {/* Navigation - Transparent */}
      <nav className={"fixed top-0 left-0 right-0 z-50 transition-all duration-500 " + (scrolled ? "bg-[#F5EFEB]/90 backdrop-blur-md shadow-sm" : "bg-transparent") + " " + (visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0")}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link
            to="/"
            className={"font-script text-3xl transition-colors duration-300 " + (scrolled ? "text-[#2F4156]" : "text-white drop-shadow-lg")}
            data-testid="nav-logo"
          >
            S <span className="text-[rgba(47,65,86,0.9)]">&</span> A
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={function() { scrollTo("locations"); }} className={"text-sm tracking-widest uppercase transition-colors duration-300 " + (scrolled ? "text-[#567C8D] hover:text-[#2F4156]" : "text-white/90 hover:text-white drop-shadow")} data-testid="nav-locations">Locatii</button>
            <button onClick={function() { scrollTo("program"); }} className={"text-sm tracking-widest uppercase transition-colors duration-300 " + (scrolled ? "text-[#567C8D] hover:text-[#2F4156]" : "text-white/90 hover:text-white drop-shadow")} data-testid="nav-program">Program</button>
            <Link to="/gallery" className={"text-sm tracking-widest uppercase transition-colors duration-300 " + (scrolled ? "text-[#567C8D] hover:text-[#2F4156]" : "text-white/90 hover:text-white drop-shadow")} data-testid="nav-gallery">Galerie</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover scale-105"
          style={{ backgroundImage: "url('" + HERO_IMAGE + "')", backgroundPosition: "center 35%" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#F5EFEB]"></div>
        <div className={"relative z-10 px-6 transition-all duration-1000 " + (visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
          <p className="text-sm tracking-[0.3em] uppercase text-white/90 mb-8 animate-fade-in font-medium drop-shadow-lg" style={{animationDelay: "0.2s"}}>Va invitam la nunta noastra</p>
          <h1 className="font-script text-7xl md:text-9xl text-white mb-6 leading-tight drop-shadow-xl">
            <span className="inline-block animate-fade-in" style={{animationDelay: "0.4s"}}>Sara</span>
            <span className="text-[rgba(47,65,86,0.9)] mx-3 md:mx-5 inline-block animate-fade-in font-script text-6xl md:text-8xl drop-shadow-lg" style={{animationDelay: "0.5s"}}>&</span>
            <span className="inline-block animate-fade-in" style={{animationDelay: "0.6s"}}>Adrian</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/90 mb-12 animate-fade-in drop-shadow" style={{animationDelay: "0.8s"}}>
            <span className="w-16 h-px bg-white/60"></span>
            <span className="font-accent text-2xl md:text-3xl italic">28 Iunie 2026</span>
            <span className="w-16 h-px bg-white/60"></span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: "1s"}}>
            <button onClick={function() { scrollTo("program"); }} className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/50 text-white font-serif text-base rounded-full hover:bg-white hover:text-[#2F4156] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="btn-program-biserica">
              Program Biserică
            </button>
            <Link to="/mese" className="w-full sm:w-auto px-8 py-4 bg-[#2F4156]/80 backdrop-blur-sm border border-[#2F4156] text-white font-serif text-base rounded-full hover:bg-[#2F4156] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="btn-mese">
              Vezi Mese
            </Link>
            <button onClick={function() { scrollTo("program-restaurant"); }} className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/50 text-white font-serif text-base rounded-full hover:bg-white hover:text-[#2F4156] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="btn-program-restaurant">
              Program Restaurant
            </button>
          </div>
        </div>
        <button onClick={function() { scrollTo("locations"); }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 animate-bounce hover:text-white transition-colors drop-shadow" data-testid="scroll-down-btn">
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 md:py-32 px-6 bg-gradient-to-b from-[#C8D9E6]/30 to-[#F5EFEB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#567C8D] mb-4">Unde ne vedem</p>
            <h2 className="font-script text-5xl md:text-6xl text-[#2F4156]">Locatii</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#567C8D] to-[#2F4156] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#567C8D] mb-1">Ceremonia religioasa</p>
                  <h3 className="font-script text-2xl md:text-3xl text-[#2F4156]">Biserica Adventista Brancoveanu</h3>
                </div>
              </div>
              <p className="text-[#567C8D] mb-2 text-lg">Bucuresti, Romania</p>
              <p className="text-[#2F4156] font-medium mb-8">Ora: 14:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F4156] text-white font-medium text-sm rounded-full hover:bg-[#567C8D] hover:scale-105 transition-all duration-300" data-testid="church-maps-btn"><ExternalLink size={16} /> Google Maps</a>
                <a href="https://waze.com/ul?q=Biserica+Adventista+Brancoveanu+Bucuresti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#2F4156] text-[#2F4156] font-medium text-sm rounded-full hover:bg-[#2F4156] hover:text-white hover:scale-105 transition-all duration-300" data-testid="church-waze-btn"><Navigation size={16} /> Waze</a>
              </div>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[rgba(47,65,86,0.9)] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[rgba(47,65,86,0.9)] mb-1">Restaurant</p>
                  <h3 className="font-script text-2xl md:text-3xl text-[#2F4156]">Domeniul Monato</h3>
                </div>
              </div>
              <p className="text-[#567C8D] mb-2 text-lg">Bolintin-Vale, Giurgiu</p>
              <p className="text-[#2F4156] font-medium mb-8">Ora: 17:00</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F4156] text-white font-medium text-sm rounded-full hover:bg-[#B8977E] hover:scale-105 transition-all duration-300" data-testid="venue-maps-btn"><ExternalLink size={16} /> Google Maps</a>
                <a href="https://waze.com/ul?q=Domeniul+Monato+Bolintin+Vale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#2F4156] text-[#2F4156] font-medium text-sm rounded-full hover:bg-[#2F4156] hover:text-white hover:scale-105 transition-all duration-300" data-testid="venue-waze-btn"><Navigation size={16} /> Waze</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Cununie */}
      <section id="program" className="py-24 md:py-32 px-6 bg-gradient-to-b from-[#F5EFEB] to-[#C8D9E6]/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-[#567C8D] mb-4">Biserica Adventistă Brâncoveanu · Ora 14:00</p>
          <h2 className="font-script text-5xl md:text-6xl text-[#2F4156] mb-3">Program</h2>
          <p className="font-accent text-xl italic text-[#567C8D] mb-12">Cununie Religioasă</p>

          <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#C8D9E6] via-[#567C8D] to-[#C8D9E6]"></div>

            <ul className="py-10 px-8 md:px-14 space-y-0">
              {[
                "Intrare mire",
                "Intrare mireasă",
                "Adi — cuvânt de bun venit",
                "Cântare de deschidere și rugăciune",
                "Moment muzical coral · Enjoy",
                "Cuvânt · Adelina Olteanu Rotaru",
                "Piesă solo · Anda Clara Burduloi",
                "Cuvânt · Vicky Burduloi",
                "Grup bărbătesc · Poveste de dragoste",
                "Cuvânt · Emma Văraru",
                "Moment Muzical Coral · Enjoy",
                "Cuvânt · Daniel și Rahela Dina",
                "Cuvânt · Iarca Gabi",
                "Binecuvântare · Iarca Gabi",
                "Anunțuri · Adi",
                "Ieșire Miri",
              ].map(function(item, idx, arr) { return (
                <li key={idx}>
                  <p className="font-accent text-lg md:text-xl italic text-[#2F4156] py-3 tracking-wide">{item}</p>
                  {idx < arr.length - 1 && (
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-[#C8D9E6]/60"></div>
                      <div className="w-1 h-1 rounded-full bg-[#567C8D]/40"></div>
                      <div className="h-px flex-1 bg-[#C8D9E6]/60"></div>
                    </div>
                  )}
                </li>
              ); })}
            </ul>

            {/* Bottom decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#C8D9E6] via-[#567C8D] to-[#C8D9E6]"></div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 md:py-32 px-6 bg-[#C8D9E6]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.2em] uppercase text-[#567C8D] mb-4">Amintiri</p>
            <h2 className="font-script text-5xl md:text-6xl text-[#2F4156]">Galerie</h2>
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
              <Camera className="w-16 h-16 mx-auto mb-4 text-[#567C8D] animate-pulse" />
              <p className="text-[#567C8D] text-lg">Galeria va fi populata cu poze in curand.</p>
            </div>
          )}
          <div className="text-center">
            <Link to="/gallery" className="inline-flex items-center gap-3 px-10 py-4 bg-[#2F4156] text-white font-serif text-lg rounded-full hover:bg-[#567C8D] hover:scale-105 hover:shadow-xl transition-all duration-300" data-testid="gallery-upload-btn"><Camera size={22} /> Incarca Poze</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#2F4156] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-script text-4xl mb-2">Sara <span className="text-white">&</span> Adrian</h3>
            <p className="text-[#C8D9E6]">28 Iunie 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
            <Link to="/" className="text-white/80 hover:text-white hover:scale-105 transition-all duration-300" data-testid="footer-home">Acasa</Link>
            <Link to="/rsvp" className="text-white/80 hover:text-white hover:scale-105 transition-all duration-300" data-testid="footer-rsvp">RSVP</Link>
            <Link to="/gallery" className="text-white/80 hover:text-white hover:scale-105 transition-all duration-300" data-testid="footer-gallery">Galerie</Link>
            <Link to="/privacy" className="text-white/80 hover:text-white hover:scale-105 transition-all duration-300" data-testid="footer-privacy">Confidentialitate</Link>
          </div>
          <div className="border-t border-white/10 pt-8 mt-4 text-center">
            <p className="text-[#C8D9E6] text-sm mb-4">Termen limită confirmări: <span className="text-white font-medium">15 Mai 2026</span></p>
            <Link to="/rsvp" className="inline-block px-8 py-3 border border-white/30 text-white/80 text-sm font-serif rounded-full hover:bg-white/10 hover:text-white transition-all duration-300" data-testid="footer-rsvp-btn">Confirmă Prezența</Link>
          </div>
          <div className="text-center text-white/30 text-xs mt-8"><p>Made with love for Sara & Adrian</p></div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
