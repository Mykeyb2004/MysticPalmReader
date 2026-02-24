import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'AI 灵境手相',
  description: 'AI驱动的手相算命与运势分析。',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-purple-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
