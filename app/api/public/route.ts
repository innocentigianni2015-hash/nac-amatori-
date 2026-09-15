import { getPublicSnapshot, mediaUrl } from "@/lib/nac-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data=await getPublicSnapshot();
  return Response.json({
    ...data,
    players:data.players.map(p=>({...p,photoUrl:mediaUrl(p.photoKey)})),
    sponsors:data.sponsors.map(s=>({...s,logoUrl:mediaUrl(s.logoKey)})),
  },{headers:{"Cache-Control":"no-store"}});
}
