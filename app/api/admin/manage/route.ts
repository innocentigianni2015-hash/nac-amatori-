import { env } from "cloudflare:workers";
import { cleanText,getD1,hasPermission,requireAdminApi,uid } from "@/lib/nac-data";
import { hashPassword } from "@/app/chatgpt-auth";

export const dynamic="force-dynamic";

function go(request:Request, section:string, ok=true, message="") {
  const url=new URL("/admin",request.url);
  url.searchParams.set(ok?"ok":"error",message|| (ok?"Salvato":"Errore"));
  url.hash=section;
  return Response.redirect(url.toString(),303);
}
const val=(f:FormData,k:string,max=2400)=>cleanText(f.get(k),max);
const num=(f:FormData,k:string)=>Number(f.get(k));

async function upload(form:FormData, entity:string, id:string){
  if(!env.BUCKET) throw new Error("Archivio immagini non disponibile");
  const file=form.get("file");
  if(!(file instanceof File)||!file.size) throw new Error("Seleziona un'immagine");
  if(!file.type.startsWith("image/")||file.size>8*1024*1024) throw new Error("Usa JPG, PNG o WEBP fino a 8 MB");
  const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,"").toLowerCase()||"jpg";
  const key=`${entity==="setting"?"site":entity+"s"}/${id}/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
  const db=getD1();
  if(entity==="setting"){
    const settingKey=`media_${id}`;
    const prev=await db.prepare("SELECT value FROM site_settings WHERE key=?").bind(settingKey).first<{value:string}>();
    await db.prepare("INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(settingKey,key).run();
    if(prev?.value && !prev.value.startsWith("/")) await env.BUCKET.delete(prev.value);
    return;
  }
  const table=entity==="player"?"players":entity==="staff"?"staff":entity==="article"?"articles":"sponsors";
  const column=entity==="sponsor"?"logo_key":entity==="article"?"image_key":"photo_key";
  const prev=await db.prepare(`SELECT ${column} AS oldKey FROM ${table} WHERE id=?`).bind(id).first<{oldKey:string|null}>();
  await db.prepare(`UPDATE ${table} SET ${column}=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(key,id).run();
  if(prev?.oldKey && !prev.oldKey.startsWith("/")) await env.BUCKET.delete(prev.oldKey);
}

export async function POST(request:Request){
  const auth=await requireAdminApi();
  if(auth.error) return auth.error;
  const form=await request.formData();
  const action=val(form,"_action",60)||val(form,"action",60);
  const section=val(form,"section",40)||"overview";
  const db=getD1();
  const isOwner=auth.admin?.role==="owner",canManageMagazine=hasPermission(auth.admin,"magazine_manage");
  if(!isOwner&&!action.startsWith("article.")) return go(request,section,false,"Permesso non disponibile");
  if(action.startsWith("article.")&&!canManageMagazine) return go(request,section,false,"Non hai il permesso di gestire il Magazine");
  try{
    if(action==="article.create"){
      const title=val(form,"title",180),description=val(form,"description",500),body=val(form,"body",12000),status=val(form,"status",20)==="published"?"published":"draft",id=uid("article");
      if(!title||!description||!body) throw new Error("Titolo, descrizione e testo sono obbligatori");
      await db.prepare("INSERT INTO articles (id,title,description,body,status,author_email,published_at) VALUES (?,?,?,?,?,?,?)").bind(id,title,description,body,status,auth.user!.email,status==="published"?new Date().toISOString():null).run();
      const file=form.get("file");if(file instanceof File&&file.size)await upload(form,"article",id);
      if(status==="published"){const row=await db.prepare("SELECT image_key AS imageKey FROM articles WHERE id=?").bind(id).first<{imageKey:string|null}>();if(!row?.imageKey)throw new Error("Per pubblicare devi aggiungere una foto")}
    } else if(action==="article.update"){
      const id=val(form,"id",100),title=val(form,"title",180),description=val(form,"description",500),body=val(form,"body",12000),status=val(form,"status",20)==="published"?"published":"draft";
      if(!id||!title||!description||!body) throw new Error("Compila tutti i campi dell'articolo");
      if(status==="published"){const row=await db.prepare("SELECT image_key AS imageKey FROM articles WHERE id=?").bind(id).first<{imageKey:string|null}>();if(!row?.imageKey)throw new Error("Per pubblicare devi aggiungere una foto")}
      await db.prepare("UPDATE articles SET title=?,description=?,body=?,status=?,published_at=CASE WHEN ?='published' THEN COALESCE(published_at,CURRENT_TIMESTAMP) ELSE NULL END,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(title,description,body,status,status,id).run();
    } else if(action==="article.delete"){
      const id=val(form,"id",100),row=await db.prepare("SELECT image_key AS imageKey FROM articles WHERE id=?").bind(id).first<{imageKey:string|null}>();await db.prepare("DELETE FROM articles WHERE id=?").bind(id).run();if(row?.imageKey&&!row.imageKey.startsWith("/"))await env.BUCKET?.delete(row.imageKey);
    } else if(action==="article.upload"){
      await upload(form,"article",val(form,"id",100));
    } else if(action==="access.create"){
      if(!isOwner)throw new Error("Solo l'owner può gestire gli accessi");const email=val(form,"email",180).toLowerCase(),name=val(form,"name",120),password=val(form,"password",120);if(!email||!name||password.length<6)throw new Error("Email, nome e password di almeno 6 caratteri sono obbligatori");
      const permissions=["magazine_view","magazine_share","magazine_manage"].filter(k=>form.get(k)).join(",");await db.prepare("INSERT INTO admins (email,name,role,permissions,password_hash) VALUES (?,?,'staff',?,?)").bind(email,name,permissions,await hashPassword(password)).run();
    } else if(action==="access.update"){
      if(!isOwner)throw new Error("Solo l'owner può gestire gli accessi");const email=val(form,"email",180).toLowerCase(),name=val(form,"name",120),password=val(form,"password",120),permissions=["magazine_view","magazine_share","magazine_manage"].filter(k=>form.get(k)).join(",");await db.prepare("UPDATE admins SET name=?,permissions=? WHERE email=? AND role='staff'").bind(name,permissions,email).run();if(password)await db.prepare("UPDATE admins SET password_hash=? WHERE email=? AND role='staff'").bind(await hashPassword(password),email).run();
    } else if(action==="access.delete"){
      if(!isOwner)throw new Error("Solo l'owner può gestire gli accessi");await db.prepare("DELETE FROM admins WHERE email=? AND role='staff'").bind(val(form,"email",180).toLowerCase()).run();
    } else if(action==="player.update"){
      const id=val(form,"id",100), name=val(form,"name",120), role=val(form,"role",100), group=val(form,"groupName",60);
      if(!id||!name||!role||!group) throw new Error("Compila nome, ruolo e reparto");
      await db.prepare("UPDATE players SET name=?,role=?,group_name=?,bio=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(name,role,group,val(form,"bio"),form.get("active")?1:0,id).run();
    } else if(action==="player.create"){
      const name=val(form,"name",120),role=val(form,"role",100),group=val(form,"groupName",60); if(!name||!role||!group) throw new Error("Dati giocatore incompleti");
      const used=await db.prepare("SELECT number FROM players ORDER BY number").all<{number:number}>(); const set=new Set(used.results.map(x=>x.number)); let number=1; while(set.has(number)&&number<100) number++;
      await db.prepare("INSERT INTO players (id,name,number,role,group_name,bio,active) VALUES (?,?,?,?,?,?,1)").bind(uid("player"),name,number,role,group,val(form,"bio")).run();
    } else if(action==="staff.create"){
      const name=val(form,"name",120),role=val(form,"role",120); if(!name||!role) throw new Error("Nome e ruolo obbligatori");
      await db.prepare("INSERT INTO staff (id,name,role,bio,active,sort_order) VALUES (?,?,?,?,1,?)").bind(uid("staff"),name,role,val(form,"bio"),num(form,"sortOrder")||0).run();
    } else if(action==="staff.update"){
      await db.prepare("UPDATE staff SET name=?,role=?,bio=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(val(form,"name",120),val(form,"role",120),val(form,"bio"),form.get("active")?1:0,num(form,"sortOrder")||0,val(form,"id",100)).run();
    } else if(action==="staff.delete"){
      await db.prepare("DELETE FROM staff WHERE id=?").bind(val(form,"id",100)).run();
    } else if(action==="event.create"){
      const title=val(form,"title",140),starts=val(form,"startsAt",40); if(!title||!starts) throw new Error("Titolo e data obbligatori");
      await db.prepare("INSERT INTO events (id,type,title,starts_at,location,opponent,notes,published) VALUES (?,?,?,?,?,?,?,?)").bind(uid("event"),val(form,"type",40)||"allenamento",title,starts,val(form,"location",140),val(form,"opponent",140),val(form,"notes"),form.get("published")?1:0).run();
    } else if(action==="event.update"){
      await db.prepare("UPDATE events SET type=?,title=?,starts_at=?,location=?,opponent=?,notes=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(val(form,"type",40),val(form,"title",140),val(form,"startsAt",40),val(form,"location",140),val(form,"opponent",140),val(form,"notes"),form.get("published")?1:0,val(form,"id",100)).run();
    } else if(action==="event.delete"){
      await db.prepare("DELETE FROM events WHERE id=?").bind(val(form,"id",100)).run();
    } else if(action==="match.update"){
      const hg=val(form,"homeGoals",10),ag=val(form,"awayGoals",10),status=val(form,"status",30);
      await db.prepare("UPDATE matches SET home_goals=?,away_goals=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(hg===""?null:Number(hg),ag===""?null:Number(ag),status,val(form,"id",100)).run();
    } else if(action==="vote.status"){
      await db.prepare("UPDATE votes SET status=? WHERE id=?").bind(val(form,"status",30),val(form,"id",100)).run();
    } else if(action==="vote.delete"){
      await db.prepare("DELETE FROM votes WHERE id=?").bind(val(form,"id",100)).run();
    } else if(action==="message.status"){
      await db.prepare("UPDATE fan_messages SET status=? WHERE id=?").bind(val(form,"status",30),val(form,"id",100)).run();
    } else if(action==="message.delete"){
      await db.prepare("DELETE FROM fan_messages WHERE id=?").bind(val(form,"id",100)).run();
    } else if(action==="settings.update"){
      const keys=["hero_title","hero_text","history_title","history_text","partner_text","instagram","facebook","whatsapp","history_intro_title","history_intro_p1","history_intro_p2","history_body_p1","history_body_p2","history_body_p3","manuel_title","manuel_intro","manuel_story_1","manuel_story_2","manuel_story_3","manuel_quote"];
      await db.batch(keys.map(k=>db.prepare("INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(k,val(form,k))));
    } else if(action==="sponsor.create"){
      const name=val(form,"name",120); if(!name) throw new Error("Nome sponsor obbligatorio");
      await db.prepare("INSERT INTO sponsors (id,name,website,active,sort_order) VALUES (?,?,?,1,?)").bind(uid("sponsor"),name,val(form,"website",300),num(form,"sortOrder")||0).run();
    } else if(action==="sponsor.update"){
      await db.prepare("UPDATE sponsors SET name=?,website=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(val(form,"name",120),val(form,"website",300),form.get("active")?1:0,num(form,"sortOrder")||0,val(form,"id",100)).run();
    } else if(action==="sponsor.delete"){
      await db.prepare("DELETE FROM sponsors WHERE id=?").bind(val(form,"id",100)).run();
    } else if(action.startsWith("upload.")){
      const entity=action.split(".")[1]; await upload(form,entity,val(form,"id",100));
    } else throw new Error("Azione non riconosciuta");
    return go(request,section,true,"Modifica salvata");
  }catch(e){ return go(request,section,false,e instanceof Error?e.message:"Operazione non riuscita"); }
}
