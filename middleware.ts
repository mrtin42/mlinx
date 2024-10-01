import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
if (process.env.NEXT_PUBLIC_SHORT_HOSTNAME) {
    var shorthostnames = process.env.NEXT_PUBLIC_SHORT_HOSTNAME ?? 'mlinx.co'
} else {
    throw new Error('SHORT_HOSTNAMES environment variable not set');
}

if (process.env.NEXT_PUBLIC_MAIN_HOSTNAME) {
    var mainhostnames = process.env.NEXT_PUBLIC_MAIN_HOSTNAME ?? 'mlinxshortener.com'
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
        return NextResponse.rewrite(
            new URL(`/home/${fullKey}`, req.url)
        );
}
