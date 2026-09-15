"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Camera, Check, CircleHelp, ExternalLink, Inbox, LayoutDashboard, MessageSquareText, Save, ShieldCheck, Star, Trash2, UserRoundPlus, UsersRound, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Player={id:string;name:string;number:number;role:string;groupName:string;bio:string;photoKey:string|null;active:number};
type Event={id:string;type:string;title:string;startsAt:string;location:string;opponent:string;notes:string;published:number};
type Attendance={id:string;eventId:string;playerId:string;status:string;note:string};
type Vote={id:string;playerNumber:number;rating:number;eventId:string|null;fanName:string;message:string;status:string;createdAt:string;playerName:string|null};
type Message={id:string;playerNumber:number|null;senderName:string;body:string;status:string;createdAt:string;playerName:string|null};
type Sponsor={id:string;name:string;website:string;logoKey:string|null;active:number;sortOrder:number};
type Match={id:string;round:number;phase:string;home:string;away:string;scheduledAt:string;sourceDate:string;time:string;field:string;homeGoals:number|null;awayGoals:number|null;status:string;sourceAnomaly:number};
type Standing={team:string;played:number;wins:number;draws:number;losses:number;goalsFor:number;goalsAgainst:number;goalDifference:number;points:number};
type Snapshot={players:Player[];events:Event[];attendance:Attendance[];votes:Vote[];messages:Message[];sponsors:Sponsor[];settings:Record<string,string>;matches:Match[];standings:Standing[]};
const NAC_TEAM="NAC AMATORI CASTELLANA";

const groups=["Portieri","Difensori","Centrocampisti","Attaccanti"];
const media=(key:string|null)=>key?`/api/media/${key.split("/").map(encodeURIComponent).join("/")}`:"/nac-scudetto.png";
const localDate=(value:string)=>new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));

export default function AdminDashboard({initialData,userName,signOutPath}:{initialData:Snapshot;userName:string;signOutPath:string}) {
  const [data,setData]=useState(initialData);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [attendanceEvent,setAttendanceEvent]=useState(initialData.events.find(e=>e.type==="allenamento")?.id||"");

  const mutate=async(action:string,payload:Record<string,unknown>={})=>{
    setBusy(true);setNotice("");
    try{
      const res=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload})});
      const json=await res.json() as Snapshot&{error?:string};
      if(!res.ok) throw new Error(json.error||"Operazione non riuscita");
      setData(json);setNotice("Modifica salvata");
    }catch(error){setNotice(error instanceof Error?error.message:"Errore");}
    finally{setBusy(false)}
  };
  const refresh=async()=>{const res=await fetch("/api/admin",{cache:"no-store"});if(res.ok)setData(await res.json() as Snapshot)};
  const upload=async(entity:"player"|"sponsor",id:string,file:File)=>{
    setBusy(true);setNotice("");const form=new FormData();form.set("entity",entity);form.set("id",id);form.set("file",file);
    try{const res=await fetch("/api/admin/upload",{method:"POST",body:form});const json=await res.json() as {error?:string};if(!res.ok)throw new Error(json.error||"Caricamento non riuscito");await refresh();setNotice("Immagine caricata");}
    catch(error){setNotice(error instanceof Error?error.message:"Errore caricamento")}finally{setBusy(false)}
  };
  const pendingVotes=data.votes.filter(v=>v.status==="pending").length;
  const pendingMessages=data.messages.filter(m=>m.status==="pending").length;
  const nextEvent=[...data.events].filter(e=>new Date(e.startsAt)>=new Date()).sort((a,b)=>a.startsAt.localeCompare(b.startsAt))[0];

  return <main className="admin-shell">
    <aside className="admin-side"><a className="admin-mark" href="/"><img src="/nac-scudetto.png" alt="NAC"/><span>NAC<small>CONTROL ROOM</small></span></a><div className="admin-identity"><ShieldCheck/><div><b>{userName}</b><small>Amministratore</small></div></div><a className="admin-public" href="/" target="_blank">Apri sito pubblico <ExternalLink/></a><a className="admin-signout" href={signOutPath} target="_top">Esci dall’admin</a></aside>
    <section className="admin-workspace">
      <header className="admin-top"><div><small>STAGIONE 2026/27</small><h1>Gestione NAC</h1></div><div className={`admin-notice ${notice?"show":""}`}>{busy?"Salvataggio…":notice}</div></header>
      <Tabs defaultValue="overview" className="admin-tabs">
        <TabsList className="admin-tabs-list">
          <TabsTrigger value="overview"><LayoutDashboard/>Panoramica</TabsTrigger>
          <TabsTrigger value="players"><UsersRound/>Rosa</TabsTrigger>
          <TabsTrigger value="agenda"><CalendarDays/>Agenda</TabsTrigger>
          <TabsTrigger value="league"><LayoutDashboard/>Campionato</TabsTrigger>
          <TabsTrigger value="votes"><Star/>Voti {pendingVotes>0&&<i>{pendingVotes}</i>}</TabsTrigger>
          <TabsTrigger value="messages"><Inbox/>Messaggi {pendingMessages>0&&<i>{pendingMessages}</i>}</TabsTrigger>
          <TabsTrigger value="content"><MessageSquareText/>Contenuti</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="admin-panel">
          <SectionHead eyebrow="OGGI" title="Il colpo d’occhio" text="Tutto quello che serve alla squadra, in un’unica schermata."/>
          <div className="admin-kpis"><Kpi value={data.players.filter(p=>p.active).length} label="Giocatori attivi"/><Kpi value={data.events.length} label="Appuntamenti"/><Kpi value={pendingVotes} label="Voti da controllare"/><Kpi value={pendingMessages} label="Messaggi nuovi"/></div>
          <div className="admin-overview-grid"><article className="admin-feature"><small>PROSSIMO APPUNTAMENTO</small>{nextEvent?<><h3>{nextEvent.title}</h3><p>{localDate(nextEvent.startsAt)}<br/>{nextEvent.location}</p><button onClick={()=>setAttendanceEvent(nextEvent.id)}>Gestisci le presenze</button></>:<><h3>Agenda vuota</h3><p>Inserisci il prossimo allenamento o la prossima partita.</p></>}</article><article className="admin-feature cyan"><small>AZIONE RAPIDA</small><h3>Completa la rosa</h3><p>Importa la rosa predisposta e sostituisci “Da annunciare” con i nomi reali.</p><button onClick={()=>mutate("player.seed")}>Importa rosa base</button></article></div>
        </TabsContent>

        <TabsContent value="players" className="admin-panel">
          <SectionHead eyebrow="ROSA & FOTO" title="Tutti i giocatori" text="Crea e aggiorna le card che appariranno automaticamente nel sito."/>
          <NewPlayer players={data.players} onSave={payload=>mutate("player.create",payload)} onSeed={()=>mutate("player.seed")}/>
          <div className="admin-player-list">{data.players.map(player=><PlayerEditor key={player.id} player={player} busy={busy} onSave={payload=>mutate("player.update",payload)} onToggle={()=>mutate("player.toggle",{id:player.id,active:!player.active})} onUpload={file=>upload("player",player.id,file)}/>)}</div>
        </TabsContent>

        <TabsContent value="agenda" className="admin-panel">
          <SectionHead eyebrow="AGENDA & PRESENZE" title="Chi viene. Chi non viene." text="Programma allenamenti, amichevoli e partite; poi registra la disponibilità di ogni giocatore."/>
          <NewEvent onSave={payload=>mutate("event.create",payload)}/>
          <div className="agenda-layout"><div className="event-list">{data.events.map(event=><EventEditor key={event.id} event={event} busy={busy} onSave={payload=>mutate("event.update",payload)} onDelete={()=>mutate("event.delete",{id:event.id})} onAttendance={()=>setAttendanceEvent(event.id)}/>)}</div><AttendanceBoard data={data} eventId={attendanceEvent} onEvent={setAttendanceEvent} onSet={(payload)=>mutate("attendance.set",payload)}/></div>
        </TabsContent>

        <TabsContent value="league" className="admin-panel">
          <SectionHead eyebrow="RISULTATI & CLASSIFICA" title="Motore campionato" text="Inserisci il risultato una sola volta: calendario e classifica si aggiornano automaticamente."/>
          <LeagueAdmin matches={data.matches} standings={data.standings} busy={busy} onAction={mutate}/>
        </TabsContent>

        <TabsContent value="votes" className="admin-panel">
          <SectionHead eyebrow="MIGLIORE IN CAMPO" title="Voti dei tifosi" text="Approva, archivia o elimina i voti ricevuti dal box 04."/>
          <ModerationList items={data.votes} kind="vote" onAction={mutate}/>
        </TabsContent>

        <TabsContent value="messages" className="admin-panel">
          <SectionHead eyebrow="SPOGLIATOIO DIGITALE" title="Messaggi ai giocatori" text="Leggi e modera i messaggi lasciati dai tifosi alla squadra."/>
          <ModerationList items={data.messages} kind="message" onAction={mutate}/>
        </TabsContent>

        <TabsContent value="content" className="admin-panel">
          <SectionHead eyebrow="SITO & PARTNER" title="Contenuti pubblici" text="Aggiorna testi, collegamenti social e sponsor senza toccare il sito."/>
          <ContentEditor settings={data.settings} sponsors={data.sponsors} busy={busy} onSave={settings=>mutate("settings.setMany",{settings})} onSponsor={mutate} onUpload={upload}/>
        </TabsContent>
      </Tabs>
    </section>
  </main>;
}

function SectionHead({eyebrow,title,text}:{eyebrow:string;title:string;text:string}){return <div className="admin-section-head"><small>{eyebrow}</small><h2>{title}</h2><p>{text}</p></div>}
function Kpi({value,label}:{value:number|string;label:string}){return <article className="admin-kpi"><b>{value}</b><span>{label}</span></article>}

function LeagueAdmin({matches,standings,busy,onAction}:{matches:Match[];standings:Standing[];busy:boolean;onAction:(a:string,p:Record<string,unknown>)=>void}){
  const [onlyNac,setOnlyNac]=useState(true); const [phase,setPhase]=useState("all");
  const filtered=matches.filter(m=>(!onlyNac||m.home===NAC_TEAM||m.away===NAC_TEAM)&&(phase==="all"||m.phase===phase));
  return <div className="league-admin"><div className="league-admin-tools"><label><input type="checkbox" checked={onlyNac} onChange={e=>setOnlyNac(e.target.checked)}/> Solo NAC</label><select value={phase} onChange={e=>setPhase(e.target.value)}><option value="all">Andata + ritorno</option><option value="andata">Andata</option><option value="ritorno">Ritorno</option></select></div><div className="league-admin-grid"><div className="match-admin-list">{filtered.map(match=><MatchResultEditor key={`${match.id}-${match.status}-${match.homeGoals}-${match.awayGoals}`} match={match} busy={busy} onAction={onAction}/>)}</div><div className="admin-standings"><h3>Classifica automatica</h3><table><thead><tr><th>#</th><th>Squadra</th><th>PG</th><th>DR</th><th>PT</th></tr></thead><tbody>{standings.map((row,i)=><tr key={row.team} className={row.team===NAC_TEAM?"is-nac":""}><td>{i+1}</td><td>{row.team}</td><td>{row.played}</td><td>{row.goalDifference}</td><td><b>{row.points}</b></td></tr>)}</tbody></table><small className="admin-standings-note">Punti → DR → GF</small></div></div></div>
}
function MatchResultEditor({match,busy,onAction}:{match:Match;busy:boolean;onAction:(a:string,p:Record<string,unknown>)=>void}){
  const [homeGoals,setHomeGoals]=useState(match.homeGoals??""); const [awayGoals,setAwayGoals]=useState(match.awayGoals??"");
  return <article className={`match-admin ${match.home===NAC_TEAM||match.away===NAC_TEAM?"is-nac":""}`}><div className="match-admin-meta"><b>{match.phase} · {match.round}ª giornata</b><span>{new Date(match.scheduledAt).toLocaleDateString("it-IT")} · {match.time} · {match.field}</span></div><div className="match-admin-score"><strong>{match.home}</strong><input aria-label="Gol casa" type="number" min="0" value={homeGoals} onChange={e=>setHomeGoals(e.target.value===""?"":Number(e.target.value))}/><span>–</span><input aria-label="Gol ospite" type="number" min="0" value={awayGoals} onChange={e=>setAwayGoals(e.target.value===""?"":Number(e.target.value))}/><strong>{match.away}</strong></div><div className="row-actions"><button disabled={busy||homeGoals===""||awayGoals===""} onClick={()=>onAction("match.result",{id:match.id,homeGoals,awayGoals})}><Save/>Salva risultato</button>{match.status==="played"&&<button className="muted" onClick={()=>onAction("match.status",{id:match.id,status:"scheduled"})}>Annulla risultato</button>}<button className="muted" onClick={()=>onAction("match.status",{id:match.id,status:match.status==="postponed"?"scheduled":"postponed"})}>{match.status==="postponed"?"Ripristina":"Rinviata"}</button></div></article>
}

function NewPlayer({players,onSave,onSeed}:{players:Player[];onSave:(p:Record<string,unknown>)=>void;onSeed:()=>void}){
  const [open,setOpen]=useState(false);const [form,setForm]=useState({name:"",role:"",groupName:"Difensori",bio:""});
  const used=new Set(players.map(p=>p.number)); const internalNumber=Array.from({length:99},(_,i)=>i+1).find(n=>!used.has(n))||99;
  return <div className="admin-create"><div><button className="admin-primary" onClick={()=>setOpen(!open)}><UserRoundPlus/>Nuovo giocatore</button><button className="admin-ghost" onClick={onSeed}>Importa rosa base</button></div>{open&&<form onSubmit={e=>{e.preventDefault();onSave({...form,number:internalNumber});setOpen(false)}}><input required placeholder="Nome e cognome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required placeholder="Ruolo" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/><select value={form.groupName} onChange={e=>setForm({...form,groupName:e.target.value})}>{groups.map(g=><option key={g}>{g}</option>)}</select><button className="admin-primary" type="submit"><Save/>Crea card</button></form>}</div>
}

function PlayerEditor({player,busy,onSave,onToggle,onUpload}:{player:Player;busy:boolean;onSave:(p:Record<string,unknown>)=>void;onToggle:()=>void;onUpload:(file:File)=>void}){
  const [form,setForm]=useState(player);
  return <article className={`admin-player ${player.active?"":"inactive"}`}><div className="player-media"><img src={media(player.photoKey)} alt={player.name}/><label><Camera/>Foto<input type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&onUpload(e.target.files[0])}/></label></div><div className="player-fields"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><div><input value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/><select value={form.groupName} onChange={e=>setForm({...form,groupName:e.target.value})}>{groups.map(g=><option key={g}>{g}</option>)}</select></div><textarea placeholder="Bio del giocatore" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/><div className="row-actions"><button disabled={busy} onClick={()=>onSave(form)}><Save/>Salva</button><button className="muted" onClick={onToggle}>{player.active?"Nascondi":"Riattiva"}</button></div></div></article>
}

function NewEvent({onSave}:{onSave:(p:Record<string,unknown>)=>void}){
  const [form,setForm]=useState({type:"allenamento",title:"Allenamento",startsAt:"",location:"Castellana",opponent:"",notes:"",published:true});
  return <form className="event-create" onSubmit={e=>{e.preventDefault();onSave(form);setForm({...form,title:"Allenamento",startsAt:"",opponent:"",notes:""})}}><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="allenamento">Allenamento</option><option value="partita">Partita</option><option value="amichevole">Amichevole</option><option value="torneo">Torneo</option></select><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Titolo"/><input required type="datetime-local" value={form.startsAt} onChange={e=>setForm({...form,startsAt:e.target.value})}/><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Luogo"/><input value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} placeholder="Avversario"/><button className="admin-primary" type="submit"><CalendarDays/>Aggiungi</button></form>
}

function EventEditor({event,busy,onSave,onDelete,onAttendance}:{event:Event;busy:boolean;onSave:(p:Record<string,unknown>)=>void;onDelete:()=>void;onAttendance:()=>void}){
  const [form,setForm]=useState(event);
  return <article className="event-editor"><div className="event-date"><b>{new Date(event.startsAt).getDate()}</b><span>{new Date(event.startsAt).toLocaleDateString("it-IT",{month:"short"})}</span></div><div className="event-fields"><div><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="allenamento">Allenamento</option><option value="partita">Partita</option><option value="amichevole">Amichevole</option><option value="torneo">Torneo</option></select><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><input type="datetime-local" value={form.startsAt.slice(0,16)} onChange={e=>setForm({...form,startsAt:e.target.value})}/><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Luogo"/><input value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} placeholder="Avversario"/><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Note"/><div className="row-actions"><button disabled={busy} onClick={()=>onSave(form)}><Save/>Salva</button><button onClick={onAttendance}><UsersRound/>Presenze</button><button className="danger" onClick={onDelete}><Trash2/></button></div></div></article>
}

function AttendanceBoard({data,eventId,onEvent,onSet}:{data:Snapshot;eventId:string;onEvent:(id:string)=>void;onSet:(p:Record<string,unknown>)=>void}){
  const selected=data.events.find(e=>e.id===eventId);const active=data.players.filter(p=>p.active);
  const counts=useMemo(()=>active.reduce((acc,p)=>{const s=data.attendance.find(a=>a.eventId===eventId&&a.playerId===p.id)?.status||"da_confermare";acc[s]=(acc[s]||0)+1;return acc},{} as Record<string,number>),[active,data.attendance,eventId]);
  return <aside className="attendance-board"><small>PRESENZE</small><select value={eventId} onChange={e=>onEvent(e.target.value)}><option value="">Scegli appuntamento</option>{data.events.map(e=><option key={e.id} value={e.id}>{e.title} · {localDate(e.startsAt)}</option>)}</select>{selected&&<><h3>{selected.title}</h3><div className="attendance-counts"><span><Check/>{counts.presente||0}</span><span><X/>{counts.assente||0}</span><span><CircleHelp/>{counts.forse||0}</span></div><div className="attendance-list">{active.map(player=>{const current=data.attendance.find(a=>a.eventId===eventId&&a.playerId===player.id)?.status||"da_confermare";return <div key={player.id}><b>{player.name}</b><div>{[["presente",<Check key="c"/>],["assente",<X key="x"/>],["forse",<CircleHelp key="h"/>]].map(([status,icon])=><button key={status as string} className={current===status?String(status):""} title={String(status)} onClick={()=>onSet({eventId,playerId:player.id,status})}>{icon}</button>)}</div></div>})}</div></>}</aside>
}

function ModerationList({items,kind,onAction}:{items:(Vote|Message)[];kind:"vote"|"message";onAction:(a:string,p:Record<string,unknown>)=>void}){
  if(!items.length)return <div className="admin-empty"><Inbox/><h3>Nessun elemento</h3><p>Quando arriveranno nuovi contenuti li troverai qui.</p></div>;
  return <div className="moderation-list">{items.map(item=><article key={item.id} className={`moderation ${item.status}`}><div><small>{new Date(item.createdAt).toLocaleString("it-IT")}</small><h3>{item.playerName||"Da annunciare"}</h3><p><b>{"fanName" in item?item.fanName:item.senderName}</b> — {"message" in item?item.message:item.body}</p>{"rating" in item&&<div className="vote-stars">{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</div>}</div><div className="moderation-actions"><span>{item.status}</span><button onClick={()=>onAction(`${kind}.status`,{id:item.id,status:"approved"})}><Check/></button><button onClick={()=>onAction(`${kind}.status`,{id:item.id,status:"archived"})}><Inbox/></button><button className="danger" onClick={()=>onAction(`${kind}.delete`,{id:item.id})}><Trash2/></button></div></article>)}</div>
}

function ContentEditor({settings,sponsors,busy,onSave,onSponsor,onUpload}:{settings:Record<string,string>;sponsors:Sponsor[];busy:boolean;onSave:(s:Record<string,string>)=>void;onSponsor:(a:string,p:Record<string,unknown>)=>void;onUpload:(e:"player"|"sponsor",id:string,f:File)=>void}){
  const [form,setForm]=useState({hero_title:settings.hero_title||"La squadra.|La città.|La nostra voce.",hero_text:settings.hero_text||"Passione, unione e rispetto. In campo ogni venerdì. Insieme, sempre.",history_title:settings.history_title||"Amatori,|ma sul serio.",history_text:settings.history_text||"NAC Amatori Castellana nasce dall'amicizia e dal desiderio di rappresentare chi vive il calcio con il sorriso, ma senza mai fare un passo indietro.",partner_text:settings.partner_text||"Le aziende e gli amici che scelgono di sostenere NAC condividono la nostra idea di sport e territorio.",instagram:settings.instagram||"",facebook:settings.facebook||"",whatsapp:settings.whatsapp||""});
  const [newSponsor,setNewSponsor]=useState({name:"",website:"",sortOrder:0});
  return <div className="content-layout"><form className="content-form" onSubmit={e=>{e.preventDefault();onSave(form)}}><label>Titolo principale <small>Usa | per andare a capo</small><input value={form.hero_title} onChange={e=>setForm({...form,hero_title:e.target.value})}/></label><label>Testo principale<textarea value={form.hero_text} onChange={e=>setForm({...form,hero_text:e.target.value})}/></label><label>Titolo storia<input value={form.history_title} onChange={e=>setForm({...form,history_title:e.target.value})}/></label><label>Testo storia<textarea value={form.history_text} onChange={e=>setForm({...form,history_text:e.target.value})}/></label><label>Testo partner<textarea value={form.partner_text} onChange={e=>setForm({...form,partner_text:e.target.value})}/></label><div className="social-fields"><input placeholder="Instagram URL" value={form.instagram} onChange={e=>setForm({...form,instagram:e.target.value})}/><input placeholder="Facebook URL" value={form.facebook} onChange={e=>setForm({...form,facebook:e.target.value})}/><input placeholder="WhatsApp URL" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/></div><button disabled={busy} className="admin-primary" type="submit"><Save/>Salva contenuti</button></form><section className="sponsor-admin"><h3>Sponsor</h3><form onSubmit={e=>{e.preventDefault();onSponsor("sponsor.create",newSponsor);setNewSponsor({name:"",website:"",sortOrder:0})}}><input required placeholder="Nome sponsor" value={newSponsor.name} onChange={e=>setNewSponsor({...newSponsor,name:e.target.value})}/><input placeholder="Sito web" value={newSponsor.website} onChange={e=>setNewSponsor({...newSponsor,website:e.target.value})}/><button className="admin-primary">Aggiungi</button></form>{sponsors.map(s=><SponsorEditor key={s.id} sponsor={s} onSave={p=>onSponsor("sponsor.update",p)} onDelete={()=>onSponsor("sponsor.delete",{id:s.id})} onUpload={f=>onUpload("sponsor",s.id,f)}/>)}</section></div>
}

function SponsorEditor({sponsor,onSave,onDelete,onUpload}:{sponsor:Sponsor;onSave:(p:Record<string,unknown>)=>void;onDelete:()=>void;onUpload:(f:File)=>void}){const [form,setForm]=useState(sponsor);return <article className="sponsor-row"><img src={media(sponsor.logoKey)} alt=""/><div><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="Sito web"/></div><label><Camera/><input type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&onUpload(e.target.files[0])}/></label><button onClick={()=>onSave(form)}><Save/></button><button className="danger" onClick={onDelete}><Trash2/></button></article>}
