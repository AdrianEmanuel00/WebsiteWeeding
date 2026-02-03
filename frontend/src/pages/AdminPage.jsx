import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, LogOut, Users, Camera, Download, Check, X, Trash2, 
  Eye, ChevronDown, Filter, RefreshCw, QrCode, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [photoFilter, setPhotoFilter] = useState("pending");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, rsvpsRes, photosRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }),
        axios.get(`${API}/rsvp`, { headers }),
        axios.get(`${API}/photos/all`, { headers })
      ]);
      setStats(statsRes.data);
      setRsvps(rsvpsRes.data);
      setPhotos(photosRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, loginData);
      localStorage.setItem("admin_token", res.data.token);
      setIsAuthenticated(true);
      fetchData(res.data.token);
      toast.success("Autentificare reușită!");
    } catch (error) {
      toast.error("Credențiale invalide");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setStats(null);
    setRsvps([]);
    setPhotos([]);
  };

  const handleModeratePhoto = async (photoId, status) => {
    const token = localStorage.getItem("admin_token");
    try {
      await axios.put(`${API}/photos/${photoId}/moderate`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPhotos(photos.map(p => p.id === photoId ? { ...p, status } : p));
      toast.success(`Poza a fost ${status === 'approved' ? 'aprobată' : 'respinsă'}`);
    } catch (error) {
      toast.error("Eroare la moderare");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("admin_token");
    const { type, id } = deleteDialog;
    try {
      if (type === 'photo') {
        await axios.delete(`${API}/photos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPhotos(photos.filter(p => p.id !== id));
      } else if (type === 'rsvp') {
        await axios.delete(`${API}/rsvp/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRsvps(rsvps.filter(r => r.id !== id));
      }
      toast.success("Șters cu succes");
      setDeleteDialog({ open: false, type: null, id: null });
      // Refresh stats
      fetchData(token);
    } catch (error) {
      toast.error("Eroare la ștergere");
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem("admin_token");
    window.open(`${API}/rsvp/export?token=${token}`, '_blank');
  };

  const filteredRsvps = rsvps.filter(r => {
    if (filter === "attending") return r.attending;
    if (filter === "not_attending") return !r.attending;
    return true;
  });

  const filteredPhotos = photos.filter(p => {
    if (photoFilter === "all") return true;
    return p.status === photoFilter;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-3xl text-[#2C3E30]">S & A</Link>
            <h1 className="font-serif text-2xl text-[#2C3E30] mt-4">Panou Admin</h1>
          </div>

          <form onSubmit={handleLogin} className="bg-white p-8 border border-[#2C3E30]/5 space-y-6">
            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">
                Utilizator
              </Label>
              <Input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="romantic-input"
                required
                data-testid="admin-username"
              />
            </div>
            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">
                Parolă
              </Label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="romantic-input"
                required
                data-testid="admin-password"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif tracking-wide hover:bg-[#1A261D] transition-colors disabled:opacity-50"
              data-testid="admin-login-btn"
            >
              {loginLoading ? "Se autentifică..." : "Autentificare"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-[#5C6B5F] hover:text-[#2C3E30] transition-colors text-sm">
              ← Înapoi la site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <header className="bg-[#2C3E30] text-[#F9F7F2] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-xl">S & A</Link>
            <span className="text-[#8DA399]">|</span>
            <span className="text-sm tracking-widest uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`${API}/qrcode`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#8DA399] text-white text-sm hover:bg-[#7a9389] transition-colors"
              data-testid="download-qr-btn"
            >
              <QrCode size={16} />
              QR Code
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm hover:text-[#8DA399] transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut size={16} />
              Ieșire
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-number">{stats.total_guests}</div>
              <div className="stat-label">Total Invitați</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-[#8DA399]">{stats.attending}</div>
              <div className="stat-label">Confirmați</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-[#B95D5D]">{stats.not_attending}</div>
              <div className="stat-label">Nu participă</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-[#D4AF37]">{stats.photos_pending}</div>
              <div className="stat-label">Poze în așteptare</div>
            </div>
          </div>
        )}

        {/* Menu Stats */}
        {stats && (
          <div className="bg-white p-6 border border-[#2C3E30]/5 mb-8">
            <h3 className="font-serif text-xl text-[#2C3E30] mb-4">Sumar Meniuri</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.menu_counts).map(([menu, count]) => (
                <div key={menu} className="text-center p-4 bg-[#F0EFEA]">
                  <div className="font-serif text-2xl text-[#8DA399]">{count}</div>
                  <div className="text-sm text-[#5C6B5F]">{menu}</div>
                </div>
              ))}
            </div>
            {stats.allergies.length > 0 && (
              <div className="mt-4 p-4 bg-[#F0EFEA]">
                <h4 className="text-sm tracking-widest uppercase text-[#8DA399] mb-2">Alergii raportate:</h4>
                <ul className="list-disc list-inside text-[#5C6B5F]">
                  {stats.allergies.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="rsvp" className="space-y-6">
          <TabsList className="bg-white border border-[#2C3E30]/5">
            <TabsTrigger value="rsvp" className="data-[state=active]:bg-[#2C3E30] data-[state=active]:text-[#F9F7F2]" data-testid="tab-rsvp">
              <Users size={16} className="mr-2" />
              RSVP ({rsvps.length})
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-[#2C3E30] data-[state=active]:text-[#F9F7F2]" data-testid="tab-photos">
              <Camera size={16} className="mr-2" />
              Poze ({photos.filter(p => p.status === 'pending').length} în așteptare)
            </TabsTrigger>
          </TabsList>

          {/* RSVP Tab */}
          <TabsContent value="rsvp">
            <div className="bg-white border border-[#2C3E30]/5">
              <div className="p-4 border-b border-[#2C3E30]/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40" data-testid="rsvp-filter">
                      <Filter size={14} className="mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate</SelectItem>
                      <SelectItem value="attending">Participă</SelectItem>
                      <SelectItem value="not_attending">Nu participă</SelectItem>
                    </SelectContent>
                  </Select>
                  <button 
                    onClick={() => fetchData(localStorage.getItem("admin_token"))}
                    className="p-2 text-[#5C6B5F] hover:text-[#2C3E30] transition-colors"
                    data-testid="refresh-btn"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8DA399] text-white text-sm hover:bg-[#7a9389] transition-colors"
                  data-testid="export-csv-btn"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nume</th>
                      <th>Participă</th>
                      <th>Persoane</th>
                      <th>Invitați</th>
                      <th>Alergii</th>
                      <th>Mesaj</th>
                      <th>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id}>
                        <td className="font-medium">{rsvp.guest_name}</td>
                        <td>
                          {rsvp.attending ? (
                            <span className="inline-flex items-center gap-1 text-[#8DA399]">
                              <Check size={16} /> Da
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#B95D5D]">
                              <X size={16} /> Nu
                            </span>
                          )}
                        </td>
                        <td>{rsvp.num_guests}</td>
                        <td>
                          <ul className="text-sm">
                            {rsvp.guests.map((g, i) => (
                              <li key={i}>{g.name} ({g.menu_type})</li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-sm">{rsvp.allergies || "-"}</td>
                        <td className="text-sm max-w-xs truncate">{rsvp.message || "-"}</td>
                        <td>
                          <button
                            onClick={() => setDeleteDialog({ open: true, type: 'rsvp', id: rsvp.id })}
                            className="text-[#B95D5D] hover:text-red-700 transition-colors"
                            data-testid={`delete-rsvp-${rsvp.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRsvps.length === 0 && (
                  <div className="text-center py-12 text-[#5C6B5F]">
                    Niciun RSVP găsit
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="bg-white border border-[#2C3E30]/5">
              <div className="p-4 border-b border-[#2C3E30]/5 flex items-center gap-4">
                <Select value={photoFilter} onValueChange={setPhotoFilter}>
                  <SelectTrigger className="w-40" data-testid="photo-filter">
                    <Filter size={14} className="mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    <SelectItem value="pending">În așteptare</SelectItem>
                    <SelectItem value="approved">Aprobate</SelectItem>
                    <SelectItem value="rejected">Respinse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4">
                {filteredPhotos.length === 0 ? (
                  <div className="text-center py-12 text-[#5C6B5F]">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" />
                    Nicio poză în această categorie
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredPhotos.map((photo) => (
                      <div key={photo.id} className="photo-card">
                        <img 
                          src={`${API}/photos/file/${photo.filename}`}
                          alt={photo.original_filename}
                        />
                        <div className="photo-overlay">
                          <div className="flex gap-2 mb-2">
                            {photo.status !== 'approved' && (
                              <button
                                onClick={() => handleModeratePhoto(photo.id, 'approved')}
                                className="p-2 bg-[#8DA399] text-white rounded-full hover:bg-[#7a9389] transition-colors"
                                data-testid={`approve-photo-${photo.id}`}
                              >
                                <Check size={18} />
                              </button>
                            )}
                            {photo.status !== 'rejected' && (
                              <button
                                onClick={() => handleModeratePhoto(photo.id, 'rejected')}
                                className="p-2 bg-[#B95D5D] text-white rounded-full hover:bg-red-700 transition-colors"
                                data-testid={`reject-photo-${photo.id}`}
                              >
                                <X size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteDialog({ open: true, type: 'photo', id: photo.id })}
                              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors"
                              data-testid={`delete-photo-${photo.id}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <span className={`text-xs uppercase tracking-wider px-2 py-1 ${
                            photo.status === 'approved' ? 'bg-[#8DA399]' :
                            photo.status === 'rejected' ? 'bg-[#B95D5D]' : 'bg-[#D4AF37]'
                          } text-white`}>
                            {photo.status === 'approved' ? 'Aprobat' :
                             photo.status === 'rejected' ? 'Respins' : 'În așteptare'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-[#F9F7F2]">
          <DialogTitle className="font-serif text-xl text-[#2C3E30] flex items-center gap-2">
            <AlertTriangle className="text-[#B95D5D]" />
            Confirmare ștergere
          </DialogTitle>
          <DialogDescription className="text-[#5C6B5F]">
            Sunteți sigur că doriți să ștergeți acest element? Acțiunea este ireversibilă.
          </DialogDescription>
          <DialogFooter className="flex gap-4">
            <button
              onClick={() => setDeleteDialog({ open: false, type: null, id: null })}
              className="px-6 py-2 border border-[#2C3E30] text-[#2C3E30] font-serif hover:bg-[#2C3E30] hover:text-[#F9F7F2] transition-colors"
              data-testid="cancel-delete-btn"
            >
              Anulează
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-[#B95D5D] text-white font-serif hover:bg-red-700 transition-colors"
              data-testid="confirm-delete-btn"
            >
              Șterge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
