'use client';

import { SRNavbar } from '@/components/main';
import DashNav from '@/components/dashnav';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { R2 } from '@/lib/r2';
import { useCallback, useState } from 'react';
import updatePFP from '@/lib/actions/db/profile/pfp';
import { toast } from 'sonner';
import defaultPfp from '@/public/default.png';
import { returnNewImage } from '@/lib/utils/images';

export default function Settings({ u, l }: any) {
    const [loading, setLoading] = useState(false);
    const [pfp, setPFP] = useState<File>();
    async function handlePFPUpload(e: any): Promise<void> {
        e.preventDefault();
        setLoading(true);
        await axios.get(
            '/api/profile/pfp/generateuploadurl',
            {
                headers: {
                    'X-Set-For-User': u.sub,
                    'X-File-Type': pfp?.type,
                    'X-File-Name': pfp?.name
                },
            }
        ).then(async (res) => {
            if (res.data.success) {
                toast.info("Uploading photo...");
                axios.put(
                    res.data.url,
                    pfp,
                    {
                        headers: {
                            'Content-Type': pfp?.type,
                        },
                    }
                ).then(async (res) => {
                    toast.info("Uploaded! Updating data...");
                    if (res.status === 200) {
                        await updatePFP(`https://users.cdn.mlinxapp.com/photos/${u.sub}/pfp/${pfp?.name}`).then((res) => {
                            if (res.success) {
                                toast.success("Profile picture updated! Refreshing...");
                                setTimeout(() => {
                                    document.location.reload();
                                }, 1000);
                            } else {
                                toast.error("Photo uploaded but database update failed");
                            }
                        })
                    } else {
                        toast.error("Failed to upload pfp");
                    }
                })
            }
            setLoading(false);
        })
    }



    const handlePFPChange = (e: any) => {
        const fileToUploed = e.target.files[0];
        console.log(fileToUploed);
        if (fileToUploed) {
            if (fileToUploed.size > 5000000) {
                toast.error("File is too large. Please upload a file smaller than 5MB.");
                return;
            } else if (!fileToUploed.type.startsWith("image/")) {
                toast.error("File is not an image. Please upload an image.");
                return;
            } else if (fileToUploed.type !== "image/png" && fileToUploed.type !== "image/gif" && fileToUploed.type !== "image/jpeg" && fileToUploed.type !== "image/jpg") {
                toast.error("File is not a supported image type. Please upload a PNG, JPEG, or GIF.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setPFP(fileToUploed);
            }
            reader.readAsDataURL(fileToUploed);
        }
    };

    return (
        <>
            {/* simply the form on its own while i test the pfp upload */}
            <>
                <SRNavbar u={u} dashboard={{ isDashboard: true, active: 'settings'}}/>
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className='h-[20vh] flex flex-col justify-center items-center'><h1 className="text-5xl font-bold">Settings</h1></div>
                        <div className="flex flex-row items-center justify-center w-full">
                            <div className="flex flex-col items-center justify-center w-full">
                                <h2 className="text-3xl font-bold">Profile Picture</h2>
                                <form onSubmit={handlePFPUpload} encType="multipart/form-data">
                                    <input
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        className="w-full p-2 my-2 bg-black border-b border-gray-500 rounded-lg text-white"
                                        onChange={handlePFPChange}
                                    />
                                    <button type="submit" disabled={loading} className={`rounded-lg bg-gray-700 hover:bg-slate-600 px-3 py-1 m-4 ${loading ? "cursor-not-allowed bg-slate-400 hover:bg-slate-400" : ""}`}>
                                        Update PFP
                                    </button>
                                </form>
                            </div>
                            <div className="flex flex-col items-center justify-center w-full">
                                <img
                                    src={u.pfp}
                                    className="rounded-lg p-1 border border-white w-[256px] h-[256px]"
                                    alt={`Profile Picture for ${u.name}`}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </>
        </>
    )
}