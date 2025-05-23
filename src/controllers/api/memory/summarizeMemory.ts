import { summarizeWithOllama } from '@lib/ai-sdk/summarizeWithOllama'
import { prisma } from '@lib/prismaClient'
import { memorySummarizationSchema } from '@schemas/summarization.schema'
import { RequestHandler } from 'express'

const summarizeMemory: RequestHandler = async (req, res) => {
    try {
        const data = await memorySummarizationSchema.parseAsync(req.body)
        let memories = data.content || []

        if (!memories.length && data.userId) {
            const results = await prisma.memoryEntry.findMany({
                where: { userId: data.userId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: { content: true },
            })
            memories = results.map((entry) => entry.content)
        }

        if (!memories.length) {
            res.status(404).json({ success: false, message: 'No memories found to summarize' })
            return
        }

        const summary = await summarizeWithOllama(memories)

        res.status(200).json({
            success: true,
            summary,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${(error as Error).message}`,
        })
    }
}

export default summarizeMemory
