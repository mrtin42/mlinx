import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export const GET = async (req: NextRequest) => {
    const site = req.nextUrl.searchParams.get("site");

    if (!site) {
        return new Response("No site provided", { status: 400 });
    }

    const url = new URL(site);

    if (!url.protocol.startsWith("http")) {
        return new Response("Invalid protocol", { status: 400 });
    }

    const page = await puppeteer.launch().then((browser) => {
        return browser.newPage();
    });

    await page.goto(url.toString(), { waitUntil: "domcontentloaded" });

    const screenshot = await page.screenshot();

    await page.close();

    return new Response(screenshot, {
        headers: {
            "Content-Type": "image/png",
            "X-Powered-By": "MLINX.co - Reinventing the way you share links",
        },
        status: 201,
    });
}