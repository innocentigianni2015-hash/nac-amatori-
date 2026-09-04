import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  round: integer("round").notNull(),
  phase: text("phase", { enum: ["andata", "ritorno"] }).notNull(),
  home: text("home").notNull(),
  away: text("away").notNull(),
  matchDate: text("match_date").notNull(),
  matchTime: text("match_time").notNull(),
  field: text("field").notNull(),
  homeGoals: integer("home_goals"),
  awayGoals: integer("away_goals"),
  status: text("status", { enum: ["scheduled", "played", "postponed"] }).notNull().default("scheduled"),
  updatedAt: text("updated_at").notNull(),
});
