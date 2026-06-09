import type { Metadata } from "next";
import { Roboto } from "next/font/google";
// @ts-ignore: CSS module declarations are handled by Next.js app router
import "./globals.css";
import Providers from "./providers";
import QueryProvider from "./QueryProvider";
import { ToastContainer } from "react-toastify";
// @ts-ignore: allow side-effect CSS import for react-toastify
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autogirl Admin",
  description: "Autogirl Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
