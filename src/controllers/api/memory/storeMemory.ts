import type { RequestHandler } from 'express'
import { prisma } from '@lib/prismaClient'
import { storeMemorySchema } from '@schemas/storeMemory.schema'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'

const storeMemory: RequestHandler = async (request, response) => {
    try {
        // ✅ 1: Validate request body
        const memoryData = await storeMemorySchema.safeParse(request.body)
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

        const { content, userId } = memoryData.data

        // ✅ 2: Generate 768-dim embedding
        const [embedding] = await embedWithOllama([content])
        if (!embedding || embedding.length !== 768) {
            throw new Error(`Embedding must be a 768-dimensional array`)
        }

        // ✅ 3: Format embedding for SQL vector insertion
        const embeddingSqlLiteral = `ARRAY[${embedding.join(',')}]`

        // ✅ 4: Insert only required fields (let DB handle id + createdAt)
        const result = await prisma.$queryRawUnsafe(
            `
            INSERT INTO "MemoryEntry" ("userId", content, embedding)
            VALUES ($1, $2, ${embeddingSqlLiteral}::vector)
            RETURNING id, content, "createdAt", "userId", embedding::text AS embedding
        `,
            userId,
            content,
        )

        const memory = Array.isArray(result) ? result[0] : result

        // ✅ 5: Respond with stored memory
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
