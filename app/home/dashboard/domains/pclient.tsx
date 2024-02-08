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
import { useEffect } from "react";

export default function Domains({u, d}: any) {
    useEffect(() => {})

    return (
        <>
            <SRNavbar u={u} dashboard={{isDashboard: true, active: "domains"}} />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">Domains</h1>
                    <p className="text-lg text-gray-300 italic">Manage your domains</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Link href="/dashboard/domains/create" className="rounded-lg bg-gray-700 active:bg-slate-600 px-3 py-1 m-4">
                        Create a new domain
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-center">Your Domains</h2>
                    <div className="flex flex-row items-center justify-center">
                        {d.map((dm: any) => {
                            return (
                                <div key={dm.id} className="flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-bold text-center">{dm.name}</h3>
                                    <p className="text-lg text-gray-300 italic">{dm.description}</p>
                                    
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
