import type { Metadata } from 'next';
import { Playfair_Display, DM_Mono, DM_Sans } from 'next/font/google';
import './globals.css';
import { AppToaster } from '@/components/ui/AppToaster';
import { CookieConsent } from '@/components/CookieConsent';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const dmMono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'MalinKiddy Erinnerungen',
  description: 'Audio-Erinnerungen für jede Lebensphase.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
        {children}
        <AppToaster />
        <CookieConsent />
      </body>
    </html>
  );
}
