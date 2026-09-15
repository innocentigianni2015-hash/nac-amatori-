import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const admins = sqliteTable("admins", {
  email: text("email").primaryKey(),
  name: text("name"),
  role: text("role").notNull().default("owner"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  number: integer("number").notNull(),
  role: text("role").notNull(),
  groupName: text("group_name").notNull(),
  bio: text("bio").notNull().default(""),
  photoKey: text("photo_key"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [uniqueIndex("players_number_unique").on(table.number)]);


export const staff = sqliteTable("staff", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  photoKey: text("photo_key"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}, (table) => [index("staff_sort_idx").on(table.active, table.sortOrder, table.name)]);

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  type: text("type").notNull().default("allenamento"),
  title: text("title").notNull(),
  startsAt: text("starts_at").notNull(),
  location: text("location").notNull().default(""),
  opponent: text("opponent").notNull().default(""),
  notes: text("notes").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [index("events_starts_at_idx").on(table.startsAt)]);

export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  playerId: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("da_confermare"),
  note: text("note").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("attendance_event_player_unique").on(table.eventId, table.playerId)]);

export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  playerNumber: integer("player_number").notNull(),
  rating: integer("rating").notNull(),
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  fanName: text("fan_name").notNull().default("Tifoso NAC"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("votes_status_idx").on(table.status), index("votes_player_idx").on(table.playerNumber)]);

export const fanMessages = sqliteTable("fan_messages", {
  id: text("id").primaryKey(),
  playerNumber: integer("player_number"),
  senderName: text("sender_name").notNull().default("Tifoso NAC"),
  body: text("body").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("fan_messages_status_idx").on(table.status)]);

export const sponsors = sqliteTable("sponsors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull().default(""),
  logoKey: text("logo_key"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});


export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  round: integer("round").notNull(),
  phase: text("phase").notNull(),
  home: text("home").notNull(),
  away: text("away").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  sourceDate: text("source_date").notNull(),
  time: text("time").notNull(),
  field: text("field").notNull(),
  homeGoals: integer("home_goals"),
  awayGoals: integer("away_goals"),
  status: text("status").notNull().default("scheduled"),
  sourceAnomaly: integer("source_anomaly", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
}, (table) => [index("matches_schedule_idx").on(table.scheduledAt), index("matches_round_idx").on(table.phase, table.round)]);

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const memorialHearts = sqliteTable("memorial_hearts", {
  id: text("id").primaryKey(),
  count: integer("count").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
