import "./globals.css";
import Image from "next/image";
import QueryProvider from "@/utils/QueryProvider";
import type { Metadata } from "next";

import getMetaData from "@/MetaData/metadata";

import LogoL from "../../public/icon/LogoL.svg";
import LogoS from "../../public/icon/LogoS.svg";
import Link from "next/link";

export const metadata: Metadata = getMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="w-full bg-white border-b border-slate-200 h-[60px] deskTop:pl-[360px]  flex items-center">
          <Link href={"/"}>
            {/* 데스그탑 & 태블릿 해상도에서만 노출 */}
            <Image
              src={LogoL}
              alt="Logo"
              className="hidden deskTop:block cursor-pointer"
            />
            {/* 모바일 해상도에서만 노출 */}
            <Image
              src={LogoS}
              alt="Logo"
              className="deskTop:hidden cursor-pointer"
            />
          </Link>
        </header>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
