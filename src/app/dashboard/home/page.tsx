'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown } from "lucide-react";
import { useLanguage } from '../../components/LanguageContext';

// Gambar dried apple dari Unsplash (bisa diganti dengan gambar sendiri)
const DRIED_APPLE_IMG =
  'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1200&q=80';

export default function HomePage() {
  const { language } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
      router.replace('/');
    }
  }, [router]);

  // Smooth scroll ke section
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const el = document.getElementById('scan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={DRIED_APPLE_IMG}
          alt="Dried Apple Background"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
        {/* Overlay gelap/transparan */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      {/* Konten Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
          {language === 'id' ? 'Identifikasi Kekeringan Buah Apel' : 'Apple Dryness Identification'}
        </h1>
        <div className="w-24 h-1 bg-green-400 rounded-full mb-6" />
        <p className="text-lg md:text-2xl text-white/90 text-center mb-8 max-w-2xl drop-shadow">
          {language === 'id'
            ? 'Solusi cerdas berbasis AI untuk mendeteksi tingkat kekeringan buah apel secara cepat, mudah, dan akurat.'
            : 'AI-powered smart solution to detect apple dryness level quickly, easily, and accurately.'}
        </p>
        <button
          onClick={handleScroll}
          className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition text-lg group focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {language === 'id' ? 'Mulai Scan' : 'Start Scanning'}
          <ArrowDown className="group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}