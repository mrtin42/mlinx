import Image from "next/image";
import Link from "next/link";

export default function DashNav({ active }: { active: string }) {
    return (
        <div className="fixed border-b border-zinc-100-/10 bg-black/50 backdrop-blur-sm flex flex-row items-center justify-center">
            <div className="flex flex-row items-center justify-between p-3">
                <div className={`${active === "dashboard" ? "text-cyan-950" : "text-gray-300"} text-sm italic`}>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                </div>
                <div className={`${active === "domains" ? "text-cyan-950" : "text-gray-300"} text-sm italic`}>
                    <Link href="/dashboard/domains">
                        Domains
                    </Link>
                </div>
                <div className={`${active === "settings" ? "text-cyan-950" : "text-gray-300"} text-sm italic`}>
                    <Link href="/dashboard/settings">
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    )
}