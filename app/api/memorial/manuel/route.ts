import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

async function ensureRow() {
  await env.DB.prepare(
    "INSERT OR IGNORE INTO memorial_hearts (id, count, updated_at) VALUES ('manuel', 0, CURRENT_TIMESTAMP)"
  ).run();
}

export async function GET() {
  await ensureRow();
  const row = await env.DB.prepare(
    "SELECT count FROM memorial_hearts WHERE id = 'manuel'"
  ).first<{ count: number }>();

  return Response.json(
    { count: Number(row?.count ?? 0) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST() {
  await ensureRow();
  const row = await env.DB.prepare(
    "UPDATE memorial_hearts SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 'manuel' RETURNING count"
  ).first<{ count: number }>();

  return Response.json(
    { count: Number(row?.count ?? 0) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
