import type { Metadata } from "next";

export default function getMetaData() {
  const metadata: Metadata = {
    title: "마이투두: 할 일을 생성하고 기록할 수 있는 서비스",
    description: "마이투두를 통해 보람찬 하루를 살아보세요!",
    metadataBase: new URL("https://todo-beta-teal.vercel.app/"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "마이투두: 할 일을 생성하고 기록할 수 있는 서비스",
      description: "my_todo를 통해 보람찬 하루를 살아보세요!",
      url: "https://todo-beta-teal.vercel.app/",
      siteName: "마이투두",
      images: {
        url: "/todo.png",
      },
      locale: "ko_KR",
      type: "website",
    },
    icons: {
      icon: "/icon/LogoS.svg",
    },
    appLinks: {
      web: {
        url: "https://todo-beta-teal.vercel.app/",
      },
    },
  };

  return metadata;
}
