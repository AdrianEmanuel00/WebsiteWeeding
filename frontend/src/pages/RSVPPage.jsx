import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Heart, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";
var MENUS = ["Cu carne", "Vegetarian (cu peste)", "Vegetarian (fara peste)"];

function RSVPPage() {
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [guests, setGuests] = useState([{ name: "", menu: "Cu carne" }]);
  var [message, setMessage] = useState("");

  function addGuest() {
    if (guests.length < 10) {
      setGuests(guests.concat([{ name: "", menu: "Cu carne" }]));
    }
  }

  function removeGuest(index) {
    if (guests.length > 1) {
      setGuests(guests.filter(function(_, i) { return i !== index; }));
    }
  }

  function updateGuest(index, field, value) {
    var newGuests = guests.map(function(g, i) {
      if (i === index) {
        var updated = {};
        updated[field] = value;
        return Object.assign({}, g, updated);
      }
      return g;
    });
    setGuests(newGuests);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validare
    var emptyGuest = guests.find(function(g) { return !g.name.trim(); });
    if (emptyGuest) {
      toast.error("Va rugam completati numele pentru toti invitatii");
      return;
    }

    setLoading(true);
    
    var guestsList = guests.map(function(g) {
      return { name: g.name, menu_type: g.menu };
    });

    var payload = {
      guest_name: guests[0].name,
      attending: true,
      num_guests: guests.length,
      guests: guestsList,
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
        <div className="max-w-lg w-full text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8DA399] to-[#6B8A7A] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Multumim!</h1>
          <p className="text-[#5C6B5F] text-lg mb-2">Am inregistrat {guests.length} {guests.length === 1 ? "persoana" : "persoane"}.</p>
          <p className="text-[#5C6B5F] text-lg mb-8">Abia asteptam sa sarbatorim impreuna cu voi!</p>
          <Link to="/" className="inline-block px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif rounded-full hover:bg-[#8DA399] hover:scale-105 transition-all duration-300" data-testid="back-home-btn">Inapoi la pagina principala</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#8DA399] transition-colors duration-300" data-testid="rsvp-back-link">
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Inapoi</span>
          </Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">RSVP</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8DA399] to-[#6B8A7A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Confirma Prezenta</h1>
            <p className="text-[#5C6B5F]">Va rugam sa confirmati participarea la nunta noastra</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{animationDelay: "0.2s"}}>
            {/* Lista de invitati */}
            {guests.map(function(guest, index) {
              return (
                <div key={index} className="bg-white p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8DA399] to-[#6B8A7A] rounded-full flex items-center justify-center text-white font-serif">
                        {index + 1}
                      </div>
                      <h3 className="font-serif text-xl text-[#2C3E30]">
                        {index === 0 ? "Datele dumneavoastra" : "Persoana " + (index + 1)}
                      </h3>
                    </div>
                    {index > 0 && (
                      <button 
                        type="button"
                        onClick={function() { removeGuest(index); }}
                        className="w-10 h-10 rounded-full bg-red-50 text-[#B95D5D] flex items-center justify-center hover:bg-red-100 hover:scale-110 transition-all duration-300"
                        data-testid={"remove-guest-" + index}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-3 block font-medium">Nume si prenume *</label>
                      <input 
                        type="text" 
                        value={guest.name} 
                        onChange={function(e) { updateGuest(index, "name", e.target.value); }} 
                        className="w-full p-4 border-2 border-[#2C3E30]/10 bg-[#F9F7F2] rounded-xl focus:border-[#8DA399] focus:outline-none transition-all duration-300" 
                        placeholder={index === 0 ? "ex: Ion Popescu" : "ex: Maria Popescu"}
                        data-testid={"guest-name-" + index}
                      />
                    </div>

                    <div>
                      <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-3 block font-medium">Preferinta meniu *</label>
                      <div className="space-y-2">
                        {MENUS.map(function(m) {
                          var isSelected = guest.menu === m;
                          return (
                            <label key={m} className={"flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 " + (isSelected ? "bg-gradient-to-r from-[#E3EBE6] to-[#D4E5DA] border-2 border-[#8DA399] shadow-md" : "bg-[#F9F7F2] border-2 border-[#2C3E30]/10 hover:border-[#8DA399]/50 hover:shadow-sm")}>
                              <input 
                                type="radio" 
                                name={"menu-" + index} 
                                value={m} 
                                checked={isSelected} 
                                onChange={function(e) { updateGuest(index, "menu", e.target.value); }} 
                                className="w-5 h-5 mr-4 accent-[#8DA399]"
                                data-testid={"guest-" + index + "-menu-" + m.replace(/[^a-zA-Z]/g, "")}
                              />
                              <span className="text-[#2C3E30] font-medium">{m}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Buton adauga persoana */}
            {guests.length < 10 && (
              <button 
                type="button"
                onClick={addGuest}
                className="w-full p-5 border-2 border-dashed border-[#8DA399]/50 rounded-2xl text-[#8DA399] font-medium flex items-center justify-center gap-3 hover:border-[#8DA399] hover:bg-[#E3EBE6]/30 hover:scale-[1.02] transition-all duration-300"
                data-testid="add-guest-btn"
              >
                <Plus size={22} />
                Adauga persoana (copil, sot/sotie, etc.)
              </button>
            )}

            {/* Numar persoane */}
            <div className="flex items-center justify-center gap-2 py-4 text-[#5C6B5F]">
              <Users size={20} />
              <span>Total: <strong className="text-[#2C3E30]">{guests.length}</strong> {guests.length === 1 ? "persoana" : "persoane"}</span>
            </div>

            {/* Mesaj optional */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg">
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-3 block font-medium">Mesaj pentru miri (optional)</label>
              <textarea 
                value={message} 
                onChange={function(e) { setMessage(e.target.value); }} 
                className="w-full p-4 border-2 border-[#2C3E30]/10 bg-[#F9F7F2] rounded-xl focus:border-[#8DA399] focus:outline-none transition-all duration-300 min-h-[120px] resize-none" 
                placeholder="Lasati-ne un mesaj..."
                data-testid="message-textarea"
              ></textarea>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-[#2C3E30] text-[#F9F7F2] font-serif text-lg tracking-wide rounded-full hover:bg-[#8DA399] hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
              data-testid="submit-rsvp-btn"
            >
              {loading ? <span className="loading-spinner"></span> : <Check size={22} />}
              {loading ? "Se trimite..." : "Confirma " + guests.length + " " + (guests.length === 1 ? "persoana" : "persoane")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RSVPPage;
