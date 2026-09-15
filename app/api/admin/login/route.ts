import { createAdminSessionCookie, verifyAdminPassword } from "@/app/chatgpt-auth";

export const dynamic="force-dynamic";

export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as {password?:string}|null;
  const password=typeof body?.password==="string"?body.password:"";
  if(!(await verifyAdminPassword(password))){
    return Response.json({error:"Password non corretta"},{status:401,headers:{"Cache-Control":"no-store"}});
  }
  const cookie=await createAdminSessionCookie();
  return Response.json({ok:true},{headers:{"Set-Cookie":cookie,"Cache-Control":"no-store"}});
}
