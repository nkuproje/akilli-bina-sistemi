// ============================================================
// BakimPage.js
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bakimAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle, ChevronDown } from 'lucide-react';

const oncelikRenk = {
  DUSUK: 'bg-[#2D1F3A] text-gray-300',
  NORMAL: 'bg-[#3D1030] text-[#F545A0]',
  YUKSEK: 'bg-orange-100 text-orange-600',
  ACIL: 'bg-red-100 text-red-700',
};

const durumRenk = {
  ACIK: 'bg-red-100 text-red-600',
  ISLEME_ALINDI: 'bg-yellow-100 text-yellow-700',
  COZULDU: 'bg-[#1A2E1A] text-emerald-400',
  IPTAL_EDILDI: 'bg-[#2D1F3A] text-gray-400',
};

export function BakimPage() {
  const { yonetici, sakin } = useAuth();
  const [talepler, setTalepler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ baslik: '', aciklama: '', oncelik: 'NORMAL', kategori: '' });

  const yukle = async () => {
    try {
      setYukleniyor(true);
      const res = sakin ? await bakimAPI.getBenim() : await bakimAPI.getAll();
      setTalepler(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Veriler yüklenemedi'); }
    finally { setYukleniyor(false); }
  };

  useEffect(() => { yukle(); }, []);

  const handleOlustur = async (e) => {
    e.preventDefault();
    try {
      await bakimAPI.olustur(form);
      toast.success('Bakım talebi oluşturuldu!');
      setModalAcik(false);
      setForm({ baslik: '', aciklama: '', oncelik: 'NORMAL', kategori: '' });
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  const handleDurum = async (id, durum) => {
    try {
      await bakimAPI.durumGuncelle(id, { durum });
      toast.success('Durum güncellendi');
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bakım Talepleri</h1>
          <p className="text-gray-400 text-sm mt-0.5">Arıza bildirimi ve takip sistemi</p>
        </div>
        <button onClick={() => setModalAcik(true)}
          className="flex items-center gap-2 bg-[#F545A0] hover:bg-[#E02080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <Plus size={16} /> Yeni Talep
        </button>
      </div>

      {yukleniyor ? (
        <div className="text-center py-16 text-gray-400">Yükleniyor...</div>
      ) : talepler.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p>Bakım talebi bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {talepler.map(talep => (
            <div key={talep.id} className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{talep.baslik}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${oncelikRenk[talep.oncelik]}`}>
                      {talep.oncelik}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${durumRenk[talep.durum]}`}>
                      {talep.durum?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {talep.kategori && <p className="text-xs text-gray-400 mt-1">📂 {talep.kategori}</p>}
                  <p className="text-sm text-gray-300 mt-2">{talep.aciklama}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Daire: {talep.daire?.daireNo} • {new Date(talep.olusturmaTarihi).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                {yonetici && talep.durum !== 'COZULDU' && (
                  <div className="flex gap-2 flex-shrink-0">
                    {talep.durum === 'ACIK' && (
                      <button onClick={() => handleDurum(talep.id, 'ISLEME_ALINDI')}
                        className="text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg font-medium">
                        İşleme Al
                      </button>
                    )}
                    <button onClick={() => handleDurum(talep.id, 'COZULDU')}
                      className="text-xs bg-[#1A2E1A] hover:bg-[#1A2E1A] text-emerald-400 px-3 py-1.5 rounded-lg font-medium">
                      Çözüldü
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAcik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D1F3A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5">Yeni Bakım Talebi</h2>
            <form onSubmit={handleOlustur} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Başlık</label>
                <input required value={form.baslik} onChange={e => setForm({...form, baslik: e.target.value})}
                  placeholder="Sorunu kısaca açıklayın"
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Açıklama</label>
                <textarea value={form.aciklama} onChange={e => setForm({...form, aciklama: e.target.value})}
                  rows={3} placeholder="Detaylı açıklama..."
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Öncelik</label>
                  <select value={form.oncelik} onChange={e => setForm({...form, oncelik: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none">
                    <option value="DUSUK">Düşük</option>
                    <option value="NORMAL">Normal</option>
                    <option value="YUKSEK">Yüksek</option>
                    <option value="ACIL">Acil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Kategori</label>
                  <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none">
                    <option value="">Seçin</option>
                    <option value="Elektrik">Elektrik</option>
                    <option value="Tesisat">Tesisat</option>
                    <option value="Isıtma">Isıtma</option>
                    <option value="Marangozluk">Marangozluk</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalAcik(false)}
                  className="flex-1 border border-[#3A2849] text-gray-300 py-2.5 rounded-xl text-sm font-medium">İptal</button>
                <button type="submit"
                  className="flex-1 bg-[#F545A0] text-white py-2.5 rounded-xl text-sm font-medium">Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BakimPage;
