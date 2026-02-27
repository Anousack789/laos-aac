import type { Metadata } from "next";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

const notoSansLao = Noto_Sans_Lao({
  variable: "--font-noto-sans-lao",
  subsets: ["lao"],
});

export const metadata: Metadata = {
  title: "Lao AAC - Augmentative and Alternative Communication",
  description:
    "A bilingual Lao-English AAC application to help individuals with communication difficulties express themselves using symbols, text, and audio.",
};

// This script runs synchronously before React hydrates — zero flash.
// It reads localStorage and sets attributes on <html> immediately.
const blockingInitScript = `
(function () {
  try {
    var s = JSON.parse(localStorage.getItem('aac-settings') || '{}');
    if (s.fontSize) document.documentElement.setAttribute('data-font-size', s.fontSize);
    if (s.darkMode)  document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <head>
        {/* dangerouslySetInnerHTML is intentional — this must be an inline blocking script */}
        <script dangerouslySetInnerHTML={{ __html: blockingInitScript }} />
      </head>
      <body className={`${notoSansLao.variable} antialiased`}>{children}</body>
    </html>
  );
}
