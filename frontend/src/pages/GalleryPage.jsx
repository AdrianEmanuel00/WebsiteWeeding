import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Camera, X, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";

function GalleryPage() {
  var [photos, setPhotos] = useState([]);
  var [loading, setLoading] = useState(true);
  var [uploading, setUploading] = useState(false);
  var [showUpload, setShowUpload] = useState(false);
  var [selectedPhoto, setSelectedPhoto] = useState(null);
  var [uploadName, setUploadName] = useState("");
  var [uploadConsent, setUploadConsent] = useState(false);
  var [uploadFiles, setUploadFiles] = useState([]);
  var fileInputRef = useRef(null);

  useEffect(function() {
    loadPhotos();
  }, []);

  function loadPhotos() {
    axios.get(API + "/photos").then(function(r) { setPhotos(r.data); }).catch(function(e) { console.error(e); }).finally(function() { setLoading(false); });
  }

  function handleFileSelect(e) {
    var files = Array.from(e.target.files || []);
    var valid = files.filter(function(f) {
      var types = ["image/jpeg", "image/png", "image/heic", "image/heif"];
      if (types.indexOf(f.type) === -1) { toast.error(f.name + " nu este valid"); return false; }
      if (f.size > 10485760) { toast.error(f.name + " depaseste 10MB"); return false; }
      return true;
    });
    setUploadFiles(valid);
  }

  function handleUpload() {
    if (!uploadConsent) { toast.error("Acceptati termenii"); return; }
    if (uploadFiles.length === 0) { toast.error("Selectati poze"); return; }
    setUploading(true);
    var promises = uploadFiles.map(function(file) {
      var fd = new FormData();
      fd.append("file", file);
      if (uploadName) fd.append("uploader_name", uploadName);
      return axios.post(API + "/photos/upload", fd);
    });
    Promise.all(promises).then(function() {
      toast.success(uploadFiles.length + " poze incarcate cu succes!");
      setShowUpload(false);
      setUploadName("");
      setUploadConsent(false);
      setUploadFiles([]);
      loadPhotos();
    }).catch(function() {
      toast.error("Eroare la incarcare");
    }).finally(function() {
      setUploading(false);
    });
  }

  function removeFile(idx) { setUploadFiles(uploadFiles.filter(function(_, i) { return i !== idx; })); }

  function downloadPhoto(photo) {
    var link = document.createElement("a");
    link.href = API + "/photos/file/" + photo.filename;
    link.download = photo.original_filename || photo.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2C3E30]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#5C6B5F] hover:text-[#8DA399] transition-colors duration-300" data-testid="gallery-back-link"><ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span></Link>
          <span className="font-serif text-xl text-[#2C3E30]">Galerie</span>
          <button onClick={function() { setShowUpload(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#2C3E30] text-[#F9F7F2] font-serif text-sm rounded-full hover:bg-[#8DA399] hover:scale-105 transition-all duration-300" data-testid="open-upload-btn"><Upload size={16} /><span className="hidden md:inline">Incarca</span></button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><p className="text-sm tracking-[0.2em] uppercase text-[#8DA399] mb-4">Amintiri</p><h1 className="font-serif text-4xl md:text-5xl text-[#2C3E30]">Galeria Noastra</h1><p className="text-[#5C6B5F] mt-4 max-w-lg mx-auto">Incarcati pozele voastre de la nunta pentru a le impartasi cu toti invitatii.</p></div>

          {loading ? (<div className="flex justify-center py-20"><div className="loading-spinner w-12 h-12"></div></div>) : photos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg"><Camera className="w-16 h-16 mx-auto mb-6 text-[#8DA399]" /><h3 className="font-serif text-2xl text-[#2C3E30] mb-2">Galeria este goala</h3><p className="text-[#5C6B5F] mb-6">Fii primul care incarca amintiri!</p><button onClick={function() { setShowUpload(true); }} className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C3E30] text-[#F9F7F2] font-serif rounded-full hover:bg-[#8DA399] hover:scale-105 transition-all duration-300" data-testid="empty-upload-btn"><Upload size={20} /> Incarca Prima Poza</button></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{photos.map(function(photo) { return (
              <div key={photo.id} className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative" data-testid={"photo-" + photo.id}>
                <img src={API + "/photos/file/" + photo.filename} alt={photo.original_filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" loading="lazy" onClick={function() { setSelectedPhoto(photo); }} />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={function(e) { e.stopPropagation(); downloadPhoto(photo); }} className="flex items-center gap-2 px-4 py-2 bg-white/90 text-[#2C3E30] rounded-full text-sm font-medium hover:bg-white transition-colors" data-testid={"download-" + photo.id}>
                    <Download size={16} /> Descarca
                  </button>
                </div>
              </div>
            ); })}</div>
          )}
        </div>
      </main>

      {showUpload && (<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-[#F9F7F2] max-w-lg w-full p-8 rounded-3xl relative shadow-2xl"><button onClick={function() { setShowUpload(false); }} className="absolute top-4 right-4 text-[#5C6B5F] hover:text-[#2C3E30] transition-colors"><X size={24} /></button><h2 className="font-serif text-2xl text-[#2C3E30] mb-6">Incarca Poze</h2><div className="space-y-6"><div><label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Numele tau (optional)</label><input type="text" value={uploadName} onChange={function(e) { setUploadName(e.target.value); }} className="w-full p-4 border-2 border-[#2C3E30]/10 rounded-xl focus:border-[#8DA399] focus:outline-none transition-all" placeholder="ex: Maria Ionescu" data-testid="upload-name-input" /></div><div><label className="text-[#2C3E30] text-sm tracking-widest uppercase mb-2 block">Selecteaza pozele</label><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif" multiple onChange={handleFileSelect} className="hidden" data-testid="file-input" /><button onClick={function() { fileInputRef.current && fileInputRef.current.click(); }} className="w-full p-8 border-2 border-dashed border-[#8DA399]/50 rounded-2xl hover:border-[#8DA399] hover:bg-[#E3EBE6]/30 transition-all text-center" data-testid="select-files-btn"><Camera className="w-12 h-12 mx-auto mb-4 text-[#8DA399]" /><p className="text-[#5C6B5F]">Click pentru a selecta</p><p className="text-xs text-[#8DA399] mt-2">JPG, PNG, HEIC (max 10MB)</p></button>{uploadFiles.length > 0 && (<div className="mt-4 space-y-2">{uploadFiles.map(function(file, i) { return (<div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#2C3E30]/5"><span className="text-sm text-[#5C6B5F] truncate">{file.name}</span><button onClick={function() { removeFile(i); }} className="text-[#B95D5D] hover:scale-110 transition-transform"><X size={18} /></button></div>); })}</div>)}</div><div className="p-4 bg-[#E3EBE6] rounded-xl text-sm text-[#5C6B5F]"><AlertCircle className="w-5 h-5 inline-block mr-2 text-[#8DA399]" />Pozele vor fi vizibile imediat in galerie.</div><div className="flex items-start gap-3"><input type="checkbox" id="consent" checked={uploadConsent} onChange={function(e) { setUploadConsent(e.target.checked); }} className="w-5 h-5 mt-0.5 accent-[#8DA399] rounded" data-testid="consent-checkbox" /><label htmlFor="consent" className="text-sm text-[#5C6B5F] leading-relaxed cursor-pointer">Accept ca pozele sa fie folosite in galerie si sunt de acord cu <Link to="/privacy" className="text-[#8DA399] hover:underline" target="_blank">politica de confidentialitate</Link>.</label></div><div className="flex gap-4"><button onClick={function() { setShowUpload(false); }} className="flex-1 px-6 py-3 border-2 border-[#2C3E30] text-[#2C3E30] font-serif rounded-full hover:bg-[#2C3E30] hover:text-[#F9F7F2] transition-all" data-testid="cancel-upload-btn">Anuleaza</button><button onClick={handleUpload} disabled={uploading || !uploadConsent || uploadFiles.length === 0} className="flex-1 px-6 py-3 bg-[#2C3E30] text-[#F9F7F2] font-serif rounded-full hover:bg-[#8DA399] disabled:opacity-50 transition-all flex items-center justify-center gap-2" data-testid="confirm-upload-btn">{uploading ? <span className="loading-spinner"></span> : <Upload size={18} />}{uploading ? "Se incarca..." : "Incarca"}</button></div></div></div></div>)}

      {selectedPhoto && (<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={function() { setSelectedPhoto(null); }}><button className="absolute top-4 right-4 text-white hover:text-[#8DA399] transition-colors" onClick={function() { setSelectedPhoto(null); }} data-testid="close-lightbox-btn"><X size={32} /></button><button className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-3 bg-white text-[#2C3E30] rounded-full font-medium hover:bg-[#8DA399] hover:text-white transition-all" onClick={function(e) { e.stopPropagation(); downloadPhoto(selectedPhoto); }}><Download size={20} /> Descarca</button><img src={API + "/photos/file/" + selectedPhoto.filename} alt={selectedPhoto.original_filename} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={function(e) { e.stopPropagation(); }} /></div>)}
    </div>
  );
}

export default GalleryPage;
