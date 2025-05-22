import type { RequestHandler } from 'express'
import { prisma } from '@lib/prismaClient'
import { memoryEntrySchema } from '@schemas/memoryEntry'
// import { getEmbeddings } from '@lib/ai-sdk/embed'

const storeMemory: RequestHandler = async (request, response) => {
    try {
        // Validate request
        const memoryData = await memoryEntrySchema.safeParse(request.body)
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

        // Generate embeddings
        // const [embedding] = await getEmbeddings([content])

        // Store in DB
        const memory = await prisma.memoryEntry.create({
            data: {
                content,
                // embedding,
                userId,
            },
        })

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
