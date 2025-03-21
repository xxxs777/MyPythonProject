import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "四季萌宠消消乐",
  description: "一款融合三消玩法与经营建设元素的休闲小游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
