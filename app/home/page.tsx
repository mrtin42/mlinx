import { SRNavbar } from "@/components/main";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import ormServer from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getSession() ?? { user: null };
  let userinfo: any;

  if (user) {
    userinfo = await ormServer.profile.findUnique({
      where: {
        sub: user.sub,
      },
    });
    if (!userinfo) {
      await ormServer.profile.create({
        data: {
          sub: user.sub,
          name: user.name,
          email: user.email,
        },
      });
      userinfo = await ormServer.profile.findUnique({
        where: {
          sub: user.sub,
        },
      });
    }
  } else {
    userinfo = null;
  }

  const u = userinfo;

  return (
    <>
      <SRNavbar u={u ? u : null}/>
      <main className="flex min-h-screen flex-col items-center w-screen">
        <div className="flex mt-3 flex-row items-center justify-between">
          <header className="flex flex-col justify-center max-w-[40vw] mr-10">
            <h1 className="text-6xl text-left py-2 leading-[4rem]">
              Reinventing the way we share links
            </h1>
            <p className="text-2xl text-left italic font-sans">
              MLINX.co is a free and open source link shortener that allows you
              to share links with ease.
            </p>
          </header>
          <div className="flex flex-col justify-center ml-10">
            <div className="bg-slate-300 rounded-lg shadow-xl flex flex-row p-2">
              <div>
                <Image
                  src="/favicon.ico"
                  width={100}
                  height={100}
                  className="rounded-lg"
                  alt="MLINX.co logo"
                />
              </div>
              <div className="flex flex-col justify-center text-black px-2">
                <h2 className="text-3xl font-bold">
                  <Link href="https://mlinx.co/maker" className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-150">mlinx.co/maker</Link>
                </h2>
                <p className="text-xl italic">&rarr; www.martin.blue</p>
              </div>
            </div>
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-center rounded-lg hover:rounded-2xl shadow-xl flex flex-row justify-center items-center p-2 mt-2 transition-all duration-300">
              Make your first link
            </Link>
          </div>
        </div>
        <p className="py-4 text-lg text-center italic font-sans">
            a <Link href="https://www.martin.blue" className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-150">martin.blue</Link> project
        </p>
        <hr className="border-gray-700 w-[80vw] my-2" />
        <div className="flex flex-col justify-between w-[80vw]">
          <h1 className="text-4xl font-bold py-1 text-center">Early Days!</h1>
          <p className="text-2xl italic font-sans">
            MLINX.co is still in its early days, so please be patient with us! We're working hard to make this the best link shortener on the web. If you have any suggestions, please let us know!
          </p>
        </div>
      </main>
    </>
  );
}
