export type MatchRow = {
  id:string; round:number; phase:string; home:string; away:string; scheduledAt:string; sourceDate:string; time:string; field:string; homeGoals:number|null; awayGoals:number|null; status:string; sourceAnomaly:number;
};
export type StandingRow = {team:string;played:number;wins:number;draws:number;losses:number;goalsFor:number;goalsAgainst:number;goalDifference:number;points:number};
export const NAC_TEAM = "NAC AMATORI CASTELLANA";
export function calculateStandings(matches: MatchRow[]): StandingRow[] {
  const table=new Map<string,StandingRow>();
  const ensure=(team:string)=>{if(!table.has(team))table.set(team,{team,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0});return table.get(team)!};
  for(const match of matches){const h=ensure(match.home),a=ensure(match.away);if(match.status!=="played"||match.homeGoals==null||match.awayGoals==null)continue;h.played++;a.played++;h.goalsFor+=match.homeGoals;h.goalsAgainst+=match.awayGoals;a.goalsFor+=match.awayGoals;a.goalsAgainst+=match.homeGoals;if(match.homeGoals>match.awayGoals){h.wins++;a.losses++;h.points+=3}else if(match.homeGoals<match.awayGoals){a.wins++;h.losses++;a.points+=3}else{h.draws++;a.draws++;h.points++;a.points++}}
  for(const row of table.values())row.goalDifference=row.goalsFor-row.goalsAgainst;
  return [...table.values()].sort((a,b)=>b.points-a.points||b.goalDifference-a.goalDifference||b.goalsFor-a.goalsFor||a.team.localeCompare(b.team));
}
export const isNacMatch=(m:MatchRow)=>m.home===NAC_TEAM||m.away===NAC_TEAM;
