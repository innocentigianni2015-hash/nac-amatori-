import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { ensureFirstAdmin, getAdminSnapshot } from "@/lib/nac-data";
import "./admin.css";

export const dynamic = "force-dynamic";
const NAC = "NAC AMATORI CASTELLANA";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowed = await ensureFirstAdmin(user.email, user.displayName);
  if (!allowed) return <main className="admin-denied"><h1>Accesso non autorizzato</h1></main>;
  const data = await getAdminSnapshot();
  const nacMatches = data.matches.filter(m => m.home === NAC || m.away === NAC);
  return <main className="admin-server">
    <header className="admin-server-head"><div><img src="/nac-scudetto.png" alt="NAC"/><div><small>NAC CONTROL ROOM</small><h1>Gestione NAC</h1></div></div><nav><a href="/">Sito pubblico</a><a href={chatGPTSignOutPath("/")}>Esci</a></nav></header>
    <section className="admin-server-kpis"><article><b>{data.players.filter(p=>p.active).length}</b><span>Giocatori</span></article><article><b>{data.staff.length}</b><span>Staff</span></article><article><b>{nacMatches.length}</b><span>Partite NAC</span></article><article><b>{Object.keys(data.settings).length}</b><span>Contenuti</span></article></section>
    <section className="admin-server-block"><div className="admin-server-title"><small>ROSA</small><h2>Giocatori</h2></div><div className="admin-server-grid">{data.players.map(p=><article key={p.id}><b>{p.name}</b><span>{p.role} · {p.groupName}</span></article>)}</div></section>
    <section className="admin-server-block"><div className="admin-server-title"><small>CAMPIONATO</small><h2>Calendario NAC</h2></div><div className="admin-server-table">{nacMatches.map(m=><div key={m.id}><span>{m.round}ª</span><b>{m.home}</b><strong>{m.homeGoals ?? "–"} : {m.awayGoals ?? "–"}</strong><b>{m.away}</b><span>{m.sourceDate}</span></div>)}</div></section>
    <section className="admin-server-block"><div className="admin-server-title"><small>STAFF</small><h2>Dirigenti e staff</h2></div>{data.staff.length?<div className="admin-server-grid">{data.staff.map(s=><article key={s.id}><b>{s.name}</b><span>{s.role}</span></article>)}</div>:<p className="admin-server-empty">Nessun componente staff ancora inserito.</p>}</section>
    <section className="admin-server-block"><div className="admin-server-title"><small>CONTENUTI</small><h2>Testi del sito</h2></div><div className="admin-server-settings">{Object.entries(data.settings).filter(([k])=>!k.startsWith("media_")).map(([k,v])=><article key={k}><b>{k}</b><p>{v}</p></article>)}</div></section>
  </main>;
}
