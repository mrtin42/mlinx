'use server';

import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";

const deleteDomain = async (domain: string) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        return {
            success: false,
            message: "You must provide a valid session to delete a domain."
        }
    }

    const ownerId = user.sub;

    const d = await ormServer.domain.findUnique({
        where: {
            domain: domain
        }
    });

    if (!d) {
        return {
            success: false,
            message: "The domain you are trying to delete does not exist."
        }
    }

    if (d.ownerId !== ownerId) {
        return {
            success: false,
            message: "You are not authorized to delete this domain."
        }
    }

    const domainData = await ormServer.domain.delete({
        where: {
            domain: domain
        }
    });

    const x = await axios.delete(
        `https://api.vercel.com/v19/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
        { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
    )

    if (x.status !== 200) {
        await ormServer.domain.create({
            data: {
                domain: domain,
                ownerId: ownerId
            }
        });
        return {
            success: false,
            message: "An error occurred while deleting your domain from Vercel. Please try again later.",
            details: x.data
        }
    }

    return {
        success: true,  
        message: `${domain} was deleted successfully.`
    }
};