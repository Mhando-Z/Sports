import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "StreamVault · IPTV Directory",
  description: "Browse thousands of live TV channels from around the world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0A0E1A] text-white antialiased">
        <DataProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </DataProvider>
      </body>
    </html>
  );
}
