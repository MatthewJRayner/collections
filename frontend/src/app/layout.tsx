import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar';
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const logoFont = localFont({
  src: "../../public/fonts/TheStoothgartRegular.otf",
  variable: "--font-logos",
  weight: "400",
  style: "normal",            
});

export const metadata: Metadata = {
  title: "Orpheus Archives",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-[1280px] mx-auto font-inter">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
