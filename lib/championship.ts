import type { Match } from "../data/girone2-2026-27";

export type StandingRow = {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export function calculateStandings(matches: Match[]): StandingRow[] {
  const table = new Map<string, StandingRow>();
  const ensure = (team: string) => {
    if (!table.has(team)) table.set(team, { team, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 });
    return table.get(team)!;
  };

  for (const match of matches) {
    ensure(match.home); ensure(match.away);
    if (match.status !== "played" || match.homeGoals == null || match.awayGoals == null) continue;
    const home = ensure(match.home), away = ensure(match.away);
    home.played++; away.played++;
    home.goalsFor += match.homeGoals; home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals; away.goalsAgainst += match.homeGoals;
    if (match.homeGoals > match.awayGoals) { home.wins++; away.losses++; home.points += 3; }
    else if (match.homeGoals < match.awayGoals) { away.wins++; home.losses++; away.points += 3; }
    else { home.draws++; away.draws++; home.points++; away.points++; }
  }

  for (const row of table.values()) row.goalDifference = row.goalsFor - row.goalsAgainst;
  return [...table.values()].sort((a,b) => b.points-a.points || b.goalDifference-a.goalDifference || b.goalsFor-a.goalsFor || a.team.localeCompare(b.team));
}

export function nacMatches(matches: Match[], nacName = "NAC AMATORI CASTELLANA") {
  return matches.filter(m => m.home === nacName || m.away === nacName);
}
