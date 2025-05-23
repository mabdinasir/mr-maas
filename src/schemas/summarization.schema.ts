import { z } from 'zod'

export const memorySummarizationSchema = z
    .object({
        userId: z.string().uuid().optional(),
        content: z.array(z.string()).min(1).optional(),
    })
    .refine((data) => data.userId || data.content, {
        message: 'Either userId or content must be provided.',
    })
