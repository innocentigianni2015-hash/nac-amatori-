"use client";
import { FormEvent,useState } from "react";
import "../admin.css";

export default function ForgotPasswordPage(){
  const [email,setEmail]=useState("admin@nacamatori.local"),[code,setCode]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setError("");setMessage("");if(password!==confirm){setError("Le due password non coincidono");return}setBusy(true);try{const res=await fetch("/api/admin/password-reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,recoveryCode:code,newPassword:password})});const json=await res.json() as {ok?:boolean;error?:string};if(!res.ok)throw new Error(json.error||"Reimpostazione non riuscita");setMessage("Password aggiornata. Ora puoi accedere con la nuova password.");setCode("");setPassword("");setConfirm("")}catch(err){setError(err instanceof Error?err.message:"Reimpostazione non riuscita")}finally{setBusy(false)}}
  return <main className="admin-login-shell"><form className="admin-login-card" onSubmit={submit}>
    <img src="/nac-scudetto.png" alt="NAC"/><small>NAC CONTROL ROOM</small><h1>Password dimenticata</h1><p>Inserisci email amministratore, codice di recupero e una nuova password di almeno 10 caratteri.</p>
    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
    <input type="password" value={code} onChange={e=>setCode(e.target.value)} placeholder="Codice di recupero" required/>
    <input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nuova password" minLength={10} required/>
    <input type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Ripeti nuova password" minLength={10} required/>
    <button type="submit" disabled={busy}>{busy?"AGGIORNAMENTO…":"IMPOSTA NUOVA PASSWORD"}</button>
    {error&&<p className="admin-login-error">{error}</p>}{message&&<p>{message}</p>}<a href="/admin/login">← Torna all'accesso</a>
  </form></main>
}
