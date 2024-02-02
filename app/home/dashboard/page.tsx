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
                    <h1 className="text-6xl font-bold text-center">
                        Welcome to your dashboard, {u?.name}!
                    </h1>
                    <p className="text-2xl italic font-sans">
                        You can manage your links here.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Link href="/dashboard/links" className="bg-blue-600 hover:bg-blue-700 text-center rounded-lg hover:rounded-2xl shadow-xl flex flex-row justify-center items-center p-2 mt-2 transition-all duration-300">
                        Manage your links
                    </Link>
                </div>
                <div data-comment="currently just making a mockup dashboard with a list of the user's links, and a button to add a new link">
                    <div className="flex flex-col items-center justify-center" data-comment="user profile: name, email, sub, etc.">
                        <h1 className="text-6xl font-bold text-center">
                            User Profile
                        </h1>
                        <p className="text-2xl italic font-sans">
                            Your user profile information.
                        </p>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl italic font-sans">
                                Name: {u?.name}
                            </p>
                            <form action={updateName}>
                                <input type="text" name="name" placeholder="New name" className="text-black" />
                                <input type="hidden" name="sub" value={u?.sub} />
                                <button type="submit">Update</button>
                            </form>
                            <p className="text-2xl italic font-sans">
                                Email: {u?.email}
                            </p>
                            <p className="text-2xl italic font-sans">
                                Sub: {u?.sub}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center" data-comment="users links: list of links the user has created">
                            <h1 className="text-6xl font-bold text-center">
                                Your Links
                            </h1>
                            <p className="text-2xl italic font-sans">
                                Your links.
                            </p>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center justify-center">
                                    <h3 className="text-3xl font-bold text-center">
                                        Make a link
                                    </h3>
                                    {/* <form  action={createLink}>
                                        <input type="text" name="slug" placeholder="Slug" className="text-black" />
                                        <input type="text" name="destination" placeholder="Destination" className="text-black" />
                                        <input type="hidden" name="ownerId" value={u?.sub} />
                                        <button type="submit">Create</button>
                                    </form> */}
                                    <FormWithToast />
                                </div>
                                {l?.length === 0 ? (
                                    <p className="text-2xl italic font-bold font-sans">
                                        You have no links.
                                    </p>
                                ) : ''}
                                {l?.map((link) => (
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-2xl italic font-sans">
                                            Slug: {link.slug}
                                        </p>
                                        <p className="text-2xl italic font-sans">
                                            Destination: {link.destination}
                                        </p>
                                        <Link href={`http${process.env.NEXT_PUBLIC_ENV === "development" ? "" : "s"}://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}/${link.slug}`} className="text-2xl italic font-sans">
                                                Link: {link.slug}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}