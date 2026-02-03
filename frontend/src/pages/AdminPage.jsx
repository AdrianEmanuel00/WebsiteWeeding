import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Users, Camera, Download, Check, X, Trash2, RefreshCw, QrCode } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("admin_token"));
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("rsvp");
  const [filter, setFilter] = useState("all");
  const [photoFilter, setPhotoFilter] = useState("pending");

  useEffect(() => {
    if (isAuth) fetchData();
    else setLoading(false);
  }, [isAuth]);

  const fetchData = async () => {
    const token = localStorage.getItem("admin_token");
    const headers = { Authorization: "Bearer " + token };
    try {
      const [s, r, p] = await Promise.all([
        axios.get(API + "/stats", { headers }),
        axios.get(API + "/rsvp", { headers }),
        axios.get(API + "/photos/all", { headers })
      ]);
      setStats(s.data);
      setRsvps(r.data);
      setPhotos(p.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(API + "/admin/login", loginData);
      localStorage.setItem("admin_token", res.data.token);
      setIsAuth(true);
      toast.success("Autentificare reusita!");
    } catch (err) {
      toast.error("Credentiale invalide");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuth(false);
    setStats(null);
    setRsvps([]);
    setPhotos([]);
  };

  const moderatePhoto = async (id, status) => {
    const token = localStorage.getItem("admin_token");
    try {
      await axios.put(API + "/photos/" + id + "/moderate", { status }, { headers: { Authorization: "Bearer " + token }});
      setPhotos(photos.map(function(p) { return p.id === id ? Object.assign({}, p, {status: status}) : p; }));
      toast.success(status === "approved" ? "Aprobat" : "Respins");
    } catch (err) {
      toast.error("Eroare");
    }
  };

  const deleteItem = async (type, id) => {
    const token = localStorage.getItem("admin_token");
    const url = type === "photo" ? API + "/photos/" + id : API + "/rsvp/" + id;
    try {
      await axios.delete(url, { headers: { Authorization: "Bearer " + token }});
      if (type === "photo") setPhotos(photos.filter(function(p) { return p.id !== id; }));
      else setRsvps(rsvps.filter(function(r) { return r.id !== id; }));
      toast.success("Sters");
      fetchData();
    } catch (err) {
      toast.error("Eroare");
    }
  };

  var filteredRsvps = rsvps.filter(function(r) {
    if (filter === "all") return true;
    if (filter === "attending") return r.attending;
    return !r.attending;
  });

  var filteredPhotos = photos.filter(function(p) {
    if (photoFilter === "all") return true;
    return p.status === photoFilter;
  });

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-3xl text-[#2C3E30]">S & A</Link>
            <h1 className="font-serif text-2xl text-[#2C3E30] mt-4">Panou Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-white p-8 border border-[#2C3E30]/5 space-y-6">
            <div>
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Utilizator</label>
              <input type="text" value={loginData.username} onChange={function(e) { setLoginData(Object.assign({}, loginData, {username: e.target.value})); }} className="w-full p-3 border" required data-testid="admin-username" />
            </div>
            <div>
              <label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Parola</label>
              <input type="password" value={loginData.password} onChange={function(e) { setLoginData(Object.assign({}, loginData, {password: e.target.value})); }} className="w-full p-3 border" required data-testid="admin-password" />
            </div>
            <button type="submit" disabled={loginLoading} className="w-full py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50" data-testid="admin-login-btn">
              {loginLoading ? "Se autentifica..." : "Autentificare"}
            </button>
          </form>
          <div className="text-center mt-6">
            <Link to="/" className="text-[#5C6B5F] hover:text-[#2C3E30] text-sm">Inapoi la site</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center"><div className="loading-spinner w-12 h-12"></div></div>;
  }

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
            <a href={API + "/qrcode"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#8DA399] text-white text-sm" data-testid="download-qr-btn">
              <QrCode size={16} /> QR Code
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-[#8DA399]" data-testid="admin-logout-btn">
              <LogOut size={16} /> Iesire
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card"><div className="stat-number">{stats.total_guests}</div><div className="stat-label">Total Invitati</div></div>
            <div className="stat-card"><div className="stat-number text-[#8DA399]">{stats.attending}</div><div className="stat-label">Confirmati</div></div>
            <div className="stat-card"><div className="stat-number text-[#B95D5D]">{stats.not_attending}</div><div className="stat-label">Nu participa</div></div>
            <div className="stat-card"><div className="stat-number text-[#D4AF37]">{stats.photos_pending}</div><div className="stat-label">Poze pending</div></div>
          </div>
        )}

        {stats && (
          <div className="bg-white p-6 border border-[#2C3E30]/5 mb-8">
            <h3 className="font-serif text-xl text-[#2C3E30] mb-4">Sumar Meniuri</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.keys(stats.menu_counts).map(function(menu) {
                return (
                  <div key={menu} className="text-center p-4 bg-[#F0EFEA]">
                    <div className="font-serif text-2xl text-[#8DA399]">{stats.menu_counts[menu]}</div>
                    <div className="text-sm text-[#5C6B5F]">{menu}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button onClick={function() { setTab("rsvp"); }} className={"px-6 py-3 font-serif " + (tab === "rsvp" ? "bg-[#2C3E30] text-white" : "bg-white text-[#2C3E30] border")} data-testid="tab-rsvp">
            <Users size={16} className="inline mr-2" /> RSVP ({rsvps.length})
          </button>
          <button onClick={function() { setTab("photos"); }} className={"px-6 py-3 font-serif " + (tab === "photos" ? "bg-[#2C3E30] text-white" : "bg-white text-[#2C3E30] border")} data-testid="tab-photos">
            <Camera size={16} className="inline mr-2" /> Poze ({photos.filter(function(p) { return p.status === "pending"; }).length})
          </button>
        </div>

        {tab === "rsvp" && (
          <div className="bg-white border border-[#2C3E30]/5">
            <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <select value={filter} onChange={function(e) { setFilter(e.target.value); }} className="px-4 py-2 border" data-testid="rsvp-filter">
                  <option value="all">Toate</option>
                  <option value="attending">Participa</option>
                  <option value="not_attending">Nu participa</option>
                </select>
                <button onClick={fetchData} className="p-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="refresh-btn"><RefreshCw size={18} /></button>
              </div>
              <a href={API + "/rsvp/export"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#8DA399] text-white text-sm" data-testid="export-csv-btn">
                <Download size={16} /> Export CSV
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead><tr><th>Nume</th><th>Participa</th><th>Persoane</th><th>Invitati</th><th>Alergii</th><th>Mesaj</th><th></th></tr></thead>
                <tbody>
                  {filteredRsvps.map(function(r) {
                    return (
                      <tr key={r.id}>
                        <td className="font-medium">{r.guest_name}</td>
                        <td>{r.attending ? <span className="text-[#8DA399]"><Check size={16} className="inline" /> Da</span> : <span className="text-[#B95D5D]"><X size={16} className="inline" /> Nu</span>}</td>
                        <td>{r.num_guests}</td>
                        <td><ul className="text-sm">{r.guests.map(function(g, i) { return <li key={i}>{g.name} ({g.menu_type})</li>; })}</ul></td>
                        <td className="text-sm">{r.allergies || "-"}</td>
                        <td className="text-sm max-w-xs truncate">{r.message || "-"}</td>
                        <td><button onClick={function() { deleteItem("rsvp", r.id); }} className="text-[#B95D5D]" data-testid={"delete-rsvp-" + r.id}><Trash2 size={16} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredRsvps.length === 0 && <div className="text-center py-12 text-[#5C6B5F]">Niciun RSVP</div>}
            </div>
          </div>
        )}

        {tab === "photos" && (
          <div className="bg-white border border-[#2C3E30]/5">
            <div className="p-4 border-b">
              <select value={photoFilter} onChange={function(e) { setPhotoFilter(e.target.value); }} className="px-4 py-2 border" data-testid="photo-filter">
                <option value="all">Toate</option>
                <option value="pending">In asteptare</option>
                <option value="approved">Aprobate</option>
                <option value="rejected">Respinse</option>
              </select>
            </div>
            <div className="p-4">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12 text-[#5C6B5F]"><Camera className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />Nicio poza</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredPhotos.map(function(photo) {
                    return (
                      <div key={photo.id} className="photo-card">
                        <img src={API + "/photos/file/" + photo.filename} alt="" />
                        <div className="photo-overlay">
                          <div className="flex gap-2 mb-2">
                            {photo.status !== "approved" && <button onClick={function() { moderatePhoto(photo.id, "approved"); }} className="p-2 bg-[#8DA399] text-white rounded-full" data-testid={"approve-photo-" + photo.id}><Check size={18} /></button>}
                            {photo.status !== "rejected" && <button onClick={function() { moderatePhoto(photo.id, "rejected"); }} className="p-2 bg-[#B95D5D] text-white rounded-full" data-testid={"reject-photo-" + photo.id}><X size={18} /></button>}
                            <button onClick={function() { deleteItem("photo", photo.id); }} className="p-2 bg-white/20 text-white rounded-full" data-testid={"delete-photo-" + photo.id}><Trash2 size={18} /></button>
                          </div>
                          <span className={"text-xs uppercase px-2 py-1 text-white " + (photo.status === "approved" ? "bg-[#8DA399]" : photo.status === "rejected" ? "bg-[#B95D5D]" : "bg-[#D4AF37]")}>
                            {photo.status === "approved" ? "Aprobat" : photo.status === "rejected" ? "Respins" : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
