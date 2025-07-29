// src/app/layout-client.tsx (INI ADALAH CLIENT COMPONENT)
"use client"; // Pastikan ini ada di baris paling atas

import Navbar from "./components/Navbar";
import { usePathname } from 'next/navigation';

// Tidak ada lagi `export const metadata` di sini!

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let currentPage = 'home';

  if (pathname === '/') {
    currentPage = 'home';
  } else if (pathname.startsWith('/scan')) {
    currentPage = 'scan';
  } else if (pathname.startsWith('/pengertian')) {
    currentPage = 'pengertian';
  } else if (pathname.startsWith('/settings')) {
    currentPage = 'settings';
  }
  // Logika dashboard jika diperlukan di sini juga, tapi biasanya dashboard punya layout sendiri.

  return (
    <> {/* Menggunakan React Fragment karena `html` dan `body` sudah di RootLayout */}
      <Navbar currentPage={currentPage} />
      <div>{children}</div>
    </>
  );
}