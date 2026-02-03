import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Camera, Heart, ChevronDown, Navigation, ExternalLink } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function HomePage() {
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${API}/photos?status=approved`);
        setGalleryPhotos(res.data.slice(0, 6));
      } catch (e) {
        console.error("Error fetching photos:", e);
      }
    };
    fetchPhotos();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl text-[#2C3E30]" data-testid="nav-logo">
            S & A
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("details")} className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30] transition-colors" data-testid="nav-details">
              Detalii
            </button>
            <button onClick={() => scrollToSection("locations")} className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30] transition-colors" data-testid="nav-locations">
              Locații
            </button>
            <Link to="/gallery" className="text-sm tracking-widest uppercase text-[#5C6B5F] hover:text-[#2C3E30] transition-colors" data-testid="nav-gallery">
              Galerie
            </Link>
            <Link to="/rsvp" className="px-6 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm tracking-wide hover:bg-[#1A261D] transition-colors" data-testid="nav-rsvp">
              Confirmă Prezența
            </Link>
          </div>
          <Link to="/rsvp" className="md:hidden px-4 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm" data-testid="nav-rsvp-mobile">
            RSVP
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1647170353231-e053570a4a54?crop=entropy&cs=srgb&fm=jpg&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F2]/40 via-[#F9F7F2]/60 to-[#F9F7F2]" />
        
        <motion.div 
          className="relative z-10 px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeInUp} className="text-sm tracking-[0.3em] uppercase text-[#5C6B5F] mb-6">
            Vă invităm la nunta noastră
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-serif text-6xl md:text-8xl font-medium text-[#2C3E30] mb-4">
            Sara <span className="text-[#D4AF37]">&</span> Adrian
          </motion.h1>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 text-[#5C6B5F] mb-12">
            <span className="w-12 h-px bg-[#8DA399]" />
            <span className="font-accent text-2xl italic">28 Iunie 2026</span>
            <span className="w-12 h-px bg-[#8DA399]" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Link 
              to="/rsvp"
              className="inline-block px-10 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg tracking-wide hover:bg-[#1A261D] transition-all duration-300"
              data-testid="hero-rsvp-btn"
            >
              Confirmă Prezența
            </Link>
          </motion.div>
        </motion.div>

        <motion.button 
          onClick={() => scrollToSection("details")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#5C6B5F] animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5 } }}
          data-testid="scroll-down-btn"
        >
          <ChevronDown size={32} />
        </motion.button>
      </section>

      {/* Quick Details Section */}
      <section id="details" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Salvează data</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">28 Iunie 2026</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Calendar className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Data</h3>
              <p className="text-[#5C6B5F]">Duminică, 28 Iunie 2026</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Clock className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Ora</h3>
              <p className="text-[#5C6B5F]">Ceremonia: 15:00</p>
              <p className="text-[#5C6B5F]">Petrecerea: 18:00</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center p-8 bg-white border border-[#2C3E30]/5">
              <Heart className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
              <h3 className="font-serif text-xl text-[#2C3E30] mb-2">Dress Code</h3>
              <p className="text-[#5C6B5F]">Elegant / Semi-formal</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-24 md:py-32 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Unde ne vedem</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Locații</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Church Card */}
            <motion.div variants={fadeInUp} className="location-card p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E3EBE6] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#8DA399]" />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#8DA399] mb-1">Ceremonia religioasă</p>
                  <h3 className="font-serif text-2xl text-[#2C3E30]">Biserica Adventistă Brâncoveanu</h3>
                </div>
              </div>
              <p className="text-[#5C6B5F] mb-6">București, România</p>
              <p className="text-[#5C6B5F] mb-8">Ora: 15:00</p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://maps.google.com/?q=Biserica+Adventista+Brancoveanu+Bucuresti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm hover:bg-[#1A261D] transition-colors"
                  data-testid="church-maps-btn"
                >
                  <ExternalLink size={16} />
                  Google Maps
                </a>
                <a 
                  href="https://waze.com/ul?q=Biserica+Adventista+Brancoveanu+Bucuresti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif text-sm hover:bg-[#2C3E30] hover:text-[#F9F7F2] transition-colors"
                  data-testid="church-waze-btn"
                >
                  <Navigation size={16} />
                  Waze
                </a>
              </div>
            </motion.div>

            {/* Venue Card */}
            <motion.div variants={fadeInUp} className="location-card p-8 md:p-10">
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
                <a 
                  href="https://maps.google.com/?q=Domeniul+Monato+Bolintin+Vale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm hover:bg-[#1A261D] transition-colors"
                  data-testid="venue-maps-btn"
                >
                  <ExternalLink size={16} />
                  Google Maps
                </a>
                <a 
                  href="https://waze.com/ul?q=Domeniul+Monato+Bolintin+Vale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif text-sm hover:bg-[#2C3E30] hover:text-[#F9F7F2] transition-colors"
                  data-testid="venue-waze-btn"
                >
                  <Navigation size={16} />
                  Waze
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Programul zilei</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-12">Program</h2>
            <div className="p-12 bg-white border border-[#2C3E30]/5">
              <p className="font-accent text-2xl italic text-[#5C6B5F]">
                Programul detaliat va fi publicat în curând.
              </p>
              <p className="text-[#8DA399] mt-4">Vă mulțumim pentru răbdare!</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section id="gallery-preview" className="py-24 md:py-32 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Amintiri</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Galerie</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {galleryPhotos.map((photo, idx) => (
                  <motion.div 
                    key={photo.id}
                    variants={fadeInUp}
                    className="aspect-square overflow-hidden"
                  >
                    <img 
                      src={`${API}/photos/file/${photo.filename}`}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={fadeInUp} className="text-center p-12 bg-white border border-[#2C3E30]/5 mb-12">
                <Camera className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
                <p className="text-[#5C6B5F]">Galeria va fi populată cu poze în curând.</p>
              </motion.div>
            )}

            <motion.div variants={fadeInUp} className="text-center">
              <Link 
                to="/gallery"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg tracking-wide hover:bg-[#1A261D] transition-colors"
                data-testid="gallery-upload-btn"
              >
                <Camera size={20} />
                Încarcă Poze
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* RSVP CTA Section */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528696466037-2883fc6c2d4a?crop=entropy&cs=srgb&fm=jpg&q=85')" }}
        />
        <motion.div 
          className="max-w-3xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-6">
            Vă așteptăm cu drag!
          </h2>
          <p className="text-[#5C6B5F] text-lg mb-10 max-w-xl mx-auto">
            Confirmați participarea voastră pentru a ne ajuta cu organizarea acestei zile speciale.
          </p>
          <Link 
            to="/rsvp"
            className="inline-block px-12 py-5 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg tracking-wide hover:bg-[#1A261D] transition-colors"
            data-testid="cta-rsvp-btn"
          >
            Confirmă Prezența
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#2C3E30] text-[#F9F7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl mb-2">Sara & Adrian</h3>
            <p className="text-[#8DA399]">28 Iunie 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
            <Link to="/" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2] transition-colors" data-testid="footer-home">
              Acasă
            </Link>
            <Link to="/rsvp" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2] transition-colors" data-testid="footer-rsvp">
              RSVP
            </Link>
            <Link to="/gallery" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2] transition-colors" data-testid="footer-gallery">
              Galerie
            </Link>
            <Link to="/privacy" className="text-[#F9F7F2]/80 hover:text-[#F9F7F2] transition-colors" data-testid="footer-privacy">
              Confidențialitate
            </Link>
          </div>
          <div className="text-center text-[#F9F7F2]/50 text-sm">
            <p>Made with ❤️ for Sara & Adrian</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
