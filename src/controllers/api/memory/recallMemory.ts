import type { RequestHandler } from 'express'
import { z } from 'zod'
import { prisma } from '@lib/prismaClient'
import { getEmbeddings } from '@lib/ai-sdk/embed'
import { MemoryEntry } from '@prisma/client'

// Zod schema for request body validation
const recallMemorySchema = z.object({
    query: z.string().min(1, 'Query is required'),
    userId: z.string().uuid('Invalid user ID'),
    topK: z.number().min(1).max(50).optional(), // Optional top-k value. The number of memories to return
})

const recallMemory: RequestHandler = async (request, response) => {
    try {
        // Validate request
        const recallData = await recallMemorySchema.safeParse(request.body)

        if (!recallData.success) {
            response.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: recallData.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            })
            return
        }

        const { query, userId, topK = 5 } = recallData.data

        // Get embedding for query
        const [queryEmbedding] = await getEmbeddings([query])

        // Perform semantic search using pgvector <=> operator (cosine distance)
        const memories = await prisma.$queryRawUnsafe<MemoryEntry[]>(
            `
            SELECT id, content, embedding::text, "createdAt", "userId"
            FROM "MemoryEntry"
            WHERE "userId" = $2
            ORDER BY embedding <=> $1::vector
            LIMIT $3
        `,
            queryEmbedding,
            userId,
            topK,
        )

        response.status(200).json({
            success: true,
            message: 'Memories recalled successfully!',
            memories,
        })
    } catch (error) {
        response.status(500).json({
            success: false,
            message: `Internal server error: ${(error as Error).message}`,
        })
    }
}

export default recallMemory
