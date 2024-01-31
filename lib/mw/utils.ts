import { NextRequest } from "next/server";

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // remove www. from domain
  if (domain.endsWith(".vercel.app")) {
    // for local development and preview URLs
    domain = process.env.NEXT_PUBLIC_MAIN_HOSTNAMES?.split(", ")[0] as string;
  }

  if (domain.includes(":")) {
    // remove port from domain
    domain = domain.split(":")[0];
  }

  // path is the path of the URL (e.g. mlinks.co/stats/github -> /stats/github)
  let path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${path}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. mlinks.co/github/repo -> github)
  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. mlinks.co/github/repo -> github/repo)

  return { domain, path, fullPath, key, fullKey };
};