'use client';

import { useState } from "react";
import createLink from "@/lib/actions/db/links/create";
import { toast } from "sonner";

const FormWithToast = () => {
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
            <button type="submit" disabled={loading}>
                Create Link
            </button>
        </form>
    );
}

export default FormWithToast;