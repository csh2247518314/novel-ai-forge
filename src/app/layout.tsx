import type { Metadata } from 'next';
import { Inter, Noto_Serif_SC } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/app-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSerifSC = Noto_Serif_SC({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: '小说工坊 - AI创作助手',
  description: '集成多个AI模型的小说创作平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifSC.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
