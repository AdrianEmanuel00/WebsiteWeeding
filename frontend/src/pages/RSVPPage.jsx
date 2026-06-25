import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Heart, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

var MENUS = ["Cu carne", "Vegetarian (cu peste)", "Vegetarian (fara peste)"];
var SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyxUNmuZYGay2DzRQvJRWa4iC-cJ6lJpHaA5y-Y1Mvrj1cmcpCKQgvcIxDqzmgr8eADjA/exec";

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
      setGuests(guests.filter(function (_, i) { return i !== index; }));
    }
  }

  function updateGuest(index, field, value) {
    var newGuests = guests.map(function (g, i) {
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

    var emptyGuest = guests.find(function (g) { return !g.name.trim(); });
    if (emptyGuest) {
      toast.error("Va rugam completati numele pentru toti invitatii");
      return;
    }

    setLoading(true);

    // menus summary: "2 Cu carne, 1 Vegetarian (cu peste)"
    var counts = {};
    guests.forEach(function (g) {
      counts[g.menu] = (counts[g.menu] || 0) + 1;
    });
    var menusSummary = Object.keys(counts)
      .map(function (k) { return counts[k] + " " + k; })
      .join(", ");

    var payload = {
      mainName: guests[0].name,
      totalPeople: guests.length,
      menusSummary: menusSummary,
      guests: guests.map(function (g) { return { name: g.name, menu: g.menu }; }),
      message: message
    };

    fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
      .then(function () {
        setSubmitted(true);
        toast.success("Multumim pentru confirmare!");
      })
      .catch(function () {
        toast.error("A aparut o eroare. Incercati din nou.");
      })
      .finally(function () {
        setLoading(false);
      });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#567C8D] to-[#2F4156] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-script text-5xl md:text-6xl text-[#2F4156] mb-4">
            Multumim!
          </h1>
          <p className="text-[#567C8D] text-lg mb-2">
            Am inregistrat {guests.length}{" "}
            {guests.length === 1 ? "persoana" : "persoane"}.
          </p>
          <p className="text-[#567C8D] text-lg mb-8">
            Abia asteptam sa sarbatorim impreuna cu voi!
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-[#2F4156] text-white font-serif rounded-full hover:bg-[#567C8D] hover:scale-105 transition-all duration-300"
            data-testid="back-home-btn"
          >
            Inapoi la pagina principala
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5EFEB]/80 backdrop-blur-md border-b border-[#2F4156]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156] transition-colors duration-300"
            data-testid="rsvp-back-link"
          >
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Inapoi</span>
          </Link>
          <span className="ml-auto font-script text-2xl text-[#2F4156]">
            RSVP
          </span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-[#567C8D] to-[#2F4156] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-script text-4xl md:text-5xl text-[#2F4156] mb-2">
              Confirma Prezenta
            </h1>
            <p className="text-[#567C8D]">
              Va rugam sa confirmati participarea la nunta noastra
            </p>
            <p className="text-[#2F4156] font-medium mt-3">
              📅 Termen limita:{" "}
              <span className="text-[#567C8D]">15 Mai 2026</span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {guests.map(function (guest, index) {
              return (
                <div
                  key={index}
                  className="bg-white p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#567C8D] to-[#2F4156] rounded-full flex items-center justify-center text-white font-serif">
                        {index + 1}
                      </div>
                      <h3 className="font-script text-2xl text-[#2F4156]">
                        {index === 0
                          ? "Datele dumneavoastra"
                          : "Persoana " + (index + 1)}
                      </h3>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={function () { removeGuest(index); }}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:scale-110 transition-all duration-300"
                        data-testid={"remove-guest-" + index}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-[#2F4156] text-sm tracking-widest uppercase mb-3 block font-medium">
                        Nume si prenume *
                      </label>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={function (e) {
                          updateGuest(index, "name", e.target.value);
                        }}
                        className="w-full p-4 border-2 border-[#C8D9E6] bg-[#F5EFEB] rounded-xl focus:border-[#567C8D] focus:outline-none transition-all duration-300"
                        placeholder={index === 0 ? "ex: Ion Popescu" : "ex: Maria Popescu"}
                        data-testid={"guest-name-" + index}
                      />
                    </div>

                    <div>
                      <label className="text-[#2F4156] text-sm tracking-widest uppercase mb-3 block font-medium">
                        Preferinta meniu *
                      </label>
                      <div className="space-y-2">
                        {MENUS.map(function (m) {
                          var isSelected = guest.menu === m;
                          return (
                            <label
                              key={m}
                              className={
                                "flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 " +
                                (isSelected
                                  ? "bg-[#C8D9E6] border-2 border-[#567C8D] shadow-md"
                                  : "bg-[#F5EFEB] border-2 border-[#C8D9E6] hover:border-[#567C8D]/50")
                              }
                            >
                              <input
                                type="radio"
                                name={"menu-" + index}
                                value={m}
                                checked={isSelected}
                                onChange={function (e) {
                                  updateGuest(index, "menu", e.target.value);
                                }}
                                className="w-5 h-5 mr-4 accent-[#567C8D]"
                                data-testid={"guest-" + index + "-menu-" + m.replace(/[^a-zA-Z]/g, "")}
                              />
                              <span className="text-[#2F4156] font-medium">
                                {m}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {guests.length < 10 && (
              <button
                type="button"
                onClick={addGuest}
                className="w-full p-5 border-2 border-dashed border-[#567C8D]/50 rounded-2xl text-[#567C8D] font-medium flex items-center justify-center gap-3 hover:border-[#567C8D] hover:bg-[#C8D9E6]/30 hover:scale-[1.02] transition-all duration-300"
                data-testid="add-guest-btn"
              >
                <Plus size={22} /> Adauga persoana (copil, sot/sotie, etc.)
              </button>
            )}

            <div className="flex items-center justify-center gap-2 py-4 text-[#567C8D]">
              <Users size={20} />
              <span>
                Total: <strong className="text-[#2F4156]">{guests.length}</strong>{" "}
                {guests.length === 1 ? "persoana" : "persoane"}
              </span>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg">
              <label className="text-[#2F4156] text-sm tracking-widest uppercase mb-3 block font-medium">
                Mesaj pentru miri (optional)
              </label>
              <textarea
                value={message}
                onChange={function (e) { setMessage(e.target.value); }}
                className="w-full p-4 border-2 border-[#C8D9E6] bg-[#F5EFEB] rounded-xl focus:border-[#567C8D] focus:outline-none transition-all duration-300 min-h-[120px] resize-none"
                placeholder="Lasati-ne un mesaj..."
                data-testid="message-textarea"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#2F4156] text-white font-serif text-lg tracking-wide rounded-full hover:bg-[#567C8D] hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
              data-testid="submit-rsvp-btn"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <Check size={22} />
              )}
              {loading
                ? "Se trimite..."
                : "Confirma " +
                  guests.length +
                  " " +
                  (guests.length === 1 ? "persoana" : "persoane")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RSVPPage;
