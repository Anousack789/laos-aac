import type { Metadata } from "next";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

const notoSansLao = Noto_Sans_Lao({
  variable: "--font-noto-sans-lao",
  subsets: ["lao"],
});

export const metadata: Metadata = {
  title: "Lao AAC - Augmentative and Alternative Communication",
  description: "A bilingual Lao-English AAC application to help individuals with communication difficulties express themselves using symbols, text, and audio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansLao.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
