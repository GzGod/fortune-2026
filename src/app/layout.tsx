import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026财运巅峰预测 - 新春特别版",
  description: "基于八字命理，预测你2026年的财运巅峰时刻",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
