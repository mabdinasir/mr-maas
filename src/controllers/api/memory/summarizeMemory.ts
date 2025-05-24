import { summarizeWithOllama } from '@lib/ai-sdk/summarizeWithOllama'
import { db } from '@db/client'
import { memoryEntries } from '@db/schema'
import { memorySummarizationSchema } from '@schemas/summarization.schema'
import type { RequestHandler } from 'express'
import { and, desc, eq, sql } from 'drizzle-orm'

const summarizeMemory: RequestHandler = async (req, res) => {
    try {
        const data = await memorySummarizationSchema.parseAsync(req.body)
        let memories = data.content || []

        if (!memories.length && data.userId) {
            const conditions = [eq(memoryEntries.userId, data.userId)]

            if (data.type) {
                conditions.push(eq(memoryEntries.type, data.type))
            }

            if (data.metadata) {
                for (const [key, value] of Object.entries(data.metadata)) {
                    const isArray = Array.isArray(value)
                    const valJson = isArray ? JSON.stringify(value) : JSON.stringify([value])
                    conditions.push(sql`metadata->${key} @> ${valJson}::jsonb`)
                }
            }

            const results = await db
                .select({ content: memoryEntries.content })
                .from(memoryEntries)
                .where(and(...conditions))
                .orderBy(desc(memoryEntries.createdAt))
                .limit(10)

            memories = results.map((entry) => entry.content)
        }

        if (!memories.length) {
            res.status(404).json({
                success: false,
                message: 'No memories found to summarize',
            })
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
