import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export async function GET(_request:Request, context:{params:Promise<{key:string[]}>}) {
  const {key}=await context.params;
  const objectKey=key.join("/");
  if (!env.BUCKET || !objectKey) return new Response("Not found",{status:404});
  const object=await env.BUCKET.get(objectKey);
  if (!object) return new Response("Not found",{status:404});
  const headers=new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag",object.httpEtag);
  headers.set("Cache-Control","public, max-age=86400");
  return new Response(object.body,{headers});
}
