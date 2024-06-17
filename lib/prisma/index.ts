import { PrismaClient as serverClient } from '@prisma/client'

const ormServer = new serverClient()

export default ormServer;