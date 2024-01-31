'use server';

import ormServer from '@/lib/prisma';

interface userParams {
    user: any;
}

export default async function userData({ user }: userParams) {
    let x = await ormServer.profile.findUnique({
        where: {
            sub: user.sub,
        },
    });
    if (!user) {
        await ormServer.profile.create({
            data: {
                sub: user.sub,
                name: user.name,
                email: user.email,

            },
        });
        x = await ormServer.profile.findUnique({
            where: {
                sub: user.sub,
            },
        });
    }
    const res = x;
    return res as any;
}