'use server';

import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const createDomain = async (formData: FormData) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        throw new Error("You must provide a valid session to create a domain.");
    }

    const ownerId = user.sub;
    const requestedUserID = formData.get("ownerId") as string;
    if (ownerId !== requestedUserID) {
        throw new Error("You are not authorized to create a domain for this user.");
    }
    const domain = formData.get("domain") as string;

    if (domain === "") {
        throw new Error("You must provide a domain for your link.");
    }

    const exists = await ormServer.domain.findUnique({
        where: {
            domain: domain
        }
    })

    if (exists?.domain === domain) { throw new Error("A domain with this name already exists.") };

    await ormServer.domain.create({
        data: {
            domain: domain,
            ownerId: ownerId
        }
    });

    return {
        success: true,
        message: "Domain created successfully."
    }
};

export default createDomain;