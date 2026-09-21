import PublicNav from "@/app/PublicNav";
import { getPublishedArticle,mediaUrl } from "@/lib/nac-data";
import { notFound } from "next/navigation";
import "../magazine.css";
export const dynamic="force-dynamic";
export default async function MagazineArticlePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params,a=await getPublishedArticle(id);if(!a)notFound();
  return <main className="magazine-shell"><PublicNav/><article className="magazine-article"><small>NAC / MAGAZINE · {new Date(a.publishedAt||a.createdAt).toLocaleDateString("it-IT")}</small><h1>{a.title}</h1><p className="lead">{a.description}</p>{a.imageKey&&<img src={mediaUrl(a.imageKey)||""} alt={a.title}/>}<div className="magazine-body">{a.body}</div></article></main>
}
