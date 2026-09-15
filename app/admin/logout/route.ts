import { clearAdminSessionCookie } from "@/app/chatgpt-auth";

export async function GET(request:Request){
  return new Response(null,{status:302,headers:{Location:new URL("/",request.url).toString(),"Set-Cookie":clearAdminSessionCookie(),"Cache-Control":"no-store"}});
}
