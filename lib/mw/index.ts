import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'
import { parse } from './utils'
// import ormServer from '../prisma';
import { ormEdge as edging } from '../prisma';
import { connect } from '@planetscale/database';

const config = {
    url: process.env.DATABASE_URL,
};

const db = connect(config);

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

    // the defaults above will never change and will only work for mlinx.co, not custom domains
    // get link from /link/:slug, parse response as JSON

    const slug = await db.execute(`SELECT * FROM Link WHERE slug = '${key}' AND domain = '${domain}'`).then(res => res.rows[0]).catch(err => console.error(err));

    console.log(slug);

    if (slug) {
        return NextResponse.redirect(slug.destination, { status: 307 });
    } else {
        return NextResponse.redirect(`https://${process.env.NEXT_PUBLIC_MAIN_HOSTNAME}`, { status: 307 });
    }
}