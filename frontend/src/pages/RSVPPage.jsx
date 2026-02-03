import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";
var MENUS = ["Cu carne", "Vegetarian (cu peste)", "Vegetarian (fara peste)"];

function RSVPPage() {
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [name, setName] = useState("");
  var [menu, setMenu] = useState("Cu carne");
  var [hasGuest, setHasGuest] = useState(false);
  var [guestName, setGuestName] = useState("");
  var [guestMenu, setGuestMenu] = useState("Cu carne");
  var [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Va rugam introduceti numele");
      return;
    }
    if (hasGuest && !guestName.trim()) {
      toast.error("Va rugam introduceti numele persoanei insotitoare");
      return;
    }

    setLoading(true);
    var guests = [{ name: name, menu_type: menu }];
    if (hasGuest) {
      guests.push({ name: guestName, menu_type: guestMenu });
    }

    var payload = {
      guest_name: name,
      attending: true,
      num_guests: guests.length,
      guests: guests,
      allergies: "",
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
          <div className="w-20 h-20 rounded-full bg-[#8DA399] flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Multumim!</h1>
          <p className="text-[#5C6B5F] text-lg mb-8">Abia asteptam sa sarbatorim impreuna cu voi!</p>
          <Link to="/" className="inline-block px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif hover:bg-[#1A261D] transition-colors" data-testid="back-home-btn">Inapoi la pagina principala</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="rsvp-back-link">
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Inapoi</span>
          </Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">RSVP</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
            <h1 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Confirma Prezenta</h1>
            <p className="text-[#5C6B5F]">Va rugam sa confirmati participarea la nunta noastra</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 border border-[#2C3E30]/5 space-y-8">
            {/* Persoana 1 */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-[#2C3E30] border-b border-[#2C3E30]/10 pb-2">Datele dumneavoastra</h3>
              
              <div>
                <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Nume si prenume *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={function(e) { setName(e.target.value); }} 
                  className="w-full p-4 border border-[#2C3E30]/20 bg-[#F9F7F2] focus:border-[#8DA399] focus:outline-none transition-colors" 
                  placeholder="ex: Ion Popescu" 
                  data-testid="guest-name-input" 
                />
              </div>

              <div>
                <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Preferinta meniu *</label>
                <div className="space-y-3">
                  {MENUS.map(function(m) {
                    return (
                      <label key={m} className={"flex items-center p-4 border cursor-pointer transition-colors " + (menu === m ? "border-[#8DA399] bg-[#E3EBE6]" : "border-[#2C3E30]/10 bg-white hover:border-[#8DA399]/50")}>
                        <input 
                          type="radio" 
                          name="menu1" 
                          value={m} 
                          checked={menu === m} 
                          onChange={function(e) { setMenu(e.target.value); }} 
                          className="mr-3 accent-[#8DA399]"
                          data-testid={"menu-" + m.replace(/[^a-zA-Z]/g, "")}
                        />
                        <span className="text-[#2C3E30]">{m}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Checkbox persoana 2 */}
            <div className="border-t border-[#2C3E30]/10 pt-6">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={hasGuest} 
                  onChange={function(e) { setHasGuest(e.target.checked); }} 
                  className="w-5 h-5 mr-3 accent-[#8DA399]"
                  data-testid="has-guest-checkbox"
                />
                <span className="text-[#2C3E30] group-hover:text-[#8DA399] transition-colors">Vin cu inca o persoana</span>
              </label>
            </div>

            {/* Persoana 2 */}
            {hasGuest && (
              <div className="space-y-6 p-6 bg-[#F0EFEA] border border-[#2C3E30]/5">
                <h3 className="font-serif text-xl text-[#2C3E30] border-b border-[#2C3E30]/10 pb-2">Persoana insotitoare</h3>
                
                <div>
                  <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Nume si prenume *</label>
                  <input 
                    type="text" 
                    value={guestName} 
                    onChange={function(e) { setGuestName(e.target.value); }} 
                    className="w-full p-4 border border-[#2C3E30]/20 bg-white focus:border-[#8DA399] focus:outline-none transition-colors" 
                    placeholder="ex: Maria Popescu" 
                    data-testid="guest2-name-input" 
                  />
                </div>

                <div>
                  <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Preferinta meniu *</label>
                  <div className="space-y-3">
                    {MENUS.map(function(m) {
                      return (
                        <label key={m} className={"flex items-center p-4 border cursor-pointer transition-colors " + (guestMenu === m ? "border-[#8DA399] bg-[#E3EBE6]" : "border-[#2C3E30]/10 bg-white hover:border-[#8DA399]/50")}>
                          <input 
                            type="radio" 
                            name="menu2" 
                            value={m} 
                            checked={guestMenu === m} 
                            onChange={function(e) { setGuestMenu(e.target.value); }} 
                            className="mr-3 accent-[#8DA399]"
                            data-testid={"guest2-menu-" + m.replace(/[^a-zA-Z]/g, "")}
                          />
                          <span className="text-[#2C3E30]">{m}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Mesaj optional */}
            <div>
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Mesaj pentru miri (optional)</label>
              <textarea 
                value={message} 
                onChange={function(e) { setMessage(e.target.value); }} 
                className="w-full p-4 border border-[#2C3E30]/20 bg-[#F9F7F2] focus:border-[#8DA399] focus:outline-none transition-colors min-h-[120px]" 
                placeholder="Lasati-ne un mesaj..."
                data-testid="message-textarea"
              ></textarea>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg tracking-wide hover:bg-[#1A261D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="submit-rsvp-btn"
            >
              {loading ? "Se trimite..." : "Confirma Prezenta"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RSVPPage;
