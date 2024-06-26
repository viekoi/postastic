import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { IsMobileProvider } from "@/providers/is-mobile-provider";
import { cn } from "@/lib/utils";

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
        <body className={cn("custom-scrollbar",inter.className) }>
          <QueryProvider>
            <IsMobileProvider breakPoint={1024}>
              <Toaster
                position="top-center"
                theme="dark"
                toastOptions={{
                  actionButtonStyle: {
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: 500,
                  },
                }}
                closeButton
                duration={1500}
                className="text-white z-50"
              />
              <ModalProvider />
              {children}
            </IsMobileProvider>
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
