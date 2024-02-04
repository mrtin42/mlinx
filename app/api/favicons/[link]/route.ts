export async function GET({params}:{params:{link:string}}) {
    const favicon = await fetch(`https://${params.link}/favicon.ico`);
    return new Response(favicon.body, {
        headers: {
            'Content-Type': 'image/x-icon',
        },
    });
}

export const dynamic = 'force-dynamic';