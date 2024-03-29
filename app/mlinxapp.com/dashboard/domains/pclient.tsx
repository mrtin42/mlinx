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
    DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import verifyDNS from "@/lib/actions/db/domains/verify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import createDomain from "@/lib/actions/db/domains/add";
import { toast } from "sonner";
import { print } from "@/lib/utils";
import printToServer from "@/lib/utils/printToServer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Domains({u, d}: any) {
    const [DNSStatus, setDNSStatus] = useState<any>([]);
    const [open, setOpen] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    useEffect(() => {
        const z = async () => {
            const x = await verifyDNS(d);
            print(x);
            printToServer(x);
            setDNSStatus(x);
            print(`${DNSStatus} <- this is the DNSStatus`);
            printToServer(`${DNSStatus} <- this is the DNSStatus`);
            setLoading(false);
        }

        z();
    }, []);

    const handleCreateDomain = async (fd: FormData) => {
        const res = await createDomain(fd);
        print(`response: ${res} <- this is the response from the server`);
        printToServer(`response: ${res} <- this is the response from the server`)
        if (res.success) {
            toast.success(res.message);
            const x = await verifyDNS(d);
        }
        else {
            print(res);
            toast.error(res.message);
        }
    }
    return (
        <>
            <SRNavbar u={u} dashboard={{isDashboard: true, active: "domains"}} />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row items-center justify-between w-[80vw] h-36">
                    <div className="flex flex-col items-start">
                        <h1 className="text-6xl font-bold text-left">Domains</h1>
                        <p className="text-lg text-left italic text-gray-300">Manage your custom domains</p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                        <Dialog>
                            <DialogTrigger className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 mx-2 my-1">
                                Add Domain
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Domain</DialogTitle>
                                    <DialogClose />
                                </DialogHeader>
                                <form action={handleCreateDomain} method="post">
                                    <input type="text" name="domain" placeholder="Domain" className="w-full p-2 my-2 bg-black border-b border-gray-500 rounded-lg text-white" />
                                    <input type="hidden" name="ownerId" value={u.sub} />
                                    <DialogClose><button type="submit" className="rounded-lg bg-gray-700 hover:bg-slate-600 px-3 py-1 m-2">Add Domain</button></DialogClose>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 mx-2 mb-1" onClick={async () => {
                        setRefreshing(true);
                        const x = await verifyDNS(d);
                        print(x);
                        printToServer(x);
                        setDNSStatus(x);
                        setRefreshing(false);
                        print(`${DNSStatus} <- this is the DNSStatus`);
                        printToServer(`${DNSStatus} <- this is the DNSStatus`);
                    }}>
                        {refreshing ? <><FontAwesomeIcon icon={faCircleNotch} spin />&nbsp;</> : ""}Refresh
                    </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        {
                            !loading && DNSStatus[0] ? DNSStatus.map((domstat: any) => {
                                return (
                                    <div className={`group/domain-div flex flex-col backdrop-filter backdrop-blur-lg border border-zinc-500/40 drop-shadow-md hover:drop-shadow-lg rounded-lg m-2 p-2 w-[80vw] transition-height duration-500`}>
                                        <div className="group/top-domain flex flex-row items-center justify-between">
                                            <button onClick={() => {
                                                if (open === domstat.domain) {
                                                    setOpen(null);
                                                } else {
                                                    setOpen(domstat.domain);
                                                }
                                            }} className="group/link p-1">
                                                <h3 className="font-bold text-2xl">{domstat.domain}
                                                <span className={`transition-transform inline-block motion-reduce:transform-none ${open === domstat.domain ? 'rotate-90 translate-x-1' : 'group-hover/link:translate-x-1'}`}>&nbsp;&rarr;</span>
                                                </h3>
                                            </button>
                                            <p className={`rounded-lg p-1 px-2 ${domstat.status ? "bg-green-700" : "bg-red-700"}`}>
                                                {domstat.status ? (<><FontAwesomeIcon icon={faCheck} /> Verified</>) : (<><FontAwesomeIcon icon={faTimes} /> Not Verified</>)}
                                            </p>
                                        </div>
                                        <div className={`group/dns-info ${open === domstat.domain ? 'flex' : 'hidden'} flex-col items-center justify-center`}>
                                            {domstat.status ? (
                                                <>
                                                    <p className="text-lg text-gray-300 italic">Your domain currently points to:</p>
                                                    {domstat.conn === 'A' ? domstat.addresses.map((addr: string) => {
                                                        return (
                                                            <p className="text-lg text-gray-300 italic">{addr}</p>
                                                        )
                                                    }) : (
                                                        <p className="text-lg text-gray-300 italic">CNAME: {domstat.address}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-lg text-gray-300 italic">Your domain is not currently pointing to any of our servers. Please update your DNS settings:</p>
                                                    {domstat.error === 'unverified' ? (
                                                        <>
                                                            <p className="text-lg text-gray-300 italic">Your domain is not verified. Please verify your domain by adding a TXT record to your DNS settings:</p>
                                                            <div className="flex flex-row items-center text-left w-full bg-slate-700 rounded-lg p-2 m-2">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <p className="text-lg text-gray-300 font-bold">Hostname:</p>
                                                                    <p className="text-lg text-gray-300 italic font-mono">{domstat.verification.domain}</p>
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <p className="text-lg text-gray-300 font-bold">Record type:</p>
                                                                    <p className="text-lg text-gray-300 italic font-mono">{domstat.verification.type}</p>
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <p className="text-lg text-gray-300 font-bold">Value:</p>
                                                                    <p className="text-lg text-gray-300 italic font-mono">{domstat.verification.value}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-lg text-gray-300 italic">Once you have added the record, ensure you have also pointed your domain to our servers:</p>
                                                        </>
                                                    ) : <></>}
                                                    {domstat.conn === 'A' ? (
                                                        <div className="flex flex-row items-center text-left w-full bg-slate-700 rounded-lg p-2 m-2">
                                                            <div className="flex flex-col text-left w-[10%]">
                                                                <p className="text-lg text-gray-300 font-bold">Type</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">A</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">A</p>
                                                            </div>
                                                            <div className="flex flex-col text-left w-[30%]">
                                                                <p className="text-lg text-gray-300 font-bold">Hostname</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">@</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">@</p>
                                                            </div>
                                                            <div className="flex flex-col text-left w-[30%]">
                                                                <p className="text-lg text-gray-300 font-bold">Value</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">76.76.21.21</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">76.76.21.61</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-row items-center text-left w-full bg-slate-700 rounded-lg p-2 m-2">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="text-lg text-gray-300 font-bold">Type</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">CNAME</p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="text-lg text-gray-300 font-bold">Hostname</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">{domstat.domain.split('.')[0]}</p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="text-lg text-gray-300 font-bold">Value</p>
                                                                <p className="text-lg text-gray-300 italic font-mono">cname.vercel-dns.com</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            }) : (
                                <>
                                    <div className="flex flex-col items-center justify-center">
                                        {loading ? (
                                            <>
                                            <p className="text-lg text-gray-300 italic">Loading..</p>
                                            <Skeleton className="w-[80vw] h-[8vh] rounded-xl" />
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-lg text-gray-300 italic">You have no domains added.</p>
                                            </>
                                        )}
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
