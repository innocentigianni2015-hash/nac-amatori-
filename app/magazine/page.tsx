import PublicNav from "@/app/PublicNav";
import { getPublishedArticles,mediaUrl } from "@/lib/nac-data";
import "./magazine.css";
export const dynamic="force-dynamic";
export default async function MagazinePage(){
  const articles=await getPublishedArticles();
  return <main className="magazine-shell"><PublicNav/><section className="magazine-hero"><div className="magazine-wrap"><small>NAC / MAGAZINE</small><h1>Storie dal campo.</h1></div></section><section className="magazine-grid">
    {articles.length?articles.map(a=><a className="magazine-card" href={`/magazine/${a.id}`} key={a.id}>{a.imageKey&&<img src={mediaUrl(a.imageKey)||""} alt={a.title}/>}<div><small>{new Date(a.publishedAt||a.createdAt).toLocaleDateString("it-IT")}</small><h2>{a.title}</h2><p>{a.description}</p></div></a>):<p>Nessun articolo pubblicato.</p>}
  </section></main>
}
