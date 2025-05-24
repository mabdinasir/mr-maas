import { summarizeWithOllama } from '@lib/ai-sdk/summarizeWithOllama'
import { db } from '@db/client'
import { memoryEntries } from '@db/schema'
import { memorySummarizationSchema } from '@schemas/summarization.schema'
import type { RequestHandler } from 'express'
import { desc, eq } from 'drizzle-orm'

const summarizeMemory: RequestHandler = async (req, res) => {
    try {
        const data = await memorySummarizationSchema.parseAsync(req.body)
        let memories = data.content || []

        // If no explicit content passed, fetch latest top 10 memories for user filtered by similarity > 0.5
        if (!memories.length && data.userId) {
            // NOTE: Summarization likely doesn't need similarity filtering (?)
            // If you want similarity filtering here, you need a query embedding for something to compare against.
            // Otherwise, just get recent memories:
            const results = await db
                .select({ content: memoryEntries.content })
                .from(memoryEntries)
                .where(eq(memoryEntries.userId, data.userId))
                .orderBy(desc(memoryEntries.createdAt))
                .limit(10)

            memories = results.map((entry) => entry.content)
        }

        if (!memories.length) {
            res.status(404).json({ success: false, message: 'No memories found to summarize' })
            return
        }

        const summary = await summarizeWithOllama(memories)

        res.status(200).json({ success: true, summary })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${(error as Error).message}`,
        })
    }
}

export default summarizeMemory
