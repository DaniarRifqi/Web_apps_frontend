"use client";

import React, { useEffect, useState } from "react";

const menu = [
  { name: "Home", href: "#home" },
  { name: "Scan", href: "#scan" },
  { name: "Pengertian", href: "#pengertian" },
  { name: "Settings", href: "#settings" },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
  e.preventDefault();
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textColor = scrolled ? 'text-green-800' : 'text-white';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'bg-white/80 backdrop-blur shadow-md border-b border-gray-100' : 'bg-white/0'}
      `}
    >
      <div className="w-full flex flex-row items-center justify-between px-8 md:px-12 py-2 md:py-3">
        <div className="flex flex-row items-center gap-3 min-h-[36px]">
          <img 
            src="/icon.png" 
            alt="AppleDryness Logo" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          <span className={`font-bold ${textColor} text-lg md:text-xl tracking-tight transition-colors duration-300 leading-none`} style={{lineHeight: '1.2'}}>AppleDryness</span>
        </div>
        <ul className="flex flex-row items-center gap-6 md:gap-8">
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
    </nav>
  );
};

export default Navbar;