import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MhdTv",
  description:
    "Stream televison channels for free, all you need is your internet only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`min-h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
