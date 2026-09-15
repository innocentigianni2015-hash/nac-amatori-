export default function PublicNav() {
  return <nav className="public-nav">
    <a className="brand" href="/"><img src="/nac-scudetto.png" alt="Scudetto NAC"/><span>NAC<br/><i>AMATORI</i></span></a>
    <div className="links">
      <a href="/la-storia">STORIA</a><a href="/squadra">SQUADRA</a><a href="/dirigenti-staff">STAFF</a>
      <a href="/calendario">CALENDARIO</a><a href="/classifica">CLASSIFICA</a><a href="/sponsor-amici">SPONSOR</a>
      <a href="/tifosi-amici">TIFOSI</a><a href="/dedicato-a-manuel">MANUEL</a>
    </div>
  </nav>;
}
