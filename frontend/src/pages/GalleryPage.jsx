import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Camera, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadData, setUploadData] = useState({
    name: "",
    consent: false,
    files: []
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${API}/photos`);
      setPhotos(res.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => {
      const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
      if (!validTypes.includes(f.type)) {
        toast.error(`${f.name} nu este un format valid`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} depășește 10MB`);
        return false;
      }
      return true;
    });
    setUploadData({ ...uploadData, files: validFiles });
  };

  const handleUpload = async () => {
    if (!uploadData.consent) {
      toast.error("Vă rugăm acceptați termenii");
      return;
    }
    if (uploadData.files.length === 0) {
      toast.error("Selectați cel puțin o poză");
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of uploadData.files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (uploadData.name) {
          formData.append('uploader_name', uploadData.name);
        }
        await axios.post(`${API}/photos/upload`, formData);
        successCount++;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Eroare la încărcarea ${file.name}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} poze încărcate cu succes! Vor fi vizibile după aprobare.`);
      setShowUpload(false);
      setUploadData({ name: "", consent: false, files: [] });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#2C3E30] transition-colors" data-testid="gallery-back-link">
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Înapoi</span>
          </Link>
          <span className="font-serif text-xl text-[#2C3E30]">Galerie</span>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm hover:bg-[#1A261D] transition-colors"
            data-testid="open-upload-btn"
          >
            <Upload size={16} />
            <span className="hidden md:inline">Încarcă</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Amintiri</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Galeria Noastră</h1>
            <p className="text-[#5C6B5F] mt-4 max-w-lg mx-auto">
              Încărcați pozele voastre de la nuntă pentru a le împărtăși cu toți invitații.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loading-spinner w-12 h-12" />
            </div>
          ) : photos.length === 0 ? (
            <motion.div 
              className="text-center py-20 bg-white border border-[#2C3E30]/5"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Camera className="w-16 h-16 mx-auto mb-6 text-[#8DA399]" />
              <h3 className="font-serif text-2xl text-[#2C3E30] mb-2">Galeria este goală</h3>
              <p className="text-[#5C6B5F] mb-6">Fii primul care încarcă amintiri de la nuntă!</p>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif hover:bg-[#1A261D] transition-colors"
                data-testid="empty-upload-btn"
              >
                <Upload size={20} />
                Încarcă Prima Poză
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="gallery-grid"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  variants={fadeInUp}
                  className="aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                  data-testid={`photo-${photo.id}`}
                >
                  <img 
                    src={`${API}/photos/file/${photo.filename}`}
                    alt={photo.original_filename}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-lg bg-[#F9F7F2] border-[#2C3E30]/10">
          <DialogTitle className="font-serif text-2xl text-[#2C3E30]">Încarcă Poze</DialogTitle>
          
          <div className="space-y-6 mt-4">
            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">
                Numele tău (opțional)
              </Label>
              <Input
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                placeholder="ex: Maria Ionescu"
                className="romantic-input"
                data-testid="upload-name-input"
              />
            </div>

            <div>
              <Label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">
                Selectează pozele
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                data-testid="file-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-[#2C3E30]/20 hover:border-[#8DA399] transition-colors text-center"
                data-testid="select-files-btn"
              >
                <Camera className="w-10 h-10 mx-auto mb-4 text-[#8DA399]" />
                <p className="text-[#5C6B5F]">Click pentru a selecta poze</p>
                <p className="text-xs text-[#8DA399] mt-2">JPG, PNG, HEIC (max 10MB)</p>
              </button>
              
              {uploadData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadData.files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white border border-[#2C3E30]/5">
                      <span className="text-sm text-[#5C6B5F] truncate">{file.name}</span>
                      <button
                        onClick={() => {
                          const newFiles = uploadData.files.filter((_, idx) => idx !== i);
                          setUploadData({ ...uploadData, files: newFiles });
                        }}
                        className="text-[#B95D5D]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F0EFEA] text-sm text-[#5C6B5F]">
              <AlertCircle className="w-5 h-5 inline-block mr-2 text-[#8DA399]" />
              Pozele vor fi vizibile public după aprobarea de către miri.
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={uploadData.consent}
                onCheckedChange={(checked) => setUploadData({ ...uploadData, consent: checked })}
                data-testid="consent-checkbox"
              />
              <Label htmlFor="consent" className="text-sm text-[#5C6B5F] leading-relaxed cursor-pointer">
                Accept ca pozele încărcate să fie folosite în galeria nunții și sunt de acord cu 
                <Link to="/privacy" className="text-[#8DA399] hover:underline ml-1" target="_blank">
                  politica de confidențialitate
                </Link>.
              </Label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-6 py-3 border border-[#2C3E30] text-[#2C3E30] font-serif hover:bg-[#2C3E30] hover:text-[#F9F7F2] transition-colors"
                data-testid="cancel-upload-btn"
              >
                Anulează
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadData.consent || uploadData.files.length === 0}
                className="flex-1 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif hover:bg-[#1A261D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="confirm-upload-btn"
              >
                {uploading ? (
                  <>
                    <span className="loading-spinner" />
                    Se încarcă...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Încarcă
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#8DA399] transition-colors"
              onClick={() => setSelectedPhoto(null)}
              data-testid="close-lightbox-btn"
            >
              <X size={32} />
            </button>
            <img
              src={`${API}/photos/file/${selectedPhoto.filename}`}
              alt={selectedPhoto.original_filename}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
