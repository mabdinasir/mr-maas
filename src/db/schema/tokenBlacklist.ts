import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const tokenBlacklist = pgTable('TokenBlacklist', {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow(),
})
