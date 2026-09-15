"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nac-manuel-heart-v1";

export default function HeartForManuel() {
  const [count, setCount] = useState<number | null>(null);
  const [hearted, setHearted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setHearted(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}

    fetch("/api/memorial/manuel", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Impossibile caricare i cuori");
        return response.json();
      })
      .then((data) => setCount(Number(data.count ?? 0)))
      .catch(() => setError("Il contatore non è disponibile in questo momento."));
  }, []);

  async function sendHeart() {
    if (hearted || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/memorial/manuel", { method: "POST" });
      if (!response.ok) throw new Error("Errore durante l'invio");
      const data = await response.json();
      setCount(Number(data.count ?? 0));
      setHearted(true);
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    } catch {
      setError("Non siamo riusciti a registrare il cuore. Riprova tra poco.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="memorial-heart" aria-labelledby="manuel-heart-title">
      <p className="memorial-heart-eyebrow">UN GESTO PER MANUEL</p>
      <h2 id="manuel-heart-title">Se lo hai conosciuto, lascia un cuore.</h2>
      <p className="memorial-heart-intro">
        Un gesto semplice per dire che il suo ricordo continua a vivere nelle persone che hanno condiviso un pezzo di strada con lui.
      </p>
      <button
        type="button"
        className={`memorial-heart-button${hearted ? " is-hearted" : ""}`}
        onClick={sendHeart}
        disabled={hearted || sending}
        aria-pressed={hearted}
      >
        <span className="memorial-heart-icon" aria-hidden="true">♥</span>
        <span>{hearted ? "Il tuo cuore è qui" : sending ? "Sto lasciando il cuore…" : "Lascia un cuore per Manuel"}</span>
      </button>
      <div className="memorial-heart-count" aria-live="polite">
        {count === null ? "" : `${count} ${count === 1 ? "cuore lasciato" : "cuori lasciati"}`}
      </div>
      {hearted && <p className="memorial-heart-thanks">Grazie per aver lasciato un segno nel suo ricordo.</p>}
      {error && <p className="memorial-heart-error" role="status">{error}</p>}
    </section>
  );
}
