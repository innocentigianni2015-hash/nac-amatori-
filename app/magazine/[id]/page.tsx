import PublicNav from "@/app/PublicNav";
import { getPublishedArticle,mediaUrl } from "@/lib/nac-data";
import { notFound } from "next/navigation";
import "../magazine.css";
export const dynamic="force-dynamic";
export default async function MagazineArticlePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params,a=await getPublishedArticle(id);if(!a)notFound();
  return <main className="magazine-shell"><PublicNav/><article className="magazine-article"><a className="magazine-article-brand" href="/magazine"><img src="/nac-sports-tv.webp" alt="NAC Sports TV"/><span>NAC SPORTS TV · MAGAZINE</span></a><small>{new Date(a.publishedAt||a.createdAt).toLocaleDateString("it-IT")}</small><h1>{a.title}</h1><p className="lead">{a.description}</p>{a.contentType==="video"&&a.articleVideoKey?<video className="magazine-main-video" controls playsInline preload="metadata" poster={a.imageKey?mediaUrl(a.imageKey)||undefined:undefined}><source src={mediaUrl(a.articleVideoKey)||""}/></video>:<><>{a.imageKey&&<img className="magazine-article-photo" src={mediaUrl(a.imageKey)||""} alt={a.title}/>}</><div className="magazine-body">{a.body}</div></>}</article></main>
}
