import type { Metadata } from "next";
import { Rye, Lato } from "next/font/google";
import "./globals.css";

const rye = Rye({
  weight: "400",
  variable: "--font-rye",
  subsets: ["latin"],
});

const lato = Lato({
  weight: "400",
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "River Rats, baby!",
  description: "River Rats league web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rye.variable} ${lato.variable}`}>
            <header className="header">
              <a href="/"><img src="/river-rat-square.jpg" alt="" /></a> <h1>River Rats Fantasy Football</h1>
            </header>
          {children}
      </body>
    </html>
  );
}
