import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('Role', ['USER', 'ADMIN'])
export const memoryTypeEnum = pgEnum('MemoryType', ['text', 'image', 'audio', 'video'])
