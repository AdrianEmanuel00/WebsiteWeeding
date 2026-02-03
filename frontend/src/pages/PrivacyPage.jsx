import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30] transition-colors" data-testid="privacy-back-link">
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Înapoi</span>
          </Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">Confidențialitate</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
              <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Politica de Confidențialitate</h1>
              <p className="text-[#5C6B5F]">Ultima actualizare: Ianuarie 2026</p>
            </div>

            <div className="bg-white p-8 md:p-12 border border-[#2C3E30]/5 space-y-8 text-[#5C6B5F] leading-relaxed">
              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">1. Introducere</h2>
                <p>
                  Acest website a fost creat pentru nunta Sara & Adrian din 28 Iunie 2026. 
                  Protecția datelor dumneavoastră personale este importantă pentru noi și ne 
                  angajăm să respectăm Regulamentul General privind Protecția Datelor (GDPR).
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">2. Date colectate</h2>
                <p className="mb-4">Colectăm următoarele informații:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Nume și prenume (pentru confirmarea prezenței)</li>
                  <li>Numărul de persoane participante</li>
                  <li>Preferințele de meniu și alergii alimentare</li>
                  <li>Fotografii încărcate de invitați (cu consimțământ explicit)</li>
                  <li>Mesaje opționale pentru miri</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">3. Scopul prelucrării datelor</h2>
                <p className="mb-4">Datele colectate sunt utilizate exclusiv pentru:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Organizarea evenimentului (planificare locuri, meniuri)</li>
                  <li>Comunicarea cu invitații</li>
                  <li>Crearea galeriei foto pentru amintiri</li>
                </ul>
                <p className="mt-4 font-medium text-[#2C3E30]">
                  Datele NU vor fi partajate cu terți în scopuri comerciale sau de marketing.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">4. Stocarea datelor</h2>
                <p>
                  Datele sunt stocate în mod securizat și vor fi păstrate doar pe durata 
                  necesară organizării evenimentului. După nuntă, datele vor fi șterse 
                  în termen de 6 luni, cu excepția fotografiilor care pot fi păstrate 
                  pentru amintiri, cu acordul celor implicați.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">5. Drepturile dumneavoastră</h2>
                <p className="mb-4">Conform GDPR, aveți următoarele drepturi:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Dreptul de acces</strong> - puteți solicita informații despre datele stocate</li>
                  <li><strong>Dreptul la rectificare</strong> - puteți cere corectarea datelor incorecte</li>
                  <li><strong>Dreptul la ștergere</strong> - puteți cere ștergerea datelor personale</li>
                  <li><strong>Dreptul la retragerea consimțământului</strong> - puteți retrage oricând acordul pentru fotografii</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">6. Fotografii</h2>
                <p>
                  Fotografiile încărcate de invitați sunt supuse moderării înainte de a fi 
                  publicate în galerie. Prin încărcarea unei fotografii, confirmați că aveți 
                  dreptul de a o distribui și că persoanele din imagine și-au dat acordul.
                </p>
                <p className="mt-4">
                  Puteți solicita oricând ștergerea fotografiilor în care apăreți.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#2C3E30] mb-4">7. Contact</h2>
                <p>
                  Pentru orice întrebări sau solicitări privind datele personale, ne puteți 
                  contacta la adresa de email:{" "}
                  <a href="mailto:adrianemanuel007@gmail.com" className="text-[#8DA399] hover:underline">
                    adrianemanuel007@gmail.com
                  </a>
                </p>
              </section>

              <section className="pt-8 border-t border-[#2C3E30]/10">
                <p className="text-sm text-[#8DA399]">
                  Vă mulțumim că ne-ați acordat încrederea. Așteptăm cu nerăbdare să sărbătorim împreună!
                </p>
                <p className="font-serif text-lg text-[#2C3E30] mt-2">Sara & Adrian</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2C3E30]/5">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="font-serif text-xl text-[#2C3E30]">Sara & Adrian</Link>
          <p className="text-[#8DA399] text-sm mt-2">28 Iunie 2026</p>
        </div>
      </footer>
    </div>
  );
}
