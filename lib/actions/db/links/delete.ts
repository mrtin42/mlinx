'use server';
import ormServer from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

const deleteLink = async (slug: string, domain: string) => {
    const { user } = await getSession() ?? { user: null };

    if (!user) {
        return {
            success: false,
            message: "You must provide a valid session to delete a link."
        }
    }

    const ownerId = user.sub;

    const l = await ormServer.link.findUnique({
        where: {
            unique_link: {
                slug: slug,
                domain: domain
            }
        }
    });

    if (!l) {
        return {
            success: false,
            message: "The link you are trying to delete does not exist."
        }
    }

    if (l.ownerId !== ownerId) {
        return {
            success: false,
            message: "You are not authorized to delete this link."
        }
    }

    const link = await ormServer.link.delete({
        where: {
            unique_link: {
                slug: slug,
                domain: domain,
            }
        }
    });
    return {
        success: true,  
        message: `${domain}/${slug} was deleted successfully.`
    }
};

export default deleteLink;