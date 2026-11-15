import type { Metadata, Viewport } from 'next';
import { Readex_Pro, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-readex-pro',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
});

export const metadata: Metadata = {
  title: 'خطي (Khatti) | منظومة خطوط النقل الدراسي الشهري في العراق',
  description: 'النظام الذكي لإدارة خطوط طلاب المدارس والجامعات مع التتبع الحي والمطابقة العمياء',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${readexPro.variable} ${ibmPlexArabic.variable}`}>
      <body className="min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
