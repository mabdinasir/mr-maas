import { db } from '@db/client'
import { tokenBlacklist } from '@db/schema'
import { lt } from 'drizzle-orm'

export const cleanupExpiredTokens = async () => {
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Delete tokens created more than 30 days ago
    await db.delete(tokenBlacklist).where(lt(tokenBlacklist.createdAt, thirtyDaysAgo))
}
