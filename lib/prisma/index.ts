import { PrismaClient as serverClient } from '@prisma/client'
import { PrismaClient as edgingClient } from '@prisma/client/edge'

const ormServer = new serverClient()
const ormEdge = new edgingClient()

export default ormServer;
export { ormEdge };