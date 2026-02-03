import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Plus, Trash2, Users, Utensils, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const MENUS = ["Standard", "Vegetarian", "Vegan", "Fara porc", "Copil"];

export default function RSVPPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState(null);
  const [guests, setGuests] = useState([{ name: "", menu_type: "Standard" }]);
  const [allergies, setAllergies] = useState("");
  const [message, setMessage] = useState("");

  function updateGuest(index, field, value) {
    var g = guests.slice();
    g[index] = Object.assign({}, g[index]);
    g[index][field] = value;
    setGuests(g);
  }

  function addGuest() {
    if (guests.length < 10) setGuests(guests.concat([{ name: "", menu_type: "Standard" }]));
  }

  function removeGuest(index) {
    if (guests.length > 1) setGuests(guests.filter(function(_, i) { return i !== index; }));
  }

  function canProceed() {
    if (step === 1) return guestName.trim() !== "" && attending !== null;
    if (step === 2) return guests.every(function(g) { return g.name.trim() !== ""; });
    return true;
  }

  function handleSubmit() {
    setLoading(true);
    var payload = {
      guest_name: guestName,
      attending: attending,
      num_guests: attending ? guests.length : 0,
      guests: attending ? guests : [],
      allergies: allergies,
      message: message
    };
    axios.post(API + "/rsvp", payload).then(function() {
      setSubmitted(true);
      toast.success("Multumim pentru confirmare!");
    }).catch(function() {
      toast.error("A aparut o eroare. Incercati din nou.");
    }).finally(function() {
      setLoading(false);
    });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#8DA399] flex items-center justify-center mx-auto mb-8"><Check className="w-10 h-10 text-white" /></div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Multumim!</h1>
          <p className="text-[#5C6B5F] text-lg mb-8">{attending ? "Abia asteptam sa sarbatorim impreuna!" : "Ne pare rau ca nu veti putea participa."}</p>
          <Link to="/" className="inline-block px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif" data-testid="back-home-btn">Inapoi la pagina principala</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="rsvp-back-link"><ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span></Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">RSVP</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map(function(s) { return (<div key={s} className="flex items-center"><div className={"w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm " + (step >= s ? "bg-[#2C3E30] text-[#F9F7F2]" : "bg-[#F0EFEA] text-[#5C6B5F]")}>{s}</div>{s < 3 && <div className={"w-12 h-0.5 " + (step > s ? "bg-[#2C3E30]" : "bg-[#F0EFEA]")}></div>}</div>); })}
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-12"><Users className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" /><h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Informatii de baza</h2><p className="text-[#5C6B5F]">Spuneti-ne cine sunteti</p></div>
              <div className="space-y-6">
                <div><label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Numele complet *</label><input type="text" value={guestName} onChange={function(e) { setGuestName(e.target.value); }} className="w-full p-4 border border-[#2C3E30]/20 bg-white" placeholder="ex: Ion Popescu" data-testid="guest-name-input" /></div>
                <div><label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-4 block">Veti participa la nunta? *</label>
                  <div className="flex gap-4">
                    <button onClick={function() { setAttending(true); }} className={"flex-1 flex flex-col items-center justify-center p-6 border-2 " + (attending === true ? "border-[#8DA399] bg-[#E3EBE6]" : "border-[#2C3E30]/10 bg-white")} data-testid="attending-yes"><Check className="w-8 h-8 mb-2 text-[#8DA399]" /><span className="font-serif text-lg text-[#2C3E30]">Da, participam</span></button>
                    <button onClick={function() { setAttending(false); }} className={"flex-1 flex flex-col items-center justify-center p-6 border-2 " + (attending === false ? "border-[#B95D5D] bg-red-50" : "border-[#2C3E30]/10 bg-white")} data-testid="attending-no"><AlertCircle className="w-8 h-8 mb-2 text-[#B95D5D]" /><span className="font-serif text-lg text-[#2C3E30]">Nu, din pacate</span></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && attending && (
            <div className="space-y-8">
              <div className="text-center mb-12"><Utensils className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" /><h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Invitati & Meniu</h2><p className="text-[#5C6B5F]">Adaugati persoanele care vor participa</p></div>
              <div className="space-y-4">
                {guests.map(function(guest, i) { return (
                  <div key={i} className="p-6 bg-white border border-[#2C3E30]/5">
                    <div className="flex items-center justify-between mb-4"><span className="text-sm tracking-widest uppercase text-[#8DA399]">Persoana {i + 1}</span>{guests.length > 1 && <button onClick={function() { removeGuest(i); }} className="text-[#B95D5D]" data-testid={"remove-guest-" + i}><Trash2 size={18} /></button>}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-[#2C3E30] text-xs tracking-widest uppercase mb-2 block">Nume *</label><input type="text" value={guest.name} onChange={function(e) { updateGuest(i, "name", e.target.value); }} className="w-full p-3 border border-[#2C3E30]/20" placeholder="Nume complet" data-testid={"guest-name-" + i} /></div>
                      <div><label className="text-[#2C3E30] text-xs tracking-widest uppercase mb-2 block">Meniu</label><select value={guest.menu_type} onChange={function(e) { updateGuest(i, "menu_type", e.target.value); }} className="w-full p-3 border border-[#2C3E30]/20" data-testid={"guest-menu-" + i}>{MENUS.map(function(m) { return <option key={m} value={m}>{m}</option>; })}</select></div>
                    </div>
                  </div>
                ); })}
                <button onClick={addGuest} disabled={guests.length >= 10} className="w-full p-4 border-2 border-dashed border-[#2C3E30]/20 text-[#5C6B5F] hover:border-[#8DA399] flex items-center justify-center gap-2" data-testid="add-guest-btn"><Plus size={20} /> Adauga persoana</button>
              </div>
              <div><label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Alergii sau restrictii alimentare</label><input type="text" value={allergies} onChange={function(e) { setAllergies(e.target.value); }} className="w-full p-4 border border-[#2C3E30]/20 bg-white" placeholder="ex: alergie la nuci" data-testid="allergies-input" /></div>
            </div>
          )}

          {(step === 3 || (step === 2 && !attending)) && (
            <div className="space-y-8">
              <div className="text-center mb-12"><MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" /><h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Mesaj</h2><p className="text-[#5C6B5F]">Lasati-ne un mesaj (optional)</p></div>
              <textarea value={message} onChange={function(e) { setMessage(e.target.value); }} className="w-full p-4 border border-[#2C3E30]/20 bg-white min-h-[150px]" placeholder="Scrie-ne un mesaj..." data-testid="message-textarea"></textarea>
              <div className="p-6 bg-[#F0EFEA]">
                <h3 className="font-serif text-xl text-[#2C3E30] mb-4">Rezumat</h3>
                <div className="space-y-2 text-[#5C6B5F]">
                  <p><strong>Nume:</strong> {guestName}</p>
                  <p><strong>Participare:</strong> {attending ? "Da" : "Nu"}</p>
                  {attending && (<><p><strong>Nr. persoane:</strong> {guests.length}</p><ul className="list-disc list-inside ml-4">{guests.map(function(g, i) { return <li key={i}>{g.name} - {g.menu_type}</li>; })}</ul>{allergies && <p><strong>Alergii:</strong> {allergies}</p>}</>)}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-12">
            {step > 1 && <button onClick={function() { setStep(step - 1); }} className="px-8 py-4 border border-[#2C3E30] text-[#2C3E30] font-serif hover:bg-[#2C3E30] hover:text-[#F9F7F2]" data-testid="prev-step-btn">Inapoi</button>}
            <div className={step === 1 ? "ml-auto" : ""}>
              {((step < 3 && attending) || (step === 1 && attending === false)) ? (
                <button onClick={function() { if (step === 1 && attending === false) setStep(3); else setStep(step + 1); }} disabled={!canProceed()} className="px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50" data-testid="next-step-btn">Continua</button>
              ) : (
                <button onClick={handleSubmit} disabled={loading || !canProceed()} className="px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50 flex items-center gap-2" data-testid="submit-rsvp-btn">{loading ? "Se trimite..." : "Trimite confirmarea"}</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
