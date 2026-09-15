"use client";

import { FormEvent, useState } from "react";
import "../admin.css";

export default function AdminLoginPage(){
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault(); setBusy(true); setError("");
    try{
      const res=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
      const json=await res.json() as {ok?:boolean;error?:string};
      if(!res.ok) throw new Error(json.error||"Accesso non riuscito");
      window.location.href="/admin";
    }catch(err){setError(err instanceof Error?err.message:"Accesso non riuscito");}
    finally{setBusy(false);}
  }
  return <main className="admin-login-shell"><form className="admin-login-card" onSubmit={submit}>
    <img src="/nac-scudetto.png" alt="NAC"/>
    <small>NAC CONTROL ROOM</small>
    <h1>Accesso Admin</h1>
    <p>Inserisci la password amministratore.</p>
    <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/>
    <button type="submit" disabled={busy}>{busy?"ACCESSO…":"ENTRA NELL'ADMIN"}</button>
    {error&&<p className="admin-login-error">{error}</p>}
    <a href="/">← Torna al sito</a>
  </form></main>;
}
