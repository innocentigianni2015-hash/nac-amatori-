import { resetOwnerPassword } from "@/app/chatgpt-auth";
export const dynamic="force-dynamic";
export async function POST(request:Request){
  const body=await request.json().catch(()=>null) as {email?:string;recoveryCode?:string;newPassword?:string}|null;
  const email=typeof body?.email==="string"?body.email:"",recoveryCode=typeof body?.recoveryCode==="string"?body.recoveryCode:"",newPassword=typeof body?.newPassword==="string"?body.newPassword:"";
  if(newPassword.length<10)return Response.json({error:"La nuova password deve avere almeno 10 caratteri"},{status:400,headers:{"Cache-Control":"no-store"}});
  if(!(await resetOwnerPassword(email,recoveryCode,newPassword)))return Response.json({error:"Dati di recupero non validi"},{status:401,headers:{"Cache-Control":"no-store"}});
  return Response.json({ok:true},{headers:{"Cache-Control":"no-store"}});
}
