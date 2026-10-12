import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const workouts = sqliteTable('workouts', {id:text('id').primaryKey(),owner:text('owner').notNull(),date:text('date').notNull(),name:text('name').notNull(),unit:text('unit').notNull(),exercises:text('exercises').notNull()}, t=>[index('idx_workouts_owner_date').on(t.owner,t.date)]);
