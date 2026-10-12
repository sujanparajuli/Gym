CREATE TABLE `food_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`date` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_food_owner_date` ON `food_entries` (`owner`,`date`);--> statement-breakpoint
CREATE TABLE `nutrition_profiles` (
	`owner` text PRIMARY KEY NOT NULL,
	`profile` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weight_entries` (
	`owner` text NOT NULL,
	`date` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weight_owner_date` ON `weight_entries` (`owner`,`date`);