import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Camera, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadData, setUploadData] = useState({ name: "", consent: false, files: [] });
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get(API + "/photos").then(r => setPhotos(r.data)).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => {
      if (!['image/jpeg', 'image/png', 'image/heic', 'image/heif'].includes(f.type)) { toast.error(f.name + " nu este valid"); return false; }
      if (f.size > 10 * 1024 * 1024) { toast.error(f.name + " depaseste 10MB"); return false; }
      return true;
    });
    setUploadData({ ...uploadData, files: valid });
  };

  const handleUpload = async () => {
    if (!uploadData.consent) { toast.error("Acceptati termenii"); return; }
    if (uploadData.files.length === 0) { toast.error("Selectati poze"); return; }
    setUploading(true);
    let ok = 0;
    for (const file of uploadData.files) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        if (uploadData.name) fd.append('uploader_name', uploadData.name);
        await axios.post(API + "/photos/upload", fd);
        ok++;
      } catch (e) { toast.error("Eroare: " + file.name); }
    }
    setUploading(false);
    if (ok > 0) {
      toast.success(ok + " poze incarcate! Vor fi vizibile dupa aprobare.");
      setShowUpload(false);
      setUploadData({ name: "", consent: false, files: [] });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30]" data-testid="gallery-back-link"><ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span></Link>
          <span className="font-serif text-xl text-[#2C3E30]">Galerie</span>
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm" data-testid="open-upload-btn"><Upload size={16} /><span className="hidden md:inline">Incarca</span></button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Amintiri</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Galeria Noastra</h1>
            <p className="text-[#5C6B5F] mt-4 max-w-lg mx-auto">Incarcati pozele voastre de la nunta pentru a le impartasi cu toti invitatii.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="loading-spinner w-12 h-12" /></div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#2C3E30]/5">
              <Camera className="w-16 h-16 mx-auto mb-6 text-[#8DA399]" />
              <h3 className="font-serif text-2xl text-[#2C3E30] mb-2">Galeria este goala</h3>
              <p className="text-[#5C6B5F] mb-6">Fii primul care incarca amintiri!</p>
              <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif" data-testid="empty-upload-btn"><Upload size={20} /> Incarca Prima Poza</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(photo)} data-testid={"photo-" + photo.id}>
                  <img src={API + "/photos/file/" + photo.filename} alt={photo.original_filename} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-lg bg-[#F9F7F2] border-[#2C3E30]/10">
          <DialogTitle className="font-serif text-2xl text-[#2C3E30]">Incarca Poze</DialogTitle>
          <div className="space-y-6 mt-4">
            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Numele tau (optional)</Label>
              <Input value={uploadData.name} onChange={e => setUploadData({ ...uploadData, name: e.target.value })} placeholder="ex: Maria Ionescu" data-testid="upload-name-input" />
            </div>
            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Selecteaza pozele</Label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif" multiple onChange={handleFileSelect} className="hidden" data-testid="file-input" />
              <button onClick={() => fileInputRef.current?.click()} className="w-full p-8 border-2 border-dashed border-[#2C3E30]/20 hover:border-[#8DA399] text-center" data-testid="select-files-btn">
                <Camera className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
                <p className="text-[#5C6B5F]">Click pentru a selecta</p>
                <p className="text-xs text-[#8DA399] mt-2">JPG, PNG, HEIC (max 10MB)</p>
              </button>
              {uploadData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadData.files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white border border-[#2C3E30]/5">
                      <span className="text-sm text-[#5C6B5F] truncate">{file.name}</span>
                      <button onClick={() => setUploadData({ ...uploadData, files: uploadData.files.filter((_, idx) => idx !== i) })} className="text-[#B95D5D]"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 bg-[#F0EFEA] text-sm text-[#5C6B5F]"><AlertCircle className="w-5 h-5 inline-block mr-2 text-[#8DA399]" />Pozele vor fi vizibile dupa aprobare.</div>
            <div className="flex items-start gap-3">
              <Checkbox id="consent" checked={uploadData.consent} onCheckedChange={checked => setUploadData({ ...uploadData, consent: checked })} data-testid="consent-checkbox" />
              <Label htmlFor="consent" className="text-sm text-[#5C6B5F] leading-relaxed cursor-pointer">Accept ca pozele sa fie folosite in galerie si sunt de acord cu <Link to="/privacy" className="text-[#8DA399] hover:underline" target="_blank">politica de confidentialitate</Link>.</Label>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowUpload(false)} className="flex-1 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif hover:bg-[#2C3E30] hover:text-[#F9F7F2]" data-testid="cancel-upload-btn">Anuleaza</button>
              <button onClick={handleUpload} disabled={uploading || !uploadData.consent || uploadData.files.length === 0} className="flex-1 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif disabled:opacity-50 flex items-center justify-center gap-2" data-testid="confirm-upload-btn">{uploading ? "Se incarca..." : <><Check size={18} /> Incarca</>}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-[#8DA399]" onClick={() => setSelectedPhoto(null)} data-testid="close-lightbox-btn"><X size={32} /></button>
          <img src={API + "/photos/file/" + selectedPhoto.filename} alt={selectedPhoto.original_filename} className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
