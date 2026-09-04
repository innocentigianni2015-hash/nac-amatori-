import { rows1 } from "./fixtures/part1";
import { rows2 } from "./fixtures/part2";
import { rows3 } from "./fixtures/part3";
import { rows4 } from "./fixtures/part4";

export type MatchStatus = "scheduled" | "played" | "postponed";
export type Match = {
  id: string;
  round: number;
  phase: "andata" | "ritorno";
  home: string;
  away: string;
  date: string;
  time: string;
  field: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: MatchStatus;
  sourceDateAnomaly?: boolean;
};

export const NAC_TEAM = "NAC AMATORI CASTELLANA";

const raw = [rows1, rows2, rows3, rows4].join("\n");

export const GIRONE_2_MATCHES: Match[] = raw.trim().split("\n").map((row, index) => {
  const [round, phase, home, away, date, time, field, anomaly] = row.split("|");
  return {
    id: `${phase === "a" ? "andata" : "ritorno"}-${round}-${index + 1}`,
    round: Number(round),
    phase: phase === "a" ? "andata" : "ritorno",
    home,
    away,
    date,
    time,
    field,
    homeGoals: null,
    awayGoals: null,
    status: "scheduled",
    ...(anomaly === "1" ? { sourceDateAnomaly: true } : {}),
  };
});
