import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideMenu from "../components/common/SideMenu";
import { IdeaFormProvider } from "../context/IdeaFormContext";
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "GameHye.com - 게임 소통 창구",
  description: "게임에 대한 철학과 아이디어를 자유롭게 나누는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>GameHye</title>
        <meta property="og:title" content="GameHye" />
        <meta property="og:description" content="게임에 관한 모든 아이디어를 공유하고 발전시키는 공간" />
        <meta property="og:image" content="https://www.gamehye.com/logo.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <html lang="ko" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-200 dark:bg-gray-900 dark:text-gray-200`}
        >
          <IdeaFormProvider>
            <div className="flex flex-col md:flex-row min-h-screen">
              <SideMenu />
              <main className="flex-1 md:ml-64 w-full transition-all duration-300 ease-in-out">
                {children}
              </main>
            </div>
          </IdeaFormProvider>
        </body>
      </html>
    </>
  );
}
