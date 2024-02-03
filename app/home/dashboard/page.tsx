import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/main";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import ormServer from "@/lib/prisma";
import updateName from "@/lib/actions/db/profile/name";
import createLink from "@/lib/actions/db/links/create";
import FormWithToast from "@/components/toastform";

export default async function Dashboard() {
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
            },
            select: {
                id: true,
                slug: true,
                destination: true,
            }
        });
    } else {
        return redirect("/api/auth/login");
    }
    
    const u = userinfo;
    const l = links;

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-screen w-screen">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold text-center">
                        Welcome to your dashboard, {u?.name}!
                    </h1>
                    <p className="text-2xl italic font-sans">
                        You can manage your links here.
                    </p>
                </div>
                <div className="rounded-2xl border border-white drop-shadow-md shadow-white bg-black flex flex-col justify-center m-0">
                    <div className="flex flex-row border-b border-white p-0 m-0">
                        <div>
                            <h2 className="font-bold text-xl">Your profile</h2>
                        </div>
                        <div className='flex flex-row'>
                            <div>
                                <h4 className="font-semibold text-md">Name:</h4>
                                <p className="italic text-md">{u?.name}</p>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div>
                                <h4 className="font-semibold text-md">Email:</h4>
                                <p className="italic text-md">{u?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <p className="italic text-md">Profile editing coming soon</p>
                        </div>
                    </div>
                </div> 
            </main>
        </>
    );
}
