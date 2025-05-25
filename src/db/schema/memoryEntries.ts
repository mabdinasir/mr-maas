import { pgTable, uuid, text, timestamp, vector, jsonb } from 'drizzle-orm/pg-core'
import { memoryTypeEnum } from './enums'
import { users } from './users'

export const memoryEntries = pgTable('MemoryEntry', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }),
    createdAt: timestamp('createdAt').defaultNow(),
    userId: uuid('userId')
        .notNull()
        .references(() => users.id),
    type: memoryTypeEnum('type').default('text'),
    metadata: jsonb('metadata'),
})
