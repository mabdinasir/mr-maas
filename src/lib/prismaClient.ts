import dotenv from 'dotenv'
import { PrismaClient } from 'generated/prisma'

dotenv.config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

export { prisma }
