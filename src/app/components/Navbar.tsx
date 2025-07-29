"use client";

import React, { useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react"; // Import ikon dari lucide-react

const menu = [
  { name: "Home", href: "#home" },
  { name: "Scan", href: "#scan" },
  { name: "Pengertian", href: "#pengertian" },
  { name: "Settings", href: "#settings" },
];

interface NavbarProps {
  currentPage: string; // Prop baru untuk menunjukkan halaman aktif
}

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string, closeMenu?: () => void) => {
  e.preventDefault();
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    if (closeMenu) {
      closeMenu(); // Tutup menu setelah klik jika fungsi diberikan
    }
    // Tidak perlu lagi memanipulasi hash di sini karena kita mengandalkan prop currentPage
  }
};

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => { // Menerima prop currentPage
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Effect untuk mencegah scrolling body saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const textColor = scrolled ? 'text-green-800' : 'text-white';

  // Logika untuk menentukan warna teks di drawer mobile
  // Menggunakan currentPage dari props
  const getMobileMenuItemColor = () => {
    // Jika currentPage adalah 'home', warna teks putih
    // Untuk halaman lainnya, warna teks hijau
    return currentPage === 'home' ? 'text-white' : 'text-green-700';
  };

  // Logika untuk menentukan background drawer mobile
  const getMobileDrawerBackground = () => {
    return currentPage === 'home' 
      ? 'bg-black/20 backdrop-blur-md' 
      : 'bg-white/60 backdrop-blur-md shadow-lg';
  };

  // Logika untuk menentukan warna tombol close di drawer mobile
  const getMobileCloseButtonColor = () => {
    return currentPage === 'home' 
      ? 'text-white hover:bg-white/20' 
      : 'text-green-700 hover:bg-green-100';
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'bg-white/80 backdrop-blur shadow-md border-b border-gray-100' : 'bg-white/0'}
      `}
    >
      <div className="w-full flex flex-row items-center justify-between px-4 md:px-12 py-2 md:py-3">
        {/* Logo dan Nama */}
        <div className="flex flex-row items-center gap-3 min-h-[36px]">
          <img 
            src="/icon.png" 
            alt="AppleDryness Logo" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          <span className={`font-bold ${textColor} text-lg md:text-xl tracking-tight transition-colors duration-300 leading-none`} style={{lineHeight: '1.2'}}>AppleDryness</span>
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-md transition-colors duration-300 ${scrolled ? 'text-green-700 hover:bg-green-100' : 'text-white hover:bg-white/20'}`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-row items-center gap-6 md:gap-8">
          {menu.map((item) => (
            <li key={item.name} className="flex items-center">
              <a
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className={`${textColor} font-semibold hover:text-green-400 transition-colors duration-300 relative after:content-[''] after:block after:h-0.5 after:bg-green-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left after:mt-1 px-1`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop (Click to close) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Drawer (from top) */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full 
          ${getMobileDrawerBackground()} // Menggunakan fungsi untuk background
          transition-transform transform ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full' 
          } duration-300 ease-in-out z-40`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-md transition-colors duration-300 ${getMobileCloseButtonColor()}`} // Menggunakan fungsi untuk warna tombol
            aria-label="Close mobile menu"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="flex flex-col items-center gap-6 py-8">
          {menu.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={e => handleNavClick(e, item.href, closeMobileMenu)}
                className={`${getMobileMenuItemColor()} font-bold text-xl hover:text-green-600 transition-colors duration-300`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;