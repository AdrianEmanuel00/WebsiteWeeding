import { useState, useRef } from "react";
import { Search, MapPin, UtensilsCrossed, X, Users } from "lucide-react";

var MENIU_LABEL = {
  "C": "Meniu Carne",
  "VP": "Meniu Vegetarian cu Pește",
  "VFP": "Meniu Vegetarian fără Pește",
  "CS": "Meniu Carne Special",
  "VS": "Meniu Vegetarian Special",
  "copil": "Meniu Copil",
  "Copil": "Meniu Copil",
  "S": "Special",
};

var MENIU_COLOR = {
  "C": "bg-[#2F4156] text-white",
  "VP": "bg-[#567C8D] text-white",
  "VFP": "bg-[#7A9E7E] text-white",
  "CS": "bg-[#8B6F5E] text-white",
  "VS": "bg-[#7A9E7E] text-white",
  "copil": "bg-[#C8A882] text-white",
  "Copil": "bg-[#C8A882] text-white",
  "S": "bg-[#9B8EA0] text-white",
};

var GUESTS = [
  // Masa 1
  { name: "Iulia Litoiu", table: 1, menu: "C" },
  { name: "Andreea Serban", table: 1, menu: "C" },
  { name: "Ervin Popescu", table: 1, menu: "C" },
  { name: "Laura Ilinca", table: 1, menu: "VFP" },
  { name: "Darius Schiopu", table: 1, menu: "C" },
  { name: "Evelina Limbosanu", table: 1, menu: "C" },
  { name: "Denisa Grama", table: 1, menu: "C" },
  { name: "Emanuel Grama", table: 1, menu: "VP" },
  { name: "Albert Stan", table: 1, menu: "C" },

  // Masa 2
  { name: "Elisei Petreaca", table: 2, menu: "VS" },
  { name: "Eduard Paraschiv", table: 2, menu: "C" },
  { name: "Cristian Tacu", table: 2, menu: "C" },
  { name: "Alexia Tacu", table: 2, menu: "C" },
  { name: "Adelin Filimon", table: 2, menu: "C" },
  { name: "Rebeca Filimon", table: 2, menu: "C" },
  { name: "Robert Maimascu", table: 2, menu: "C" },
  { name: "Dani Dina", table: 2, menu: "C" },
  { name: "Rahela Dina", table: 2, menu: "CS" },
  { name: "Mădălin Dina", table: 2, menu: "C" },

  // Masa 3
  { name: "Andreeea Dragu", table: 3, menu: "VFP" },
  { name: "Ghita", table: 3, menu: "C" },
  { name: "Matias Constantin", table: 3, menu: "C" },
  { name: "Amalia Preda", table: 3, menu: "C" },
  { name: "Daniel Ciornei", table: 3, menu: "C" },
  { name: "Oana Ciornei", table: 3, menu: "VP" },
  { name: "Daniel Hojbota", table: 3, menu: "C" },
  { name: "Bianca Olteanu", table: 3, menu: "C" },
  { name: "Rafael Dina", table: 3, menu: "C" },
  { name: "Flavia Nicola", table: 3, menu: "C" },

  // Masa 4
  { name: "Ana Mieila", table: 4, menu: "VFP" },
  { name: "Edi Mieila", table: 4, menu: "C" },
  { name: "Sara Diaconu", table: 4, menu: "C" },
  { name: "Timotei Petreaca", table: 4, menu: "C" },
  { name: "Larisa Paune", table: 4, menu: "C" },
  { name: "Dragos Paune", table: 4, menu: "C" },
  { name: "Felix Visinica", table: 4, menu: "C" },
  { name: "Ermina Cocor", table: 4, menu: "C" },
  { name: "Theo Dinca Tica", table: 4, menu: "C" },
  { name: "Bogdan Tica", table: 4, menu: "C" },

  // Masa 5
  { name: "Eduard Dina", table: 5, menu: "C" },
  { name: "Andreea Stanciu", table: 5, menu: "VFP" },
  { name: "Diana Marcu", table: 5, menu: "C" },
  { name: "Bogdan Ungureanu", table: 5, menu: "C" },
  { name: "Eduard Radu", table: 5, menu: "C" },
  { name: "Lorena Radu", table: 5, menu: "VP" },
  { name: "Mihaela Manea", table: 5, menu: "C" },
  { name: "Alex Jelescu", table: 5, menu: "C" },
  { name: "Robert Petre", table: 5, menu: "C" },
  { name: "Lorena Petre", table: 5, menu: "C" },

  // Masa 6
  { name: "Sara Dimoiu", table: 6, menu: "C" },
  { name: "Robert Untea", table: 6, menu: "C" },
  { name: "Mark Grigore", table: 6, menu: "C" },
  { name: "Adina Grigore", table: 6, menu: "C" },
  { name: "Andrei Sisu", table: 6, menu: "C" },
  { name: "Daria Sisu", table: 6, menu: "VFP" },
  { name: "Alin Voinea", table: 6, menu: "C" },
  { name: "Lori Voinea", table: 6, menu: "C" },
  { name: "Robert Chirita", table: 6, menu: "C" },
  { name: "Andreea Chirita", table: 6, menu: "VP" },
  { name: "Livia Platica", table: 6, menu: "C" },
  { name: "Milian Draganescu", table: 6, menu: "C" },
  { name: "Toni Gancea", table: 6, menu: "C" },
  { name: "Denisa Preoteasa", table: 6, menu: "C" },

  // Masa 7
  { name: "Alexandra Tudorache", table: 7, menu: "C" },
  { name: "Irene Enache", table: 7, menu: "C" },
  { name: "Mark Ciurea", table: 7, menu: "C" },
  { name: "Irina Rusanu", table: 7, menu: "C" },
  { name: "Dorin Mitrache", table: 7, menu: "C" },
  { name: "Luca Matei", table: 7, menu: "VP" },
  { name: "Alecsandra Matei", table: 7, menu: "VP" },
  { name: "Laura Kusmuz", table: 7, menu: "C" },
  { name: "Sebi Brăușor", table: 7, menu: "VP" },
  { name: "Ciolacu Larisa", table: 7, menu: "VP" },
  { name: "Gabita Elisei", table: 7, menu: "C" },
  { name: "Andreea Gogorici", table: 7, menu: "C" },

  // Masa 8
  { name: "Clarisa Dina", table: 8, menu: "C" },
  { name: "Cristi Nicola", table: 8, menu: "C" },
  { name: "Luminita Nicola", table: 8, menu: "CS" },
  { name: "Marian Florea", table: 8, menu: "C" },
  { name: "Florin Dina", table: 8, menu: "C" },
  { name: "Iulia Stoica", table: 8, menu: "VP" },
  { name: "Valentin Ciurea", table: 8, menu: "C" },
  { name: "Emilia Ciurea", table: 8, menu: "C" },
  { name: "Simona Dinca", table: 8, menu: "VP" },
  { name: "Mihaela Dinculescu", table: 8, menu: "C" },
  { name: "Jean Dinculescu", table: 8, menu: "C" },
  { name: "Carmen Dinculescu", table: 8, menu: "C" },

  // Masa 9
  { name: "Adelina Olteanu Rotaru", table: 9, menu: "C" },
  { name: "Nelu Olteanu", table: 9, menu: "CS" },
  { name: "Marius Lupu", table: 9, menu: "C" },
  { name: "Claudiu Lupu", table: 9, menu: "C" },
  { name: "Madalina Nitu", table: 9, menu: "C" },
  { name: "Gabriela Udrescu", table: 9, menu: "C" },
  { name: "Mimi", table: 9, menu: "C" },
  { name: "Svetlana Jalba", table: 9, menu: "C" },
  { name: "Anton Jalba", table: 9, menu: "C" },

  // Masa 10
  { name: "Adrian Burduloi", table: 10, menu: "C" },
  { name: "Vicky Burduloi", table: 10, menu: "VP" },
  { name: "Costache Valentin", table: 10, menu: "C" },
  { name: "Costache Mihaela", table: 10, menu: "C" },
  { name: "Emanoil Cosma", table: 10, menu: "VP" },
  { name: "Melania Cosma", table: 10, menu: "VP" },
  { name: "Costache Ernest", table: 10, menu: "C" },
  { name: "Costache Theo", table: 10, menu: "C" },
  { name: "Oana Burduloi", table: 10, menu: "C" },
  { name: "Valalentin Burduloi", table: 10, menu: "VP" },
  { name: "Filip Burduloi", table: 10, menu: "copil" },

  // Masa 11
  { name: "Dorina Faraon", table: 11, menu: "C" },
  { name: "Ionel Faraon", table: 11, menu: "C" },
  { name: "Alina Faraon", table: 11, menu: "C" },
  { name: "Beniamin Burduloi", table: 11, menu: "C" },
  { name: "Paula Burduloi", table: 11, menu: "C" },
  { name: "Isaac Burduloi", table: 11, menu: "copil" },
  { name: "Emmet Burduloi", table: 11, menu: null },
  { name: "Mirela Vararu", table: 11, menu: "C" },
  { name: "Ovidiu Vararu", table: 11, menu: "C" },
  { name: "Gabriela Enache", table: 11, menu: "C" },
  { name: "Adrian Enache", table: 11, menu: "VP" },
  { name: "Marin Morariu", table: 11, menu: "C" },
  { name: "Dina Morariu", table: 11, menu: "C" },

  // Masa 12
  { name: "Albert Antonesei", table: 12, menu: "C" },
  { name: "Sara Antonesei", table: 12, menu: "CS" },
  { name: "Anca Medrega", table: 12, menu: "C" },
  { name: "Stefania Medrega", table: 12, menu: "C" },
  { name: "Robert Lupes", table: 12, menu: "C" },
  { name: "Sebastian Dinu", table: 12, menu: "C" },
  { name: "Daria Gheorghe", table: 12, menu: "C" },
  { name: "Alina Tica", table: 12, menu: "C" },
  { name: "Nicole Pavel", table: 12, menu: "C" },
  { name: "Vlad Pavel", table: 12, menu: "C" },
  { name: "Denis Dîrmina", table: 12, menu: "C" },

  // Masa 13
  { name: "Daniela Antonesei", table: 13, menu: "C" },
  { name: "Dori Antonesei", table: 13, menu: "C" },
  { name: "Tica Niculae", table: 13, menu: "C" },
  { name: "Tica Petrica", table: 13, menu: "C" },
  { name: "Viorica Faraon", table: 13, menu: "C" },
  { name: "Ion Faraon", table: 13, menu: "C" },
  { name: "Olga Burduloi", table: 13, menu: "C" },
  { name: "Mariana Iosub", table: 13, menu: "C" },
  { name: "Lorin Iosub", table: 13, menu: "C" },
  { name: "Costel Faraon", table: 13, menu: "C" },
  { name: "Lenuta Faraon", table: 13, menu: "C" },

  // Masa 14
  { name: "Adriana Avram", table: 14, menu: "C" },
  { name: "Ionela Avram", table: 14, menu: "C" },
  { name: "Adi Butuc", table: 14, menu: "C" },
  { name: "Alex Avram", table: 14, menu: "C" },
  { name: "Ioana Neagu", table: 14, menu: "CS" },
  { name: "Andreea Anghel", table: 14, menu: "C" },
  { name: "Valentin Maruntu", table: 14, menu: "C" },
  { name: "Filip Avram", table: 14, menu: "C" },

  // Masa 15
  { name: "Larisa Timofte", table: 15, menu: "C" },
  { name: "Andrada Timofte", table: 15, menu: "C" },
  { name: "Andrei Burduloi", table: 15, menu: "C" },
  { name: "Naomi Timofte", table: 15, menu: "C" },
  { name: "Lizzy Tinjeala", table: 15, menu: "VP" },
  { name: "Robert Tinjeala", table: 15, menu: "VFP" },
  { name: "Eva Burduloi", table: 15, menu: "VFP" },
  { name: "Matei Burduloi", table: 15, menu: "C" },

  // Masa 16
  { name: "Anda Clara Burduloi", table: 16, menu: "C" },
  { name: "Adelin Faraon", table: 16, menu: "C" },
  { name: "Denis Timaru", table: 16, menu: "C" },
  { name: "Adelina Alban", table: 16, menu: "C" },
  { name: "David Beres", table: 16, menu: "C" },
  { name: "Jacqueline Shalhevet", table: 16, menu: "C" },
  { name: "Marcu Feru", table: 16, menu: "C" },
  { name: "Vlad Stetcu", table: 16, menu: "C" },
  { name: "Catalina Iolea", table: 16, menu: "C" },
  { name: "Patricia Padure", table: 16, menu: "C" },
  { name: "Alida Beres", table: 16, menu: "C" },
  { name: "David Alban", table: 16, menu: "C" },
  { name: "Emma Vararu", table: 16, menu: "C" },
  { name: "Abel Cosma", table: 16, menu: "C" },
  { name: "George Luscanof", table: 16, menu: "C" },

  // Masa 17
  { name: "Alexandru Faraon", table: 17, menu: "C" },
  { name: "Emma Faraon", table: 17, menu: "C" },
  { name: "Beniamin Faraon", table: 17, menu: "C" },
  { name: "Robert Morariu", table: 17, menu: "C" },
  { name: "Alexandra Morariu", table: 17, menu: "C" },
  { name: "Elica Morariu", table: 17, menu: "C" },
  { name: "Daniel Morariu", table: 17, menu: "VFP" },
  { name: "Bogdan Iosub", table: 17, menu: "C" },
  { name: "Razvan Tudorache", table: 17, menu: "C" },
  { name: "Alexandra Serban", table: 17, menu: "C" },

  // Staff
  { name: "Anca Rarinca", table: "Staff", menu: "VP" },
  { name: "Andrei Paraschiv", table: "Staff", menu: "C" },
  { name: "Darian Vasilescu", table: "Staff", menu: "VP" },
  { name: "Larisa Faraon", table: "Staff", menu: "C" },
  { name: "Adrian Dragomir", table: "Staff", menu: "C" },
  { name: "Sebi Mirica", table: "Staff", menu: "VP" },
  { name: "Alin Vaduva", table: "Staff", menu: "C" },
  { name: "Monica Cristea", table: "Staff", menu: null },
];

function normalize(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "");
}

function MesePage() {
  var [query, setQuery] = useState("");
  var [selected, setSelected] = useState(null);
  var [showSuggestions, setShowSuggestions] = useState(false);
  var inputRef = useRef(null);

  var suggestions = query.trim().length >= 2
    ? GUESTS.filter(function(g) {
        return normalize(g.name).includes(normalize(query.trim()));
      }).slice(0, 8)
    : [];

  function handleSelect(guest) {
    setSelected(guest);
    setQuery(guest.name);
    setShowSuggestions(false);
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  }

  var menuKey = selected && selected.menu ? (selected.menu === "Copil" ? "copil" : selected.menu) : null;
  var tablemates = selected
    ? GUESTS.filter(function(g) { return g.table === selected.table && g.name !== selected.name; })
    : [];

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col items-center justify-start px-6 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-[#567C8D] mb-3">Domeniul Monato · 28 Iunie 2026</p>
        <h1 className="font-script text-5xl md:text-6xl text-[#2F4156] mb-3">Locul tău</h1>
        <p className="text-[#567C8D] font-accent italic text-lg">Caută-ți numele pentru a afla masa la care ești așezat</p>
      </div>

      {/* Search */}
      <div className="w-full max-w-md relative">
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-[#C8D9E6]">
          <Search className="absolute left-5 w-5 h-5 text-[#567C8D]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={function(e) {
              setQuery(e.target.value);
              setSelected(null);
              setShowSuggestions(true);
            }}
            onFocus={function() { setShowSuggestions(true); }}
            placeholder="Scrie numele tău..."
            className="w-full pl-14 pr-12 py-5 text-[#2F4156] placeholder-[#567C8D]/50 bg-transparent rounded-2xl focus:outline-none text-lg font-serif"
          />
          {query && (
            <button onClick={handleClear} className="absolute right-5 text-[#567C8D] hover:text-[#2F4156] transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && !selected && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#C8D9E6] overflow-hidden z-10">
            {suggestions.map(function(guest, idx) { return (
              <button
                key={idx}
                onClick={function() { handleSelect(guest); }}
                className="w-full text-left px-6 py-4 hover:bg-[#C8D9E6]/30 transition-colors border-b border-[#F5EFEB] last:border-0 flex items-center justify-between"
              >
                <span className="text-[#2F4156] font-serif text-base">{guest.name}</span>
                <span className={"text-xs px-2 py-1 rounded-full font-medium " + (MENIU_COLOR[guest.menu] || "bg-gray-200 text-gray-700")}>
                  {guest.menu}
                </span>
              </button>
            ); })}
          </div>
        )}

        {showSuggestions && query.trim().length >= 2 && suggestions.length === 0 && !selected && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#C8D9E6] px-6 py-5 text-center z-10">
            <p className="text-[#567C8D] font-serif">Numele nu a fost găsit. Încearcă altă variantă.</p>
          </div>
        )}
      </div>

      {/* Result */}
      {selected && (
        <div className="w-full max-w-md mt-8 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#C8D9E6]">
            <div className="h-2 bg-gradient-to-r from-[#C8D9E6] via-[#567C8D] to-[#C8D9E6]"></div>
            <div className="p-10 text-center">
              <p className="text-sm tracking-widest uppercase text-[#567C8D] mb-2">Bine ai venit,</p>
              <h2 className="font-script text-4xl text-[#2F4156] mb-8">{selected.name}</h2>

              <div className="flex flex-col gap-5">
                {/* Table */}
                <div className="flex items-center gap-5 bg-[#F5EFEB] rounded-2xl px-7 py-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#567C8D] to-[#2F4156] flex items-center justify-center flex-shrink-0 shadow">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs tracking-widest uppercase text-[#567C8D] mb-1">Masa ta</p>
                    <p className="text-2xl font-bold text-[#2F4156]">
                      {selected.table === "Staff" ? "Staff" : "Masa " + selected.table}
                    </p>
                  </div>
                </div>

                {/* Menu */}
                {menuKey && (
                  <div className="flex items-center gap-5 bg-[#F5EFEB] rounded-2xl px-7 py-5">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow " + (MENIU_COLOR[menuKey] || "bg-[#2F4156]")}>
                      <UtensilsCrossed className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs tracking-widest uppercase text-[#567C8D] mb-1">Meniul tău</p>
                      <p className="text-xl font-semibold text-[#2F4156]">{MENIU_LABEL[menuKey] || menuKey}</p>
                    </div>
                  </div>
                )}
              </div>

              {tablemates.length > 0 && (
                <div className="mt-6 bg-[#F5EFEB] rounded-2xl px-7 py-5 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#567C8D] to-[#2F4156] flex items-center justify-center flex-shrink-0 shadow">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs tracking-widest uppercase text-[#567C8D] font-medium">Colegii tăi de masă</p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {tablemates.map(function(g, i) { return (
                      <li key={i} className="flex items-center justify-between py-1.5 border-b border-[#C8D9E6]/50 last:border-0">
                        <span className="text-[#2F4156] font-serif text-sm">{g.name}</span>
                        {g.menu && (
                          <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (MENIU_COLOR[g.menu === "Copil" ? "copil" : g.menu] || "bg-gray-200 text-gray-700")}>
                            {MENIU_LABEL[g.menu === "Copil" ? "copil" : g.menu] || g.menu}
                          </span>
                        )}
                      </li>
                    ); })}
                  </ul>
                </div>
              )}

              <p className="text-[#567C8D] text-sm mt-8 font-accent italic">Ne bucurăm să te avem alături! 🤍</p>
            </div>
            <div className="h-2 bg-gradient-to-r from-[#C8D9E6] via-[#567C8D] to-[#C8D9E6]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MesePage;
