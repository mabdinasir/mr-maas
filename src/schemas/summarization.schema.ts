import { z } from 'zod'

export const memorySummarizationSchema = z
    .object({
        userId: z.string().uuid().optional(),
        content: z.array(z.string()).min(1).optional(),
        type: z.enum(['text', 'image', 'audio', 'video']).optional(),
        metadata: z.record(z.any()).optional(),
    })
    .refine((data) => data.userId || data.content, {
        message: 'Either userId or content must be provided.',
    })
