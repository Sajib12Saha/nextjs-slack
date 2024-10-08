import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "./provider/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";




const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons:[
      {
        url:"/companyLogo.svg",
        href:"/companyLogo.svg"
      },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 

  return (
    
    <ConvexAuthNextjsServerProvider>


  <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
        <Modals/>
        {children}
        <Toaster/>
        
        </ConvexClientProvider>
        
      </body>
    </html>

    </ConvexAuthNextjsServerProvider>
  
  );
}


