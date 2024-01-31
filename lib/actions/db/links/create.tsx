'use server';

import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const createLink = async (formData: FormData) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        throw new Error("You must provide a valid session to create a link.");
    }

    const ownerId = user.sub;
    const requestedUserID = formData.get("ownerId") as string;
    if (ownerId !== requestedUserID) {
        throw new Error("You are not authorized to create a link for this user.");
    }
    const slug = formData.get("slug") as string;
    const destination = formData.get("destination") as string;
    
    const exists = await ormServer.link.findUnique({
        where: {
            slug: slug
        }
    });
    
    if (exists?.slug === slug) { throw new Error("A link with this slug already exists.") };

    const link = await ormServer.link.create({
        data: {
            ownerId,
            slug,
            destination,
        },
    });

    
}

export default createLink;