import type { RequestHandler } from 'express'
import { db } from '@db/client'
import { memoryEntries } from '@db/schema'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'
import { recallMemorySchema } from '@schemas/recallMemory.schema'
import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'

const recallMemory: RequestHandler = async (request, response) => {
    try {
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

        const [queryEmbedding] = await embedWithOllama([query])

        const similarity = sql<number>`1 - (${cosineDistance(memoryEntries.embedding, queryEmbedding)})`

        const memories = await db
            .select({
                id: memoryEntries.id,
                content: memoryEntries.content,
                createdAt: memoryEntries.createdAt,
                userId: memoryEntries.userId,
                similarity,
            })
            .from(memoryEntries)
            .where(and(eq(memoryEntries.userId, userId), gt(similarity, 0.5)))
            .orderBy(desc(similarity))
            .limit(topK)

        if (memories.length === 0) {
            response.status(404).json({
                success: false,
                message: 'No relevant memories found.',
            })
            return
        }

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
