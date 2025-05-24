import type { RequestHandler } from 'express'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '@lib/utils/security/hashPassword'
import { loginSchema } from '@schemas/index'
import { omitPassword } from '@lib/utils/security/omitPassword'
import { generateJwtToken } from '@lib/utils/auth/generateJwtToken'
import { users } from '@db/schema'
import { db } from '@db/client'

const login: RequestHandler = async (request, response) => {
    try {
        // Validate request body with Zod
        const userData = await loginSchema.parseAsync(request.body)

        // Find user by email
        const [existingUser] = await db.select().from(users).where(eq(users.email, userData.email))

        if (!existingUser) {
            response.status(404).json({ success: false, message: 'Sorry, user not found!' })
            return
        }

        // Verify password
        await verifyPassword(userData.password, existingUser.password || '', response)

        // Update user's sign-in status
        const [loggedInUser] = await db
            .update(users)
            .set({ isSignedIn: true, isDeleted: false, updatedAt: new Date() })
            .where(eq(users.id, existingUser.id))
            .returning()

        // Generate JWT and remove password
        const jwt = generateJwtToken(loggedInUser)
        const userWithoutPassword = omitPassword(loggedInUser)

        response.status(200).json({
            success: true,
            message: 'User signed in successfully!',
            user: userWithoutPassword,
            jwt,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            response.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            })
            return
        }

        response.status(500).json({
            success: false,
            message: `Internal error occurred: ${(error as Error).message}`,
        })
    }
}

export default login
