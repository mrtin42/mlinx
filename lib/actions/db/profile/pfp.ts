'use server';

import ormServer from '@/lib/prisma';
import { R2 as R2Client } from '@/lib/r2';
import { getSession } from '@auth0/nextjs-auth0';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const updatePFPinDB = async (url: string) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        return {
            success: false,
            message: "User not found",
        };
    } else if (!url.includes(user.sub)) {
        return {
            success: false,
            message: "You do not own this profile",
        };
    }
    
    const pfp = await ormServer.profile.update({
        where: {
            sub: user.sub,
        },
        data: {
            pfp: url,
        },
    });

    return {
        success: true,
        pfp,
    };
}  

export default updatePFPinDB;