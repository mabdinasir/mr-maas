import type { RequestHandler } from 'express'
import { embedWithOllama } from '@lib/ai-sdk/embedWithOllama'
import { prisma } from '@lib/prismaClient'
import { generateAnswerWithRAGSchema } from '@schemas/generateAnswerWithRAG.schema'
import { MemoryEntry } from '@prisma/client'
import { createOllama } from 'ollama-ai-provider'
import { generateText } from 'ai'

const ollama = createOllama()
const model = ollama('qwen3')

const generateAnswerWithRAG: RequestHandler = async (req, res) => {
    try {
        // Validate request
        const ragData = await generateAnswerWithRAGSchema.safeParse(req.body)
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

        const { query, userId } = ragData.data

        // Step 1: Embed the query
        const [queryEmbedding] = await embedWithOllama([query])

        // Step 2: Retrieve relevant memory entries
        const memories = await prisma.$queryRawUnsafe<MemoryEntry[]>(
            `
                SELECT id, content
                FROM "MemoryEntry"
                WHERE "userId" = $1
                ORDER BY embedding <-> $2::vector
                LIMIT 5
            `,
            userId,
            queryEmbedding,
        )

        const context = memories.map((memory) => memory.content).join('\n')

        // Step 3: Use `generateText` with the custom model
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
