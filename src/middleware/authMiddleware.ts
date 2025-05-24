/* eslint-disable callback-return */
/* eslint-disable require-atomic-updates */
import type { RequestHandler } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import { db } from '@db/client'
import { users, tokenBlacklist } from '@db/schema'
import { authorizationSchema } from '@schemas/index'
import { verifyJwtToken } from '@lib/utils/auth/generateJwtToken'

dotenv.config()

export const authMiddleware: RequestHandler = async (request, response, next) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET

        if (!JWT_SECRET) {
            response.status(500).json({ success: false, message: 'Server configuration error' })
            return
        }

        // Validate authorization header structure
        const authorizationHeader = authorizationSchema.parse(request.headers.authorization)
        const token = authorizationHeader.split(' ')[1]

        if (!token) {
            response.status(401).json({ success: false, message: 'Authorization token missing' })
            return
        }

        // Verify token validity
        const decoded = verifyJwtToken(token)

        // Check if user exists
        const [isExistingUser] = await db.select().from(users).where(eq(users.email, decoded.email))

        if (!isExistingUser) {
            response.status(404).json({ success: false, message: 'User not found' })
            return
        }

        // Optional: Check if user is signed in
        // if (!isExistingUser.isSignedIn) {
        //     response.status(401).json({ success: false, message: 'Unauthorized: User is not signed in!' })
        //     return
        // }

        // Check token blacklist
        const [blacklistedToken] = await db.select().from(tokenBlacklist).where(eq(tokenBlacklist.token, token))

        if (blacklistedToken) {
            response.status(401).json({
                success: false,
                message: 'Token used has been revoked! Please sign in first!',
            })
            return
        }

        // Attach user context to request
        request.user = decoded
        request.token = token
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            response.status(401).json({ success: false, message: 'Session expired' })
            return
        }

        if (error instanceof jwt.JsonWebTokenError) {
            response.status(401).json({ success: false, message: `Invalid session: ${error.message}` })
            return
        }

        if (error instanceof z.ZodError) {
            response.status(400).json({
                success: false,
                message: 'Invalid authorization header',
                errors: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            })
            return
        }

        response.status(500).json({
            success: false,
            message: `Internal server error: ${(error as Error).message}`,
        })
    }
}
