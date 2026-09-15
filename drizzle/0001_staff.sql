CREATE TABLE IF NOT EXISTS `staff` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `role` text NOT NULL,
  `bio` text DEFAULT '' NOT NULL,
  `photo_key` text,
  `active` integer DEFAULT 1 NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS `staff_sort_idx` ON `staff` (`active`,`sort_order`,`name`);
