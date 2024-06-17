import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'
import { parse } from './utils'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL as string);

export const LinkMw = async (req: NextRequest, ev: NextFetchEvent): Promise<any> => {
    let { domain, path, fullPath, key, fullKey } = parse(req);

    // the defaults below will never change and will only work for mlinx.co, not custom domains
    if (domain === 'mlinx.co') {
        if (path === '/') return NextResponse.redirect(`https://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}`, { status: 307 });
    }

    if (domain.endsWith('.localhost') || domain.endsWith('.local') || domain.endsWith('.test')) {
        // for local development and preview URLs
        domain = 'mlinx.co' as string;
    }

    console.log(domain, path, fullPath, key, fullKey);

    const slug = key;
    
    // the defaults above will never change and will only work for mlinx.co, not custom domains
    // get link from /link/:slug, parse response as JSON

    const res = await sql`SELECT * FROM "Link" WHERE slug = ${key} AND domain = ${domain}`.catch((err) => { console.error(err); return null; });
    if (!res) return NextResponse.redirect(`https://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}`, { status: 307 });
    const r = res[0];

    console.log(r);

    if (r) {
        return NextResponse.redirect(r.destination, { status: 307 });    
    } else {
        return NextResponse.redirect(`https://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}`, { status: 307 });
    }
}