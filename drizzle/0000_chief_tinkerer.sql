CREATE TABLE IF NOT EXISTS `admins` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`player_id` text NOT NULL,
	`status` text DEFAULT 'da_confermare' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `attendance_event_player_unique` ON `attendance` (`event_id`,`player_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'allenamento' NOT NULL,
	`title` text NOT NULL,
	`starts_at` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`opponent` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `events_starts_at_idx` ON `events` (`starts_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `fan_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`player_number` integer,
	`sender_name` text DEFAULT 'Tifoso NAC' NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `fan_messages_status_idx` ON `fan_messages` (`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `players` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`number` integer NOT NULL,
	`role` text NOT NULL,
	`group_name` text NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`photo_key` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `players_number_unique` ON `players` (`number`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sponsors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`logo_key` text,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`player_number` integer NOT NULL,
	`rating` integer NOT NULL,
	`event_id` text,
	`fan_name` text DEFAULT 'Tifoso NAC' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `votes_status_idx` ON `votes` (`status`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `votes_player_idx` ON `votes` (`player_number`);

CREATE TABLE IF NOT EXISTS `matches` (
  `id` text PRIMARY KEY NOT NULL,
  `round` integer NOT NULL,
  `phase` text NOT NULL,
  `home` text NOT NULL,
  `away` text NOT NULL,
  `scheduled_at` text NOT NULL,
  `source_date` text NOT NULL,
  `time` text NOT NULL,
  `field` text NOT NULL,
  `home_goals` integer,
  `away_goals` integer,
  `status` text DEFAULT 'scheduled' NOT NULL,
  `source_anomaly` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS `matches_schedule_idx` ON `matches` (`scheduled_at`);
CREATE INDEX IF NOT EXISTS `matches_round_idx` ON `matches` (`phase`,`round`);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-001',1,'andata','ASD GRAZIE','CASALPOGLIO ELETTR. VEGA','2026-09-18T21:00:00','18/09/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-002',1,'andata','ASD LEVATA FRAGOLETTA','CITTADELLA','2026-09-19T15:00:00','19/09/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-003',1,'andata','G & B UNITED CAMPITELLO','NAC AMATORI CASTELLANA','2026-09-18T21:00:00','18/09/26','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-004',1,'andata','U.S. CERETA','CICOGNARA COGOZZO','2026-09-18T20:45:00','18/09/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-005',1,'andata','ALIMENTIS A.C. COMMESSAGGIO','ASD AMATORI CLUB 94','2026-09-19T15:00:00','19/09/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-1-006',1,'andata','ASD AMATORI GAZOLDO','TORMEC PEGOGNAGA','2026-09-19T15:30:00','19/09/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-007',2,'andata','CASALPOGLIO ELETTR. VEGA','ASD AMATORI GAZOLDO','2026-09-26T15:00:00','26/09/26','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-008',2,'andata','TORMEC PEGOGNAGA','ALIMENTIS A.C. COMMESSAGGIO','2026-09-25T21:00:00','25/09/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-009',2,'andata','ASD AMATORI CLUB 94','CICOGNARA COGOZZO','2026-09-26T15:00:00','26/09/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-010',2,'andata','G & B UNITED CAMPITELLO','U.S. CERETA','2026-09-25T21:00:00','25/09/26','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-011',2,'andata','CITTADELLA','NAC AMATORI CASTELLANA','2026-09-26T15:00:00','26/09/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-2-012',2,'andata','ASD GRAZIE','ASD LEVATA FRAGOLETTA','2026-09-25T21:00:00','25/09/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-013',3,'andata','ASD LEVATA FRAGOLETTA','CASALPOGLIO ELETTR. VEGA','2026-10-03T15:00:00','03/10/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-014',3,'andata','NAC AMATORI CASTELLANA','ASD GRAZIE','2026-10-02T21:15:00','02/10/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-015',3,'andata','U.S. CERETA','CITTADELLA','2026-10-02T20:45:00','02/10/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-016',3,'andata','G & B UNITED CAMPITELLO','ASD AMATORI CLUB 94','2026-10-02T21:00:00','02/10/26','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-017',3,'andata','CICOGNARA COGOZZO','TORMEC PEGOGNAGA','2026-10-02T21:00:00','02/10/26','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-3-018',3,'andata','ASD AMATORI GAZOLDO','ALIMENTIS A.C. COMMESSAGGIO','2026-10-03T15:30:00','03/10/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-019',4,'andata','CASALPOGLIO ELETTR. VEGA','CICOGNARA COGOZZO','2026-10-10T15:00:00','10/10/26','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-020',4,'andata','ALIMENTIS A.C. COMMESSAGGIO','G & B UNITED CAMPITELLO','2026-10-10T15:00:00','10/10/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-021',4,'andata','CITTADELLA','ASD AMATORI GAZOLDO','2026-10-10T15:00:00','10/10/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-022',4,'andata','TORMEC PEGOGNAGA','ASD GRAZIE','2026-10-09T21:00:00','09/10/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-023',4,'andata','ASD AMATORI CLUB 94','ASD LEVATA FRAGOLETTA','2026-10-10T15:00:00','10/10/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-4-024',4,'andata','NAC AMATORI CASTELLANA','U.S. CERETA','2026-10-09T21:15:00','09/10/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-025',5,'andata','U.S. CERETA','CASALPOGLIO ELETTR. VEGA','2026-10-16T20:45:00','16/10/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-026',5,'andata','ASD AMATORI CLUB 94','NAC AMATORI CASTELLANA','2026-10-17T15:00:00','17/10/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-027',5,'andata','ASD LEVATA FRAGOLETTA','TORMEC PEGOGNAGA','2026-10-17T15:00:00','17/10/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-028',5,'andata','ASD GRAZIE','ASD AMATORI GAZOLDO','2026-10-16T21:00:00','16/10/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-029',5,'andata','ALIMENTIS A.C. COMMESSAGGIO','CITTADELLA','2026-10-17T15:00:00','17/10/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-5-030',5,'andata','CICOGNARA COGOZZO','G & B UNITED CAMPITELLO','2026-10-16T21:00:00','16/10/26','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-031',6,'andata','CASALPOGLIO ELETTR. VEGA','ASD AMATORI CLUB 94','2026-10-24T15:00:00','24/10/26','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-032',6,'andata','TORMEC PEGOGNAGA','U.S. CERETA','2026-10-23T21:00:00','23/10/25','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',1);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-033',6,'andata','ASD AMATORI GAZOLDO','NAC AMATORI CASTELLANA','2026-10-24T15:30:00','24/10/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-034',6,'andata','ASD LEVATA FRAGOLETTA','ALIMENTIS A.C. COMMESSAGGIO','2026-10-24T15:00:00','24/10/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-035',6,'andata','CICOGNARA COGOZZO','ASD GRAZIE','2026-10-23T21:00:00','23/10/25','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',1);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-6-036',6,'andata','G & B UNITED CAMPITELLO','CITTADELLA','2026-10-23T21:00:00','23/10/26','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-037',7,'andata','NAC AMATORI CASTELLANA','CASALPOGLIO ELETTR. VEGA','2026-10-30T21:15:00','30/10/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-038',7,'andata','U.S. CERETA','ASD LEVATA FRAGOLETTA','2026-10-30T20:45:00','30/10/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-039',7,'andata','ASD AMATORI CLUB 94','ASD GRAZIE','2026-10-31T15:00:00','31/10/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-040',7,'andata','CITTADELLA','TORMEC PEGOGNAGA','2026-10-31T15:00:00','31/10/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-041',7,'andata','G & B UNITED CAMPITELLO','ASD AMATORI GAZOLDO','2026-10-30T21:00:00','30/10/26','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-7-042',7,'andata','ALIMENTIS A.C. COMMESSAGGIO','CICOGNARA COGOZZO','2026-10-31T15:00:00','31/10/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-043',8,'andata','CASALPOGLIO ELETTR. VEGA','ALIMENTIS A.C. COMMESSAGGIO','2026-11-07T15:00:00','07/11/26','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-044',8,'andata','ASD AMATORI GAZOLDO','CICOGNARA COGOZZO','2026-11-07T15:30:00','07/11/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-045',8,'andata','TORMEC PEGOGNAGA','G & B UNITED CAMPITELLO','2026-11-06T21:00:00','06/11/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-046',8,'andata','CITTADELLA','ASD AMATORI CLUB 94','2026-11-07T15:00:00','07/11/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-047',8,'andata','ASD GRAZIE','U.S. CERETA','2026-11-06T21:00:00','06/11/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-8-048',8,'andata','ASD LEVATA FRAGOLETTA','NAC AMATORI CASTELLANA','2026-11-07T15:00:00','07/11/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-049',9,'andata','G & B UNITED CAMPITELLO','CASALPOGLIO ELETTR. VEGA','2026-11-14T15:00:00','14/11/26','15:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-050',9,'andata','CICOGNARA COGOZZO','CITTADELLA','2026-11-13T21:00:00','13/11/26','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-051',9,'andata','ALIMENTIS A.C. COMMESSAGGIO','ASD GRAZIE','2026-11-14T15:00:00','14/11/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-052',9,'andata','ASD LEVATA FRAGOLETTA','ASD AMATORI GAZOLDO','2026-11-14T15:00:00','14/11/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-053',9,'andata','NAC AMATORI CASTELLANA','TORMEC PEGOGNAGA','2026-11-13T21:15:00','13/11/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-9-054',9,'andata','ASD AMATORI CLUB 94','U.S. CERETA','2026-11-14T15:00:00','14/11/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-055',10,'andata','TORMEC PEGOGNAGA','CASALPOGLIO ELETTR. VEGA','2026-11-20T21:00:00','20/11/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-056',10,'andata','ASD AMATORI GAZOLDO','ASD AMATORI CLUB 94','2026-11-21T15:30:00','21/11/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-057',10,'andata','U.S. CERETA','ALIMENTIS A.C. COMMESSAGGIO','2026-11-20T20:45:00','20/11/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-058',10,'andata','NAC AMATORI CASTELLANA','CICOGNARA COGOZZO','2026-11-20T21:15:00','20/11/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-059',10,'andata','G & B UNITED CAMPITELLO','ASD LEVATA FRAGOLETTA','2026-11-21T15:00:00','21/11/26','15:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-10-060',10,'andata','CITTADELLA','ASD GRAZIE','2026-11-21T15:00:00','21/11/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-061',11,'andata','CASALPOGLIO ELETTR. VEGA','CITTADELLA','2026-11-28T15:00:00','28/11/25','15:00','CASALPOGLIO',NULL,NULL,'scheduled',1);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-062',11,'andata','ASD GRAZIE','G & B UNITED CAMPITELLO','2026-11-27T21:00:00','27/11/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-063',11,'andata','ASD LEVATA FRAGOLETTA','CICOGNARA COGOZZO','2026-11-28T15:00:00','28/11/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-064',11,'andata','ALIMENTIS A.C. COMMESSAGGIO','NAC AMATORI CASTELLANA','2026-11-28T15:00:00','28/11/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-065',11,'andata','U.S. CERETA','ASD AMATORI GAZOLDO','2026-11-27T20:45:00','27/11/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('andata-11-066',11,'andata','ASD AMATORI CLUB 94','TORMEC PEGOGNAGA','2026-11-28T15:00:00','28/11/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-067',1,'ritorno','CASALPOGLIO ELETTR. VEGA','ASD GRAZIE','2026-12-05T15:00:00','05/12/26','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-068',1,'ritorno','CITTADELLA','ASD LEVATA FRAGOLETTA','2026-12-05T15:00:00','05/12/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-069',1,'ritorno','NAC AMATORI CASTELLANA','G & B UNITED CAMPITELLO','2026-12-04T21:15:00','04/12/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-070',1,'ritorno','CICOGNARA COGOZZO','U.S. CERETA','2026-12-04T21:00:00','04/12/26','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-071',1,'ritorno','ASD AMATORI CLUB 94','ALIMENTIS A.C. COMMESSAGGIO','2026-12-05T15:00:00','05/12/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-1-072',1,'ritorno','TORMEC PEGOGNAGA','ASD AMATORI GAZOLDO','2026-12-04T21:00:00','04/12/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-073',3,'ritorno','CASALPOGLIO ELETTR. VEGA','ASD LEVATA FRAGOLETTA','2026-12-11T21:00:00','11/12/26','21:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-074',3,'ritorno','ASD GRAZIE','NAC AMATORI CASTELLANA','2026-12-11T21:00:00','11/12/26','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-075',3,'ritorno','CITTADELLA','U.S. CERETA','2026-12-12T15:00:00','12/12/26','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-076',3,'ritorno','ASD AMATORI CLUB 94','G & B UNITED CAMPITELLO','2026-12-12T15:00:00','12/12/26','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-077',3,'ritorno','TORMEC PEGOGNAGA','CICOGNARA COGOZZO','2026-12-11T21:00:00','11/12/26','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-3-078',3,'ritorno','ALIMENTIS A.C. COMMESSAGGIO','ASD AMATORI GAZOLDO','2026-12-12T15:00:00','12/12/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-079',2,'ritorno','ASD AMATORI GAZOLDO','CASALPOGLIO ELETTR. VEGA','2026-12-19T15:30:00','19/12/26','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-080',2,'ritorno','ALIMENTIS A.C. COMMESSAGGIO','TORMEC PEGOGNAGA','2026-12-19T15:00:00','19/12/26','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-081',2,'ritorno','CICOGNARA COGOZZO','ASD AMATORI CLUB 94','2026-12-18T21:00:00','18/12/26','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-082',2,'ritorno','U.S. CERETA','G & B UNITED CAMPITELLO','2026-12-18T20:45:00','18/12/26','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-083',2,'ritorno','NAC AMATORI CASTELLANA','CITTADELLA','2026-12-18T21:15:00','18/12/26','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-2-084',2,'ritorno','ASD LEVATA FRAGOLETTA','ASD GRAZIE','2026-12-19T15:00:00','19/12/26','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-085',4,'ritorno','CICOGNARA COGOZZO','CASALPOGLIO ELETTR. VEGA','2027-01-22T21:00:00','22/01/27','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-086',4,'ritorno','G & B UNITED CAMPITELLO','ALIMENTIS A.C. COMMESSAGGIO','2027-01-23T15:00:00','23/01/27','15:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-087',4,'ritorno','ASD AMATORI GAZOLDO','CITTADELLA','2027-01-23T15:30:00','23/01/27','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-088',4,'ritorno','ASD GRAZIE','TORMEC PEGOGNAGA','2027-01-22T21:00:00','22/01/27','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-089',4,'ritorno','ASD LEVATA FRAGOLETTA','ASD AMATORI CLUB 94','2027-01-23T15:00:00','23/01/27','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-4-090',4,'ritorno','U.S. CERETA','NAC AMATORI CASTELLANA','2027-01-22T21:00:00','22/01/27','21:00','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-091',5,'ritorno','CASALPOGLIO ELETTR. VEGA','U.S. CERETA','2027-01-30T15:00:00','30/01/27','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-092',5,'ritorno','NAC AMATORI CASTELLANA','ASD AMATORI CLUB 94','2027-01-29T21:15:00','29/01/27','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-093',5,'ritorno','TORMEC PEGOGNAGA','ASD LEVATA FRAGOLETTA','2027-01-29T21:00:00','29/01/27','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-094',5,'ritorno','ASD AMATORI GAZOLDO','ASD GRAZIE','2027-01-28T21:15:00','28/01/27','21:15','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-095',5,'ritorno','CITTADELLA','ALIMENTIS A.C. COMMESSAGGIO','2027-01-30T15:00:00','30/01/27','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-5-096',5,'ritorno','G & B UNITED CAMPITELLO','CICOGNARA COGOZZO','2027-01-30T15:00:00','30/01/27','15:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-097',6,'ritorno','ASD AMATORI CLUB 94','CASALPOGLIO ELETTR. VEGA','2027-02-06T15:00:00','06/02/27','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-098',6,'ritorno','U.S. CERETA','TORMEC PEGOGNAGA','2027-02-05T20:45:00','05/02/27','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-099',6,'ritorno','NAC AMATORI CASTELLANA','ASD AMATORI GAZOLDO','2027-02-05T21:15:00','05/02/27','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-100',6,'ritorno','ALIMENTIS A.C. COMMESSAGGIO','ASD LEVATA FRAGOLETTA','2027-02-06T15:00:00','06/02/27','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-101',6,'ritorno','ASD GRAZIE','CICOGNARA COGOZZO','2027-02-05T21:00:00','05/02/27','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-6-102',6,'ritorno','CITTADELLA','G & B UNITED CAMPITELLO','2027-02-06T15:00:00','06/02/27','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-103',7,'ritorno','CASALPOGLIO ELETTR. VEGA','NAC AMATORI CASTELLANA','2027-02-13T15:00:00','13/02/27','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-104',7,'ritorno','ASD LEVATA FRAGOLETTA','U.S. CERETA','2027-02-13T15:00:00','13/02/27','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-105',7,'ritorno','ASD GRAZIE','ASD AMATORI CLUB 94','2027-02-12T21:00:00','12/02/27','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-106',7,'ritorno','TORMEC PEGOGNAGA','CITTADELLA','2027-02-12T21:00:00','12/02/27','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-107',7,'ritorno','ASD AMATORI GAZOLDO','G & B UNITED CAMPITELLO','2027-02-13T15:30:00','13/02/27','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-7-108',7,'ritorno','CICOGNARA COGOZZO','ALIMENTIS A.C. COMMESSAGGIO','2027-02-12T21:00:00','12/02/27','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-109',8,'ritorno','ALIMENTIS A.C. COMMESSAGGIO','CASALPOGLIO ELETTR. VEGA','2027-02-20T15:00:00','20/02/27','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-110',8,'ritorno','CICOGNARA COGOZZO','ASD AMATORI GAZOLDO','2027-02-19T21:00:00','19/02/27','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-111',8,'ritorno','G & B UNITED CAMPITELLO','TORMEC PEGOGNAGA','2027-02-20T15:00:00','20/02/27','15:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-112',8,'ritorno','ASD AMATORI CLUB 94','CITTADELLA','2027-02-20T15:00:00','20/02/27','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-113',8,'ritorno','U.S. CERETA','ASD GRAZIE','2027-02-19T20:45:00','19/02/27','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-8-114',8,'ritorno','NAC AMATORI CASTELLANA','ASD LEVATA FRAGOLETTA','2027-02-19T21:15:00','19/02/27','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-115',9,'ritorno','CASALPOGLIO ELETTR. VEGA','G & B UNITED CAMPITELLO','2027-02-27T15:00:00','27/02/27','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-116',9,'ritorno','CITTADELLA','CICOGNARA COGOZZO','2027-02-27T15:00:00','27/02/27','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-117',9,'ritorno','ASD GRAZIE','ALIMENTIS A.C. COMMESSAGGIO','2027-02-26T21:00:00','26/02/27','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-118',9,'ritorno','ASD AMATORI GAZOLDO','ASD LEVATA FRAGOLETTA','2027-02-27T15:30:00','27/02/27','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-119',9,'ritorno','TORMEC PEGOGNAGA','NAC AMATORI CASTELLANA','2027-02-26T21:00:00','26/02/27','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-9-120',9,'ritorno','U.S. CERETA','ASD AMATORI CLUB 94','2027-02-26T20:45:00','26/02/27','20:45','CERETA DI VOLTA MN',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-121',10,'ritorno','CASALPOGLIO ELETTR. VEGA','TORMEC PEGOGNAGA','2027-03-06T15:00:00','06/03/27','15:00','CASALPOGLIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-122',10,'ritorno','ASD AMATORI CLUB 94','ASD AMATORI GAZOLDO','2027-03-06T15:00:00','06/03/27','15:00','SCANDOLARA RAVARA (CR)',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-123',10,'ritorno','ALIMENTIS A.C. COMMESSAGGIO','U.S. CERETA','2027-03-06T15:00:00','06/03/27','15:00','COMMESSAGGIO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-124',10,'ritorno','CICOGNARA COGOZZO','NAC AMATORI CASTELLANA','2027-03-05T21:00:00','05/03/27','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-125',10,'ritorno','ASD LEVATA FRAGOLETTA','G & B UNITED CAMPITELLO','2027-03-06T15:00:00','06/03/27','15:00','LEVATA DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-10-126',10,'ritorno','ASD GRAZIE','CITTADELLA','2027-03-05T21:00:00','05/03/27','21:00','GRAZIE DI CURTATONE',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-127',11,'ritorno','CITTADELLA','CASALPOGLIO ELETTR. VEGA','2027-03-13T15:00:00','13/03/27','15:00','CITTADELLA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-128',11,'ritorno','G & B UNITED CAMPITELLO','ASD GRAZIE','2027-03-12T21:00:00','12/03/27','21:00','CAMPITELLO DI MARCARIA',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-129',11,'ritorno','CICOGNARA COGOZZO','ASD LEVATA FRAGOLETTA','2027-03-12T21:00:00','12/03/27','21:00','CICOGNARA DI COGOZZO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-130',11,'ritorno','NAC AMATORI CASTELLANA','ALIMENTIS A.C. COMMESSAGGIO','2027-03-12T21:15:00','12/03/27','21:15','CASTELGOFFREDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-131',11,'ritorno','ASD AMATORI GAZOLDO','U.S. CERETA','2027-03-13T15:30:00','13/03/27','15:30','GAZOLDO',NULL,NULL,'scheduled',0);
INSERT OR IGNORE INTO `matches` (`id`,`round`,`phase`,`home`,`away`,`scheduled_at`,`source_date`,`time`,`field`,`home_goals`,`away_goals`,`status`,`source_anomaly`) VALUES ('ritorno-11-132',11,'ritorno','TORMEC PEGOGNAGA','ASD AMATORI CLUB 94','2027-03-12T21:00:00','12/03/27','21:00','POLESINE DI PEGOGNAGA',NULL,NULL,'scheduled',0);


CREATE TABLE IF NOT EXISTS `memorial_hearts` (
  `id` text PRIMARY KEY NOT NULL,
  `count` integer DEFAULT 0 NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT OR IGNORE INTO `memorial_hearts` (`id`, `count`) VALUES ('manuel', 0);

-- Aggiornamento calendario ufficiale MSP 2026/27: orari casalinghi ASD AMATORI GAZOLDO alle 15:30
UPDATE `matches` SET `scheduled_at`='2026-09-19T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='andata-1-006';
UPDATE `matches` SET `scheduled_at`='2026-10-03T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='andata-3-018';
UPDATE `matches` SET `scheduled_at`='2026-10-24T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='andata-6-033';
UPDATE `matches` SET `scheduled_at`='2026-11-07T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='andata-8-044';
UPDATE `matches` SET `scheduled_at`='2026-11-21T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='andata-10-056';
UPDATE `matches` SET `scheduled_at`='2026-12-19T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='ritorno-2-079';
UPDATE `matches` SET `scheduled_at`='2027-01-23T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='ritorno-4-087';
UPDATE `matches` SET `scheduled_at`='2027-02-13T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='ritorno-7-107';
UPDATE `matches` SET `scheduled_at`='2027-02-27T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='ritorno-9-118';
UPDATE `matches` SET `scheduled_at`='2027-03-13T15:30:00', `time`='15:30', `updated_at`=CURRENT_TIMESTAMP WHERE `id`='ritorno-11-131';
