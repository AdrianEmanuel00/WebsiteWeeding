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

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) {
      setAuth(true);
      loadData(t);
    }
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
    } catch (e) {
      logout();
    }
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
    } catch (e) {
      toast.error("Invalid");
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAuth(false);
    setData(null);
  };

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
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F9F7F2"}}>
        <div style={{maxWidth:"400px",width:"100%",padding:"20px"}}>
          <h1 style={{textAlign:"center",marginBottom:"20px",fontFamily:"serif",color:"#2C3E30"}}>Admin</h1>
          <form onSubmit={login} style={{background:"white",padding:"30px",border:"1px solid #ddd"}}>
            <div style={{marginBottom:"15px"}}>
              <label style={{display:"block",marginBottom:"5px"}}>User</label>
              <input type="text" value={user} onChange={(e) => setUser(e.target.value)} style={{width:"100%",padding:"10px",border:"1px solid #ccc"}} data-testid="admin-username" />
            </div>
            <div style={{marginBottom:"15px"}}>
              <label style={{display:"block",marginBottom:"5px"}}>Password</label>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{width:"100%",padding:"10px",border:"1px solid #ccc"}} data-testid="admin-password" />
            </div>
            <button type="submit" disabled={loading} style={{width:"100%",padding:"12px",background:"#2C3E30",color:"white",border:"none",cursor:"pointer"}} data-testid="admin-login-btn">
              {loading ? "..." : "Login"}
            </button>
          </form>
          <div style={{textAlign:"center",marginTop:"20px"}}>
            <Link to="/" style={{color:"#666"}}>Back</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Loading...</div>;

  return (
    <div style={{minHeight:"100vh",background:"#F9F7F2"}}>
      <header style={{background:"#2C3E30",color:"white",padding:"15px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"15px"}}>
          <Link to="/" style={{color:"white",fontFamily:"serif",fontSize:"20px",textDecoration:"none"}}>S & A</Link>
          <span style={{color:"#8DA399"}}>|</span>
          <span>Admin</span>
        </div>
        <div style={{display:"flex",gap:"15px",alignItems:"center"}}>
          <a href={API + "/qrcode"} target="_blank" rel="noreferrer" style={{background:"#8DA399",color:"white",padding:"8px 15px",textDecoration:"none"}} data-testid="download-qr-btn">QR Code</a>
          <button onClick={logout} style={{background:"none",border:"none",color:"white",cursor:"pointer"}} data-testid="admin-logout-btn">Logout</button>
        </div>
      </header>

      <main style={{maxWidth:"1200px",margin:"0 auto",padding:"20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"15px",marginBottom:"20px"}}>
          <div style={{background:"white",padding:"20px",textAlign:"center"}}><div style={{fontSize:"30px",color:"#8DA399"}}>{data.stats.total_guests}</div><div>Guests</div></div>
          <div style={{background:"white",padding:"20px",textAlign:"center"}}><div style={{fontSize:"30px",color:"#8DA399"}}>{data.stats.attending}</div><div>Attending</div></div>
          <div style={{background:"white",padding:"20px",textAlign:"center"}}><div style={{fontSize:"30px",color:"#B95D5D"}}>{data.stats.not_attending}</div><div>Not Attending</div></div>
          <div style={{background:"white",padding:"20px",textAlign:"center"}}><div style={{fontSize:"30px",color:"#D4AF37"}}>{data.stats.photos_pending}</div><div>Pending Photos</div></div>
        </div>

        <div style={{background:"white",padding:"20px",marginBottom:"20px"}}>
          <h3 style={{marginBottom:"15px"}}>Menu Summary</h3>
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
            {Object.entries(data.stats.menu_counts).map(([m,c]) => (
              <div key={m} style={{background:"#F0EFEA",padding:"15px",textAlign:"center",minWidth:"100px"}}>
                <div style={{fontSize:"24px",color:"#8DA399"}}>{c}</div>
                <div style={{fontSize:"12px"}}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"white",marginBottom:"20px"}}>
          <div style={{borderBottom:"1px solid #eee",padding:"15px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3>RSVPs ({data.rsvps.length})</h3>
            <a href={API + "/rsvp/export"} target="_blank" rel="noreferrer" style={{background:"#8DA399",color:"white",padding:"8px 15px",textDecoration:"none"}} data-testid="export-csv-btn">Export CSV</a>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#F0EFEA"}}><th style={{padding:"10px",textAlign:"left"}}>Name</th><th>Attending</th><th>Guests</th><th>Menu</th><th>Allergies</th><th></th></tr></thead>
            <tbody>
              {data.rsvps.map((r) => (
                <tr key={r.id} style={{borderBottom:"1px solid #eee"}}>
                  <td style={{padding:"10px"}}>{r.guest_name}</td>
                  <td style={{color:r.attending?"#8DA399":"#B95D5D"}}>{r.attending?"Yes":"No"}</td>
                  <td>{r.num_guests}</td>
                  <td>{r.guests.map((g,i) => <div key={i}>{g.name}: {g.menu_type}</div>)}</td>
                  <td>{r.allergies || "-"}</td>
                  <td><button onClick={() => del("rsvp",r.id)} style={{color:"#B95D5D",border:"none",background:"none",cursor:"pointer"}} data-testid={"delete-rsvp-" + r.id}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{background:"white"}}>
          <div style={{borderBottom:"1px solid #eee",padding:"15px"}}><h3>Photos ({data.photos.filter(p => p.status==="pending").length} pending)</h3></div>
          <div style={{padding:"15px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"10px"}}>
            {data.photos.map((p) => (
              <div key={p.id} style={{position:"relative",aspectRatio:"1",overflow:"hidden"}}>
                <img src={API + "/photos/file/" + p.filename} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.7)",padding:"8px",display:"flex",gap:"5px",justifyContent:"center"}}>
                  {p.status !== "approved" && <button onClick={() => moderate(p.id,"approved")} style={{background:"#8DA399",color:"white",border:"none",padding:"5px 10px",cursor:"pointer"}} data-testid={"approve-photo-" + p.id}>OK</button>}
                  {p.status !== "rejected" && <button onClick={() => moderate(p.id,"rejected")} style={{background:"#B95D5D",color:"white",border:"none",padding:"5px 10px",cursor:"pointer"}} data-testid={"reject-photo-" + p.id}>X</button>}
                  <button onClick={() => del("photos",p.id)} style={{background:"#666",color:"white",border:"none",padding:"5px 10px",cursor:"pointer"}} data-testid={"delete-photo-" + p.id}>Del</button>
                </div>
                <div style={{position:"absolute",top:"5px",right:"5px",background:p.status==="approved"?"#8DA399":p.status==="rejected"?"#B95D5D":"#D4AF37",color:"white",padding:"2px 6px",fontSize:"10px"}}>{p.status}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
