import { z } from 'zod'

export const memoryEntrySchema = z.object({
    content: z.string().min(1, 'Content is required'),
    userId: z.string().uuid('Invalid user ID'),
})
