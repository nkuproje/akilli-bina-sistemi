// ============================================================
// GiderPage.js
// ============================================================
import React, { useState, useEffect } from 'react';
import { giderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Receipt, Plus, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const RENKLER = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const kategoriler = ['Temizlik', 'Elektrik', 'Su', 'Doğalgaz', 'Bakım', 'Güvenlik', 'Peyzaj', 'Asansör', 'Diğer'];

export function GiderPage() {
  const [giderler, setGiderler] = useState([]);
  const [ozet, setOzet] = useState(null);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({
    binaId: 1, kategori: 'Temizlik', aciklama: '', tutar: '',
    tarih: new Date().toISOString().split('T')[0], tedarikci: '', faturaNu: ''
  });

  const yukle = async () => {
    try {
      const [giderRes, ozetRes] = await Promise.all([
        giderAPI.getAll(1),
        giderAPI.getOzet(2026),
      ]);
      setGiderler(Array.isArray(giderRes.data) ? giderRes.data : []);
      setOzet(ozetRes.data);
    } catch { toast.error('Yüklenemedi'); }
  };

  useEffect(() => { yukle(); }, []);

  const handleEkle = async (e) => {
    e.preventDefault();
    try {
      await giderAPI.ekle(form);
      toast.success('Gider kaydedildi!');
      setModalAcik(false);
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  const pieData = ozet?.kategoriOzeti
    ? Object.entries(ozet.kategoriOzeti).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gelir-Gider Yönetimi</h1>
          <p className="text-gray-400 text-sm mt-0.5">Finansal takip ve raporlama</p>
        </div>
        <button onClick={() => setModalAcik(true)}
          className="flex items-center gap-2 bg-[#F545A0] hover:bg-[#E02080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <Plus size={16} /> Gider Ekle
        </button>
      </div>

      {/* Özet Kart */}
      {ozet && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2D1F3A]/20 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-sm text-red-100">2026 Toplam Gider</p>
              <p className="text-3xl font-bold">₺{Number(ozet.toplamGider).toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pasta grafik */}
        {pieData.length > 0 && (
          <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
            <h2 className="font-semibold text-gray-100 mb-4">Kategori Dağılımı</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={RENKLER[i % RENKLER.length]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={v => `₺${Number(v).toLocaleString('tr-TR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Son giderler */}
        <div className="bg-[#2D1F3A] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-100">Son Giderler</h2>
          </div>
          <div className="divide-y divide-[#3A2849] max-h-72 overflow-y-auto">
            {giderler.slice(0, 10).map(g => (
              <div key={g.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#1C1228]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#3D1030] text-[#F545A0] px-2 py-0.5 rounded-full">{g.kategori}</span>
                    <span className="text-sm font-medium text-gray-100">{g.aciklama}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{g.giderTarihi} {g.tedarikci && `• ${g.tedarikci}`}</p>
                </div>
                <span className="text-sm font-bold text-red-600">-₺{Number(g.tutar).toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalAcik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D1F3A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5">Yeni Gider Ekle</h2>
            <form onSubmit={handleEkle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Kategori</label>
                  <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none">
                    {kategoriler.map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Tutar (₺)</label>
                  <input required type="number" step="0.01" value={form.tutar}
                    onChange={e => setForm({...form, tutar: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Açıklama</label>
                <input required value={form.aciklama} onChange={e => setForm({...form, aciklama: e.target.value})}
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Tarih</label>
                  <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Tedarikçi</label>
                  <input value={form.tedarikci} onChange={e => setForm({...form, tedarikci: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalAcik(false)}
                  className="flex-1 border border-[#3A2849] text-gray-300 py-2.5 rounded-xl text-sm font-medium">İptal</button>
                <button type="submit"
                  className="flex-1 bg-[#F545A0] text-white py-2.5 rounded-xl text-sm font-medium">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiderPage;
