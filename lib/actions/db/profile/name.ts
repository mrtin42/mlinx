'use server';

import { redirect } from "next/navigation";
import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

const updateName = async (formData: FormData) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        return {
            success: false,
            message: "User not found",
        }
    }

    const name = formData.get("name") as string;
    await ormServer.profile.update({
        where: {
            sub: formData.get("ownerId") as string,
        },
        data: {
            name: name,
        },
    });

    return {
        success: true,
        message: "Name updated",
    }
}

export default updateName;