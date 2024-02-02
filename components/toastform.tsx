'use client';

import { useState } from "react";
import createLink from "@/lib/actions/db/links/create";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";

const FormWithToast = () => {
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
            <input
                type="text"
                name="slug"
            />
            <input
                type="text"
                name="destination"
            />
            <input
                type="hidden"
                name="ownerId"
                value={user?.sub ?? 'achtung'}
            />
            <button type="submit" disabled={loading}>
                Create Link
            </button>
        </form>
    );
}

export default FormWithToast;