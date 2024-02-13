'use server';

import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const createLink = async (formData: FormData) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        // throw new Error("You must provide a valid session to create a link.");
        return {
            success: false,
            message: "You must provide a valid session to create a link."
        }
    }

    const ownerId = user.sub;
    const requestedUserID = formData.get("ownerId") as string;
    if (ownerId !== requestedUserID) {
        // throw new Error("You are not authorized to create a link for this user.");
        return {
            success: false,
            message: "You are not authorized to create a link for this user."
        
        }
    }
    const slug = formData.get("slug") as string;
    const domain = formData.get("domain") as string ?? "mlinx.co";
    let destination = formData.get("destination") as string;
    
    const exists = await ormServer.link.findUnique({
        where: {
            unique_link: {
                slug,
                domain
            }
        }
    });
    
    // if (exists?.slug === slug) { throw new Error("A link with this slug already exists.") };
    if (exists?.slug === slug) { return {
        success: false,
        message: "A link with this slug already exists."
    } };

    if (slug === "") {
        // throw new Error("You must provide a slug for your link.");
        return {
            success: false,
            message: "You must provide a slug for your link."
        }
    }

    if (destination === "") {
        // throw new Error("You must provide a destination for your link.");
        return {
            success: false,
            message: "You must provide a destination for your link."
        }
    }

    if (!destination.startsWith("http") || !destination.startsWith("https")) {
        destination = `https://${destination}`;
    }

    const link = await ormServer.link.create({
        data: {
            ownerId,
            slug,
            destination,
            domain
        },
    });
    
    return {
        success: true,
        message: "Link created successfully.",
        data: link
    };
}

export default createLink;
