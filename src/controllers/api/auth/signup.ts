import type { RequestHandler } from 'express'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@lib/utils/security/hashPassword'
import { users } from '@db/schema'
import { z } from 'zod'
import { signUpSchema } from '@schemas/index'
import { omitPassword } from '@lib/utils/security/omitPassword'
import { db } from '@db/client'

const signUp: RequestHandler = async (request, response) => {
    try {
        // 1. Validate request body
        const userData = await signUpSchema.parseAsync(request.body)

        // 2. Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, userData.email))
        if (existingUser.length > 0) {
            response.status(409).json({
                success: false,
                message: 'User already exists!',
            })
            return
        }

        // 3. Hash password
        const hashedPassword = await hashPassword(userData.password)

        // 4. Insert new user
        const [newUser] = await db
            .insert(users)
            .values({
                ...userData,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning()

        // 5. Return user without password
        const userWithoutPassword = omitPassword(newUser)

        response.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: userWithoutPassword,
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
        }

        response.status(500).json({
            success: false,
            message: `Internal error occurred: ${(error as Error).message}`,
        })
    }
}

export default signUp
