import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "./providers/QueryProvider";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muvement ",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
