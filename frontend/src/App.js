import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import RSVPPage from "@/pages/RSVPPage";
import GalleryPage from "@/pages/GalleryPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <div className="App min-h-screen bg-[#F9F7F2]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
