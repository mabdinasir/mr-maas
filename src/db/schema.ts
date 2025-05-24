import { pgTable, uuid, text, timestamp, boolean, pgEnum, vector, jsonb } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('Role', ['USER', 'ADMIN'])
export const memoryTypeEnum = pgEnum('MemoryType', ['text', 'image', 'audio', 'video'])

export const users = pgTable('User', {
    id: uuid('id').defaultRandom().primaryKey(),
    password: text('password').notNull(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    mobile: text('mobile').notNull().unique(),
    email: text('email').notNull().unique(),
    isSignedIn: boolean('isSignedIn').default(false),
    isDeleted: boolean('isDeleted').default(false),
    hasAcceptedTnC: boolean('hasAcceptedTnC').default(false),
    role: roleEnum('role').default('USER'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    profilePicture: text('profilePicture'),
    bio: text('bio'),
})

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

export const tokenBlacklist = pgTable('TokenBlacklist', {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow(),
})
