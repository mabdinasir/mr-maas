import { z } from 'zod'

export const recallMemorySchema = z.object({
    query: z.string().min(3, 'Query is required and must be at least 3 characters long'),
    userId: z.string().uuid('Invalid user ID'),
    topK: z.number().min(1).max(50).optional(), // Optional top-k value. The number of memories to return
})
