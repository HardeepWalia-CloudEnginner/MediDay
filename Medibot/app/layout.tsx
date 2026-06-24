import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediBot - RBAC Chat Interface',
  description: 'A Next.js chat interface with RBAC enforcement and MediBot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
