import "./style.css";
import HeartForManuel from "./HeartForManuel";

export const metadata = {
  title: "Dedicato a Manuel | NAC Amatori Castellana",
  description: "Una pagina dedicata al ricordo di Manuel Calandrino.",
};

export default function DedicatoAManuelPage() {
  return (
    <main className="memorial-page">
      <header className="memorial-nav">
        <a href="/" className="memorial-brand">
          <img src="/nac-scudetto.png" alt="NAC Amatori Castellana" />
          <span>NAC AMATORI CASTELLANA</span>
        </a>
        <a href="/" className="memorial-back">Torna al sito</a>
      </header>

      <section className="memorial-hero">
        <div className="memorial-kicker">PER SEMPRE CON NOI</div>
        <h1>
          Dedicato a <em>Manuel</em>
        </h1>
        <p>
          Ci sono persone che entrano in una squadra e diventano parte della sua storia.
          Manuel Calandrino per la NAC è stato questo: un compagno, un amico, uno di noi.
        </p>
      </section>

      <section className="memorial-photo-block">
        <p className="memorial-photo-tribute">
          “Ci sono compagni che lasciano il campo, ma non lasciano mai la squadra.”
        </p>
        <img
          src="/manuel-calandrino-team.jpg"
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
            Nel 2025 la NAC Amatori Castellana è stata colpita da una perdita profondissima:
            la scomparsa di Manuel Calandrino, che faceva parte del gruppo da circa tre anni.
          </p>
          <p>
            Per tutti noi Manuel non è soltanto un nome da ricordare, ma una presenza che ha
            lasciato un segno vero nello spogliatoio, nelle serate insieme, negli allenamenti
            e nelle partite condivise con questa maglia.
          </p>
          <p>
            Questa pagina nasce per custodire il suo ricordo con rispetto, affetto e gratitudine.
            Perché ci sono persone che continuano a far parte di una squadra anche oltre il tempo.
          </p>
        </div>
      </section>

      <HeartForManuel />

      <section className="memorial-quote">
        <blockquote>
          “Ogni volta che la NAC entra in campo, una parte di chi ha condiviso questa maglia
          continua a esserci.”
        </blockquote>
        <p>Ciao Cala. Per sempre con noi.</p>
      </section>
    </main>
  );
}
