"use client";
import { FormEvent,useState } from "react";
import "../admin.css";

export default function AdminLoginPage(){
  const [email,setEmail]=useState("admin@nacamatori.local"),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{const res=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const json=await res.json() as {ok?:boolean;error?:string};if(!res.ok)throw new Error(json.error||"Accesso non riuscito");window.location.href="/admin"}catch(err){setError(err instanceof Error?err.message:"Accesso non riuscito")}finally{setBusy(false)}}
  return <main className="admin-login-shell"><form className="admin-login-card" onSubmit={submit}>
    <img src="/nac-scudetto.png" alt="NAC"/><small>NAC CONTROL ROOM</small><h1>Accesso Staff</h1><p>Accedi con l'email autorizzata e la tua password.</p>
    <input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
    <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/>
    <button type="submit" disabled={busy}>{busy?"ACCESSO…":"ENTRA"}</button>{error&&<p className="admin-login-error">{error}</p>}
    <a href="/admin/password-dimenticata">Password dimenticata?</a><a href="/">← Torna al sito</a>
  </form></main>
}
