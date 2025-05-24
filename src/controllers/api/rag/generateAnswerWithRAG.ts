import type { RequestHandler } from 'express'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'
import { db } from '@db/client'
import { memoryEntries } from '@db/schema'
import { generateAnswerWithRAGSchema } from '@schemas/generateAnswerWithRAG.schema'
import { createOllama } from 'ollama-ai-provider'
import { generateText } from 'ai'
import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'

const ollama = createOllama()
const model = ollama('qwen3')

const generateAnswerWithRAG: RequestHandler = async (req, res) => {
    try {
        const ragData = generateAnswerWithRAGSchema.safeParse(req.body)

        if (!ragData.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: ragData.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            })
            return
        }

        const { query, userId, type, metadata } = ragData.data

        // Step 1: Embed the query
        const [queryEmbedding] = await embedWithOllama([query])
        const similarity = sql<number>`1 - (${cosineDistance(memoryEntries.embedding, queryEmbedding)})`

        const conditions = [eq(memoryEntries.userId, userId), gt(similarity, 0.5)]

        if (type) {
            conditions.push(eq(memoryEntries.type, type))
        }

        if (metadata) {
            for (const [key, value] of Object.entries(metadata)) {
                const valJson = Array.isArray(value) ? JSON.stringify(value) : JSON.stringify([value])
                conditions.push(sql`metadata->${key} @> ${valJson}::jsonb`)
            }
        }

        const memories = await db
            .select({
                id: memoryEntries.id,
                content: memoryEntries.content,
                similarity,
            })
            .from(memoryEntries)
            .where(and(...conditions))
            .orderBy(desc(similarity))
            .limit(5)

        const context = memories.map((memory) => memory.content).join('\n')

        const result = await generateText({
            model,
            messages: [
                {
                    role: 'user',
                    content: `Context:\n${context}\n\nUser Question:\n${query}`,
                },
            ],
        })

        res.status(200).json({
            success: true,
            answer: result.text,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `RAG error: ${(error as Error).message}`,
        })
    }
}

export default generateAnswerWithRAG
