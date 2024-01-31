import { redirect } from "next/navigation";
import ormServer from "@/lib/prisma";

const updateName = async (formData: FormData) => {
    'use server';

    const name = formData.get("name") as string;
    await ormServer.profile.update({
        where: {
            sub: formData.get("sub") as string,
        },
        data: {
            name: name,
        },
    });
    redirect("./");
}

export default updateName;