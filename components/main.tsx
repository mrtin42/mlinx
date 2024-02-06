'use client';

import Image from "next/image";
import Link from "next/link";
import { useUser as getSession } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import { logo } from "@/lib/fonts";

export default function CSRNav() {
    const { user, error, isLoading } = getSession() ?? { user: null };
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScrolled(window.scrollY > 10);
        });
    }, []);

    return (
        <nav className={`flex flex-row justify-between sticky top-0 px-20 transition-all duration-300 bg-black/50 backdrop-blur-sm border-b ${scrolled ? "border-zinc-100/10" : "border-transparent"}`}>
            <div className="flex items-center justify-between p-3">
             <Link href="/">
                <h1 className={`${logo.className} mr-2 text-3xl font-bold text-center`}>
                    MLINX.co
                </h1>
             </Link>
             {process.env.NEXT_PUBLIC_ENV === "development" ? (
                <>
                    <p className="text-sm text-gray-300 italic">
                        DEV <span className="hidden lg:inline">ENVIRONMENT</span>
                    </p>
                </>
             ) : ''}
            </div>
            <div></div>
            <div className="flex items-center justify-between p-3 transition-all duration-200">
                { isLoading ? (
                    <></>
                ) : (
                    <>
                        { user ? (
                                <div id="menu" className="flex flex-row items-center justify-center space-x-4">
                                    <p className={`text-sm text-gray-300 italic ${process.env.NEXT_PUBLIC_ENV === 'development' ? 'hidden xl:inline' : 'hidden md:inline'}`}>
                                        {user.name} {process.env.NEXT_PUBLIC_ENV === "development" ? `// Your UID: ${user.sub}`: ''}
                                    </p>
                                    <Link href="/dashboard" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                        Dash<span className="hidden md:inline">board</span>
                                    </Link>
                                    <Link href="/api/auth/logout" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                        Logout
                                    </Link>
                                </div>
                        ) : (
                            <div id='menu' className="flex flex-row items-center justify-center space-x-4">
                                <p className="text-sm text-gray-300 italic">
                                    Guest
                                </p>
                                <Link href="/api/auth/login" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                    Login
                                </Link>
                                <Link href="/api/auth/login" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                    Sign Up
                                </Link>
                            </div>
                        ) }
                    </>
                )}
            </div>
        </nav>
    )
}

export function SRNavbar({u}: any) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScrolled(window.scrollY > 10);
        });
    }, []);

    return (
        <nav className={`flex flex-row justify-between sticky top-0 px-20 transition-all duration-300 bg-black/50 backdrop-blur-sm border-b ${scrolled ? "border-zinc-100/10" : "border-transparent"}`}>
            <div className="flex items-center justify-between p-3">
             <Link href="/">
                <h1 className={`${logo.className} mr-2 text-3xl font-bold text-center`}>
                    MLINX.co
                </h1>
             </Link>
             {process.env.NEXT_PUBLIC_ENV === "development" ? (
                <>
                    <p className="text-sm text-gray-300 italic">
                        DEV <span className="hidden lg:inline">ENVIRONMENT</span>
                    </p>
                </>
             ) : ''}
            </div>
            <div></div>
            <div className="flex items-center justify-between p-3 transition-all duration-200">
                        { u ? (
                                <div id="menu" className="flex flex-row items-center justify-center space-x-4">
                                    {/* <p className={`text-sm text-gray-300 italic ${process.env.NEXT_PUBLIC_ENV === 'development' ? 'hidden xl:inline' : 'hidden md:inline'}`}>
                                        {u.name} {process.env.NEXT_PUBLIC_ENV === "development" ? `// Your UID: ${u.sub}`: ''}
                                    </p> */}
                                    <Link href="/dashboard/profile">
                                        <Image src={u.picture} alt={u.name} width={40} height={40} className="rounded-full" />
                                    </Link>
                                    <Link href="/dashboard" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                        Dash<span className="hidden md:inline">board</span>
                                    </Link>
                                    <Link href="/api/auth/logout" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                        Logout
                                    </Link>
                                </div>
                        ) : (
                            <div id='menu' className="flex flex-row items-center justify-center space-x-4">
                                <p className="text-sm text-gray-300 italic">
                                    Guest
                                </p>
                                <Link href="/api/auth/login" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                    Login
                                </Link>
                                <Link href="/api/auth/login" className="inline-block transition-all duration-150 text-sm px-1 lg:px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-cyan-950 hover:bg-white mt-0">
                                    Sign Up
                                </Link>
                            </div>
                        ) }
            </div>
        </nav>
    )
}