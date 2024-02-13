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
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import createDomain from "@/lib/actions/db/domains/add";
import { toast } from "sonner";
import { print } from "@/lib/utils";
import printToServer from "@/lib/utils/printToServer";

export default function Domains({u, d}: any) {
    const [DNSStatus, setDNSStatus] = useState<any>([]);
    useEffect(() => {
        const z = async () => {
            const x = await verifyDNS(d);
            print(x);
            printToServer(x);
            setDNSStatus(x);
            print(`${DNSStatus} <- this is the DNSStatus`);
            printToServer(`${DNSStatus} <- this is the DNSStatus`);
        }

        z();
    }, [])

    const handleCreateDomain = async (fd: FormData) => {
        const res = await createDomain(fd);
        print(`response: ${res} <- this is the response from the server`);
        printToServer(`response: ${res} <- this is the response from the server`)
        if (res.success) {
            toast.success(res.message);
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
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">Domains</h1>
                    <p className="text-lg text-gray-300 italic">Manage your domains</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Dialog>
                        <DialogTrigger className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1">
                            Add Domain
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 p-4">
                            <DialogHeader>
                                <DialogTitle>Add Domain</DialogTitle>
                                <DialogDescription>
                                    Add a domain to your account
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center">
                                <form action={handleCreateDomain} method="post">
                                    <input type="text" name="domain" placeholder="Domain" className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1" />
                                    <input type="hidden" name="ownerId" value={u.sub} />
                                    <DialogClose>
                                        <button type="submit" className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1">
                                            Add Domain
                                        </button>
                                    </DialogClose>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-center">Your Domains</h2>
                    <button className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1" onClick={async () => {
                        const x = await verifyDNS(d);
                        print(x);
                        printToServer(x);
                        setDNSStatus(x);
                        print(`${DNSStatus} <- this is the DNSStatus`);
                        printToServer(`${DNSStatus} <- this is the DNSStatus`);
                    }}>Refresh</button>
                    <div className="flex flex-row items-center justify-center">
                        {
                            DNSStatus[0] ? DNSStatus.map((domstat: any) => {
                                return (
                                    <Dialog key={domstat.domain}>
                                        <DialogTrigger className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1">
                                            {domstat.domain}
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-800 p-4">
                                            <DialogHeader>
                                                <DialogTitle>{domstat.domain}</DialogTitle>
                                                <DialogDescription>
                                                    {domstat.status ? "Verified" : "Not Verified"}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-row items-center justify-center">
                                                {
                                                    domstat.status ? 
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 text-4xl m-4" />
                                                    :
                                                    <FontAwesomeIcon icon={faTimes} className="text-red-500 text-4xl m-4" />
                                                }
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                {
                                                    domstat.status ? 
                                                    <p className="text-lg text-green-500">Domain verified</p>
                                                    :
                                                    <p className="text-lg text-red-500">Domain not verified</p>
                                                }
                                                <p className="text-lg text-gray-300 italic">{domstat.error}{
                                                    domstat.error === "resolverError" ? ": DNS resolver error" : 
                                                    domstat.error === "resolvedInvalid" ? ": DNS records invalid" : 
                                                    domstat.error === "invalidConnType" ? ": Invalid record type" : ""
                                                }</p>
                                                <div className="flex flex-row items-center justify-center">
                                                    {
                                                        !(domstat.status === false) ? (
                                                            <>
                                                                <p className="text-lg text-gray-300 italic">Records:<br /></p>
                                                                
                                                                <ul>
                                                                    {
                                                                        domstat.addresses ? domstat.addresses.map((addr: string) => {
                                                                            return (
                                                                                <li key={addr} className="text-lg text-gray-300 italic">{addr}</li>
                                                                            )
                                                                        }) : domstat.address ? (
                                                                            <li key={domstat.address} className="text-lg text-gray-300 italic">{domstat.address}</li>
                                                                        ) : <p>No addresses to display</p>
                                                                    }
                                                                </ul>
                                                            </>
                                                        ) : (
                                                            <>
                                                                { process.env.NEXT_PUBLIC_ENV === 'development' ? (
                                                                    <div className="flex flex-col">
                                                                        <p className="text-lg text-gray-300 italic">You must add one of the following records to your domain:</p>
                                                                        <ul>
                                                                            <li className="text-lg text-gray-300 italic">A record:
                                                                                <ul>
                                                                                    <li className="text-lg text-gray-300 italic">
                                                                                        76.76.21.21
                                                                                    </li>
                                                                                    <li className="text-lg text-gray-300 italic">
                                                                                        76.76.21.61
                                                                                    </li>
                                                                                </ul>
                                                                            </li>
                                                                            <li className="text-lg text-gray-300 italic">CNAME record:
                                                                                <ul>
                                                                                    <li className="text-lg text-gray-300 italic">
                                                                                        cname.vercel-dns.com
                                                                                    </li>
                                                                                    {/* <li className="text-lg text-gray-300 italic">
                                                                                        cname.martin-dns.com
                                                                                    </li> */}
                                                                                    {/* i'll re-add this once i buy the martin-dns.com domain */}
                                
                                                                                </ul>
                                                                                { !domstat.domain.split(".")[2] ? (
                                                                                    <p className="text-lg text-gray-300 italic">Note that some DNS providers do not support CNAME records at the root domain level. if possible, use an A record instead, or look for a record type called "ANAME" or "ALIAS" which is similar to a CNAME but can be used at the root domain level. Some DNS providers instead offer a feature called "CNAME flattening" which can be used to achieve the same effect.</p>
                                                                                ) : <></>}
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col">
                                                                        <p className="text-lg text-gray-300 italic">You must {domstat.error === "unverified" ? "verify your domain" : "add one of the following records to your domain"}:</p>
                                                                        { domstat.error === "unverified" ? (
                                                                            <>
                                                                                { domstat.verification.type === "TXT" ? (
                                                                                    <>
                                                                                        <p className="text-lg text-gray-300 italic">Add the following TXT record to _vercel.{domstat.domain}:</p>
                                                                                        <p className="text-lg text-gray-300 italic">{domstat.verification.value}</p>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <p className="text-lg text-gray-300 italic">Add the following DNS record to {domstat.verification.domain}:</p>
                                                                                        <p className="text-lg text-gray-300 italic">{domstat.verification.type} {domstat.verification.value}</p>
                                                                                    </>
                                                                                )}
                                                                                <button className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1" onClick={async () => {
                                                                                    const x = await verifyDNS(d);
                                                                                    print(x);
                                                                                    printToServer(x);
                                                                                    setDNSStatus(x);
                                                                                    print(`${DNSStatus} <- this is the DNSStatus`);
                                                                                    printToServer(`${DNSStatus} <- this is the DNSStatus`);
                                                                                }}>Refresh</button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                            
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </>

                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                );
                            }) : <p>No domains to display</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
