// ============================================================
// DuyuruPage.js
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { duyuruAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Bell, Plus, AlertTriangle, Trash2 } from 'lucide-react';

export function DuyuruPage() {
  const { yonetici } = useAuth();
  const [duyurular, setDuyurular] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ baslik: '', icerik: '', onemli: false });

  const yukle = async () => {
    try {
      const res = await duyuruAPI.getAll();
      setDuyurular(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Yüklenemedi'); }
  };

  useEffect(() => { yukle(); }, []);

  const handleOlustur = async (e) => {
    e.preventDefault();
    try {
      await duyuruAPI.olustur(form);
      toast.success('Duyuru yayınlandı!');
      setModalAcik(false);
      setForm({ baslik: '', icerik: '', onemli: false });
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  const handleSil = async (id) => {
    try {
      await duyuruAPI.sil(id);
      toast.success('Duyuru kaldırıldı');
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Duyurular</h1>
          <p className="text-gray-400 text-sm mt-0.5">Site ile ilgili duyuru ve bildirimler</p>
        </div>
        {yonetici && (
          <button onClick={() => setModalAcik(true)}
            className="flex items-center gap-2 bg-[#F545A0] hover:bg-[#E02080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <Plus size={16} /> Duyuru Ekle
          </button>
        )}
      </div>

      {duyurular.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p>Henüz duyuru yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {duyurular.map(d => (
            <div key={d.id} className={`bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border transition-shadow hover:shadow-md ${d.onemli ? 'border-red-200' : 'border-[#3A2849]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {d.onemli && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={11} /> Önemli
                      </span>
                    )}
                    <h3 className="font-semibold text-white">{d.baslik}</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{d.icerik}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(d.yayinTarihi).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
                {yonetici && (
                  <button onClick={() => handleSil(d.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAcik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D1F3A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5">Yeni Duyuru</h2>
            <form onSubmit={handleOlustur} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Başlık</label>
                <input required value={form.baslik} onChange={e => setForm({...form, baslik: e.target.value})}
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">İçerik</label>
                <textarea required rows={4} value={form.icerik} onChange={e => setForm({...form, icerik: e.target.value})}
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.onemli} onChange={e => setForm({...form, onemli: e.target.checked})} className="w-4 h-4 rounded accent-red-500" />
                <span className="text-sm text-gray-200 font-medium">Önemli duyuru olarak işaretle</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalAcik(false)}
                  className="flex-1 border border-[#3A2849] text-gray-300 py-2.5 rounded-xl text-sm font-medium">İptal</button>
                <button type="submit"
                  className="flex-1 bg-[#F545A0] text-white py-2.5 rounded-xl text-sm font-medium">Yayınla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DuyuruPage;
