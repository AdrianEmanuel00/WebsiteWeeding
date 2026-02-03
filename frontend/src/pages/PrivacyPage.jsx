import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="privacy-back-link"><ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span></Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">Confidentialitate</span>
        </div>
      </header>
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12"><Shield className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" /><h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Politica de Confidentialitate</h1><p className="text-[#5C6B5F]">Ultima actualizare: Ianuarie 2026</p></div>
          <div className="bg-white p-8 md:p-12 border border-[#2C3E30]/5 space-y-8 text-[#5C6B5F] leading-relaxed">
            <section><h2 className="font-serif text-2xl text-[#2C3E30] mb-4">1. Introducere</h2><p>Acest website a fost creat pentru nunta Sara & Adrian din 28 Iunie 2026. Protectia datelor dumneavoastra personale este importanta pentru noi si ne angajam sa respectam Regulamentul General privind Protectia Datelor (GDPR).</p></section>
            <section><h2 className="font-serif text-2xl text-[#2C3E30] mb-4">2. Date colectate</h2><p className="mb-4">Colectam urmatoarele informatii:</p><ul className="list-disc list-inside ml-4 space-y-2"><li>Nume si prenume</li><li>Numarul de persoane participante</li><li>Preferintele de meniu si alergii alimentare</li><li>Fotografii incarcate de invitati</li><li>Mesaje optionale pentru miri</li></ul></section>
            <section><h2 className="font-serif text-2xl text-[#2C3E30] mb-4">3. Scopul prelucrarii</h2><p className="mb-4">Datele colectate sunt utilizate exclusiv pentru:</p><ul className="list-disc list-inside ml-4 space-y-2"><li>Organizarea evenimentului</li><li>Comunicarea cu invitatii</li><li>Crearea galeriei foto</li></ul><p className="mt-4 font-medium text-[#2C3E30]">Datele NU vor fi partajate cu terti in scopuri comerciale.</p></section>
            <section><h2 className="font-serif text-2xl text-[#2C3E30] mb-4">4. Drepturile dumneavoastra</h2><p className="mb-4">Conform GDPR, aveti dreptul de:</p><ul className="list-disc list-inside ml-4 space-y-2"><li>Acces la datele stocate</li><li>Rectificare a datelor incorecte</li><li>Stergere a datelor personale</li><li>Retragere a consimtamantului</li></ul></section>
            <section><h2 className="font-serif text-2xl text-[#2C3E30] mb-4">5. Contact</h2><p>Pentru orice intrebari: <a href="mailto:adrianemanuel007@gmail.com" className="text-[#8DA399] hover:underline">adrianemanuel007@gmail.com</a></p></section>
            <section className="pt-8 border-t border-[#2C3E30]/10"><p className="text-sm text-[#8DA399]">Va multumim pentru incredere!</p><p className="font-serif text-lg text-[#2C3E30] mt-2">Sara & Adrian</p></section>
          </div>
        </div>
      </main>
      <footer className="py-8 px-6 border-t border-[#2C3E30]/5"><div className="max-w-3xl mx-auto text-center"><Link to="/" className="font-serif text-xl text-[#2C3E30]">Sara & Adrian</Link><p className="text-[#8DA399] text-sm mt-2">28 Iunie 2026</p></div></footer>
    </div>
  );
}
