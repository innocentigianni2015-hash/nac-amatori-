import { getPublicSnapshot } from '@/lib/nac-data';
import PublicNav from '@/app/PublicNav';
import styles from './sponsor.module.css';

export const dynamic='force-dynamic';

type Sponsor={id:string;name:string;website:string;logoKey:string|null;active:number;sortOrder:number};

type Tier={key:string;eyebrow:string;title:string;text:string;min:number;max:number};

const tiers:Tier[]=[
  {key:'main',eyebrow:'01 — TOP VISIBILITY',title:'Main Sponsor',text:'Il partner principale del NAC: massima evidenza nella comunicazione del club e nella presenza istituzionale.',min:100,max:199},
  {key:'technical',eyebrow:'02 — PERFORMANCE',title:'Sponsor Tecnico',text:'Il partner legato a materiale tecnico, abbigliamento, attrezzatura e supporto diretto alla squadra.',min:200,max:299},
  {key:'official',eyebrow:'03 — NETWORK',title:'Official Partner',text:'Aziende che affiancano NAC durante la stagione e condividono visibilità, territorio e relazioni.',min:300,max:399},
  {key:'partner',eyebrow:'04 — TERRITORIO',title:'Partner & Sostenitori',text:'Le realtà che sostengono concretamente il progetto sportivo e la vita quotidiana del club.',min:0,max:99},
  {key:'friends',eyebrow:'05 — COMMUNITY',title:'Amici NAC',text:'Attività, professionisti e sostenitori vicini alla squadra e alla sua comunità.',min:400,max:999999},
];

function SponsorCard({sponsor,main}:{sponsor:Sponsor;main:boolean}){
  const content=<>{sponsor.logoKey&&<img src={`/api/media/${sponsor.logoKey}`} alt={sponsor.name}/>}<h3>{sponsor.name}</h3></>;
  return sponsor.website?<a className={styles.card} href={sponsor.website} target='_blank' rel='noopener noreferrer'>{content}</a>:<article className={styles.card}>{content}</article>;
}

export default async function SponsorPage(){
  const data=await getPublicSnapshot();
  return <main className={`public-page ${styles.page}`}>
    <header className={`public-page-head ${styles.head}`}><PublicNav/><div className='public-page-title'><small>PARTNER NAC</small><h1>Sponsor & Amici.</h1><p>{data.settings.partner_text||'Le aziende e gli amici che scelgono di sostenere NAC condividono la nostra idea di sport e territorio.'}</p></div></header>
    <div className={styles.body}>
      <section className={styles.introStrip}><div><small>INSIEME, DENTRO E FUORI DAL CAMPO</small><h2>Chi sostiene il NAC<br/>fa parte della squadra.</h2></div><p>Abbiamo organizzato i partner per livello di collaborazione, dando a ciascuna realtà uno spazio chiaro, riconoscibile e coerente con il valore del rapporto con il club.</p></section>
      <div className={styles.tiers}>{tiers.map(tier=>{const sponsors=data.sponsors.filter(s=>s.sortOrder>=tier.min&&s.sortOrder<=tier.max);const isMain=tier.key==='main';return <section className={`${styles.tier} ${isMain?styles.mainTier:''}`} key={tier.key}><div className={styles.sectionHead}><div><small>{tier.eyebrow}</small><h2>{tier.title}</h2></div><p>{tier.text}</p></div>{sponsors.length?<div className={`${styles.grid} ${isMain?styles.gridMain:''}`}>{sponsors.map(s=><SponsorCard sponsor={s} main={isMain} key={s.id}/>)}</div>:<div className={styles.available}><div><b>Spazio disponibile</b><span>Questa categoria è aperta a nuovi partner.</span></div><a href='mailto:info@nacamatori.it'>PARLIAMONE →</a></div>}</section>})}</div>
      <section className={styles.cta}><div><small>DIVENTA PARTNER</small><h2>Porta il tuo brand in squadra.</h2><p>Costruiamo una collaborazione proporzionata ai tuoi obiettivi e al rapporto che vuoi creare con NAC.</p></div><a href='mailto:info@nacamatori.it'>DIVENTA SPONSOR →</a></section>
    </div>
  </main>;
}
