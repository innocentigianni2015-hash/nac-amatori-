"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Player={id:string;name:string;number:number;role:string;groupName:string;bio:string;photoUrl:string|null};
type NacEvent={id:string;type:string;title:string;startsAt:string;location:string;opponent:string;notes:string};
type Sponsor={id:string;name:string;website:string;logoUrl:string|null};
type Match={id:string;round:number;phase:string;home:string;away:string;scheduledAt:string;sourceDate:string;time:string;field:string;homeGoals:number|null;awayGoals:number|null;status:string;sourceAnomaly:number};
type Standing={team:string;played:number;wins:number;draws:number;losses:number;goalsFor:number;goalsAgainst:number;goalDifference:number;points:number};
type PublicData={players:Player[];events:NacEvent[];sponsors:Sponsor[];settings:Record<string,string>;matches:Match[];standings:Standing[]};
const NAC_TEAM="NAC AMATORI CASTELLANA";

const fallback=[
  {group:"Portieri",slots:[[1,"Portiere"],[13,"Portiere"]]},
  {group:"Difensori",slots:[[2,"Terzino destro"],[3,"Terzino sinistro"],[4,"Centrale · Capitano"],[5,"Centrale"],[12,"Centrale"],[15,"Terzino"],[22,"Centrale"]]},
  {group:"Centrocampisti",slots:[[6,"Mediano"],[8,"Interno"],[10,"Trequartista"],[14,"Interno"],[16,"Mediano"],[20,"Esterno"],[21,"Interno"]]},
  {group:"Attaccanti",slots:[[7,"Esterno"],[9,"Punta centrale"],[11,"Esterno"],[17,"Attaccante"]]},
];
const groupOrder=["Portieri","Difensori","Centrocampisti","Attaccanti"];

export default function Home(){
  const [data,setData]=useState<PublicData|null>(null);
  const [rating,setRating]=useState(0);
  const [player,setPlayer]=useState("");
  const [fanName,setFanName]=useState("");
  const [comment,setComment]=useState("");
  const [sending,setSending]=useState(false);
  const [feedback,setFeedback]=useState("");
  const [calendarView,setCalendarView]=useState<"nac"|"all"|"table">("nac");

  useEffect(()=>{fetch("/api/public",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>x&&setData(x)).catch(()=>undefined)},[]);
  const groups=useMemo(()=>{
    if(data?.players.length) return groupOrder.map(group=>({group,players:data.players.filter(p=>p.groupName===group)})).filter(x=>x.players.length);
    return fallback.map(area=>({group:area.group,players:area.slots.map(([number,role])=>({id:`slot-${number}`,name:"Da annunciare",number:number as number,role:role as string,groupName:area.group,bio:"",photoUrl:null}))}));
  },[data]);
  const settings=data?.settings||{};
  const nextEvent=data?.events?.[0]||{id:"fallback",type:"allenamento",title:"Allenamento",startsAt:"2026-08-29T16:00:00",location:"Castellana",opponent:"",notes:"½ campetto"};
  const when=new Date(nextEvent.startsAt);
  const leagueMatches=data?.matches||[];
  const nacMatches=leagueMatches.filter(m=>m.home===NAC_TEAM||m.away===NAC_TEAM);
  const now=Date.now();
  const nextNac=nacMatches.find(m=>m.status!=="played"&&new Date(m.scheduledAt).getTime()>=now);
  const lastNac=[...nacMatches].filter(m=>m.status==="played").sort((a,b)=>b.scheduledAt.localeCompare(a.scheduledAt))[0];
  const heroLines=(settings.hero_title||"La squadra.|La città.|La nostra voce.").split("|");
  const historyLines=(settings.history_title||"Amatori,|ma sul serio.").split("|");

  const submitVote=async(e:FormEvent)=>{
    e.preventDefault();if(!player||!rating)return;setSending(true);setFeedback("");
    try{const res=await fetch("/api/community",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({playerNumber:Number(player),rating,fanName,message:comment,website:""})});const json=await res.json() as {error?:string;message?:string};if(!res.ok)throw new Error(json.error||"Invio non riuscito");setFeedback(json.message||"Voto inviato");setRating(0);setPlayer("");setFanName("");setComment("");}
    catch(error){setFeedback(error instanceof Error?error.message:"Errore nell’invio")}finally{setSending(false)}
  };

  return <main>
    <section className="hero"><nav><a className="brand" href="#top"><img src="/nac-scudetto.png" alt="Scudetto NAC"/><span>NAC<br/><i>AMATORI</i></span></a><div className="links"><a href="/la-storia">STORIA</a><a href="/squadra">SQUADRA</a><a href="/dirigenti-staff">STAFF</a><a href="/calendario">CALENDARIO</a><a href="/classifica">CLASSIFICA</a><a href="/sponsor-amici">SPONSOR</a><a href="/tifosi-amici">TIFOSI</a></div></nav><div className="intro" id="top"><small>MSP ITALIA · OPEN A 11 · GIRONE 2</small><h1>{heroLines.map((line,index)=><span key={line}>{index===1?<em>{line}</em>:line}{index<heroLines.length-1&&<br/>}</span>)}</h1><p>{settings.hero_text||"Passione, unione e rispetto. In campo ogni venerdì. Insieme, sempre."}</p><a className="button white" href="/squadra">VEDI LA ROSA →</a></div><div className="stripes"/></section>
    <div className="ticker">PASSIONE　✦　 UNITÀ　✦　 RISPETTO　✦　 CASTELLANA</div>
    <section style={{background:"#06233e",color:"white",padding:"76px 28px"}}><div style={{maxWidth:1100,margin:"auto",display:"grid",gridTemplateColumns:"1fr auto",gap:32,alignItems:"end"}}><div><small style={{fontFamily:"DM Mono",letterSpacing:".15em",color:"#77c9f2"}}>NAC / MANIFESTO</small><h2 style={{marginBottom:0}}>Non siamo qui<br/><em>per partecipare.</em></h2></div><p style={{maxWidth:350,lineHeight:1.75,color:"#c8eaf9"}}>Ogni venerdì portiamo in campo Castellana: amicizia, carattere e quella voglia precisa di non mollare mai.</p></div></section>

    <section className="section two" id="storia"><div><small>01 — LA NOSTRA STORIA</small><h2>{historyLines.map((line,index)=><span key={line}>{index===1?<em>{line}</em>:line}{index<historyLines.length-1&&<br/>}</span>)}</h2></div><div><p>{settings.history_text||"La N.A.C. Amatori Castellana nasce nell'aprile 2011 da un gruppo di giocatori e dirigenti deciso a dare vita a una nuova realtà di calcio amatoriale."}</p><div className="stats"><b>2011<i>anno di nascita</i></b><b>11<i>uomini in campo</i></b><b>1<i>solo gruppo</i></b></div><p style={{marginTop:28}}><a className="button" href="/la-storia">SCOPRI TUTTA LA STORIA →</a></p></div></section>

    <section className="section roster" id="squadra"><small>02 — ROSA 2026/27</small><h2>Le maglie<br/><em>hanno un volto.</em></h2><p>La rosa NAC, organizzata per ruolo. Foto e profili vengono aggiornati direttamente dalla società.</p>{groups.map(area=><div className="role" key={area.group}><div className="roleHead"><h3>{area.group}</h3><span>{area.players.length} giocatori</span></div><div className="cards">{area.players.map(slot=><article className={`playerCard ${slot.photoUrl?"has-photo":""}`} key={slot.id}>{slot.photoUrl&&<img className="playerPhoto" src={slot.photoUrl} alt={slot.name}/>}<div><strong>{slot.name}</strong><span>{slot.role}</span>{slot.bio&&<p>{slot.bio}</p>}</div></article>)}</div></div>)}</section>

    <section className="matches" id="partite"><div className="section league-section"><small>03 — CAMPIONATO 2026/27</small><div className="league-head"><div><h2>Calendario<br/><em>e classifica.</em></h2><p>Girone Eliminatorio 2 · MSP Mantova. I risultati aggiornano automaticamente la classifica.</p></div>{nextNac&&<article className="next-match-card"><small>PROSSIMA NAC</small><b>{nextNac.home}<span>vs</span>{nextNac.away}</b><p>{new Date(nextNac.scheduledAt).toLocaleDateString("it-IT",{weekday:"short",day:"2-digit",month:"short"})} · {nextNac.time}<br/>{nextNac.field}</p></article>}</div><div className="league-tabs"><button className={calendarView==="nac"?"active":""} onClick={()=>setCalendarView("nac")}>SOLO NAC</button><button className={calendarView==="all"?"active":""} onClick={()=>setCalendarView("all")}>TUTTO IL GIRONE</button><button className={calendarView==="table"?"active":""} onClick={()=>setCalendarView("table")}>CLASSIFICA</button></div>{calendarView!=="table"?<div className="fixture-list">{(calendarView==="nac"?nacMatches:leagueMatches).map(match=><article key={match.id} className={`fixture ${match.home===NAC_TEAM||match.away===NAC_TEAM?"is-nac":""}`}><div className="fixture-meta"><b>{match.phase.toUpperCase()} · {match.round}ª</b><span>{new Date(match.scheduledAt).toLocaleDateString("it-IT",{day:"2-digit",month:"short",year:"2-digit"})} · {match.time}</span></div><div className="fixture-teams"><strong>{match.home}</strong><b>{match.status==="played"?`${match.homeGoals} – ${match.awayGoals}`:"VS"}</b><strong>{match.away}</strong></div><small>{match.field}</small></article>)}</div>:<div className="standings-wrap"><table className="standings"><thead><tr><th>#</th><th>Squadra</th><th>PG</th><th>V</th><th>N</th><th>P</th><th>GF</th><th>GS</th><th>DR</th><th>PT</th></tr></thead><tbody>{(data?.standings||[]).map((row,index)=><tr key={row.team} className={row.team===NAC_TEAM?"is-nac":""}><td>{index+1}</td><td>{row.team}</td><td>{row.played}</td><td>{row.wins}</td><td>{row.draws}</td><td>{row.losses}</td><td>{row.goalsFor}</td><td>{row.goalsAgainst}</td><td>{row.goalDifference}</td><td><b>{row.points}</b></td></tr>)}</tbody></table><p className="standings-note">Ordinamento automatico: punti, differenza reti, gol fatti.</p></div>}{lastNac&&<p className="last-result">Ultimo risultato NAC: <b>{lastNac.home} {lastNac.homeGoals} – {lastNac.awayGoals} {lastNac.away}</b></p>}</div></section>

    <section className="section community" id="tifosi"><div><small>04 — TIFOSI & AMICI</small><h2>Eleggi il migliore<br/><em>della giornata.</em></h2><p>Scegli un giocatore NAC, assegna il tuo voto e lascia un messaggio personale. Tutto arriva direttamente alla società.</p></div><form onSubmit={submitVote}><label htmlFor="player-vote">Il tuo migliore NAC</label><select id="player-vote" required value={player} onChange={e=>setPlayer(e.target.value)}><option value="">Scegli il giocatore</option>{groups.flatMap(area=>area.players).map(slot=><option key={slot.id} value={slot.number}>{slot.name} · {slot.role}</option>)}</select><label htmlFor="fan-name">Il tuo nome</label><input id="fan-name" value={fanName} onChange={e=>setFanName(e.target.value)} placeholder="Come vuoi firmarti"/><label>La sua prestazione</label><div className="stars" aria-label={`Valutazione ${rating} su 5`}>{[1,2,3,4,5].map(n=><button type="button" aria-label={`${n} stelle`} key={n} onClick={()=>setRating(n)}>{n<=rating?'★':'☆'}</button>)}</div><label htmlFor="fan-comment">Messaggio per il giocatore</label><textarea id="fan-comment" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Raccontaci la partita o lascia un messaggio…"/><button className="button" type="submit" disabled={!player||!rating||sending}>{sending?"INVIO…":"INVIA VOTO E MESSAGGIO →"}</button>{feedback&&<p className="voteFeedback" role="status">{feedback}</p>}</form></section>

    <section className="editorialEvents" aria-labelledby="agenda-title"><div className="section"><small>05 — PROSSIMI APPUNTAMENTI</small><h2 id="agenda-title">La stagione<br/><em>comincia adesso.</em></h2><div className="eventGrid"><article className="eventPoster"><img src="/preparazione-nac.jpeg" alt="Programma preparazione NAC stagione 2026-2027"/><div className="eventCopy"><small>29 AGO — 19 SET</small><h3>Preparazione 2026/27</h3><p>Allenamenti, amichevoli e prima giornata di campionato.</p></div></article><article className="eventPoster"><img src="/memorial-ferri.jpeg" alt="Locandina del Memorial Marco e Stefano Ferri"/><div className="eventCopy"><small>08 — 12 SET · BARCHI DI ASOLA</small><h3>Memorial Ferri</h3><p>Quadrangolare di calcio a 11.</p></div></article></div></div></section>

    <section className="partners" id="sponsor"><div className="section"><small>06 — PARTNER</small><h2>Con noi,<br/><em>fuori dal campo.</em></h2><p>{settings.partner_text||"Le aziende e gli amici che scelgono di sostenere NAC condividono la nostra idea di sport e territorio."}</p><div className="logos">{data?.sponsors.length?data.sponsors.map(s=><a key={s.id} href={s.website||"#"} target={s.website?"_blank":undefined}>{s.logoUrl&&<img src={s.logoUrl} alt=""/>}<b>{s.name}</b></a>):<>FAR-PET　　IL TUO LOGO　　DIVENTA PARTNER</>}</div><a className="button white" href="mailto:info@nacamatori.it">DIVENTA SPONSOR →</a></div></section>
    <footer><div className="brand"><img src="/nac-scudetto.png" alt="NAC"/><span>NAC<br/><i>AMATORI</i></span></div><b>PASSIONE. UNITÀ. RISPETTO.</b><span>{settings.instagram?<a href={settings.instagram}>Instagram</a>:"Instagram"}　 {settings.facebook?<a href={settings.facebook}>Facebook</a>:"Facebook"}　 {settings.whatsapp?<a href={settings.whatsapp}>WhatsApp</a>:"WhatsApp"}　 <a href="/admin">Admin</a></span></footer>
  </main>
}
