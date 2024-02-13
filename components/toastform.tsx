'use client';

import { useState } from "react";
import createLink from "@/lib/actions/db/links/create";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DialogClose } from "./ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const FormWithToast = ({ d }: any) => {
    const inputClasses = "w-full p-2 my-2 bg-black border-b border-gray-500 rounded-lg text-white";

    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (fd: FormData) => {
        setLoading(true);
        const res = await createLink(fd);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <form action={handleSubmit}>
            <select name="domain" className="w-full p-2 my-2 bg-black border-b border-gray-500 rounded-lg text-white">
                <option key='main' value="mlinx.co">mlinx.co</option>
                {d?.map((domain: any) => (
                    <option key={domain.id} value={domain.name}>
                        {domain.domain}
                    </option>
                ))}
            </select>
            <input
                type="text"
                name="slug"
                placeholder="Slug (/my-link)"
                className={inputClasses}
            />
            <input
                type="text"
                name="destination"
                placeholder="Destination (https://example.com)"
                className={inputClasses}
            />
            <input
                type="hidden"
                name="ownerId"
                value={user?.sub ?? 'achtung'}
            />
            <DialogClose>
                <button type="submit" disabled={loading} className={`rounded-lg bg-gray-700 hover:bg-slate-600 px-3 py-1 m-0 ${loading ? "cursor-not-allowed bg-slate-400 hover:bg-slate-400" : ""}`}>
                    Create Link
                </button>
            </DialogClose>
        </form>
    );
}

export default FormWithToast;