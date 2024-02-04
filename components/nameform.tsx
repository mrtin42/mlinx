'use client';

import { useState } from "react";
import updateName from "@/lib/actions/db/profile/name";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DialogClose } from "./ui/dialog";

const FormWithToast = () => {
    const inputClasses = "w-full p-2 my-2 bg-black border-b border-gray-500 rounded-lg text-white";

    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (fd: FormData) => {
        setLoading(true);
        const res = await updateName(fd);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return (
        <form action={handleSubmit}>
            <input
                type="text"
                name="name"
                className={inputClasses}
            />
            <input
                type="hidden"
                name="ownerId"
                value={user?.sub ?? 'achtung'}
            />
            <DialogClose>
                <button type="submit" disabled={loading} className={`rounded-lg bg-gray-700 hover:bg-slate-600 px-3 py-1 m-4 ${loading ? "cursor-not-allowed bg-slate-400 hover:bg-slate-400" : ""}`}>
                    Update Name
                </button>
            </DialogClose>
        </form>
    );
}

export default FormWithToast;