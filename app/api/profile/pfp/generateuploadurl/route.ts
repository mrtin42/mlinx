import { NextRequest, NextResponse } from "next/server";
import chalk from "chalk";
import { getSession } from "@auth0/nextjs-auth0";
import ormServer from "@/lib/prisma";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

import { R2 } from "@/lib/r2";

export async function GET(req: NextRequest) {
    const { user } = await getSession() ?? { user: null };
    if (!user) return new NextResponse(
        JSON.stringify({
            success: false,
            message: "User not found",
        }),
        {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const usertoGenLink = req.headers.get("X-Set-For-User") as string;
    const PfpFileType = req.headers.get("X-File-Type") as string; // so we can correctly set the content type
    if (user.sub !== usertoGenLink) return new NextResponse(
        JSON.stringify({
            success: false,
            message: "You do not own this profile",
        }),
        {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    try {
        console.log(chalk.green('auth check passed'))
        console.log(chalk.yellow('checking for existing pfp'))
        const pfpDBres = await ormServer.profile.findUnique({
            where: {
                sub: usertoGenLink,
            },
            select: {
                pfp: true,
            },
        })
        if (pfpDBres?.pfp && !pfpDBres.pfp.includes('defaults/default.png')) {
            console.log(chalk.red('pfp exists: deleting'))
            const pfpUrl = pfpDBres.pfp;
            const delurl = await getSignedUrl(
                R2,
                new DeleteObjectCommand({
                    Bucket: 'mlinx-users',
                    Key: pfpUrl.replace('https://users.cdn.mlinxapp.com/', ''),
                }),
                { expiresIn: 60 }
            )
            console.log(chalk.yellow('signed url obtained: requesting delete'))
            await axios.delete(delurl).then((res) => {
                if (res.status !== 204 && res.status !== 200 && res.status !== 202 && res.status !== 201) {
                    console.error(res);
                    return new NextResponse(
                        JSON.stringify({
                            success: false,
                            message: "Failed to delete old pfp",
                        }),
                        {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    )
                }
            });
            console.log(chalk.green('old pfp deleted from r2'));
            console.log(chalk.yellow('resetting pfp in db'))
            await ormServer.profile.update({
                where: {
                    sub: usertoGenLink,
                },
                data: {
                    pfp: 'https://users.cdn.mlinxapp.com/defaults/default.png',
                },
            })
            console.log(chalk.green('pfp reset in db'))
        }
        console.log(chalk.yellow('uploading pfp'))
        const ownerId = usertoGenLink;
        const signedUrl = await getSignedUrl(
            R2,
            new PutObjectCommand({
                Bucket: 'mlinx-users',
                Key: `photos/${ownerId}/pfp${PfpFileType.replace('image/', '.')}`,
            }),
            { expiresIn: 60 }
        )
        console.log(chalk.green('signed url obtained'))
        return new NextResponse(
            JSON.stringify({
                success: true,
                url: signedUrl,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
    } catch (e) {
        console.error(e);
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "An unknown error occurred. WHOOPS",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
    }
}