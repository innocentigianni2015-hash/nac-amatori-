import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { ensureFirstAdmin, getAdminSnapshot } from "@/lib/nac-data";
import "./admin.css";

export const dynamic = "force-dynamic";
const NAC="NAC AMATORI CASTELLANA";
const groups=["Portieri","Difensori","Centrocampisti","Attaccanti"];
const media=(key:string|null|undefined)=>!key?"/nac-scudetto.png":key.startsWith("/")?key:`/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
const mediaItems=[
  ["home_preparazione","Home · Preparazione"],["home_memorial","Home · Memorial"],["manuel_team","Manuel · Foto squadra"],
  ...["2011-12","2012-13","2013-14","2014-15","2015-16","2016-17","2017-18","2018-19","2019-20","2020-21","2021-22","2022-23","2023-24"].map(x=>[`history_${x}`,`Storia · ${x.replace("-","/")}`])
];

export default async function AdminPage(){
  const user=await requireChatGPTUser("/admin");
  const allowed=await ensureFirstAdmin(user.email,user.displayName);
  if(!allowed)return <main className="admin-denied"><h1>Accesso non autorizzato</h1></main>;
  const data=await getAdminSnapshot();
  const nacMatches=data.matches.filter(m=>m.home===NAC||m.away===NAC);
  return <main className="admin-server">
    <header className="admin-server-head"><div><img src="/nac-scudetto.png" alt="NAC"/><div><small>AREA RISERVATA NAC</small><h1>Gestione squadra</h1></div></div><nav><a href="/">Apri il sito</a><a href={chatGPTSignOutPath("/")}>Esci</a></nav></header>
    <nav className="admin-server-nav" aria-label="Menu amministrazione">
      <a className="admin-nav-home" href="#dashboard"><span>HOME</span><b>Dashboard</b><small>Da qui parti sempre</small></a>
      <div className="admin-nav-group"><span>SQUADRA</span><a href="#rosa"><b>Giocatori</b><small>Foto, ruoli e rosa</small></a><a href="#staff"><b>Dirigenti e staff</b><small>Società e staff tecnico</small></a><a href="#agenda"><b>Allenamenti ed eventi</b><small>Date e appuntamenti</small></a></div>
      <div className="admin-nav-group"><span>CAMPIONATO</span><a href="#campionato"><b>Partite e risultati</b><small>Inserisci o correggi risultati</small></a></div>
      <div className="admin-nav-group"><span>SITO</span><a href="#contenuti"><b>Testi del sito</b><small>Modifica le informazioni</small></a><a href="#media"><b>Foto del sito</b><small>Carica o sostituisci immagini</small></a><a href="#sponsor"><b>Sponsor</b><small>Loghi e collegamenti</small></a></div>
      <div className="admin-nav-group"><span>COMMUNITY</span><a href="#community"><b>Voti e messaggi</b><small>Controlla ciò che inviano i tifosi</small></a></div>
      <div className="admin-nav-bottom"><a href="/">Apri sito pubblico</a><a href={chatGPTSignOutPath("/")}>Esci dall'Admin</a></div>
    </nav>
    <section id="dashboard" className="admin-dashboard-intro">
      <small>HOME ADMIN</small><h2>Cosa vuoi fare?</h2><p>Scegli un'operazione. Non serve conoscere il pannello: ogni pulsante porta direttamente alla funzione giusta.</p>
      <div className="admin-task-grid">
        <a href="#rosa"><b>Aggiungi o modifica un giocatore</b><span>Rosa, ruolo e foto</span></a>
        <a href="#agenda"><b>Inserisci allenamento o evento</b><span>Date, luogo e avversario</span></a>
        <a href="#campionato"><b>Inserisci un risultato</b><span>La classifica si aggiorna automaticamente</span></a>
        <a href="#media"><b>Cambia una foto del sito</b><span>Home, storia e immagini principali</span></a>
        <a href="#sponsor"><b>Gestisci uno sponsor</b><span>Logo, nome e sito web</span></a>
        <a href="#community"><b>Controlla voti e messaggi</b><span>Approva, archivia o elimina</span></a>
      </div>
    </section>
    <section className="admin-server-kpis"><article><b>{data.players.filter(p=>p.active).length}</b><span>Giocatori attivi</span></article><article><b>{data.staff.filter(s=>s.active).length}</b><span>Persone nello staff</span></article><article><b>{nacMatches.length}</b><span>Partite NAC</span></article><article><b>{data.events.length}</b><span>Allenamenti ed eventi</span></article></section>

    <section id="rosa" className="admin-server-block"><Title eyebrow="ROSA" title="Giocatori" text="Modifica nome, ruolo, reparto, bio, stato e foto. Il numero resta solo tecnico e non viene mostrato al pubblico."/>
      <form className="admin-add-form" method="post" action="/api/admin/manage"><Hidden action="player.create" section="rosa"/><input name="name" placeholder="Nome e cognome" required/><input name="role" placeholder="Ruolo" required/><select name="groupName" defaultValue="Difensori">{groups.map(g=><option key={g}>{g}</option>)}</select><textarea name="bio" placeholder="Bio"/><button>Aggiungi giocatore</button></form>
      <div className="admin-manage-grid">{data.players.map(p=><article className="admin-manage-card" key={p.id}><form method="post" action="/api/admin/manage"><Hidden action="player.update" section="rosa" id={p.id}/><img src={media(p.photoKey)} alt=""/><input name="name" defaultValue={p.name} required/><input name="role" defaultValue={p.role} required/><select name="groupName" defaultValue={p.groupName}>{groups.map(g=><option key={g}>{g}</option>)}</select><textarea name="bio" defaultValue={p.bio}/><label className="check"><input type="checkbox" name="active" defaultChecked={Boolean(p.active)}/> Visibile sul sito</label><button>Salva giocatore</button></form><form className="upload-line" method="post" action="/api/admin/manage" encType="multipart/form-data"><Hidden action="upload.player" section="rosa" id={p.id}/><input type="file" name="file" accept="image/*" required/><button>Carica foto</button></form></article>)}</div>
    </section>

    <section id="staff" className="admin-server-block"><Title eyebrow="STAFF" title="Dirigenti e staff" text="Crea e modifica le card con foto, ruolo, ordine e biografia."/>
      <form className="admin-add-form" method="post" action="/api/admin/manage"><Hidden action="staff.create" section="staff"/><input name="name" placeholder="Nome e cognome" required/><input name="role" placeholder="Ruolo" required/><input type="number" name="sortOrder" defaultValue="0"/><textarea name="bio" placeholder="Bio / incarico"/><button>Aggiungi staff</button></form>
      <div className="admin-manage-grid">{data.staff.map(s=><article className="admin-manage-card" key={s.id}><form method="post" action="/api/admin/manage"><Hidden action="staff.update" section="staff" id={s.id}/><img src={media(s.photoKey)} alt=""/><input name="name" defaultValue={s.name} required/><input name="role" defaultValue={s.role} required/><input type="number" name="sortOrder" defaultValue={s.sortOrder}/><textarea name="bio" defaultValue={s.bio}/><label className="check"><input type="checkbox" name="active" defaultChecked={Boolean(s.active)}/> Visibile sul sito</label><div className="manage-actions"><button>Salva</button></div></form><form className="upload-line" method="post" action="/api/admin/manage" encType="multipart/form-data"><Hidden action="upload.staff" section="staff" id={s.id}/><input type="file" name="file" accept="image/*" required/><button>Carica foto</button></form><form method="post" action="/api/admin/manage"><Hidden action="staff.delete" section="staff" id={s.id}/><button className="danger">Elimina</button></form></article>)}</div>
    </section>

    <section id="agenda" className="admin-server-block"><Title eyebrow="AGENDA" title="Allenamenti ed eventi" text="Inserisci allenamenti, amichevoli, partite e tornei."/>
      <form className="admin-add-form event" method="post" action="/api/admin/manage"><Hidden action="event.create" section="agenda"/><select name="type" defaultValue="allenamento"><option value="allenamento">Allenamento</option><option value="partita">Partita</option><option value="amichevole">Amichevole</option><option value="torneo">Torneo</option></select><input name="title" placeholder="Titolo" required/><input type="datetime-local" name="startsAt" required/><input name="location" placeholder="Luogo"/><input name="opponent" placeholder="Avversario"/><textarea name="notes" placeholder="Note"/><label className="check"><input type="checkbox" name="published" defaultChecked/> Pubblicato</label><button>Aggiungi evento</button></form>
      <div className="admin-event-list">{data.events.map(e=><form className="admin-event-row" key={e.id} method="post" action="/api/admin/manage"><Hidden action="event.update" section="agenda" id={e.id}/><select name="type" defaultValue={e.type}><option value="allenamento">Allenamento</option><option value="partita">Partita</option><option value="amichevole">Amichevole</option><option value="torneo">Torneo</option></select><input name="title" defaultValue={e.title}/><input type="datetime-local" name="startsAt" defaultValue={e.startsAt.slice(0,16)}/><input name="location" defaultValue={e.location}/><input name="opponent" defaultValue={e.opponent}/><textarea name="notes" defaultValue={e.notes}/><label className="check"><input type="checkbox" name="published" defaultChecked={Boolean(e.published)}/> Pubblicato</label><button>Salva</button><button className="danger" formAction="/api/admin/manage" name="_action" value="event.delete">Elimina</button></form>)}</div>
    </section>

    <section id="campionato" className="admin-server-block"><Title eyebrow="CAMPIONATO" title="Risultati NAC" text="Modifica risultato e stato; la classifica pubblica viene ricalcolata automaticamente."/>
      <div className="admin-match-list">{nacMatches.map(m=><form className="admin-match-row" key={m.id} method="post" action="/api/admin/manage"><Hidden action="match.update" section="campionato" id={m.id}/><span>{m.round}ª · {m.sourceDate}</span><b className="team-home">{m.home}</b><strong className="admin-vs">VS</strong><b className="team-away">{m.away}</b><div className="admin-score-edit"><input type="number" min="0" name="homeGoals" defaultValue={m.homeGoals??""}/><strong>:</strong><input type="number" min="0" name="awayGoals" defaultValue={m.awayGoals??""}/></div><select name="status" defaultValue={m.status}><option value="scheduled">Da giocare</option><option value="played">Giocata</option><option value="postponed">Rinviata</option></select><button>Salva</button></form>)}</div>
    </section>

    <section id="contenuti" className="admin-server-block"><Title eyebrow="CONTENUTI" title="Testi del sito" text="Modifica Home, Storia, Manuel e collegamenti social."/>
      <form className="admin-content-form" method="post" action="/api/admin/manage"><Hidden action="settings.update" section="contenuti"/>
        <Field label="Titolo Home" name="hero_title" value={data.settings.hero_title}/><Field label="Testo Home" name="hero_text" value={data.settings.hero_text} area/><Field label="Titolo box Storia" name="history_title" value={data.settings.history_title}/><Field label="Testo box Storia" name="history_text" value={data.settings.history_text} area/><Field label="Testo Partner" name="partner_text" value={data.settings.partner_text} area/>
        <h3>Pagina Storia</h3><Field label="Titolo" name="history_intro_title" value={data.settings.history_intro_title}/><Field label="Paragrafo 1" name="history_intro_p1" value={data.settings.history_intro_p1} area/><Field label="Paragrafo 2" name="history_intro_p2" value={data.settings.history_intro_p2} area/><Field label="Corpo 1" name="history_body_p1" value={data.settings.history_body_p1} area/><Field label="Corpo 2" name="history_body_p2" value={data.settings.history_body_p2} area/><Field label="Corpo 3" name="history_body_p3" value={data.settings.history_body_p3} area/>
        <h3>Pagina Manuel</h3><Field label="Titolo" name="manuel_title" value={data.settings.manuel_title}/><Field label="Introduzione" name="manuel_intro" value={data.settings.manuel_intro} area/><Field label="Ricordo 1" name="manuel_story_1" value={data.settings.manuel_story_1} area/><Field label="Ricordo 2" name="manuel_story_2" value={data.settings.manuel_story_2} area/><Field label="Ricordo 3" name="manuel_story_3" value={data.settings.manuel_story_3} area/><Field label="Citazione finale" name="manuel_quote" value={data.settings.manuel_quote} area/>
        <h3>Social</h3><Field label="Instagram URL" name="instagram" value={data.settings.instagram}/><Field label="Facebook URL" name="facebook" value={data.settings.facebook}/><Field label="WhatsApp URL" name="whatsapp" value={data.settings.whatsapp}/><button className="save-wide">Salva tutti i contenuti</button>
      </form>
    </section>

    <section id="media" className="admin-server-block"><Title eyebrow="IMMAGINI" title="Media del sito" text="Sostituisci le immagini principali e tutte le foto storiche senza modificare il codice."/><div className="admin-media-grid">{mediaItems.map(([id,label])=>{const key=data.settings[`media_${id}`];return <article key={id}><span>{label}</span><img src={media(key)} alt=""/><form method="post" action="/api/admin/manage" encType="multipart/form-data"><Hidden action="upload.setting" section="media" id={id}/><input type="file" name="file" accept="image/*" required/><button>Carica / sostituisci</button></form></article>})}</div></section>

    <section id="sponsor" className="admin-server-block"><Title eyebrow="SPONSOR" title="Sponsor e amici" text="Crea, modifica, ordina e carica i loghi degli sponsor."/><form className="admin-add-form" method="post" action="/api/admin/manage"><Hidden action="sponsor.create" section="sponsor"/><input name="name" placeholder="Nome sponsor" required/><input name="website" placeholder="Sito web"/><input type="number" name="sortOrder" defaultValue="0"/><button>Aggiungi sponsor</button></form><div className="admin-manage-grid">{data.sponsors.map(s=><article className="admin-manage-card" key={s.id}><form method="post" action="/api/admin/manage"><Hidden action="sponsor.update" section="sponsor" id={s.id}/><img src={media(s.logoKey)} alt=""/><input name="name" defaultValue={s.name}/><input name="website" defaultValue={s.website}/><input type="number" name="sortOrder" defaultValue={s.sortOrder}/><label className="check"><input type="checkbox" name="active" defaultChecked={Boolean(s.active)}/> Visibile</label><button>Salva</button></form><form className="upload-line" method="post" action="/api/admin/manage" encType="multipart/form-data"><Hidden action="upload.sponsor" section="sponsor" id={s.id}/><input type="file" name="file" accept="image/*" required/><button>Carica logo</button></form><form method="post" action="/api/admin/manage"><Hidden action="sponsor.delete" section="sponsor" id={s.id}/><button className="danger">Elimina</button></form></article>)}</div></section>

    <section id="community" className="admin-server-block"><Title eyebrow="TIFOSI" title="Voti e messaggi" text="Approva, archivia o elimina i contributi inviati dal pubblico."/><div className="admin-community-grid"><div><h3>Voti</h3>{data.votes.map(v=><form className="community-row" key={v.id} method="post" action="/api/admin/manage"><Hidden action="vote.status" section="community" id={v.id}/><div><b>{v.playerName||"Giocatore"} · {v.rating}/5</b><p>{v.fanName}: {v.message}</p></div><select name="status" defaultValue={v.status}><option value="pending">In attesa</option><option value="approved">Approvato</option><option value="archived">Archiviato</option></select><button>Salva</button><button className="danger" name="_action" value="vote.delete">Elimina</button></form>)}</div><div><h3>Messaggi</h3>{data.messages.map(m=><form className="community-row" key={m.id} method="post" action="/api/admin/manage"><Hidden action="message.status" section="community" id={m.id}/><div><b>{m.playerName||"Squadra"}</b><p>{m.senderName}: {m.body}</p></div><select name="status" defaultValue={m.status}><option value="pending">In attesa</option><option value="approved">Approvato</option><option value="archived">Archiviato</option></select><button>Salva</button><button className="danger" name="_action" value="message.delete">Elimina</button></form>)}</div></div></section>

      <style>{`
        .admin-server{padding-left:270px}
        .admin-server-head{position:sticky;top:0;z-index:30}
        .admin-server-nav{position:fixed;left:0;top:0;bottom:0;width:270px;z-index:40;display:flex;flex-direction:column;gap:0;overflow-y:auto;padding:22px 16px;background:#02090f;border-right:1px solid rgba(130,212,247,.18);border-bottom:0}
        .admin-server-nav>a,.admin-nav-group a{display:grid;gap:3px;padding:12px 13px;border:0;border-radius:8px;color:#e8f7ff;text-decoration:none;text-transform:none;font-family:Manrope,Arial,sans-serif}
        .admin-server-nav>a:hover,.admin-nav-group a:hover{background:#0a2030}
        .admin-server-nav a b{font-size:13px}.admin-server-nav a small{font:500 10px/1.35 'DM Mono';color:#7998a7}
        .admin-nav-home{margin-bottom:16px;background:#0a2030!important;border:1px solid rgba(130,212,247,.22)!important}
        .admin-nav-home>span,.admin-nav-group>span{padding:0 13px 7px;color:#82d4f7;font:800 9px 'DM Mono';letter-spacing:.14em}
        .admin-nav-group{display:grid;gap:2px;padding:12px 0;border-top:1px solid rgba(130,212,247,.12)}
        .admin-nav-bottom{margin-top:auto;padding-top:16px;border-top:1px solid rgba(130,212,247,.12)}
        .admin-nav-bottom a{color:#a8c5d2!important}.admin-dashboard-intro{max-width:1200px;margin:30px auto 0;padding:0 28px;scroll-margin-top:90px}
        .admin-dashboard-intro>small{color:#7dd3fc;font:800 9px 'DM Mono';letter-spacing:.16em}.admin-dashboard-intro h2{font-size:42px;margin:8px 0}.admin-dashboard-intro>p{max-width:720px;margin:0;color:#9bb5c1;line-height:1.6}
        .admin-task-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}
        .admin-task-grid a{display:grid;gap:8px;min-height:112px;padding:18px;border:1px solid rgba(130,212,247,.18);background:#0a1b27;color:#effaff;text-decoration:none}
        .admin-task-grid a:hover{border-color:#82d4f7;background:#0b2231}.admin-task-grid b{font-size:15px}.admin-task-grid span{color:#8eabb8;font-size:12px;line-height:1.45}
        .admin-server-block,.admin-server-kpis{scroll-margin-top:90px}
        @media(max-width:1000px){
          .admin-server{padding-left:0}.admin-server-head{position:relative}
          .admin-server-nav{position:sticky;top:0;bottom:auto;width:auto;height:auto;z-index:25;display:flex;flex-direction:row;overflow-x:auto;padding:10px 12px;border-right:0;border-bottom:1px solid rgba(130,212,247,.18)}
          .admin-server-nav>a,.admin-nav-group{flex:0 0 auto}.admin-nav-group{display:flex;align-items:center;padding:0;border:0}.admin-nav-group>span,.admin-nav-bottom{display:none}.admin-nav-group a{min-width:max-content;padding:10px 12px}.admin-server-nav a small,.admin-nav-home>span{display:none}.admin-nav-home{margin:0;background:#0a2030!important}
          .admin-task-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        }
        @media(max-width:650px){
          .admin-server-head h1{font-size:22px}.admin-server-head nav{display:flex;gap:10px}.admin-server-head nav a:first-child{display:none}
          .admin-dashboard-intro{padding:0 16px}.admin-dashboard-intro h2{font-size:34px}.admin-task-grid{grid-template-columns:1fr;gap:8px}
          .admin-task-grid a{min-height:88px;padding:15px}.admin-server-kpis{margin-top:20px}
        }
      `}</style>
  </main>;
}

function Hidden({action,section,id}:{action:string;section:string;id?:string}){return <><input type="hidden" name="action" value={action}/><input type="hidden" name="section" value={section}/>{id&&<input type="hidden" name="id" value={id}/>}</>}
function Title({eyebrow,title,text}:{eyebrow:string;title:string;text:string}){return <div className="admin-server-title"><small>{eyebrow}</small><h2>{title}</h2><p>{text}</p></div>}
function Field({label,name,value,area=false}:{label:string;name:string;value?:string;area?:boolean}){return <label><span>{label}</span>{area?<textarea name={name} defaultValue={value||""}/>:<input name={name} defaultValue={value||""}/>}</label>}
