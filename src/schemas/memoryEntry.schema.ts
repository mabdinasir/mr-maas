import { z } from 'zod'

export const memoryEntrySchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    content: z.string().min(1, 'Content is required'),
})
