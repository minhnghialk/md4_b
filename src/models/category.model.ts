import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    findMany: async function() {
        try {
            let categories = await prisma.categories.findMany()

            return {
                status: true,
                message: "get categories ok",
                data: categories
            }
        }
        catch (err) {
            return { 
                status: false,
                message: "Lỗi model",
                data: null
            }
        }
    },
}