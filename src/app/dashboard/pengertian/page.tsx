'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ThermometerSun, CheckCircle2, Droplets } from "lucide-react";
import { useLanguage } from '../../components/LanguageContext';

export default function PengertianPage() {
  const { language } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
      router.replace('/');
    }
  }, [router]);

  // Animasi stepper saat scroll
  const stepperRef = useRef<HTMLDivElement>(null);
  const [showStepper, setShowStepper] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (!stepperRef.current) return;
      const rect = stepperRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        setShowStepper(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="pengertian" className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-16 md:py-24 overflow-hidden">
      {/* Accent Shape/Blob */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-200 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-green-100 rounded-full blur-2xl opacity-20 z-0" />
      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-100 p-4 rounded-full mb-4 shadow">
            <BookOpen size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2 text-center drop-shadow-sm">
              {language === 'id' ? 'Tentang Identifikasi Apel' : 'About Apple Identification'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl">
              {language === 'id' ? 'Pahami tujuan dan kategori yang digunakan dalam aplikasi ini.' : 'Understand the purpose and categories used in this app.'}
            </p>
        </div>
        {/* Card Tujuan Identifikasi */}
        <div className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-green-200 shadow-xl mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-3">
            {language === 'id' ? '🎯 Tujuan Identifikasi' : '🎯 Identification Purpose'}
          </h3>
          <p className="text-gray-700 leading-relaxed text-justify text-base">
            {language === 'id'
              ? 'Tujuan utama dari sistem "DryApple-Scan" adalah untuk mengidentifikasikan kondisi permukaan buah apel berdasarkan tingkat kelembapan atau kekeringannya. Identifikasi ini sangat penting dalam manajemen pasca-panen untuk menentukan penanganan yang tepat, apakah apel layak untuk disimpan dalam waktu lama, dijual langsung sebagai buah segar, atau harus segera diolah. Dengan deteksi otomatis, proses penyortiran menjadi lebih efisien, konsisten, dan dapat mengurangi potensi kerugian akibat kerusakan buah.'
              : 'The main goal of the "DryApple-Scan" system is to identify the surface condition of apples based on their moisture or dryness level. This identification is crucial in post-harvest management to determine the right handling, whether the apple is suitable for long-term storage, direct sale as fresh fruit, or needs immediate processing. With automatic detection, the sorting process becomes more efficient, consistent, and can reduce potential losses due to fruit spoilage.'}
          </p>
        </div>
        {/* Stepper Kategori */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-8 text-center">
            {language === 'id' ? 'Progres Tingkat Kekeringan Apel' : 'Apple Dryness Level Progress'}
                </h3>
          <div ref={stepperRef} className="flex flex-row items-start justify-center gap-0 w-full max-w-3xl">
            {/* Step: Basah */}
            <div className={`flex-1 flex flex-col items-center transition-all duration-700 ease-out ${showStepper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '0ms'}}>
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-4 border-blue-400 mb-3">
                <Droplets size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-blue-700 mb-2">{language === 'id' ? 'Basah' : 'Wet'}</h4>
              <p className="text-gray-600 text-center text-base mb-4">{language === 'id' ? 'Permukaan apel masih basah, bisa karena pencucian, embun, atau awal pembusukan. Perlu penanganan segera.' : 'Apple surface is still wet, possibly due to washing, dew, or early spoilage. Requires immediate handling.'}</p>
            </div>
            {/* Connector */}
            <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${showStepper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '150ms'}}>
              <div className="w-12 h-1 bg-green-200 mt-8 mb-8 md:mb-12 md:mt-12 rounded-full" />
            </div>
            {/* Step: Sedang */}
            <div className={`flex-1 flex flex-col items-center transition-all duration-700 ease-out ${showStepper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '300ms'}}>
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 border-4 border-green-400 mb-3">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-green-700 mb-2">{language === 'id' ? 'Sedang' : 'Medium'}</h4>
              <p className="text-gray-600 text-center text-base mb-4">{language === 'id' ? 'Kondisi ideal: permukaan apel halus, kencang, dan berkilau. Siap konsumsi atau penyimpanan.' : 'Ideal condition: smooth, firm, and shiny apple surface. Ready for consumption or storage.'}</p>
            </div>
            {/* Connector */}
            <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${showStepper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '450ms'}}>
              <div className="w-12 h-1 bg-orange-200 mt-8 mb-8 md:mb-12 md:mt-12 rounded-full" />
            </div>
            {/* Step: Kering */}
            <div className={`flex-1 flex flex-col items-center transition-all duration-700 ease-out ${showStepper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 border-4 border-orange-400 mb-3">
                <ThermometerSun size={32} className="text-orange-600" />
              </div>
              <h4 className="text-lg font-bold text-orange-700 mb-2">{language === 'id' ? 'Kering' : 'Dry'}</h4>
              <p className="text-gray-600 text-center text-base mb-4">{language === 'id' ? 'Apel telah kehilangan banyak kelembapan, kulit kusam dan mengerut. Cocok untuk diolah menjadi produk kering.' : 'Apple has lost a lot of moisture, skin is dull and wrinkled. Suitable for dried products.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}