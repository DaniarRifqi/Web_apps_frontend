"use client"; // Pastikan baris ini ada di paling atas

import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from 'next/navigation'; // <-- TAMBAHKAN BARIS INI

export const metadata = {
  title: "Identifikasi Kekeringan Buah Apel",
  description: "Landing page identifikasi kekeringan buah apel dengan AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // <-- TAMBAHKAN BARIS INI

  // <-- TAMBAHKAN LOGIKA INI
  let currentPage = 'home'; // Nilai default

  // Logika untuk menentukan halaman aktif berdasarkan pathname
  if (pathname === '/') {
    currentPage = 'home';
  } else if (pathname.startsWith('/scan')) {
    currentPage = 'scan';
  } else if (pathname.startsWith('/pengertian')) {
    currentPage = 'pengertian';
  } else if (pathname.startsWith('/settings')) {
    currentPage = 'settings';
  }
  // Penting: Jika Anda juga memiliki layout di `/app/dashboard/layout.tsx`
  // dan halaman-halaman seperti `/dashboard`, `/dashboard/scan`, dll.
  // menggunakan layout tersebut, maka `layout.tsx` ini (root layout)
  // hanya perlu menangani rute yang tidak ditangkap oleh layout dashboard.
  // Jika `/dashboard` adalah rute terpisah yang juga perlu navbar,
  // maka Anda bisa tambahkan:
  // else if (pathname.startsWith('/dashboard')) {
  //   currentPage = 'home'; // Atau nama lain yang Anda inginkan untuk dashboard di navbar
  // }


  return (
    <html lang="id">
      <body className="bg-white">
        <Navbar currentPage={currentPage} /> {/* <-- RUBAH BARIS INI */}
        <div>{children}</div>
      </body>
    </html>
  );
}