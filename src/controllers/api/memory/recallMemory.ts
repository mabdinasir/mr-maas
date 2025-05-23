import type { RequestHandler } from 'express'
import { prisma } from '@lib/prismaClient'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'
import { MemoryEntry } from '@prisma/client'
import { recallMemorySchema } from '@schemas/recallMemory.schema'

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
        const [queryEmbedding] = await embedWithOllama([query])

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
