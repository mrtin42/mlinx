import { getSession } from "@auth0/nextjs-auth0";
import Domains from "./pclient";
import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";
import { print } from "@/lib/utils";

export default async function DomainsPage() {
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
        var domains = await ormServer.domain.findMany({
            where: {
                ownerId: user.sub,
            },
            select: {
                domain: true,
                ownerId: true
            }
        });
    } else {
        return redirect("/api/auth/login");
    }

    print(userinfo);
    print(domains);

    const u = userinfo;
    const d = domains;

    return <Domains u={u} d={d} />;
}