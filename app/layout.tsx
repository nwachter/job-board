"use client";
import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono, Merriweather_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import TopButtons from "./components/layout/TopButtons";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "JobBoard",
  description: "Application de recherche d'emploi 2.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
        <link href="https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Istok+Web:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@100..900&family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&family=Onest:wght@100..900&family=Poiret+One&family=Roboto:ital,wght@0,100..900;1,100..900&family=Sintony:wght@400;700&display=swap" rel="stylesheet" />

        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />

      </head>
      <body
        className={`${dmSans.variable} ${dmSans.variable} antialiased min-h-screen min-w-screen w-screen h-screen`}
      >
        <Navbar />
        <div className="flex flex-col items-end w-full h-full">
          <TopButtons />
          <div className="flex h-full w-full">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
