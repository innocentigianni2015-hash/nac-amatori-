import { getPublicSnapshot } from "@/lib/nac-data";
import PublicNav from "@/app/PublicNav";
export const dynamic="force-dynamic";
export default async function StaffPage(){
  const data=await getPublicSnapshot();
  return <main className="public-page"><header className="public-page-head"><PublicNav/><div className="public-page-title"><small>SOCIETÀ</small><h1>Dirigenti & Staff.</h1><p>Le persone che organizzano, accompagnano e sostengono la squadra durante tutta la stagione.</p></div></header><div className="public-page-body">{data.staff.length?<div className="public-grid staff-card-grid">{data.staff.map(p=><article className="public-card staff-card" key={p.id}>{p.photoKey&&<img src={`/api/media/${p.photoKey}`} alt={p.name}/>}<h3>{p.name}</h3><small>{p.role}</small>{p.bio&&<p>{p.bio}</p>}</article>)}</div>:<div className="empty-note">Organigramma in aggiornamento. Inserisci dirigenti e staff dall’Admin.</div>}</div></main>
}
