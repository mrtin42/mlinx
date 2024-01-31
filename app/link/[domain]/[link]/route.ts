import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(req: NextRequest, { params }: { params: { link: string, domain: string } }) {

    const link = await ormServer.link.findUnique({
        where: {
            slug: params.link,
            domain: params.domain,
        },
    });
    if (!link) {
        return new Response(``, { status: 307, headers: { 'Content-Type': 'text/json', 'Location': `https://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}` } })
    }
    return new Response(`${link}`, { status: 200, headers: { 'Content-Type': 'text/json' } })
}