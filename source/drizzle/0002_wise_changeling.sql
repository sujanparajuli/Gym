CREATE TABLE `photo_usage` (
	`owner` text NOT NULL,
	`day` text NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_photo_usage_owner_day` ON `photo_usage` (`owner`,`day`);