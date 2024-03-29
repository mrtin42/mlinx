'use client';

import Link from "next/link";
import Image from "next/image";
import { SRNavbar } from "@/components/main";
import FormWithToast from "@/components/toastform";
import NameForm from "@/components/nameform";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import DashNav from "@/components/dashnav";
import formatForFavicon from "@/lib/utils/favicons";
import ormServer from "@/lib/prisma";
import { toast } from "sonner";
import deleteLink    from "@/lib/actions/db/links/delete";

export default function Dashboard({u, l, d}: any) {

    const faviconDiv = (link: any) => {
        return (
            <div key={link.id} className="flex flex-row justify-between items-center w-full my-2">
                <div className="flex flex-row items-center w-[30%]">
                    
                    <Image
                        src={formatForFavicon(link.destination, 256)}
                        width={64}
                        height={64}
                        className="rounded-full mx-2"
                        alt={`Favicon for ${link.destination}`}
                    /><Link href={`https://${link.domain}/${link.slug}`} target="_blank" className="font-bold text-md">{link.domain}/{link.slug}</Link>
                </div>
                <div className="w-[10%]">
                    <h4 className="font-semibold text-md">Slug:</h4>
                    <p className="italic text-md">{link.slug}</p>
                </div>
                <div className="w-[30%]">
                    <h4 className="font-semibold text-md">Destination:</h4>
                    <p className="italic text-md">{`${link.destination.substr(0,35)}${link.destination.length > 30 ? '...' : ''}`}</p>
                </div>
                <div className="w-[10%]">
                    <h4 className="font-semibold text-md">Created on:</h4>
                    <p className="italic text-md">{new Date(link.createdAt).toDateString()}</p>
                </div>
                <div className="text-right">
                    <Link href={`/dashboard/link?key=${link.slug}&domain=${link.domain}`} className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 m-4">
                        Edit
                    </Link>
                    <button onClick={async () => {
                        const x = await deleteLink(link.slug, link.domain);
                        if (x.success) {
                            toast.success(x.message);
                        } else {
                            toast.error(x.message);
                        }
                    }} className="rounded-lg bg-red-700 hover:bg-red-500 active:bg-red-600 px-3 py-1 m-4">
                        Delete
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SRNavbar u={u} dashboard={{ isDashboard: true, active: 'dashboard'}} />
            <main className="flex flex-col items-center min-h-screen w-screen">
                <header className="flex flex-col items-center justify-center h-[20vh]">
                    <h1 className="text-5xl font-bold text-center">
                        Welcome to MLINX.co, {u?.name}!
                    </h1>
                </header>
                <div className="rounded-2xl border border-white drop-shadow-md shadow-white bg-black flex flex-col justify-center m-0 my-2 w-[80vw]">
                    <div className="flex flex-row p-1 m-0">
                        <div className="flex items-center my-4">
                            <h2 className="font-bold text-3xl whitespace-nowrap mx-4">Your profile:</h2>
                        </div>
                        <div className='flex flex-row justify-between items-center w-full'>
                            <div>
                                <h4 className="font-semibold text-md">Name:</h4>
                                <p className="italic text-md">{u?.name}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-md">Email:</h4>
                                <p className="italic text-md">{u?.email}</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 m-4">
                                        Update
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle><span className="text-black">Update your name</span></DialogTitle>
                                        <DialogDescription>
                                            Use the form below to update your name.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <NameForm/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-white drop-shadow-md shadow-white bg-black flex flex-col justify-center m-0 my-2 w-[80vw]">
                    <div className="flex flex-row p-1 m-0">
                        <div className="flex items-center my-4">
                            <h2 className="font-bold text-3xl whitespace-nowrap mx-4">Your links:</h2>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full">
                            <span></span>
                            <div className="flex flex-row justify-between items-center w-full">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 m-4">
                                            Create
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle><span className="text-black">Create a new link</span></DialogTitle>
                                            <DialogDescription>
                                                Use the form below to create a new link.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <FormWithToast d={d} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-center w-full">
                        {l?.map((link: any) => { return faviconDiv(link) })}
                    </div>
                </div>
            </main>
        </>
    );
}
