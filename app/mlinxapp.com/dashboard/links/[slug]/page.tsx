import { getSession } from "@auth0/nextjs-auth0";
import LinkPage from "./pclient";
import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";
import puppeteer from "puppeteer";

export default async function Profile({ params }: { params: { slug: string }}) {
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
        var link = await ormServer.link.findUnique({
          where: {
            slug: params.slug,
          },
        });
        if (link?.ownerId !== user.sub) {
          throw new Error("You do not own this link.");
        }
    } else {
        return redirect("/api/auth/login");
    }
    
    const u = userinfo;
    const l = link;


    return <LinkPage u={u} l={l} slug={params.slug} />;
}