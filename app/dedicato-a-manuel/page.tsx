import "./style.css";
import HeartForManuel from "./HeartForManuel";
import PublicNav from "@/app/PublicNav";
import { getPublicSnapshot } from "@/lib/nac-data";

export const metadata = {
  title: "Dedicato a Manuel | NAC Amatori Castellana",
  description: "Una pagina dedicata al ricordo di Manuel Calandrino.",
};

export default async function DedicatoAManuelPage() {
  const data=await getPublicSnapshot(); const st=data.settings;
  return (
    <main className="memorial-page">
      <header className="memorial-nav-wrap"><PublicNav/></header>

      <section className="memorial-hero">
        <div className="memorial-kicker">PER SEMPRE CON NOI</div>
        <h1>
          {st.manuel_title||<>Dedicato a <em>Manuel</em></>}
        </h1>
        <p>
          {st.manuel_intro||"Ci sono persone che entrano in una squadra e diventano parte della sua storia. Manuel Calandrino per la NAC è stato questo: un compagno, un amico, uno di noi."}
        </p>
      </section>

      <section className="memorial-photo-block">
        <p className="memorial-photo-tribute">
          “Ci sono compagni che lasciano il campo, ma non lasciano mai la squadra.”
        </p>
        <img
          src={st.media_manuel_team?`/api/media/${st.media_manuel_team.split("/").map(encodeURIComponent).join("/")}`:"/manuel-calandrino-team.jpg"}
          alt="NAC Amatori Castellana in una foto di squadra con lo striscione Ciao Cala dedicato a Manuel Calandrino"
          className="memorial-photo"
        />
        <p className="memorial-caption">
          Ciao Cala. Il tuo posto nella nostra storia resta qui, con noi.
        </p>
      </section>

      <section className="memorial-story">
        <div className="memorial-heading">
          <small>UN RICORDO CHE RESTA</small>
          <h2>Uno dei nostri.</h2>
        </div>
        <div className="memorial-copy">
          <p>
            {st.manuel_story_1||"Nel 2025 la NAC Amatori Castellana è stata colpita da una perdita profondissima: la scomparsa di Manuel Calandrino, che faceva parte del gruppo da circa tre anni."}
          </p>
          <p>
            {st.manuel_story_2||"Per tutti noi Manuel non è soltanto un nome da ricordare, ma una presenza che ha lasciato un segno vero nello spogliatoio, nelle serate insieme, negli allenamenti e nelle partite condivise con questa maglia."}
          </p>
          <p>
            {st.manuel_story_3||"Questa pagina nasce per custodire il suo ricordo con rispetto, affetto e gratitudine. Perché ci sono persone che continuano a far parte di una squadra anche oltre il tempo."}
          </p>
        </div>
      </section>

      <HeartForManuel />

      <section className="memorial-quote">
        <blockquote>
          {st.manuel_quote||"Ogni volta che la NAC entra in campo, una parte di chi ha condiviso questa maglia continua a esserci."}
        </blockquote>
        <p>Ciao Cala. Per sempre con noi.</p>
      </section>
    </main>
  );
}
