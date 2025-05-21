import { z } from 'zod'

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    bio: z.string().optional(),
})

export { profileSchema }
