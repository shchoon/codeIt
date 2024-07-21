"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecoidContextProvider from "./recoilContextProvider";

import LogoL from "../../public/icon/LogoL.svg";
import LogoS from "../../public/icon/LogoS.svg";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <header className="relative w-full bg-white border-b border-slate-200 h-[60px] deskTop:pl-[360px] tablet:pl-6 mobile:pl-4 flex items-center">
          {/* 데스그탑 & 태블릿 해상도에서만 노출 */}
          <Image
            src={LogoL}
            alt="Logo"
            className="absolute mobile:invisible cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          />
          {/* 모바일 해상도에서만 노출 */}
          <Image
            src={LogoS}
            alt="Logo"
            className="absolute tablet:invisible cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          />
        </header>
        <div className="w-full h-screen py-6 bg-gray-50 deskTop:px-[360px] tablet:px-6 mobile:px-4">
          <RecoidContextProvider>{children}</RecoidContextProvider>
        </div>
      </body>
    </html>
  );
}
