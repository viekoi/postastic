import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postastic",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <div className="lg:block hidden">
              <Toaster
                theme="dark"
                toastOptions={{
                  actionButtonStyle: {
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: 500,
                  },
                }}
                closeButton
                duration={3000}
                className="text-white z-50"
              />
            </div>
            <ModalProvider />
            {children}
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
