import Image from "next/image";
import Link from "next/link";

export default function DashNav({ active }: { active: string }) {
    return (
        <div className="border-b border-wid border-zinc-100-/10 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-between p-3">
                <div className={`${active === "dashboard" ? "text-cyan-950" : "text-gray-300"} text-sm italic m-2 mr-4`}>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                </div>
                <div className={`${active === "domains" ? "text-cyan-950" : "text-gray-300"} text-sm italic m-2`}>
                    <Link href="/dashboard/domains">
                        Domains
                    </Link>
                </div>
                <div className={`${active === "settings" ? "text-cyan-950" : "text-gray-300"} text-sm italic m-2`}>
                    <Link href="/dashboard/settings">
                        Settings
                    </Link>
                </div>
            </div>
            <div>
                <span></span>
            </div>
        </div>
    )
}