import { cleanText, getAdminSnapshot, getD1, requireAdminApi, uid } from "@/lib/nac-data";

export const dynamic = "force-dynamic";

const groups=new Set(["Portieri","Difensori","Centrocampisti","Attaccanti"]);
const attendanceStates=new Set(["presente","assente","forse","da_confermare"]);
const moderationStates=new Set(["pending","approved","archived"]);
const matchStates=new Set(["scheduled","played","postponed"]);

async function response() {
  return Response.json(await getAdminSnapshot(),{headers:{"Cache-Control":"no-store"}});
}

export async function GET() {
  const auth=await requireAdminApi();
  if (auth.error) return auth.error;
  return response();
}

export async function POST(request:Request) {
  const auth=await requireAdminApi();
  if (auth.error) return auth.error;
  const body=await request.json().catch(()=>null) as {action?:string;payload?:Record<string,unknown>}|null;
  if (!body?.action) return Response.json({error:"Azione mancante"},{status:400});
  const p=body.payload || {};
  const db=getD1();

  try {
    switch(body.action) {
      case "player.seed": {
        const base=[
          [1,"Portiere","Portieri"],[13,"Portiere","Portieri"],
          [2,"Terzino destro","Difensori"],[3,"Terzino sinistro","Difensori"],[4,"Centrale · Capitano","Difensori"],[5,"Centrale","Difensori"],[12,"Centrale","Difensori"],[15,"Terzino","Difensori"],[22,"Centrale","Difensori"],
          [6,"Mediano","Centrocampisti"],[8,"Interno","Centrocampisti"],[10,"Trequartista","Centrocampisti"],[14,"Interno","Centrocampisti"],[16,"Mediano","Centrocampisti"],[20,"Esterno","Centrocampisti"],[21,"Interno","Centrocampisti"],
          [7,"Esterno","Attaccanti"],[9,"Punta centrale","Attaccanti"],[11,"Esterno","Attaccanti"],[17,"Attaccante","Attaccanti"],
        ] as const;
        await db.batch(base.map(([number,role,group])=>db.prepare("INSERT OR IGNORE INTO players (id, name, number, role, group_name, active) VALUES (?, 'Da annunciare', ?, ?, ?, 1)").bind(uid("player"),number,role,group)));
        break;
      }
      case "player.create": {
        const name=cleanText(p.name,100) || "Da annunciare";
        const number=Number(p.number);
        const role=cleanText(p.role,80);
        const groupName=cleanText(p.groupName,50);
        if (!Number.isInteger(number)||number<1||number>99||!role||!groups.has(groupName)) throw new Error("Dati giocatore non validi");
        await db.prepare("INSERT INTO players (id, name, number, role, group_name, bio, active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind(uid("player"),name,number,role,groupName,cleanText(p.bio,1200)).run();
        break;
      }
      case "player.update": {
        const id=cleanText(p.id,100), name=cleanText(p.name,100), role=cleanText(p.role,80), groupName=cleanText(p.groupName,50);
        const number=Number(p.number);
        if (!id||!name||!Number.isInteger(number)||number<1||number>99||!role||!groups.has(groupName)) throw new Error("Dati giocatore non validi");
        await db.prepare("UPDATE players SET name=?, number=?, role=?, group_name=?, bio=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(name,number,role,groupName,cleanText(p.bio,1200),id).run();
        break;
      }
      case "player.toggle": {
        await db.prepare("UPDATE players SET active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(p.active?1:0,cleanText(p.id,100)).run();
        break;
      }
      case "staff.create": {
        const name=cleanText(p.name,120), role=cleanText(p.role,120);
        if(!name||!role) throw new Error("Nome e ruolo sono obbligatori");
        await db.prepare("INSERT INTO staff (id, name, role, bio, active, sort_order) VALUES (?, ?, ?, ?, 1, ?)").bind(uid("staff"),name,role,cleanText(p.bio,1200),Number(p.sortOrder)||0).run();
        break;
      }
      case "staff.update": {
        const id=cleanText(p.id,100),name=cleanText(p.name,120),role=cleanText(p.role,120);
        if(!id||!name||!role) throw new Error("Dati staff non validi");
        await db.prepare("UPDATE staff SET name=?, role=?, bio=?, active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(name,role,cleanText(p.bio,1200),p.active===false?0:1,Number(p.sortOrder)||0,id).run();
        break;
      }
      case "staff.toggle": {
        await db.prepare("UPDATE staff SET active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(p.active?1:0,cleanText(p.id,100)).run();
        break;
      }
      case "staff.delete": {
        await db.prepare("DELETE FROM staff WHERE id=?").bind(cleanText(p.id,100)).run();
        break;
      }
      case "event.create": {
        const title=cleanText(p.title,140), startsAt=cleanText(p.startsAt,40), type=cleanText(p.type,40)||"allenamento";
        if (!title||!startsAt) throw new Error("Titolo e data sono obbligatori");
        await db.prepare("INSERT INTO events (id, type, title, starts_at, location, opponent, notes, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(uid("event"),type,title,startsAt,cleanText(p.location,140),cleanText(p.opponent,140),cleanText(p.notes,1200),p.published===false?0:1).run();
        break;
      }
      case "event.update": {
        const id=cleanText(p.id,100), title=cleanText(p.title,140), startsAt=cleanText(p.startsAt,40);
        if (!id||!title||!startsAt) throw new Error("Titolo e data sono obbligatori");
        await db.prepare("UPDATE events SET type=?, title=?, starts_at=?, location=?, opponent=?, notes=?, published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(cleanText(p.type,40)||"allenamento",title,startsAt,cleanText(p.location,140),cleanText(p.opponent,140),cleanText(p.notes,1200),p.published===false?0:1,id).run();
        break;
      }
      case "event.delete": {
        await db.prepare("DELETE FROM events WHERE id=?").bind(cleanText(p.id,100)).run();
        break;
      }
      case "attendance.set": {
        const eventId=cleanText(p.eventId,100), playerId=cleanText(p.playerId,100), status=cleanText(p.status,30);
        if (!eventId||!playerId||!attendanceStates.has(status)) throw new Error("Presenza non valida");
        await db.prepare("INSERT INTO attendance (id, event_id, player_id, status, note) VALUES (?, ?, ?, ?, ?) ON CONFLICT(event_id, player_id) DO UPDATE SET status=excluded.status, note=excluded.note, updated_at=CURRENT_TIMESTAMP").bind(uid("att"),eventId,playerId,status,cleanText(p.note,300)).run();
        break;
      }
      case "match.result": {
        const id=cleanText(p.id,100); const homeGoals=Number(p.homeGoals); const awayGoals=Number(p.awayGoals);
        if(!id||!Number.isInteger(homeGoals)||!Number.isInteger(awayGoals)||homeGoals<0||awayGoals<0) throw new Error("Risultato non valido");
        await db.prepare("UPDATE matches SET home_goals=?, away_goals=?, status='played', updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(homeGoals,awayGoals,id).run();
        break;
      }
      case "match.status": {
        const id=cleanText(p.id,100), status=cleanText(p.status,30); if(!id||!matchStates.has(status)) throw new Error("Stato partita non valido");
        await db.prepare("UPDATE matches SET status=?, home_goals=CASE WHEN ?='played' THEN home_goals ELSE NULL END, away_goals=CASE WHEN ?='played' THEN away_goals ELSE NULL END, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,status,status,id).run();
        break;
      }
      case "vote.status": {
        const status=cleanText(p.status,30); if(!moderationStates.has(status)) throw new Error("Stato non valido");
        await db.prepare("UPDATE votes SET status=? WHERE id=?").bind(status,cleanText(p.id,100)).run();
        break;
      }
      case "vote.delete": {
        await db.prepare("DELETE FROM votes WHERE id=?").bind(cleanText(p.id,100)).run();
        break;
      }
      case "message.status": {
        const status=cleanText(p.status,30); if(!moderationStates.has(status)) throw new Error("Stato non valido");
        await db.prepare("UPDATE fan_messages SET status=? WHERE id=?").bind(status,cleanText(p.id,100)).run();
        break;
      }
      case "message.delete": {
        await db.prepare("DELETE FROM fan_messages WHERE id=?").bind(cleanText(p.id,100)).run();
        break;
      }
      case "sponsor.create": {
        const name=cleanText(p.name,120); if(!name) throw new Error("Nome sponsor obbligatorio");
        await db.prepare("INSERT INTO sponsors (id, name, website, active, sort_order) VALUES (?, ?, ?, 1, ?)").bind(uid("sponsor"),name,cleanText(p.website,300),Number(p.sortOrder)||0).run();
        break;
      }
      case "sponsor.update": {
        const id=cleanText(p.id,100),name=cleanText(p.name,120); if(!id||!name) throw new Error("Sponsor non valido");
        await db.prepare("UPDATE sponsors SET name=?, website=?, active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(name,cleanText(p.website,300),p.active===false?0:1,Number(p.sortOrder)||0,id).run();
        break;
      }
      case "sponsor.delete": {
        await db.prepare("DELETE FROM sponsors WHERE id=?").bind(cleanText(p.id,100)).run();
        break;
      }
      case "settings.setMany": {
        const allowed=new Set(["hero_title","hero_text","history_title","history_text","partner_text","instagram","facebook","whatsapp",
          "history_intro_title","history_intro_p1","history_intro_p2","history_body_p1","history_body_p2","history_body_p3",
          "manuel_title","manuel_intro","manuel_story_1","manuel_story_2","manuel_story_3","manuel_quote"]);
        const raw=p.settings && typeof p.settings==="object" ? p.settings as Record<string,unknown> : {};
        const entries=Object.entries(raw).filter(([key])=>allowed.has(key));
        if(entries.length) await db.batch(entries.map(([key,value])=>db.prepare("INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP").bind(key,cleanText(value,2400))));
        break;
      }
      default: return Response.json({error:"Azione sconosciuta"},{status:400});
    }
    return response();
  } catch(error) {
    const message=error instanceof Error ? error.message : "Operazione non riuscita";
    return Response.json({error:message},{status:409});
  }
}
