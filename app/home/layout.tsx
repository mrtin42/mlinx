import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "../globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MLINX.co",
  description: "Reinventing the way we share links",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-black text-slate-50" vaul-drawer-wrapper="">
          <Toaster />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
