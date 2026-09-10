import { env } from "cloudflare:workers";
import { cleanText, getD1, requireAdminApi } from "@/lib/nac-data";

export const dynamic="force-dynamic";

export async function POST(request:Request){
  const auth=await requireAdminApi();if(auth.error)return auth.error;
  if(!env.BUCKET)return Response.json({error:"Archivio immagini non disponibile"},{status:503});
  const form=await request.formData();const file=form.get("file");const entity=cleanText(form.get("entity"),20);const id=cleanText(form.get("id"),100);
  if(!(file instanceof File)||!id||!["player","sponsor"].includes(entity))return Response.json({error:"File non valido"},{status:400});
  if(!file.type.startsWith("image/")||file.size>8*1024*1024)return Response.json({error:"Usa JPG, PNG o WEBP fino a 8 MB"},{status:400});
  const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,"").toLowerCase()||"jpg";
  const key=`${entity}s/${id}/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
  const db=getD1(),table=entity==="player"?"players":"sponsors",column=entity==="player"?"photo_key":"logo_key";
  const previous=await db.prepare(`SELECT ${column} AS oldKey FROM ${table} WHERE id=?`).bind(id).first<{oldKey:string|null}>();
  await db.prepare(`UPDATE ${table} SET ${column}=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(key,id).run();
  if(previous?.oldKey)await env.BUCKET.delete(previous.oldKey);
  return Response.json({ok:true,key});
}
