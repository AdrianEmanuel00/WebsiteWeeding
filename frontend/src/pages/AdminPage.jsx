import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("rsvp");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) { setAuth(true); loadData(t); }
  }, []);

  const loadData = async (token) => {
    try {
      const h = { Authorization: "Bearer " + token };
      const [s, r, p] = await Promise.all([
        axios.get(API + "/stats", { headers: h }),
        axios.get(API + "/rsvp", { headers: h }),
        axios.get(API + "/photos/all", { headers: h })
      ]);
      setData({ stats: s.data, rsvps: r.data, photos: p.data });
    } catch (e) { logout(); }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post(API + "/admin/login", { username: user, password: pass });
      localStorage.setItem("admin_token", r.data.token);
      setAuth(true);
      loadData(r.data.token);
      toast.success("OK");
    } catch (e) { toast.error("Invalid"); }
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem("admin_token"); setAuth(false); setData(null); };

  const moderate = async (id, status) => {
    const t = localStorage.getItem("admin_token");
    await axios.put(API + "/photos/" + id + "/moderate", { status }, { headers: { Authorization: "Bearer " + t }});
    loadData(t);
    toast.success("Done");
  };

  const del = async (type, id) => {
    const t = localStorage.getItem("admin_token");
    await axios.delete(API + "/" + type + "/" + id, { headers: { Authorization: "Bearer " + t }});
    loadData(t);
    toast.success("Deleted");
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-3xl text-[#2C3E30]">S & A</Link>
            <h1 className="font-serif text-2xl text-[#2C3E30] mt-4">Panou Admin</h1>
          </div>
          <form onSubmit={login} className="bg-white p-8 border border-[#2C3E30]/5 space-y-6">
            <div>
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Utilizator</label>
              <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full p-3 border border-[#2C3E30]/20 rounded-none" required data-testid="admin-username" />
            </div>
            <div>
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Parola</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-3 border border-[#2C3E30]/20 rounded-none" required data-testid="admin-password" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50" data-testid="admin-login-btn">{loading ? "..." : "Autentificare"}</button>
          </form>
          <div className="text-center mt-6"><Link to="/" className="text-[#5C6B5F] hover:text-[#2C3E30] text-sm">Inapoi la site</Link></div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center"><div className="loading-spinner w-12 h-12"></div></div>;

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="bg-[#2C3E30] text-[#F9F7F2] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl">S & A</Link>
            <span className="text-[#8DA399]">|</span>
            <span className="text-sm uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={API + "/qrcode"} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#8DA399] text-white text-sm" data-testid="download-qr-btn">QR Code</a>
            <button onClick={logout} className="text-sm hover:text-[#8DA399]" data-testid="admin-logout-btn">Iesire</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card"><div className="stat-number">{data.stats.total_guests}</div><div className="stat-label">Total Invitati</div></div>
          <div className="stat-card"><div className="stat-number text-[#8DA399]">{data.stats.attending}</div><div className="stat-label">Confirmati</div></div>
          <div className="stat-card"><div className="stat-number text-[#B95D5D]">{data.stats.not_attending}</div><div className="stat-label">Nu participa</div></div>
          <div className="stat-card"><div className="stat-number text-[#D4AF37]">{data.stats.photos_pending}</div><div className="stat-label">Poze pending</div></div>
        </div>

        <div className="bg-white p-6 border border-[#2C3E30]/5 mb-8">
          <h3 className="font-serif text-xl text-[#2C3E30] mb-4">Sumar Meniuri</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(data.stats.menu_counts).map(function([m, c]) {
              return <div key={m} className="text-center p-4 bg-[#F0EFEA]"><div className="font-serif text-2xl text-[#8DA399]">{c}</div><div className="text-sm text-[#5C6B5F]">{m}</div></div>;
            })}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={function() { setTab("rsvp"); }} className={"px-6 py-3 font-serif " + (tab === "rsvp" ? "bg-[#2C3E30] text-white" : "bg-white text-[#2C3E30] border")} data-testid="tab-rsvp">RSVP ({data.rsvps.length})</button>
          <button onClick={function() { setTab("photos"); }} className={"px-6 py-3 font-serif " + (tab === "photos" ? "bg-[#2C3E30] text-white" : "bg-white text-[#2C3E30] border")} data-testid="tab-photos">Poze ({data.photos.filter(function(p) { return p.status === "pending"; }).length})</button>
        </div>

        {tab === "rsvp" && (
          <div className="bg-white border border-[#2C3E30]/5">
            <div className="p-4 border-b flex justify-between items-center">
              <button onClick={function() { loadData(localStorage.getItem("admin_token")); }} className="px-4 py-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="refresh-btn">Refresh</button>
              <a href={API + "/rsvp/export"} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#8DA399] text-white text-sm" data-testid="export-csv-btn">Export CSV</a>
            </div>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead><tr><th>Nume</th><th>Participa</th><th>Persoane</th><th>Meniuri</th><th>Alergii</th><th></th></tr></thead>
                <tbody>
                  {data.rsvps.map(function(r) {
                    return (
                      <tr key={r.id}>
                        <td className="font-medium">{r.guest_name}</td>
                        <td className={r.attending ? "text-[#8DA399]" : "text-[#B95D5D]"}>{r.attending ? "Da" : "Nu"}</td>
                        <td>{r.num_guests}</td>
                        <td><ul className="text-sm">{r.guests.map(function(g, i) { return <li key={i}>{g.name}: {g.menu_type}</li>; })}</ul></td>
                        <td className="text-sm">{r.allergies || "-"}</td>
                        <td><button onClick={function() { del("rsvp", r.id); }} className="text-[#B95D5D]" data-testid={"delete-rsvp-" + r.id}>Sterge</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {data.rsvps.length === 0 && <div className="text-center py-12 text-[#5C6B5F]">Niciun RSVP</div>}
            </div>
          </div>
        )}

        {tab === "photos" && (
          <div className="bg-white border border-[#2C3E30]/5 p-4">
            {data.photos.length === 0 ? (
              <div className="text-center py-12 text-[#5C6B5F]">Nicio poza</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.photos.map(function(photo) {
                  return (
                    <div key={photo.id} className="photo-card">
                      <img src={API + "/photos/file/" + photo.filename} alt="" />
                      <div className="photo-overlay">
                        <div className="flex gap-2 mb-2">
                          {photo.status !== "approved" && <button onClick={function() { moderate(photo.id, "approved"); }} className="p-2 bg-[#8DA399] text-white rounded-full" data-testid={"approve-photo-" + photo.id}>OK</button>}
                          {photo.status !== "rejected" && <button onClick={function() { moderate(photo.id, "rejected"); }} className="p-2 bg-[#B95D5D] text-white rounded-full" data-testid={"reject-photo-" + photo.id}>X</button>}
                          <button onClick={function() { del("photos", photo.id); }} className="p-2 bg-gray-500 text-white rounded-full" data-testid={"delete-photo-" + photo.id}>Del</button>
                        </div>
                        <span className={"text-xs uppercase px-2 py-1 text-white " + (photo.status === "approved" ? "bg-[#8DA399]" : photo.status === "rejected" ? "bg-[#B95D5D]" : "bg-[#D4AF37]")}>{photo.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
