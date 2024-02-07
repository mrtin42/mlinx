// import { NextRequest, NextResponse } from "next/server";
// import { R2 } from "@/lib/r2";
// import { getSession } from '@auth0/nextjs-auth0';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import axios from "axios";
// import ormServer from "@/lib/prisma";

// export async function PUT(req: NextRequest) {
//     const { user } = await getSession() ?? { user: null };
//     if (!user) {
//         return new NextResponse(
//             JSON.stringify({
//                 success: false,
//                 message: "User not found",
//             }),
//             {
//                 status: 401,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         )
//     } else if (user.sub !== req.headers.get("X-Set-For-User")) {
//         return new NextResponse(
//             JSON.stringify({
//                 success: false,
//                 message: "You do not own this profile",
//             }),
//             {
//                 status: 403,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         )
//     }
//     const { pfp } = await req.json();
//     if (!pfp) return new NextResponse(
//         JSON.stringify({
//             success: false,
//             message: "No file provided",
//         }),
//         {
//             status: 400,
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         }
//     )
//     const pfpFile = pfp as File;
//     const userToSetPfp = req.headers.get("X-Set-For-User") as string;

//     if (pfpFile.size > 5000000) {
//         return new NextResponse(
//             JSON.stringify({
//                 success: false,
//                 message: "File is too large. Please upload a file smaller than 5MB.",
//             }),
//             {
//                 status: 413,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         )
//     }
//     const signedUrl = await getSignedUrl(
//         R2,
//         new PutObjectCommand({
//             Bucket: 'mlinx-users',
//             Key: `photos/${userToSetPfp}/pfp.png`,
//         }),
//         { expiresIn: 60 }
//     );
//     const res = await axios.put(signedUrl, pfpFile, {
//         headers: {
//             'Content-Type': pfpFile.type,
//         },
//     });
//     if (res.status !== 200) {
//         return new NextResponse(
//             JSON.stringify({
//                 success: false,
//                 message: "Failed to upload pfp",
//                 details: res.data,
//             }),
//             {
//                 status: 500,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         )
//     }
//     await ormServer.profile.update({
//         where: {
//             sub: userToSetPfp,
//         },
//         data: {
//             pfp: `https://users.cdn.mlinxapp.com/photos/${userToSetPfp}/pfp.png`,
//         },
    
//     })
//     return new NextResponse(
//         JSON.stringify({
//             success: true,
//             message: "PFP uploaded successfully",
//         }),
//         {
//             status: 200,
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         }
//     )
// }