import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser={displayName:string;email:string;fullName:string|null};
type AdminEnv={ADMIN_PASSWORD?:string;ADMIN_SESSION_SECRET?:string;DB?:D1Database};
const COOKIE_NAME="nac_admin_session",SESSION_SECONDS=60*60*24*7,OWNER_EMAIL="admin@nacamatori.local";

function adminEnv(){return env as unknown as AdminEnv}
async function hmac(value:string){const secret=adminEnv().ADMIN_SESSION_SECRET;if(!secret)throw new Error("ADMIN_SESSION_SECRET non configurato");const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));return Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("")}
export async function hashPassword(value:string){const data=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(data)).map(b=>b.toString(16).padStart(2,"0")).join("")}
function equal(a:string,b:string){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}

export async function verifyAdminCredentials(email:string,password:string){
  const clean=email.trim().toLowerCase();
  if(clean===OWNER_EMAIL){const expected=adminEnv().ADMIN_PASSWORD||"";if(!equal(password,expected))return false;if(adminEnv().DB)await adminEnv().DB!.prepare("INSERT OR IGNORE INTO admins (email,name,role,permissions) VALUES (?,?, 'owner','*')").bind(OWNER_EMAIL,"Gianni Innocenti").run();return true}
  if(!adminEnv().DB)return false;
  const row=await adminEnv().DB!.prepare("SELECT password_hash AS passwordHash FROM admins WHERE email=? AND role='staff'").bind(clean).first<{passwordHash:string|null}>();
  return Boolean(row?.passwordHash)&&equal(await hashPassword(password),row!.passwordHash!);
}
export async function getChatGPTUser():Promise<ChatGPTUser|null>{
  const h=await headers(),cookie=h.get("cookie")||"",token=cookie.split(/;\s*/).find(x=>x.startsWith(`${COOKIE_NAME}=`))?.split("=")[1];if(!token)return null;
  const [encoded,exp,sig]=decodeURIComponent(token).split(".");if(!encoded||!exp||!sig||Number(exp)<Math.floor(Date.now()/1000))return null;
  if(!equal(sig,await hmac(`${encoded}.${exp}`)))return null;
  const email=decodeURIComponent(escape(atob(encoded))).toLowerCase();if(!adminEnv().DB)return null;
  const row=await adminEnv().DB!.prepare("SELECT name FROM admins WHERE email=?").bind(email).first<{name:string|null}>();if(!row)return null;
  const displayName=row.name||email;return{displayName,email,fullName:displayName};
}
export async function requireChatGPTUser(returnTo:string){const user=await getChatGPTUser();if(user)return user;redirect(`/admin/login?return_to=${encodeURIComponent(returnTo)}`)}
export function chatGPTSignOutPath(_returnTo="/"){return"/admin/logout"}
export async function createAdminSessionCookie(email:string){const clean=email.trim().toLowerCase(),encoded=btoa(unescape(encodeURIComponent(clean))),exp=String(Math.floor(Date.now()/1000)+SESSION_SECONDS),sig=await hmac(`${encoded}.${exp}`);return `${COOKIE_NAME}=${encodeURIComponent(`${encoded}.${exp}.${sig}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`}
export function clearAdminSessionCookie(){return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`}
