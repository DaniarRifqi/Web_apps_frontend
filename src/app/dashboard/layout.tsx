"use client";

import Navbar from "../components/Navbar";
import { usePathname } from 'next/navigation'; // <-- TAMBAHKAN BARIS INI

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // <-- TAMBAHKAN BARIS INI

  // <-- TAMBAHKAN LOGIKA INI
  let currentPage = 'home'; // Default value

  // Periksa path untuk menentukan halaman aktif
  if (pathname === '/') {
    currentPage = 'home';
  } else if (pathname.startsWith('/scan')) {
    currentPage = 'scan';
  } else if (pathname.startsWith('/pengertian')) {
    currentPage = 'pengertian';
  } else if (pathname.startsWith('/settings')) {
    currentPage = 'settings';
  }
  // Jika layout ini hanya untuk halaman dashboard dan halaman-halaman lain (scan, pengertian, settings)
  // adalah rute terpisah, maka logika di atas sudah cukup.
  // Jika '/dashboard' itu sendiri adalah sebuah halaman, atau ada sub-halaman di dalamnya,
  // Anda mungkin ingin menambahkan:
  // else if (pathname.startsWith('/dashboard')) {
  //   currentPage = 'dashboard'; // Atau 'home' jika ini adalah halaman utama dashboard
  // }
  // Pastikan nilai 'currentPage' ini sesuai dengan nama section di Navbar Anda.


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar currentPage={currentPage} /> {/* <-- RUBAH BARIS INI */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
        {children}
      </main>
    </div>
  );
}