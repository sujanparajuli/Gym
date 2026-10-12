CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`date` text NOT NULL,
	`name` text NOT NULL,
	`unit` text NOT NULL,
	`exercises` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_workouts_owner_date` ON `workouts` (`owner`,`date`);