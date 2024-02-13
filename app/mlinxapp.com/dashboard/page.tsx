import { getSession } from "@auth0/nextjs-auth0";
import Dashboard from "./pclient";
import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function Home() {
    const { user } = await getSession() ?? { user: null };

    if (user) {
        var userinfo = await ormServer.profile.findUnique({
          where: {
            sub: user.sub,
          },
        })
        if (!userinfo) {
          await ormServer.profile.create({
            data: {
              sub: user.sub,
              name: user.name,
              email: user.email
            },
          });
          userinfo = await ormServer.profile.findUnique({
            where: {
              sub: user.sub,
            },
          });
        }
        var links = await ormServer.link.findMany({
            where: {
                ownerId: user.sub,
            }
        });
        var domains = await ormServer.domain.findMany({
            where: {
                ownerId: user.sub,
            },
            select: {
                domain: true,
            }
        });
    } else {
        return redirect("/api/auth/login");
    }
    
    const u = userinfo;
    const l = links;
    const d = domains;

    return <Dashboard u={u} l={l} d={d} />;
}