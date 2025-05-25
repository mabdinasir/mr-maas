import type { RequestHandler } from 'express'
import { storeMemorySchema } from '@schemas/storeMemory.schema'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'
import { db } from '@db/client'
import { memoryEntries } from '@db/schema'

const storeMemory: RequestHandler = async (request, response) => {
    try {
        // ✅ 1: Validate request body
        const memoryData = storeMemorySchema.safeParse(request.body)
        if (!memoryData.success) {
            response.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: memoryData.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            })
            return
        }

        const { content, userId, type, metadata } = memoryData.data

        // ✅ 2: Generate 768-dim embedding
        const [embedding] = await embedWithOllama([content])
        if (!embedding || embedding.length !== 768) {
            throw new Error('Embedding must be a 768-dimensional array')
        }

        // ✅ 3: Insert into DB using Drizzle
        const [memory] = await db
            .insert(memoryEntries)
            .values({ userId, content, embedding, type, metadata })
            .returning({
                id: memoryEntries.id,
                userId: memoryEntries.userId,
                content: memoryEntries.content,
                embedding: memoryEntries.embedding,
                type: memoryEntries.type,
                metadata: memoryEntries.metadata,
                createdAt: memoryEntries.createdAt,
            })

        // ✅ 4: Respond with success
        response.status(200).json({
            success: true,
            message: 'Memory stored successfully!',
            memory,
        })
    } catch (error) {
        response.status(500).json({
            success: false,
            message: `Internal server error: ${(error as Error).message}`,
        })
    }
}

export default storeMemory
