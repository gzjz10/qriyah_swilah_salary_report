import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'شركة قرية صويلح — نظام المرتبات',
  description: 'نظام إدارة مرتبات وأجور موظفي شركة قرية صويلح',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
