import { NextRequest, NextResponse } from 'next/server'
import ormServer from '@/lib/prisma';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async function GetLinks(req: NextRequest) {
    const { user } = await getSession() ?? { user: null };
    if (!user) return new NextResponse(
        `{
            "error": "not_authenticated",
            "error_description": "The user does not have an active session or is not authenticated"
        }`, { status: 401, headers: { 'Content-Type': 'text/json' }})
    const links = await ormServer.link.findMany({
        where: {
            ownerId: user.sub,
        },
    });

    return NextResponse.json(links);
});