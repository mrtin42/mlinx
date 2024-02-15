import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "../globals.css";
import { Toaster } from "sonner";
import { config } from '@fortawesome/fontawesome-svg-core'
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MLINX.co",
  description: "Reinventing the way we share links",
  themeColor: "#111111",
  icons: [
    {
      rel: "icon",
      href: "/dark.favicon.ico",
      url: "/dark.favicon.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      href: "/light.favicon.ico",
      url: "/light.favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      url: "/apple-touch-icon.png",
    },
  ],
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-black text-slate-50 font-sans" vaul-drawer-wrapper="">
          <Toaster />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
