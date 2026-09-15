import { cleanText, getD1, uid } from "@/lib/nac-data";

export async function POST(request:Request) {
  const body=await request.json().catch(()=>null) as Record<string,unknown>|null;
  if (!body || cleanText(body.website,100)) return Response.json({ok:true});
  const playerNumber=Number(body.playerNumber);
  const rating=Number(body.rating);
  const fanName=cleanText(body.fanName,80) || "Tifoso NAC";
  const message=cleanText(body.message,1200);
  if (!Number.isInteger(playerNumber) || playerNumber<1 || playerNumber>99 || !Number.isInteger(rating) || rating<1 || rating>5) {
    return Response.json({error:"Giocatore o voto non valido"},{status:400});
  }
  const db=getD1();
  const statements=[db.prepare("INSERT INTO votes (id, player_number, rating, fan_name, message, status) VALUES (?, ?, ?, ?, ?, 'pending')").bind(uid("vote"),playerNumber,rating,fanName,message)];
  if (message) statements.push(db.prepare("INSERT INTO fan_messages (id, player_number, sender_name, body, status) VALUES (?, ?, ?, ?, 'pending')").bind(uid("msg"),playerNumber,fanName,message));
  await db.batch(statements);
  return Response.json({ok:true,message:"Voto inviato alla NAC"},{status:201});
}
