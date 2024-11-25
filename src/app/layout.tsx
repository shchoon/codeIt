import "./globals.css";
import Image from "next/image";
import QueryProvider from "@/utils/QueryProvider";

import LogoL from "../../public/icon/LogoL.svg";
import LogoS from "../../public/icon/LogoS.svg";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="w-full bg-white border-b border-slate-200 h-[60px] deskTop:pl-[360px] tablet:pl-6 mobile:pl-4 flex items-center">
          <Link href={"/"}>
            {/* 데스그탑 & 태블릿 해상도에서만 노출 */}
            <Image
              src={LogoL}
              alt="Logo"
              className="mobile:hidden cursor-pointer"
            />
            {/* 모바일 해상도에서만 노출 */}
            <Image
              src={LogoS}
              alt="Logo"
              className="tablet:hidden cursor-pointer"
            />
          </Link>
        </header>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
