import "./style.css";
import PublicNav from "@/app/PublicNav";
import { getPublicSnapshot } from "@/lib/nac-data";

const seasons = ["2011-12","2012-13","2013-14","2014-15","2015-16","2016-17","2017-18","2018-19","2019-20","2020-21","2021-22","2022-23","2023-24"];

export default async function LaStoria() {
  const data=await getPublicSnapshot(); const st=data.settings;
  return <main className="historyPage">
    <header className="historyHero">
      <PublicNav/>
      <div className="historyHeroCopy"><small>DAL 2011 · CASTEL GOFFREDO</small><h1>La nostra<br/><em>storia.</em></h1><p>Una squadra nata per scelta. Cresciuta attraverso stagioni, cambiamenti, amicizie e la stessa voglia di stare insieme intorno a un pallone.</p></div>
    </header>

    <section className="historyIntro">
      <div><small>01 — STORIA DELLA NAC</small><h2>{st.history_intro_title||"Nuova Associazione Calcio Amatori Castellana."}</h2></div>
      <div className="historyText"><p>{st.history_intro_p1||"La N.A.C. Amatori Castellana nasce nell'aprile 2011 dall'idea di un gruppo di giocatori e dirigenti che, impegnati presso una squadra di amatori presente da diverso tempo a Castel Goffredo, decidono di staccarsi da essa per dare vita ad una nuova realtà di calcio amatoriale."}</p><p>{st.history_intro_p2||"Durante la stagione agonistica 2010-2011 questa squadra vince il campionato di calcio amatori a 11 organizzato dal CSI di Mantova. Gli ottimi risultati ottenuti sul campo tuttavia non rispecchiano il clima dello spogliatoio, tutt’altro che sereno. Durante la stagione infatti vengono fatte scelte che diversi giocatori non gradiscono, dunque la decisione di uscire da questa storica realtà amatoriale per crearne una tutta nuova. Nasce così la Nuova Associazione Calcio Amatori Castellana."}</p></div>
    </section>
    <section className="historyBody">
      <div className="historyBodyText"><p>{st.history_body_p1||'Si susseguono anni in cui non mancano stravolgimenti societari e numerosi via vai di giocatori, segno del clima "vivace" che ha sempre contraddistinto questa realtà ma anche del suo grande senso di apertura verso chiunque abbia voglia di unirsi al gruppo per dare il suo contributo.'}</p><p>{st.history_body_p2||"La squadra nei primi anni ha militato nel suddetto campionato amatoriale organizzato dal CSI Mantova, per passare poi - per diverso tempo - all'ente UISP Mantova. Recentemente, come tante altre squadre amatoriali, si è iscritta al campionato Open a 11 del nuovo ente MSP Mantova."}</p><p>{st.history_body_p3||'La N.A.C. fa dello spirito di gruppo il suo punto di forza, cercando di dare sempre spazio a tutti i componenti della rosa. Per i membri della N.A.C. il calcio è grande passione e divertimento. È il motivo per il quale vale la pena trovarsi a correre due sere a settimana dopo ore di lavoro. È il motivo per il quale ogni venerdì sera o sabato pomeriggio si va in campo a dare il massimo per vincere. È il motivo per il quale non ci si stanca mai di stare tutti insieme.'}</p></div>
      <aside><b>2011</b><span>ANNO DI NASCITA</span><b>CSI · UISP · MSP</b><span>IL NOSTRO CAMMINO</span><b>CASTELLANA</b><span>LA NOSTRA CASA</span></aside>
    </section>

    <section className="archiveSection">
      <div className="archiveHead"><small>02 — ARCHIVIO FOTOGRAFICO</small><h2>Le stagioni<br/><em>in una foto.</em></h2><p>Volti, maglie e gruppi diversi. La stessa NAC, stagione dopo stagione.</p></div>
      <div className="seasonGrid">{seasons.map((season,index)=>{const label=season.replace("-","/");const key=st[`media_history_${season}`];const src=key?`/api/media/${key.split("/").map(encodeURIComponent).join("/")}`:`/storia/${season}.jpeg`;return <figure className={index%4===0?"wide":""} key={season}><img src={src} alt={`NAC Amatori Castellana stagione ${label}`}/><figcaption><span>STAGIONE</span><b>{label}</b></figcaption></figure>})}</div>
    </section>

    <section className="historyClosing"><small>DAL 2011, INSIEME.</small><h2>Il calcio passa.<br/><em>Il gruppo resta.</em></h2><a href="/" className="historyButton">TORNA ALLA NAC →</a></section>
  </main>
}
