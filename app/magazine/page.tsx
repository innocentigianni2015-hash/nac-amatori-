import PublicNav from "@/app/PublicNav";
import { getPublishedArticles,mediaUrl } from "@/lib/nac-data";
import "./magazine.css";
export const dynamic="force-dynamic";
export default async function MagazinePage(){
  const articles=await getPublishedArticles();
  return <main className="magazine-shell"><PublicNav/><section className="magazine-hero"><div className="magazine-wrap magazine-brand"><img className="magazine-logo" src="/nac-sports-tv.webp" alt="NAC Sports TV"/><div><small>NAC SPORTS TV · MAGAZINE</small><h1>Storie dal campo.</h1><p className="magazine-sections">NEWS · VIDEO · EDITORIALI</p></div></div></section><section className="magazine-grid">
    {articles.length?articles.map(a=><a className="magazine-card" href={`/magazine/${a.id}`} key={a.id}><img src={a.imageKey?(mediaUrl(a.imageKey)||"/nac-sports-tv.webp"):"/nac-sports-tv.webp"} alt={a.imageKey?a.title:"NAC Sports TV"}/><div><small>{new Date(a.publishedAt||a.createdAt).toLocaleDateString("it-IT")}</small><h2>{a.title}</h2><p>{a.description}</p></div></a>):<div className="magazine-empty"><img src="/nac-sports-tv.webp" alt="NAC Sports TV"/><p>Nessun articolo pubblicato.</p></div>}
  </section></main>
}
