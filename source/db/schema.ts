import { sqliteTable, text, index, uniqueIndex, integer } from 'drizzle-orm/sqlite-core';
export const workouts = sqliteTable('workouts', {id:text('id').primaryKey(),owner:text('owner').notNull(),date:text('date').notNull(),name:text('name').notNull(),unit:text('unit').notNull(),exercises:text('exercises').notNull()}, t=>[index('idx_workouts_owner_date').on(t.owner,t.date)]);

export const nutritionProfiles=sqliteTable('nutrition_profiles',{owner:text('owner').primaryKey(),profile:text('profile').notNull()});
export const weightEntries=sqliteTable('weight_entries',{owner:text('owner').notNull(),date:text('date').notNull(),payload:text('payload').notNull()},t=>[uniqueIndex('idx_weight_owner_date').on(t.owner,t.date)]);
export const foodEntries=sqliteTable('food_entries',{id:text('id').primaryKey(),owner:text('owner').notNull(),date:text('date').notNull(),payload:text('payload').notNull()},t=>[index('idx_food_owner_date').on(t.owner,t.date)]);
export const photoUsage=sqliteTable('photo_usage',{owner:text('owner').notNull(),day:text('day').notNull(),count:integer('count').notNull()},t=>[uniqueIndex('idx_photo_usage_owner_day').on(t.owner,t.day)]);
