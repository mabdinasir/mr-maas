import { z } from 'zod'

export const generateAnswerWithRAGSchema = z.object({
    query: z.string().min(3, { message: 'Query must be at least 3 characters long' }),
    userId: z.string().uuid('Invalid user ID'),
    type: z.enum(['text', 'image', 'audio', 'video']).optional(),
    metadata: z.record(z.any()).optional(),
})
