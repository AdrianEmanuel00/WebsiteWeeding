import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

var API = process.env.REACT_APP_BACKEND_URL + "/api";

function AdminPage() {
  var stored = localStorage.getItem("admin_token");
  var [auth, setAuth] = useState(!!stored);
  var [user, setUser] = useState("");
  var [pass, setPass] = useState("");
  var [loading, setLoading] = useState(false);
  var [stats, setStats] = useState(null);
  var [rsvps, setRsvps] = useState([]);
  var [photos, setPhotos] = useState([]);
  var [tab, setTab] = useState("rsvp");

  useEffect(function() {
    if (auth) loadData();
  }, [auth]);

  function loadData() {
    var t = localStorage.getItem("admin_token");
    var h = { Authorization: "Bearer " + t };
    axios.get(API + "/stats", { headers: h }).then(function(r) { setStats(r.data); });
    axios.get(API + "/rsvp", { headers: h }).then(function(r) { setRsvps(r.data); });
    axios.get(API + "/photos/all", { headers: h }).then(function(r) { setPhotos(r.data); });
  }

  function login(e) {
    e.preventDefault();
    setLoading(true);
    axios.post(API + "/admin/login", { username: user, password: pass })
      .then(function(r) {
        localStorage.setItem("admin_token", r.data.token);
        setAuth(true);
        toast.success("OK");
      })
      .catch(function() { toast.error("Invalid"); })
      .finally(function() { setLoading(false); });
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setAuth(false);
  }

  function moderate(id, st) {
    var t = localStorage.getItem("admin_token");
    axios.put(API + "/photos/" + id + "/moderate", { status: st }, { headers: { Authorization: "Bearer " + t }})
      .then(function() { loadData(); toast.success("OK"); });
  }

  function delRsvp(id) {
    var t = localStorage.getItem("admin_token");
    axios.delete(API + "/rsvp/" + id, { headers: { Authorization: "Bearer " + t }})
      .then(function() { loadData(); toast.success("Deleted"); });
  }

  function delPhoto(id) {
    var t = localStorage.getItem("admin_token");
    axios.delete(API + "/photos/" + id, { headers: { Authorization: "Bearer " + t }})
      .then(function() { loadData(); toast.success("Deleted"); });
  }

  if (!auth) {
    return (
      <div style={{minHeight:"100vh",background:"#F9F7F2",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
        <div style={{maxWidth:"400px",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"32px"}}>
            <Link to="/" style={{fontFamily:"serif",fontSize:"28px",color:"#2C3E30",textDecoration:"none"}}>S & A</Link>
            <h1 style={{fontFamily:"serif",fontSize:"24px",color:"#2C3E30",marginTop:"16px"}}>Panou Admin</h1>
          </div>
          <form onSubmit={login} style={{background:"white",padding:"32px",border:"1px solid rgba(44,62,48,0.1)"}}>
            <div style={{marginBottom:"20px"}}>
              <label style={{display:"block",color:"#2C3E30",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Utilizator</label>
              <input type="text" value={user} onChange={function(e){setUser(e.target.value);}} style={{width:"100%",padding:"12px",border:"1px solid rgba(44,62,48,0.2)",boxSizing:"border-box"}} required data-testid="admin-username" />
            </div>
            <div style={{marginBottom:"20px"}}>
              <label style={{display:"block",color:"#2C3E30",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px"}}>Parola</label>
              <input type="password" value={pass} onChange={function(e){setPass(e.target.value);}} style={{width:"100%",padding:"12px",border:"1px solid rgba(44,62,48,0.2)",boxSizing:"border-box"}} required data-testid="admin-password" />
            </div>
            <button type="submit" disabled={loading} style={{width:"100%",padding:"16px",background:"#2C3E30",color:"#F9F7F2",fontFamily:"serif",border:"none",cursor:"pointer",opacity:loading?0.5:1}} data-testid="admin-login-btn">{loading?"...":"Autentificare"}</button>
          </form>
          <div style={{textAlign:"center",marginTop:"24px"}}><Link to="/" style={{color:"#5C6B5F",fontSize:"14px"}}>Inapoi la site</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#F9F7F2"}}>
      <header style={{background:"#2C3E30",color:"#F9F7F2",padding:"16px 24px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <Link to="/" style={{fontFamily:"serif",fontSize:"20px",color:"#F9F7F2",textDecoration:"none"}}>S & A</Link>
            <span style={{color:"#8DA399"}}>|</span>
            <span style={{fontSize:"12px",textTransform:"uppercase"}}>Admin</span>
          </div>
          <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
            <a href={API+"/qrcode"} target="_blank" rel="noreferrer" style={{padding:"8px 16px",background:"#8DA399",color:"white",textDecoration:"none",fontSize:"14px"}} data-testid="download-qr-btn">QR Code</a>
            <button onClick={logout} style={{background:"none",border:"none",color:"#F9F7F2",cursor:"pointer"}} data-testid="admin-logout-btn">Iesire</button>
          </div>
        </div>
      </header>
      <main style={{maxWidth:"1200px",margin:"0 auto",padding:"32px 24px"}}>
        {stats && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"32px"}}>
            <div className="stat-card"><div className="stat-number">{stats.total_guests}</div><div className="stat-label">Total</div></div>
            <div className="stat-card"><div className="stat-number" style={{color:"#8DA399"}}>{stats.attending}</div><div className="stat-label">Confirmati</div></div>
            <div className="stat-card"><div className="stat-number" style={{color:"#B95D5D"}}>{stats.not_attending}</div><div className="stat-label">Nu participa</div></div>
            <div className="stat-card"><div className="stat-number" style={{color:"#D4AF37"}}>{stats.photos_pending}</div><div className="stat-label">Poze pending</div></div>
          </div>
        )}
        <div style={{display:"flex",gap:"16px",marginBottom:"24px"}}>
          <button onClick={function(){setTab("rsvp");}} style={{padding:"12px 24px",fontFamily:"serif",background:tab==="rsvp"?"#2C3E30":"white",color:tab==="rsvp"?"white":"#2C3E30",border:tab==="rsvp"?"none":"1px solid #2C3E30",cursor:"pointer"}} data-testid="tab-rsvp">RSVP ({rsvps.length})</button>
          <button onClick={function(){setTab("photos");}} style={{padding:"12px 24px",fontFamily:"serif",background:tab==="photos"?"#2C3E30":"white",color:tab==="photos"?"white":"#2C3E30",border:tab==="photos"?"none":"1px solid #2C3E30",cursor:"pointer"}} data-testid="tab-photos">Poze</button>
        </div>
        {tab==="rsvp" && (
          <div style={{background:"white",border:"1px solid rgba(44,62,48,0.1)"}}>
            <div style={{padding:"16px",borderBottom:"1px solid rgba(44,62,48,0.1)",display:"flex",justifyContent:"space-between"}}>
              <button onClick={loadData} style={{padding:"8px 16px",background:"none",border:"none",color:"#5C6B5F",cursor:"pointer"}} data-testid="refresh-btn">Refresh</button>
              <a href={API+"/rsvp/export"} target="_blank" rel="noreferrer" style={{padding:"8px 16px",background:"#8DA399",color:"white",textDecoration:"none",fontSize:"14px"}} data-testid="export-csv-btn">Export CSV</a>
            </div>
            <table className="admin-table">
              <thead><tr><th>Nume</th><th>Participa</th><th>Nr</th><th>Meniuri</th><th>Alergii</th><th></th></tr></thead>
              <tbody>
                {rsvps.map(function(r){return(
                  <tr key={r.id}>
                    <td style={{fontWeight:"500"}}>{r.guest_name}</td>
                    <td style={{color:r.attending?"#8DA399":"#B95D5D"}}>{r.attending?"Da":"Nu"}</td>
                    <td>{r.num_guests}</td>
                    <td style={{fontSize:"14px"}}>{r.guests.map(function(g){return g.name+": "+g.menu_type;}).join(", ")}</td>
                    <td style={{fontSize:"14px"}}>{r.allergies||"-"}</td>
                    <td><button onClick={function(){delRsvp(r.id);}} style={{color:"#B95D5D",background:"none",border:"none",cursor:"pointer"}} data-testid={"delete-rsvp-"+r.id}>Sterge</button></td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
        {tab==="photos" && (
          <div style={{background:"white",border:"1px solid rgba(44,62,48,0.1)",padding:"16px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"16px"}}>
              {photos.map(function(p){return(
                <div key={p.id} className="photo-card">
                  <img src={API+"/photos/file/"+p.filename} alt="" />
                  <div className="photo-overlay">
                    <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                      {p.status!=="approved"&&<button onClick={function(){moderate(p.id,"approved");}} style={{padding:"8px",background:"#8DA399",color:"white",border:"none",borderRadius:"50%",cursor:"pointer"}} data-testid={"approve-photo-"+p.id}>OK</button>}
                      {p.status!=="rejected"&&<button onClick={function(){moderate(p.id,"rejected");}} style={{padding:"8px",background:"#B95D5D",color:"white",border:"none",borderRadius:"50%",cursor:"pointer"}} data-testid={"reject-photo-"+p.id}>X</button>}
                      <button onClick={function(){delPhoto(p.id);}} style={{padding:"8px",background:"#666",color:"white",border:"none",borderRadius:"50%",cursor:"pointer"}} data-testid={"delete-photo-"+p.id}>Del</button>
                    </div>
                    <span style={{fontSize:"10px",textTransform:"uppercase",padding:"4px 8px",background:p.status==="approved"?"#8DA399":p.status==="rejected"?"#B95D5D":"#D4AF37",color:"white"}}>{p.status}</span>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
