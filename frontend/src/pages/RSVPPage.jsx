import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Plus, Trash2, Users, Utensils, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const MENU_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Vegan", label: "Vegan" },
  { value: "Fara porc", label: "Fara porc" },
  { value: "Copil", label: "Meniu copil" }
];

export default function RSVPPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    attending: null,
    num_guests: 1,
    guests: [{ name: "", menu_type: "Standard" }],
    allergies: "",
    message: ""
  });

  const updateGuest = (index, field, value) => {
    const g = [...formData.guests];
    g[index] = { ...g[index], [field]: value };
    setFormData({ ...formData, guests: g });
  };

  const addGuest = () => {
    if (formData.guests.length < 10) {
      setFormData({ ...formData, num_guests: formData.num_guests + 1, guests: [...formData.guests, { name: "", menu_type: "Standard" }] });
    }
  };

  const removeGuest = (index) => {
    if (formData.guests.length > 1) {
      const g = formData.guests.filter((_, i) => i !== index);
      setFormData({ ...formData, num_guests: g.length, guests: g });
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.guest_name.trim() !== "" && formData.attending !== null;
    if (step === 2) return formData.guests.every(g => g.name.trim() !== "");
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, num_guests: formData.attending ? formData.guests.length : 0, guests: formData.attending ? formData.guests : [] };
      await axios.post(API + "/rsvp", payload);
      setSubmitted(true);
      toast.success("Multumim pentru confirmare!");
    } catch (e) {
      toast.error("A aparut o eroare. Incercati din nou.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#8DA399] flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30] mb-4">Multumim!</h1>
          <p className="text-[#5C6B5F] text-lg mb-8">{formData.attending ? "Abia asteptam sa sarbatorim impreuna!" : "Ne pare rau ca nu veti putea participa. Multumim!"}</p>
          <Link to="/" className="inline-block px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif" data-testid="back-home-btn">Inapoi la pagina principala</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="rsvp-back-link">
            <ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span>
          </Link>
          <span className="ml-auto font-serif text-xl text-[#2C3E30]">RSVP</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <div className={"w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm " + (step >= s ? "bg-[#2C3E30] text-[#F9F7F2]" : "bg-[#F0EFEA] text-[#5C6B5F]")}>{s}</div>
                {s < 3 && <div className={"w-12 h-0.5 " + (step > s ? "bg-[#2C3E30]" : "bg-[#F0EFEA]")} />}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Informatii de baza</h2>
                <p className="text-[#5C6B5F]">Spuneti-ne cine sunteti</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Numele complet *</Label>
                  <Input value={formData.guest_name} onChange={e => setFormData({ ...formData, guest_name: e.target.value })} placeholder="ex: Ion Popescu" data-testid="guest-name-input" />
                </div>
                <div>
                  <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-4 block">Veti participa la nunta? *</Label>
                  <RadioGroup value={formData.attending === null ? undefined : formData.attending ? "yes" : "no"} onValueChange={val => setFormData({ ...formData, attending: val === "yes" })} className="flex gap-4">
                    <div className="flex-1">
                      <RadioGroupItem value="yes" id="attending-yes" className="peer sr-only" data-testid="attending-yes" />
                      <Label htmlFor="attending-yes" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#2C3E30]/10 cursor-pointer peer-data-[state=checked]:border-[#8DA399] peer-data-[state=checked]:bg-[#E3EBE6]">
                        <Check className="w-8 h-8 mb-2 text-[#8DA399]" /><span className="font-serif text-lg text-[#2C3E30]">Da, participam</span>
                      </Label>
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value="no" id="attending-no" className="peer sr-only" data-testid="attending-no" />
                      <Label htmlFor="attending-no" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#2C3E30]/10 cursor-pointer peer-data-[state=checked]:border-[#B95D5D] peer-data-[state=checked]:bg-red-50">
                        <AlertCircle className="w-8 h-8 mb-2 text-[#B95D5D]" /><span className="font-serif text-lg text-[#2C3E30]">Nu, din pacate</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && formData.attending && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Invitati & Meniu</h2>
                <p className="text-[#5C6B5F]">Adaugati persoanele care vor participa</p>
              </div>
              <div className="space-y-4">
                {formData.guests.map((guest, i) => (
                  <div key={i} className="p-6 bg-white border border-[#2C3E30]/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm tracking-widest uppercase text-[#8DA399]">Persoana {i + 1}</span>
                      {formData.guests.length > 1 && <button onClick={() => removeGuest(i)} className="text-[#B95D5D]" data-testid={"remove-guest-" + i}><Trash2 size={18} /></button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#2C3E30] text-xs tracking-widest uppercase mb-2 block">Nume *</Label>
                        <Input value={guest.name} onChange={e => updateGuest(i, "name", e.target.value)} placeholder="Nume complet" data-testid={"guest-name-" + i} />
                      </div>
                      <div>
                        <Label className="text-[#2C3E30] text-xs tracking-widest uppercase mb-2 block">Preferinta meniu</Label>
                        <Select value={guest.menu_type} onValueChange={val => updateGuest(i, "menu_type", val)}>
                          <SelectTrigger data-testid={"guest-menu-" + i}><SelectValue /></SelectTrigger>
                          <SelectContent>{MENU_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addGuest} disabled={formData.guests.length >= 10} className="w-full p-4 border-2 border-dashed border-[#2C3E30]/20 text-[#5C6B5F] hover:border-[#8DA399] flex items-center justify-center gap-2" data-testid="add-guest-btn"><Plus size={20} /> Adauga persoana</button>
              </div>
              <div>
                <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Alergii sau restrictii alimentare</Label>
                <Input value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} placeholder="ex: alergie la nuci" data-testid="allergies-input" />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {(step === 3 || (step === 2 && !formData.attending)) && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#2C3E30] mb-2">Mesaj</h2>
                <p className="text-[#5C6B5F]">Lasati-ne un mesaj (optional)</p>
              </div>
              <Textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Scrie-ne un mesaj..." className="min-h-[150px]" data-testid="message-textarea" />
              <div className="p-6 bg-[#F0EFEA]">
                <h3 className="font-serif text-xl text-[#2C3E30] mb-4">Rezumat</h3>
                <div className="space-y-2 text-[#5C6B5F]">
                  <p><strong>Nume:</strong> {formData.guest_name}</p>
                  <p><strong>Participare:</strong> {formData.attending ? "Da" : "Nu"}</p>
                  {formData.attending && (<>
                    <p><strong>Nr. persoane:</strong> {formData.guests.length}</p>
                    <ul className="list-disc list-inside ml-4">{formData.guests.map((g, i) => <li key={i}>{g.name} - {g.menu_type}</li>)}</ul>
                    {formData.allergies && <p><strong>Alergii:</strong> {formData.allergies}</p>}
                  </>)}
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between mt-12">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-8 py-4 border border-[#2C3E30] text-[#2C3E30] font-serif hover:bg-[#2C3E30] hover:text-[#F9F7F2]" data-testid="prev-step-btn">Inapoi</button>}
            <div className={step === 1 ? "ml-auto" : ""}>
              {((step < 3 && formData.attending) || (step === 1 && formData.attending === false)) ? (
                <button onClick={() => step === 1 && formData.attending === false ? setStep(3) : setStep(step + 1)} disabled={!canProceed()} className="px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50" data-testid="next-step-btn">Continua</button>
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
