import { getSession } from "@auth0/nextjs-auth0";
import LinkPage from "./pclient";
import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";
import puppeteer from "puppeteer";
import { print } from "@/lib/utils";

interface Props {
  searchParams: {
    [key: string]: string; 
  }
}

  export default async function Profile({ searchParams }: Props) {
      console.log('x');
      console.log(searchParams);
      const { user } = await getSession() ?? { user: null };
      const slug = searchParams.key;
      const domain = searchParams.domain;
      print(`slug: ${slug}, domain: ${domain}`);
    
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
            unique_link: {
              slug: slug,
              domain: domain
            }
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


    return <LinkPage u={u} l={l} />;
}