import { PrismaClient as serverClient } from '@prisma/client'
import { PrismaClient as edgingClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const ormServer = new serverClient()
const ormEdge = new edgingClient().$extends(withAccelerate())

export default ormServer;
export { ormEdge };