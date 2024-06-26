import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "./lib/mw/utils";
import { LinkMw } from "./lib/mw";
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL as string);

if (process.env.NEXT_PUBLIC_SHORT_HOSTNAME) {
    var shorthostnames = process.env.NEXT_PUBLIC_SHORT_HOSTNAME ?? 'mlinx.co'
} else {
    throw new Error('SHORT_HOSTNAMES environment variable not set');
}

if (process.env.NEXT_PUBLIC_MAIN_HOSTNAME) {
    var mainhostnames = process.env.NEXT_PUBLIC_MAIN_HOSTNAME ?? 'mlinxapp.com'
} else {
    throw new Error('MAIN_HOSTNAMES environment variable not set');
}

const short = shorthostnames;
const main = mainhostnames;

export const config = {
    matcher: [
      /*
       * Match all paths except for:
       * 1. /api/ routes
       * 2. /_next/ (Next.js internals)
       * 3. /_proxy/ (special page for OG tags proxying)
       * 4. /_static (inside /public)
       * 5. /_vercel (Vercel internals)
       * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
       */
      "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
    ],
  }; // nicked this from https://github.com/dubinc/dub because i cba to write it myself


export default async function middleware(
    req: NextRequest,
    ev: NextFetchEvent
) {
    const { domain, path, fullPath, key, fullKey } = parse(req);

    if (domain !== main && domain !== short) {
        if (fullKey === '_nslookup/trace') {
            return NextResponse.json({
                domain: domain,
                status: true,
                msg: 'correct! this domain points to mlinx\'s servers via Cloudflare\'s proxy.',
            }, { status: 200 });
        }
        const inDB = await sql`SELECT * FROM "Domain" WHERE "domain" = ${domain}` as any;
        if (inDB.domain === domain) {
            return LinkMw(req, ev);
        }
    }

    if (short.includes(domain)) {
        return LinkMw(req, ev);
    }
    if (main.includes(domain)) {
        if (req.headers.get('MDEV-Cloudflare') !== process.env.CLOUDFLARE_KEY && process.env.NEXT_PUBLIC_ENV !== 'development') {
            return NextResponse.json({
                error: 'Unproxied request',
                status: false,
                msg: 'www.mlinxapp.com is only accessible via Cloudflare\'s proxy. Direct requests are not allowed.',
            },
            { status: 403 /* Forbidden */ }
            )
        }

        return NextResponse.rewrite(
            new URL(`/mlinxapp.com/${fullKey}`, req.url)
        ); // cloudflare will handle redirecting to the /systems-suspended page when the domain is mlinxapp.com and systems are suspended
    }
}