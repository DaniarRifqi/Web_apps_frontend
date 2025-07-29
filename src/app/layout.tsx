// src/app/layout.tsx (INI ADALAH SERVER COMPONENT)

import type { Metadata } from 'next'; // Import type jika belum ada
import './globals.css';
import ClientLayout from './layout-client'; // Import Client Layout Anda

export const metadata: Metadata = {
  title: "Identifikasi Kekeringan Buah Apel",
  description: "Landing page identifikasi kekeringan buah apel dengan AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white">
        {/* Render Client Layout di sini */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}