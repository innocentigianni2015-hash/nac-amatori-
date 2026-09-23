import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { calculateStandings,type MatchRow } from "@/lib/championship";

export type PlayerRow={id:string;name:string;number:number;role:string;groupName:string;bio:string;photoKey:string|null;active:number};
export type EventRow={id:string;type:string;title:string;startsAt:string;location:string;opponent:string;notes:string;published:number};
export type AttendanceRow={id:string;eventId:string;playerId:string;status:string;note:string};
export type VoteRow={id:string;playerNumber:number;rating:number;eventId:string|null;fanName:string;message:string;status:string;createdAt:string;playerName:string|null};
export type MessageRow={id:string;playerNumber:number|null;senderName:string;body:string;status:string;createdAt:string;playerName:string|null};
export type MatchDbRow=MatchRow;
export type SponsorRow={id:string;name:string;website:string;logoKey:string|null;active:number;sortOrder:number};
export type StaffRow={id:string;name:string;role:string;bio:string;photoKey:string|null;active:number;sortOrder:number};
export type AdminRow={email:string;name:string|null;role:string;permissions:string;createdAt:string};
export type ArticleRow={id:string;title:string;description:string;body:string;imageKey:string|null;introVideoKey:string|null;articleVideoKey:string|null;contentType:string;status:string;authorEmail:string;publishedAt:string|null;createdAt:string;updatedAt:string};

export function getD1():D1Database{if(!env.DB)throw new Error("Database NAC non disponibile");return env.DB}
export function uid(prefix:string){return `${prefix}_${crypto.randomUUID()}`}
export function cleanText(value:unknown,max=500){return typeof value==="string"?value.trim().slice(0,max):""}
export function mediaUrl(key:string|null){return key?`/api/media/${key.split("/").map(encodeURIComponent).join("/")}`:null}
export function hasPermission(admin:Pick<AdminRow,"role"|"permissions">|null|undefined,permission:string){if(!admin)return false;if(admin.role==="owner")return true;return admin.permissions.split(",").map(x=>x.trim()).includes(permission)}

export async function ensureFirstAdmin(email:string,name:string){
  const db=getD1(),count=await db.prepare("SELECT COUNT(*) AS total FROM admins").first<{total:number}>();
  if(Number(count?.total||0)===0)await db.prepare("INSERT OR IGNORE INTO admins (email,name,role,permissions) VALUES (?,?,'owner','*')").bind(email.toLowerCase(),name).run();
  return Boolean(await db.prepare("SELECT email FROM admins WHERE email=?").bind(email.toLowerCase()).first());
}
export async function getAdminAccess(email:string){return getD1().prepare("SELECT email,name,role,permissions,created_at AS createdAt FROM admins WHERE email=?").bind(email.toLowerCase()).first<AdminRow>()}
export async function requireAdminApi(){
  const user=await getChatGPTUser();if(!user)return{user:null,admin:null,error:Response.json({error:"Accesso richiesto"},{status:401})};
  const admin=await getAdminAccess(user.email);if(!admin)return{user,admin:null,error:Response.json({error:"Utente non autorizzato"},{status:403})};
  return{user,admin,error:null};
}

export async function getAdminSnapshot(currentEmail?:string){
  const db=getD1();
  const [players,staff,events,attendance,votes,messages,sponsors,settings,matches,articles,admins]=await Promise.all([
    db.prepare("SELECT id,name,number,role,group_name AS groupName,bio,photo_key AS photoKey,active FROM players ORDER BY active DESC,number ASC").all<PlayerRow>(),
    db.prepare("SELECT id,name,role,bio,photo_key AS photoKey,active,sort_order AS sortOrder FROM staff ORDER BY active DESC,sort_order ASC,name ASC").all<StaffRow>(),
    db.prepare("SELECT id,type,title,starts_at AS startsAt,location,opponent,notes,published FROM events ORDER BY starts_at DESC").all<EventRow>(),
    db.prepare("SELECT id,event_id AS eventId,player_id AS playerId,status,note FROM attendance").all<AttendanceRow>(),
    db.prepare("SELECT v.id,v.player_number AS playerNumber,v.rating,v.event_id AS eventId,v.fan_name AS fanName,v.message,v.status,v.created_at AS createdAt,p.name AS playerName FROM votes v LEFT JOIN players p ON p.number=v.player_number ORDER BY v.created_at DESC LIMIT 250").all<VoteRow>(),
    db.prepare("SELECT m.id,m.player_number AS playerNumber,m.sender_name AS senderName,m.body,m.status,m.created_at AS createdAt,p.name AS playerName FROM fan_messages m LEFT JOIN players p ON p.number=m.player_number ORDER BY m.created_at DESC LIMIT 250").all<MessageRow>(),
    db.prepare("SELECT id,name,website,logo_key AS logoKey,active,sort_order AS sortOrder FROM sponsors ORDER BY sort_order ASC,name ASC").all<SponsorRow>(),
    db.prepare("SELECT key,value FROM site_settings").all<{key:string;value:string}>(),
    db.prepare("SELECT id,round,phase,home,away,scheduled_at AS scheduledAt,source_date AS sourceDate,time,field,home_goals AS homeGoals,away_goals AS awayGoals,status,source_anomaly AS sourceAnomaly FROM matches ORDER BY scheduled_at ASC").all<MatchDbRow>(),
    db.prepare("SELECT id,title,description,body,image_key AS imageKey,intro_video_key AS introVideoKey,article_video_key AS articleVideoKey,content_type AS contentType,status,author_email AS authorEmail,published_at AS publishedAt,created_at AS createdAt,updated_at AS updatedAt FROM articles ORDER BY created_at DESC").all<ArticleRow>(),
    db.prepare("SELECT email,name,role,permissions,created_at AS createdAt FROM admins ORDER BY role DESC,name,email").all<AdminRow>(),
  ]);
  return{players:players.results,staff:staff.results,events:events.results,attendance:attendance.results,votes:votes.results,messages:messages.results,sponsors:sponsors.results,settings:Object.fromEntries(settings.results.map(x=>[x.key,x.value])),matches:matches.results,standings:calculateStandings(matches.results),articles:articles.results,admins:admins.results,currentAdmin:currentEmail?admins.results.find(x=>x.email===currentEmail.toLowerCase())||null:null};
}
export async function getPublicSnapshot(){
  const db=getD1(),[players,staff,events,sponsors,settings,matches]=await Promise.all([
    db.prepare("SELECT id,name,number,role,group_name AS groupName,bio,photo_key AS photoKey,active FROM players WHERE active=1 ORDER BY number ASC").all<PlayerRow>(),
    db.prepare("SELECT id,name,role,bio,photo_key AS photoKey,active,sort_order AS sortOrder FROM staff WHERE active=1 ORDER BY sort_order ASC,name ASC").all<StaffRow>(),
    db.prepare("SELECT id,type,title,starts_at AS startsAt,location,opponent,notes,published FROM events WHERE published=1 AND starts_at>=datetime('now','-1 day') ORDER BY starts_at ASC LIMIT 12").all<EventRow>(),
    db.prepare("SELECT id,name,website,logo_key AS logoKey,active,sort_order AS sortOrder FROM sponsors WHERE active=1 ORDER BY sort_order ASC,name ASC").all<SponsorRow>(),
    db.prepare("SELECT key,value FROM site_settings").all<{key:string;value:string}>(),
    db.prepare("SELECT id,round,phase,home,away,scheduled_at AS scheduledAt,source_date AS sourceDate,time,field,home_goals AS homeGoals,away_goals AS awayGoals,status,source_anomaly AS sourceAnomaly FROM matches ORDER BY scheduled_at ASC").all<MatchDbRow>(),
  ]);
  return{players:players.results,staff:staff.results,events:events.results,sponsors:sponsors.results,settings:Object.fromEntries(settings.results.map(x=>[x.key,x.value])),matches:matches.results,standings:calculateStandings(matches.results)};
}
export async function getPublishedArticles(){const r=await getD1().prepare("SELECT id,title,description,body,image_key AS imageKey,intro_video_key AS introVideoKey,article_video_key AS articleVideoKey,content_type AS contentType,status,author_email AS authorEmail,published_at AS publishedAt,created_at AS createdAt,updated_at AS updatedAt FROM articles WHERE status='published' ORDER BY COALESCE(published_at,created_at) DESC").all<ArticleRow>();return r.results}
export async function getPublishedArticle(id:string){return getD1().prepare("SELECT id,title,description,body,image_key AS imageKey,intro_video_key AS introVideoKey,article_video_key AS articleVideoKey,content_type AS contentType,status,author_email AS authorEmail,published_at AS publishedAt,created_at AS createdAt,updated_at AS updatedAt FROM articles WHERE id=? AND status='published'").bind(id).first<ArticleRow>()}
