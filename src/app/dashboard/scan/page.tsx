"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect as useEffect2 } from 'react';
import { ScanLine, Upload, FileImage, Loader2, RefreshCcw, Info, History as HistoryIcon, X, Calendar, Filter } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import HistoryModal from './HistoryModal';

export default function ScanPage() {
  const { language } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
      router.replace('/');
    }
  }, [router]);
  
  // --- State Management ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [predictionResults, setPredictionResults] = useState<Record<string, number> | null>(null);
  const [conclusion, setConclusion] = useState<{ text: string, type: 'Kering' | 'Sedang' | 'Basah' | '' }>({ text: '', type: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false); // State baru untuk drag & drop

  // --- History State & Data dari Backend ---
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState({ date: '', type: '' });
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect2(() => {
    if (showHistory) {
      setLoadingHistory(true);
      fetch('http://localhost:5000/api/history/')
        .then(res => res.json())
        .then(data => {
          // Tambahkan base URL backend ke field image
          const formatted = data.map((item: any) => ({
            ...item,
            image: item.image.startsWith('http')
              ? item.image
              : `http://localhost:5000${item.image}`,
            date: item.date ? item.date.slice(0, 10) : '',
          }));
          setHistoryData(formatted);
          setLoadingHistory(false);
        })
        .catch(() => setLoadingHistory(false));
    }
  }, [showHistory]);

  // --- Refs ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  // Fungsi terpusat untuk memproses file yang dipilih
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setPredictionResults(null);
      setConclusion({ text: '', type: '' });
    } else {
      alert(language === 'id' ? 'Tipe file tidak valid. Silakan pilih file gambar.' : 'Invalid file type. Please select an image file.');
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedImage) {
      alert(language === 'id' ? 'Silakan pilih berkas gambar terlebih dahulu.' : 'Please select an image file first.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage); // Ganti 'data' ke 'file'

    try {
      const res = await fetch("http://localhost:5000/api/predict/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log('Response from backend:', data);
      // Flask mengembalikan { label: ..., confidence: ... }
      const label = data.label;
      const confidence = data.confidence;

      let type: "Kering" | "Sedang" | "Basah" | "" = "";
      if (label === "kering") type = "Kering";
      else if (label === "sedang") type = "Sedang";
      else if (label === "basah") type = "Basah";
      else if (label === "Tidak terdeteksi") type = "";

      // Tampilkan confidence dan label
      if (label && confidence !== null && confidence !== undefined) {
        if (label === "Tidak terdeteksi") {
          setPredictionResults(null);
          setConclusion({
            text: language === 'id'
              ? `Gambar <strong>tidak terdeteksi</strong> (keyakinan ${confidence.toFixed(2)}%)`
              : `Image <strong>not detected</strong> (confidence ${confidence.toFixed(2)}%)`,
            type: ""
          });
        } else {
          setPredictionResults({ [type]: parseFloat(confidence.toFixed(2)) });
          setConclusion({
            text: language === 'id'
              ? `Gambar teridentifikasi sebagai <strong>${type}</strong> dengan keyakinan ${confidence.toFixed(2)}%.`
              : `Image identified as <strong>${type === 'Kering' ? 'Dry' : type === 'Sedang' ? 'Medium' : 'Wet'}</strong> with confidence ${confidence.toFixed(2)}%.`,
            type
          });
        }
      } else {
        setPredictionResults(null);
        setConclusion({
          text: language === 'id'
            ? 'Gagal mendapatkan hasil prediksi dari backend.'
            : 'Failed to get prediction from backend.',
          type: ""
        });
      }
    } catch (err) {
      setPredictionResults(null);
      setConclusion({
        text: language === 'id'
          ? 'Terjadi error saat menghubungi backend.'
          : 'An error occurred while contacting backend.',
        type: ""
      });
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl('');
    setPredictionResults(null);
    setConclusion({ text: '', type: '' });
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  }, []); // dependensi kosong karena processImageFile sudah stabil

  // Styling dinamis untuk kotak kesimpulan
  const conclusionStyles = {
    Kering: 'bg-orange-50 border-orange-500 text-orange-800',
    Sedang: 'bg-green-50 border-green-500 text-green-800',
    Basah: 'bg-blue-50 border-blue-500 text-blue-800',
    '': 'bg-gray-50 border-gray-500 text-gray-800'
  };

  // --- Render Komponen ---
  return (
    <section id="scan" className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-green-50 py-16 md:py-24">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-100 p-4 rounded-full mb-4 shadow">
            <ScanLine size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2 text-center drop-shadow-sm">
            {language === 'id' ? 'AI Scan & Identifikasi Apel' : 'AI Scan & Apple Identification'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl">
            {language === 'id' ? 'Unggah gambar apel, biarkan AI kami menganalisis tingkat kekeringan secara otomatis dan akurat.' : 'Upload an apple image and let our AI analyze the dryness level automatically and accurately.'}
          </p>
        </div>
        {/* Stepper / Timeline */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${!imageUrl ? 'border-green-500 bg-green-100' : 'border-green-300 bg-green-50'} text-green-700 font-bold text-lg`}>1</div>
            <span className="mt-2 text-xs md:text-sm font-semibold text-green-700">{language === 'id' ? 'Upload' : 'Upload'}</span>
          </div>
          <div className="h-1 w-8 bg-green-200 rounded-full" />
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${(imageUrl && !predictionResults) ? 'border-green-500 bg-green-100' : 'border-green-300 bg-green-50'} text-green-700 font-bold text-lg`}>2</div>
            <span className="mt-2 text-xs md:text-sm font-semibold text-green-700">{language === 'id' ? 'Scan' : 'Scan'}</span>
          </div>
          <div className="h-1 w-8 bg-green-200 rounded-full" />
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${predictionResults ? 'border-green-500 bg-green-100' : 'border-green-300 bg-green-50'} text-green-700 font-bold text-lg`}>3</div>
            <span className="mt-2 text-xs md:text-sm font-semibold text-green-700">{language === 'id' ? 'Hasil' : 'Result'}</span>
          </div>
        </div>
        {/* Modal History */}
        <HistoryModal
          open={showHistory}
          onClose={() => setShowHistory(false)}
          data={historyData}
          filter={historyFilter}
          setFilter={setHistoryFilter}
          language={language}
        />
        {/* Card Utama */}
        <div className="bg-white/90 p-6 md:p-10 rounded-2xl border border-green-100 shadow-xl">
          {!imageUrl ? (
            // --- Tampilan Awal (Input & Drop Zone) ---
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`text-center flex flex-col items-center p-8 md:p-12 rounded-xl border-2 border-dashed transition-colors duration-200 ${isDragging ? 'border-green-400 bg-green-50' : 'border-green-200 bg-green-50/40'}`}
            >
              <FileImage size={56} className={`transition-transform duration-200 ${isDragging ? 'scale-110 text-green-400' : 'text-green-300'}`} />
              <h3 className="text-xl md:text-2xl font-semibold text-green-800 mt-4 mb-2">{language === 'id' ? 'Seret & Lepas Gambar di Sini' : 'Drag & Drop Image Here'}</h3>
              <p className="text-gray-500 mb-6 text-base">{language === 'id' ? 'atau klik untuk memilih file' : 'or click to select a file'}</p>
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-base md:text-lg"
              >
                <Upload size={20} />
                {language === 'id' ? 'Pilih File' : 'Choose File'}
              </button>
            </div>
          ) : (
            // --- Tampilan Pratinjau & Hasil ---
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Kolom Kiri: Pratinjau Gambar */}
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold text-green-800 mb-3">{language === 'id' ? 'Pratinjau Gambar' : 'Image Preview'}</h3>
                <div className="relative aspect-square bg-green-50 rounded-xl overflow-hidden border border-green-200">
                  <img src={imageUrl} alt="Pratinjau Apel" className="w-full h-full object-cover" />
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white">
                      <Loader2 size={36} className="animate-spin" />
                      <p className="mt-3 font-semibold text-sm">{language === 'id' ? 'Menganalisis...' : 'Analyzing...'}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-3 flex-col sm:flex-row">
                  <form onSubmit={handleUpload} className="w-full">
                    <button
                      type="submit"
                      disabled={loading || !!predictionResults}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-full hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed shadow text-base"
                    >
                      {loading ? (language === 'id' ? 'Memproses...' : 'Processing...') : (language === 'id' ? '🚀 Identifikasi Sekarang' : '🚀 Identify Now')}
                    </button>
                  </form>
                  <button
                    onClick={handleReset}
                    title={language === 'id' ? 'Reset' : 'Reset'}
                    className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition text-base"
                  >
                    <RefreshCcw size={20} />
                  </button>
                </div>
              </div>
              {/* Kolom Kanan: Hasil Identifikasi */}
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold text-green-800 mb-3">{language === 'id' ? 'Hasil Analisis' : 'Analysis Result'}</h3>
                <div className="bg-green-50/70 p-6 rounded-xl border border-green-200 min-h-[160px]">
                  {!predictionResults && !loading && (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                      <Info size={28} className="mb-2 text-green-400" />
                      <p className="text-base" dangerouslySetInnerHTML={{
                        __html: conclusion.text
                          ? conclusion.text
                          : (language === 'id'
                              ? 'Hasil analisis akan ditampilkan di sini setelah gambar diidentifikasi.'
                              : 'The analysis result will be displayed here after the image is identified.')
                      }} />
                    </div>
                  )}
                  {predictionResults && (
                    <div>
                      <ul className="mb-4">
                        {Object.entries(predictionResults).map(([key, value]) => (
                          <li key={key} className="flex justify-between py-1 text-base">
                            <span className={`font-semibold px-3 py-1 rounded-full text-white ${key === 'Kering' ? 'bg-orange-500' : key === 'Sedang' ? 'bg-green-500' : 'bg-blue-500'}`}>{language === 'id' ? key : (key === 'Kering' ? 'Dry' : key === 'Sedang' ? 'Medium' : 'Wet')}</span>
                            <span className="font-mono text-green-900">{value}%</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`p-4 rounded-lg border-2 font-semibold text-center text-base ${conclusionStyles[conclusion.type]}`}
                        dangerouslySetInnerHTML={{ __html: language === 'id' ? conclusion.text : conclusion.type ? `Image identified as <strong>${conclusion.type === 'Kering' ? 'Dry' : conclusion.type === 'Sedang' ? 'Medium' : 'Wet'}</strong> with confidence ${predictionResults && predictionResults[conclusion.type] ? predictionResults[conclusion.type] : ''}%.` : '' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Button History selalu muncul di bawah card */}
          <div className="flex justify-end mt-8">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition text-base font-semibold"
              onClick={() => setShowHistory(true)}
            >
              <HistoryIcon size={20} />
              {language === 'id' ? 'Riwayat' : 'History'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}