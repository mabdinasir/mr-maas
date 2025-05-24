import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { roleEnum } from './enums'

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
