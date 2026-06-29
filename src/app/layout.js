import "./globals.css";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  title: "MhdTv",
  description:
    "Stream televison channels for free, all you need is your internet only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`min-h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col">
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
