'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SRNavbar } from '@/components/main';
import formatForFavicon from '@/lib/utils/favicons';

export default function LinkPage({ u, l, slug }: any) {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <SRNavbar u={u} dashboard={{ isDashboard: true, active: 'dashboard' }} />
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <div className="flex flex-row items-center justify-center w-full">
                    <div className='flex flex-col items-center justify-center w-full text-left'>
                        <Link href={`http://${process.env.NEXT_PUBLIC_SHORT_HOSTNAME}${process.env.NEXT_PUBLIC_ENV === 'development' ? ':42069' : ''}/${slug}`} target='_blank'>
                            <div className="flex flex-row items-center justify-center w-full">
                                <Image
                                    src={formatForFavicon(l.destination, 64)}
                                    width={64}
                                    height={64}
                                    className="rounded-full mx-2"
                                    alt={`Favicon for ${l.destination}`}
                                />
                                <h2 className="font-bold text-3xl">{process.env.NEXT_PUBLIC_SHORT_HOSTNAME}/{slug}</h2>
                            </div>
                            <p className="ml-2 text-xl italic">{`${l.destination.substr(0,35)}${l.destination.length > 30 ? '...' : ''}`}</p>   
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                        <Image
                            src={`/api/links/screenshot/${slug}`}
                            width={256}
                            height={256}
                            className="rounded-lg p-1 border border-white"
                            alt={`Screenshot of ${l.destination}`}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}