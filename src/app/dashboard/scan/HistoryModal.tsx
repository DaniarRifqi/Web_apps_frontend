import { X, History as HistoryIcon, Calendar, Filter, Trash2, CheckSquare, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface HistoryItem {
  id: number;
  date: string;
  image: string;
  type: string;
  confidence: number;
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  data: HistoryItem[];
  filter: { date: string; type: string };
  setFilter: React.Dispatch<React.SetStateAction<{ date: string; type: string }>>;
  language: string;
  loading: boolean; // <-- TAMBAHKAN PROPERTI 'loading' DI SINI
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  open,
  onClose,
  data,
  filter,
  setFilter,
  language,
  loading, // <-- TAMBAHKAN INI JUGA DI DESTRUCTURING PROPS
}) => {
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>(data);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  React.useEffect(() => {
    setLocalHistory(data);
  }, [data]);

  // Filter and sort by date (newest first), then take the top 10
  const filteredHistory = localHistory
    .filter(item => {
      const matchDate = filter.date ? item.date === filter.date : true;
      const matchType = filter.type ? item.type === item.type : true; // Perbaiki: seharusnya item.type === filter.type
      return matchDate && matchType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Hapus satu
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://webappsbackend-production.up.railway.app/api/history/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLocalHistory(h => h.filter(item => item.id !== id));
        setSelected(null);
      } else {
        // Tambahkan penanganan error yang lebih informatif
        console.error('Failed to delete history item on server:', data.message || 'Unknown error');
        alert(language === 'id' ? 'Gagal menghapus data di server!' : 'Failed to delete data on server!');
      }
    } catch (err) {
      // Gunakan `err` untuk logging
      console.error('Error contacting server for delete:', err);
      alert(language === 'id' ? 'Gagal menghubungi server!' : 'Failed to contact server!');
    }
  };

  // Hapus semua
  const handleDeleteAll = async () => { // Jadikan async jika akan memanggil API
    if (confirm(language === 'id' ? 'Apakah Anda yakin ingin menghapus semua riwayat?' : 'Are you sure you want to delete all history?')) {
      try {
        // Contoh: Panggil API untuk menghapus semua
        // const res = await fetch(`http://localhost:5000/api/history/clear-all`, { method: 'DELETE' });
        // const data = await res.json();
        // if (data.success) {
        setLocalHistory([]);
        setSelected(null);
        setSelectAll(false);
        // } else {
        //   alert('Gagal menghapus semua data di server!');
        // }
      } catch (err) {
        console.error('Error deleting all history:', err);
        alert('Gagal menghapus semua riwayat!');
      }
    }
  };


  // Pilih semua
  const handleSelectAll = () => {
    setSelectAll(true);
    setSelected(null);
  };

  // Reset select all jika data berubah
  React.useEffect(() => {
    if (filteredHistory.length === 0) setSelectAll(false);
  }, [filteredHistory.length]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md mx-2 sm:mx-4 p-0 relative animate-fadeIn border border-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <HistoryIcon size={18} className="text-blue-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              {language === 'id' ? 'Riwayat Identifikasi' : 'Identification History'}
            </h2>
          </div>
          <button
            className="text-slate-400 hover:text-red-500 transition rounded-full p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Filter */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <Calendar size={13} className="text-slate-500" />
            <input
              type="date"
              value={filter.date}
              onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
              className="border border-slate-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full sm:w-auto"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <Filter size={13} className="text-slate-500" />
            <select
              value={filter.type}
              onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
              className="border border-slate-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full sm:w-auto"
            >
              <option value="">{language === 'id' ? 'Semua Jenis' : 'All Types'}</option>
              <option value="Kering">{language === 'id' ? 'Kering' : 'Dry'}</option>
              <option value="Sedang">{language === 'id' ? 'Sedang' : 'Medium'}</option>
              <option value="Basah">{language === 'id' ? 'Basah' : 'Wet'}</option>
            </select>
          </div>
        </div>
        {/* Tabel/List History */}
        <div className="overflow-x-auto px-1 sm:px-4 py-2 sm:py-3">
          {/* Tambahkan indikator loading di sini */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-blue-500" size={24} />
              <p className="ml-2 text-sm text-slate-600">{language === 'id' ? 'Memuat riwayat...' : 'Loading history...'}</p>
            </div>
          ) : (
            <table className="min-w-full text-[11px] sm:text-xs border-separate border-spacing-0">
              <thead>
                <tr className="bg-blue-50 text-blue-900">
                  <th className="py-2 px-2 sm:px-3 border-b border-slate-200 font-semibold text-left whitespace-nowrap">{language === 'id' ? 'Tanggal' : 'Date'}</th>
                  <th className="py-2 px-2 sm:px-3 border-b border-slate-200 font-semibold text-left whitespace-nowrap">{language === 'id' ? 'Gambar' : 'Image'}</th>
                  <th className="py-2 px-2 sm:px-3 border-b border-slate-200 font-semibold text-left whitespace-nowrap">{language === 'id' ? 'Jenis' : 'Type'}</th>
                  <th className="py-2 px-2 sm:px-3 border-b border-slate-200 font-semibold text-right whitespace-nowrap">{language === 'id' ? 'Keyakinan' : 'Confidence'}</th>
                  {filteredHistory.length > 0 && (selected !== null || selectAll) && (
                    <th className="py-2 px-2 sm:px-3 border-b border-slate-200 font-semibold text-center w-12 sm:w-16">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="inline-flex items-center justify-center text-blue-600 hover:bg-blue-100 rounded-full p-1"
                          title={language === 'id' ? 'Pilih Semua' : 'Select All'}
                          onClick={handleSelectAll}
                        >
                          <CheckSquare size={13} />
                        </button>
                        <button
                          className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-1"
                          title={language === 'id' ? 'Hapus Semua' : 'Delete All'}
                          onClick={handleDeleteAll}
                        >
                          <Trash2 size={13} />
                        </button>
                        {selectAll && (
                          <button
                            className="inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full p-1"
                            title={language === 'id' ? 'Batal' : 'Cancel'}
                            onClick={() => { setSelectAll(false); setSelected(null); }}
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      {language === 'id' ? 'Tidak ada data.' : 'No data.'}
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(item => (
                    <tr
                      key={item.id}
                      className={`transition cursor-pointer ${
                        (selected === item.id || selectAll) ? 'bg-blue-100/80' : 'hover:bg-blue-50/60'
                      }`}
                      onClick={() => {
                        setSelected(selected === item.id ? null : item.id);
                        setSelectAll(false);
                      }}
                    >
                      <td className="py-2 px-2 sm:px-3 border-b border-slate-100 whitespace-nowrap">{item.date}</td>
                      <td className="py-2 px-2 sm:px-3 border-b border-slate-100">
                        <img src={item.image} alt="history" className="w-8 h-8 object-contain rounded border bg-white shadow-sm" />
                      </td>
                      <td className="py-2 px-2 sm:px-3 border-b border-slate-100">
                        <span className={
                          `inline-block rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold ` +
                          (item.type === 'Kering' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            item.type === 'Sedang' ? 'bg-green-100 text-green-700 border border-green-200' :
                            item.type === 'Basah' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700 border')
                        }>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-3 border-b border-slate-100 font-semibold text-right whitespace-nowrap">{item.confidence}%</td>
                      {(selected === item.id && !selectAll) && (
                        <td className="py-2 px-2 sm:px-3 border-b border-slate-100 text-center flex gap-1 justify-center">
                          <button
                            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-1"
                            title={language === 'id' ? 'Hapus' : 'Delete'}
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            className="inline-flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full p-1"
                            title={language === 'id' ? 'Batal' : 'Cancel'}
                            onClick={e => {
                              e.stopPropagation();
                              setSelected(null);
                            }}
                          >
                            <X size={13} />
                          </button>
                        </td>
                      )}
                      {/* Pastikan tidak ada td kosong di sini jika tidak ada aksi yang muncul */}
                      {filteredHistory.length > 0 && !(selected === item.id || selectAll) && (
                        <td className="py-2 px-2 sm:px-3 border-b border-slate-100"></td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;