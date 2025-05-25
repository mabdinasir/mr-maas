import type { RequestHandler } from 'express'
import { db } from '@db/client'
import { eq } from 'drizzle-orm'
import { users, tokenBlacklist } from '@db/schema'

const signOut: RequestHandler = async (request, response) => {
    try {
        const userId = request?.user?.id
        const token = request?.token ?? ''

        if (!userId || !token) {
            response.status(400).json({ success: false, message: 'Invalid request: Missing user or token' })
            return
        }

        await db.update(users).set({ isSignedIn: false }).where(eq(users.id, userId))
        await db.insert(tokenBlacklist).values({ token })

        response.status(200).json({ success: true, message: 'Signed out successfully' })
    } catch (error) {
        response.status(500).json({ success: false, message: `Signout failed: ${(error as Error).message}` })
    }
}

export default signOut
