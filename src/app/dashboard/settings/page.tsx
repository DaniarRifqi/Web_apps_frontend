"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Settings, Languages, Sun, Moon, HelpCircle, ScanLine, Upload, Camera, Cpu, ClipboardList, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import { useLanguage } from '../../components/LanguageContext';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
      router.replace('/');
    }
  }, [router]);

  // Tambahkan state lokal untuk bahasa yang dipilih
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleSaveSettings = () => {
    setLanguage(selectedLanguage);
    toast.success(selectedLanguage === 'id' ? 'Bahasa berhasil diubah!' : 'Language changed successfully!');
  };

  // Data untuk langkah-langkah penggunaan
  const usageSteps = [
    {
      icon: ScanLine,
      title: "Buka Halaman Scan",
      description: "Pilih menu 'Scan' pada sidebar untuk memulai proses identifikasi."
    },
    {
      icon: Upload,
      title: "Pilih Sumber Gambar",
      description: "Unggah gambar dari galeri Anda atau gunakan kamera untuk mengambil foto apel secara langsung. Pastikan gambar jelas dan fokus."
    },
    {
      icon: Cpu,
      title: "Mulai Proses Analisis",
      description: "Klik tombol 'Identifikasi Sekarang' dan sistem kami akan menganalisis gambar menggunakan model AI."
    },
    {
      icon: ClipboardList,
      title: "Lihat Hasil Identifikasi",
      description: "Hasil klasifikasi (Kering, Sedang, Basah) akan ditampilkan beserta persentase keyakinan."
    }
  ];

  return (
    <section id="settings" className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-green-50 py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-100 p-4 rounded-full mb-4 shadow">
            <Settings size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2 text-center drop-shadow-sm">
            { language === 'id' ? 'Pengaturan & Bantuan' : 'Setting & Help'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl">
            {language === 'id' ? 'Kelola preferensi aplikasi dan lihat panduan penggunaan.' : 'Manage app preferences and view the usage guide.'}
          </p>
        </div>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 items-start">
          {/* Kolom Kiri: Pengaturan */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/90 p-6 rounded-2xl border border-green-100 shadow-xl">
              <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">
                {language === 'id' ? 'Preferensi' : 'Preference'}
              </h3>
              {/* Pengaturan Bahasa */}
              <div className="mb-6">
                <label htmlFor="language-select" className="flex items-center text-base font-semibold text-green-700 mb-2">
                  <Languages size={18} className="mr-2" /> {language === 'id' ? 'Bahasa' : 'Language'}
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'id' | 'en')}
                  className="block w-full p-2 border border-green-200 rounded-lg bg-green-50 focus:ring-green-400 focus:border-green-400 transition text-base"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <button
                onClick={handleSaveSettings}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-full hover:bg-green-600 transition shadow text-base"
              >
                <Save size={20} />
                {language === 'id' ? 'Simpan Pengaturan' : 'Save Settings'}
              </button>
            </div>
          </div>
          {/* Kolom Kanan: Cara Menggunakan */}
          <div className="lg:col-span-2 bg-white/90 p-6 rounded-2xl border border-green-100 shadow-xl">
            <div className="flex items-center mb-6">
              <HelpCircle className="text-green-600" size={28} />
              <h3 className="text-lg md:text-2xl font-bold text-green-800 ml-3">
                {language === 'id' ? 'Cara Menggunakan Aplikasi' : 'How to Use the App'}
              </h3>
            </div>
            {/* Timeline/Stepper */}
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-green-100"></div>
              <ul className="space-y-8">
                {usageSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-green-500 text-white rounded-full font-bold z-10 text-base">
                      {index + 1}
                    </div>
                    <div className="ml-5">
                      <h4 className="flex items-center text-lg font-bold text-green-800">
                        <step.icon size={18} className="mr-2 text-green-600" /> {language === 'id' ? step.title : (index === 0 ? 'Open Scan Page' : index === 1 ? 'Choose Image Source' : index === 2 ? 'Start Analysis' : 'View Results')}
                      </h4>
                      <p className="mt-1 text-gray-700 text-base">{language === 'id' ? step.description : (index === 0 ? "Select 'Scan' from the sidebar to start identification." : index === 1 ? "Upload an image from your gallery or use the camera to take a photo of the apple. Make sure the image is clear and focused." : index === 2 ? "Click 'Identify Now' and our system will analyze the image using AI." : "The classification result (Dry, Medium, Wet) will be displayed along with the confidence percentage.")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}