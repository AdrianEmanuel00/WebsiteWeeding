import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Camera, X, AlertCircle, Download, Play, Film } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";
var STORAGE_KEY = "wedding_uploads_v1";
var MAX_PHOTOS = 25;
var MAX_VIDEOS = 2;

function getDeviceCounts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { photos: 0, videos: 0 }; }
  catch { return { photos: 0, videos: 0 }; }
}
function saveDeviceCounts(counts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

function GalleryPage() {
  var [media, setMedia] = useState([]);
  var [loading, setLoading] = useState(true);
  var [uploading, setUploading] = useState(false);
  var [showUpload, setShowUpload] = useState(false);
  var [selectedItem, setSelectedItem] = useState(null);
  var [uploadName, setUploadName] = useState("");
  var [uploadConsent, setUploadConsent] = useState(false);
  var [uploadPhotos, setUploadPhotos] = useState([]);
  var [uploadVideos, setUploadVideos] = useState([]);
  var [deviceCounts, setDeviceCounts] = useState(getDeviceCounts);
  var photoInputRef = useRef(null);
  var videoInputRef = useRef(null);

  useEffect(function() { loadMedia(); }, []);

  function loadMedia() {
    setLoading(true);
    axios.get(API + "/photos").then(function(r) { setMedia(r.data); }).catch(function(e) { console.error(e); }).finally(function() { setLoading(false); });
  }

  function handlePhotoSelect(e) {
    var files = Array.from(e.target.files || []);
    var counts = getDeviceCounts();
    var remaining = MAX_PHOTOS - counts.photos;
    if (remaining <= 0) { toast.error("Ai atins limita de " + MAX_PHOTOS + " poze de pe acest dispozitiv"); return; }
    var valid = files.filter(function(f) {
      if (!["image/jpeg","image/png","image/heic","image/heif"].includes(f.type)) { toast.error(f.name + " nu este un format valid"); return false; }
      if (f.size > 20971520) { toast.error(f.name + " depaseste 20MB"); return false; }
      return true;
    }).slice(0, remaining);
    if (valid.length < files.length) toast.warning("Poti incarca maxim " + remaining + " poze in plus de pe acest dispozitiv");
    setUploadPhotos(valid);
    e.target.value = "";
  }

  function handleVideoSelect(e) {
    var files = Array.from(e.target.files || []);
    var counts = getDeviceCounts();
    var remaining = MAX_VIDEOS - counts.videos;
    if (remaining <= 0) { toast.error("Ai atins limita de " + MAX_VIDEOS + " clipuri de pe acest dispozitiv"); return; }
    var valid = files.filter(function(f) {
      if (!["video/mp4","video/quicktime","video/mov","video/avi","video/x-msvideo"].includes(f.type)) { toast.error(f.name + " nu este un format video valid (MP4, MOV)"); return false; }
      if (f.size > 524288000) { toast.error(f.name + " depaseste 500MB"); return false; }
      return true;
    }).slice(0, remaining);
    if (valid.length < files.length) toast.warning("Poti incarca maxim " + remaining + " clipuri in plus de pe acest dispozitiv");
    setUploadVideos(valid);
    e.target.value = "";
  }

  function handleUpload() {
    if (!uploadConsent) { toast.error("Acceptati termenii pentru a continua"); return; }
    if (uploadPhotos.length === 0 && uploadVideos.length === 0) { toast.error("Selectati cel putin o poza sau un clip"); return; }
    setUploading(true);

    var photoPromises = uploadPhotos.map(function(file) {
      var fd = new FormData();
      fd.append("file", file);
      fd.append("media_type", "photo");
      if (uploadName) fd.append("uploader_name", uploadName);
      return axios.post(API + "/photos/upload", fd);
    });
    var videoPromises = uploadVideos.map(function(file) {
      var fd = new FormData();
      fd.append("file", file);
      fd.append("media_type", "video");
      if (uploadName) fd.append("uploader_name", uploadName);
      return axios.post(API + "/photos/upload", fd, { timeout: 600000 });
    });

    Promise.all([...photoPromises, ...videoPromises]).then(function() {
      var counts = getDeviceCounts();
      counts.photos += uploadPhotos.length;
      counts.videos += uploadVideos.length;
      saveDeviceCounts(counts);
      setDeviceCounts({ photos: counts.photos, videos: counts.videos });

      var parts = [];
      if (uploadPhotos.length > 0) parts.push(uploadPhotos.length + (uploadPhotos.length === 1 ? " poza" : " poze"));
      if (uploadVideos.length > 0) parts.push(uploadVideos.length + (uploadVideos.length === 1 ? " clip" : " clipuri"));
      toast.success(parts.join(" si ") + " incarcate cu succes!");
      setShowUpload(false);
      setUploadName("");
      setUploadConsent(false);
      setUploadPhotos([]);
      setUploadVideos([]);
      loadMedia();
    }).catch(function(err) {
      var msg = err?.response?.data?.detail || "Eroare la incarcare. Incearca din nou.";
      toast.error(msg);
    }).finally(function() { setUploading(false); });
  }

  function downloadItem(item) {
    var link = document.createElement("a");
    link.href = API + "/photos/file/" + item.filename;
    link.download = item.original_filename || item.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  var remainingPhotos = MAX_PHOTOS - deviceCounts.photos;
  var remainingVideos = MAX_VIDEOS - deviceCounts.videos;

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5EFEB]/80 backdrop-blur-md border-b border-[#2F4156]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#567C8D] hover:text-[#2F4156] transition-colors duration-300" data-testid="gallery-back-link"><ArrowLeft size={20} /><span className="text-sm tracking-widest uppercase">Inapoi</span></Link>
          <span className="font-script text-2xl text-[#2F4156]">Galerie</span>
          <button onClick={function() { setShowUpload(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#2F4156] text-white font-serif text-sm rounded-full hover:bg-[#567C8D] hover:scale-105 transition-all duration-300" data-testid="open-upload-btn"><Upload size={16} /><span className="hidden md:inline">Incarca</span></button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.2em] uppercase text-[#567C8D] mb-4">Amintiri</p>
            <h1 className="font-script text-5xl md:text-6xl text-[#2F4156]">Galeria Noastra</h1>
            <p className="text-[#567C8D] mt-4 max-w-lg mx-auto">Incarcati pozele si clipurile voastre de la nunta pentru a le impartasi cu toti invitatii.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="loading-spinner w-12 h-12"></div></div>
          ) : media.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <Camera className="w-16 h-16 mx-auto mb-6 text-[#567C8D]" />
              <h3 className="font-script text-3xl text-[#2F4156] mb-2">Galeria este goala</h3>
              <p className="text-[#567C8D] mb-6">Fii primul care incarca amintiri!</p>
              <button onClick={function() { setShowUpload(true); }} className="inline-flex items-center gap-2 px-8 py-4 bg-[#2F4156] text-white font-serif rounded-full hover:bg-[#567C8D] hover:scale-105 transition-all duration-300" data-testid="empty-upload-btn"><Upload size={20} /> Incarca Prima Poza</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map(function(item) {
                var isVideo = item.media_type === "video";
                return (
                  <div key={item.id} className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative cursor-pointer bg-[#2F4156]/10" onClick={function() { setSelectedItem(item); }} data-testid={"media-" + item.id}>
                    {isVideo ? (
                      <video src={API + "/photos/file/" + item.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" preload="metadata" muted playsInline />
                    ) : (
                      <img src={API + "/photos/file/" + item.filename} alt={item.original_filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    )}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 bg-white/85 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play size={24} className="text-[#2F4156] ml-1" fill="#2F4156" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#2F4156]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={function(e) { e.stopPropagation(); downloadItem(item); }} className="flex items-center gap-2 px-4 py-2 bg-white/90 text-[#2F4156] rounded-full text-sm font-medium hover:bg-white transition-colors" data-testid={"download-" + item.id}><Download size={16} /> Descarca</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={function(e) { if (e.target === e.currentTarget) setShowUpload(false); }}>
          <div className="bg-[#F5EFEB] max-w-lg w-full p-8 rounded-3xl relative shadow-2xl my-8">
            <button onClick={function() { setShowUpload(false); }} className="absolute top-4 right-4 text-[#567C8D] hover:text-[#2F4156] transition-colors"><X size={24} /></button>
            <h2 className="font-script text-3xl text-[#2F4156] mb-6">Incarca Amintiri</h2>
            <div className="space-y-5">

              {/* Nume */}
              <div>
                <label className="text-[#2F4156] text-sm tracking-widest uppercase mb-2 block">Numele tau (optional)</label>
                <input type="text" value={uploadName} onChange={function(e) { setUploadName(e.target.value); }} className="w-full p-4 border-2 border-[#C8D9E6] rounded-xl focus:border-[#567C8D] focus:outline-none transition-all bg-white" placeholder="ex: Maria Ionescu" data-testid="upload-name-input" />
              </div>

              {/* Poze */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#2F4156] text-sm tracking-widest uppercase flex items-center gap-2"><Camera size={16} /> Poze</label>
                  <span className={"text-xs font-semibold px-3 py-1 rounded-full " + (remainingPhotos > 5 ? "bg-[#C8D9E6] text-[#2F4156]" : remainingPhotos > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600")}>
                    {remainingPhotos > 0 ? remainingPhotos + " / " + MAX_PHOTOS + " ramase" : "Limita atinsa"}
                  </span>
                </div>
                <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif" multiple onChange={handlePhotoSelect} className="hidden" data-testid="photo-input" />
                <button onClick={function() { if (remainingPhotos > 0) photoInputRef.current && photoInputRef.current.click(); }} disabled={remainingPhotos <= 0} className="w-full p-5 border-2 border-dashed border-[#567C8D]/50 rounded-2xl hover:border-[#567C8D] hover:bg-[#C8D9E6]/30 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed" data-testid="select-photos-btn">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-[#567C8D]" />
                  <p className="text-[#567C8D] text-sm font-medium">Click pentru a selecta poze</p>
                  <p className="text-xs text-[#567C8D]/60 mt-1">JPG, PNG, HEIC — max 20MB per poza</p>
                </button>
                {uploadPhotos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadPhotos.map(function(f, i) { return (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#C8D9E6]">
                        <span className="text-sm text-[#567C8D] truncate">{f.name}</span>
                        <button onClick={function() { setUploadPhotos(uploadPhotos.filter(function(_, j) { return j !== i; })); }} className="text-red-400 hover:text-red-600 hover:scale-110 transition-all ml-2 flex-shrink-0"><X size={18} /></button>
                      </div>
                    ); })}
                  </div>
                )}
              </div>

              {/* Clipuri */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#2F4156] text-sm tracking-widest uppercase flex items-center gap-2"><Film size={16} /> Clipuri Video</label>
                  <span className={"text-xs font-semibold px-3 py-1 rounded-full " + (remainingVideos > 0 ? "bg-[#C8D9E6] text-[#2F4156]" : "bg-red-100 text-red-600")}>
                    {remainingVideos > 0 ? remainingVideos + " / " + MAX_VIDEOS + " ramase" : "Limita atinsa"}
                  </span>
                </div>
                <input ref={videoInputRef} type="file" accept="video/mp4,video/quicktime,video/mov,video/avi" multiple onChange={handleVideoSelect} className="hidden" data-testid="video-input" />
                <button onClick={function() { if (remainingVideos > 0) videoInputRef.current && videoInputRef.current.click(); }} disabled={remainingVideos <= 0} className="w-full p-5 border-2 border-dashed border-[#567C8D]/50 rounded-2xl hover:border-[#567C8D] hover:bg-[#C8D9E6]/30 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed" data-testid="select-videos-btn">
                  <Film className="w-8 h-8 mx-auto mb-2 text-[#567C8D]" />
                  <p className="text-[#567C8D] text-sm font-medium">Click pentru a selecta clipuri</p>
                  <p className="text-xs text-[#567C8D]/60 mt-1">MP4, MOV — max 500MB per clip</p>
                </button>
                {uploadVideos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadVideos.map(function(f, i) { return (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#C8D9E6]">
                        <span className="text-sm text-[#567C8D] truncate">{f.name}</span>
                        <button onClick={function() { setUploadVideos(uploadVideos.filter(function(_, j) { return j !== i; })); }} className="text-red-400 hover:text-red-600 hover:scale-110 transition-all ml-2 flex-shrink-0"><X size={18} /></button>
                      </div>
                    ); })}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-[#C8D9E6]/40 rounded-xl text-sm text-[#567C8D] flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Pozele si clipurile vor fi vizibile imediat in galerie pentru toti invitatii.</span>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="consent" checked={uploadConsent} onChange={function(e) { setUploadConsent(e.target.checked); }} className="w-5 h-5 mt-0.5 accent-[#567C8D] rounded flex-shrink-0" data-testid="consent-checkbox" />
                <label htmlFor="consent" className="text-sm text-[#567C8D] leading-relaxed cursor-pointer">Accept ca pozele/clipurile sa fie afisate in galerie si sunt de acord cu <Link to="/privacy" className="text-[#2F4156] hover:underline" target="_blank">politica de confidentialitate</Link>.</label>
              </div>

              {/* Butoane */}
              <div className="flex gap-4 pt-1">
                <button onClick={function() { setShowUpload(false); }} className="flex-1 px-6 py-3 border-2 border-[#2F4156] text-[#2F4156] font-serif rounded-full hover:bg-[#2F4156] hover:text-white transition-all" data-testid="cancel-upload-btn">Anuleaza</button>
                <button onClick={handleUpload} disabled={uploading || !uploadConsent || (uploadPhotos.length === 0 && uploadVideos.length === 0)} className="flex-1 px-6 py-3 bg-[#2F4156] text-white font-serif rounded-full hover:bg-[#567C8D] disabled:opacity-40 transition-all flex items-center justify-center gap-2" data-testid="confirm-upload-btn">
                  {uploading ? <><span className="loading-spinner"></span> Se incarca...</> : <><Upload size={18} /> Incarca</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#2F4156]/95 flex items-center justify-center p-4" onClick={function() { setSelectedItem(null); }}>
          <button className="absolute top-4 right-4 text-white hover:text-[#C8D9E6] transition-colors z-10" onClick={function() { setSelectedItem(null); }} data-testid="close-lightbox-btn"><X size={32} /></button>
          <button className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-3 bg-white text-[#2F4156] rounded-full font-medium hover:bg-[#C8D9E6] transition-all z-10" onClick={function(e) { e.stopPropagation(); downloadItem(selectedItem); }}><Download size={20} /> Descarca</button>
          {selectedItem.media_type === "video" ? (
            <video src={API + "/photos/file/" + selectedItem.filename} className="max-w-full max-h-[85vh] rounded-lg" controls autoPlay onClick={function(e) { e.stopPropagation(); }} />
          ) : (
            <img src={API + "/photos/file/" + selectedItem.filename} alt={selectedItem.original_filename} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={function(e) { e.stopPropagation(); }} />
          )}
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
