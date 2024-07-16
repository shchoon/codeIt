import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

import LogoL from "../../public/icon/LogoL.svg";
import LogoS from "../../public/icon/LogoS.svg";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="relative w-full border-b border-slate-200 h-[60px] mb-6 deskTop:pl-[360px] tablet:pl-6 mobile:pl-4 flex items-center">
          <Image src={LogoL} alt="Logo" className="absolute mobile:invisible" />
          <Image src={LogoS} alt="Logo" className="absolute tablet:invisible" />
        </header>
        <div className="w-full deskTop:px-[360px] tablet:px-6 mobile:px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
