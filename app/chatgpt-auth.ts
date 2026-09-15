import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser = {
  displayName: string;
  email: string;
  fullName: string | null;
};

type AdminEnv = {
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
};

const COOKIE_NAME = "nac_admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const ADMIN_EMAIL = "admin@nacamatori.local";
const ADMIN_NAME = "Gianni Innocenti";

function adminEnv(): AdminEnv {
  return env as unknown as AdminEnv;
}
async function hmac(value:string) {
  const secret=adminEnv().ADMIN_SESSION_SECRET;
  if(!secret) throw new Error("ADMIN_SESSION_SECRET non configurato");
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders=await headers();
  const cookie=requestHeaders.get("cookie")||"";
  const token=cookie.split(/;\s*/).find(x=>x.startsWith(`${COOKIE_NAME}=`))?.split("=")[1];
  if(!token) return null;
  const [exp,sig]=decodeURIComponent(token).split(".");
  if(!exp||!sig||Number(exp)<Math.floor(Date.now()/1000)) return null;
  const expected=await hmac(exp);
  if(sig!==expected) return null;
  return {displayName:ADMIN_NAME,email:ADMIN_EMAIL,fullName:ADMIN_NAME};
}

export async function requireChatGPTUser(returnTo:string):Promise<ChatGPTUser>{
  const user=await getChatGPTUser();
  if(user) return user;
  redirect(`/admin/login?return_to=${encodeURIComponent(returnTo)}`);
}
export function chatGPTSignOutPath(_returnTo="/") {
  return "/admin/logout";
}

export async function verifyAdminPassword(password:string){
  const expected=adminEnv().ADMIN_PASSWORD||"";
  if(!expected) return false;
  if(password.length!==expected.length) return false;
  let diff=0; for(let i=0;i<password.length;i++) diff|=password.charCodeAt(i)^expected.charCodeAt(i);
  return diff===0;
}

export async function createAdminSessionCookie(){
  const exp=String(Math.floor(Date.now()/1000)+SESSION_SECONDS);
  const sig=await hmac(exp);
  return `${COOKIE_NAME}=${encodeURIComponent(`${exp}.${sig}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearAdminSessionCookie(){
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
