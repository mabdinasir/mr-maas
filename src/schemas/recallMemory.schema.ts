import { z } from 'zod'

export const recallMemorySchema = z.object({
    query: z.string().min(3, 'Query is required and must be at least 3 characters long'),
    userId: z.string().uuid('Invalid user ID'),
    topK: z.number().min(1).max(50).optional(),
    type: z.enum(['text', 'image', 'audio', 'video']).optional(),
    metadata: z.record(z.any()).optional(),
})
