import { createAdminSessionCookie,verifyAdminCredentials } from "@/app/chatgpt-auth";
export const dynamic="force-dynamic";
export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as {email?:string;password?:string}|null;
  const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"",password=typeof body?.password==="string"?body.password:"";
  if(!email||!(await verifyAdminCredentials(email,password)))return Response.json({error:"Credenziali non corrette"},{status:401,headers:{"Cache-Control":"no-store"}});
  return Response.json({ok:true},{headers:{"Set-Cookie":await createAdminSessionCookie(email),"Cache-Control":"no-store"}});
}
