import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { enerjiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Zap, Droplets, Flame, Plus, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const ayAdlari = ['', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

// JSON'dan gelen BigDecimal veya null/undefined değerleri güvenle sayıya çevirir
const safeNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

export default function EnerjiPage() {
  const { yonetici, sakin, kullanici } = useAuth();
  const [okumalar, setOkumalar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({
    binaId: 1, elektrikKwh: '', suM3: '', dogalgazM3: '',
    ay: new Date().getMonth() + 1, yil: 2026
  });

  const yukle = async () => {
    try {
      const res = await enerjiAPI.getAll(1);
      setOkumalar(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Yüklenemedi'); }
  };

  useEffect(() => { yukle(); }, []);

  const handleEkle = async (e) => {
    e.preventDefault();
    try {
      await enerjiAPI.ekle({
        ...form,
        elektrikKwh: Number(form.elektrikKwh),
        suM3: Number(form.suM3),
        dogalgazM3: Number(form.dogalgazM3),
      });
      toast.success('Enerji okuma kaydedildi!');
      setModalAcik(false);
      yukle();
    } catch { toast.error('İşlem başarısız'); }
  };

  const handleSimule = async () => {
    try {
      const res = await enerjiAPI.simule(1);
      toast.success('📡 Sensör verisi üretildi ve kaydedildi!');
      yukle();
    } catch { toast.error('Simülasyon başarısız'); }
  };

  const chartData = [...okumalar].reverse().slice(0, 6).map(o => ({
    ay: ayAdlari[o.donemAy],
    Elektrik: safeNum(o.elektrikKwh),
    Su: safeNum(o.suM3),
    'Doğalgaz': safeNum(o.dogalgazM3),
  }));

  const maliyetData = [...okumalar].reverse().slice(0, 6).map(o => ({
    ay: ayAdlari[o.donemAy],
    Elektrik: safeNum(o.elektrikMaliyet),
    Su: safeNum(o.suMaliyet),
    'Doğalgaz': safeNum(o.dogalgazMaliyet),
  }));

  const sonOkuma = okumalar[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Enerji Takibi</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {yonetici ? 'Bina geneli tüketim analizi ve tasarruf önerileri' : 'Dairenizin tüketim analizi ve tasarruf önerileri'}
          </p>
        </div>
        {yonetici && (
          <div className="flex gap-2">
            <button onClick={handleSimule}
              className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
              title="IoT sensörü simüle ederek rastgele gerçekçi veri üretir">
              📡 Sensör Simülasyonu
            </button>
            <button onClick={() => setModalAcik(true)}
              className="flex items-center gap-2 bg-[#F545A0] hover:bg-[#E02080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <Plus size={16} /> Okuma Ekle
            </button>
          </div>
        )}
      </div>

      {/* Sakin daire seçmemişse uyarı */}
      {sakin && !kullanici?.daireId && (
        <div className="flex items-start gap-3 bg-[#2E1A10] border border-orange-800 rounded-2xl px-5 py-4">
          <span className="text-orange-500 text-xl">🏠</span>
          <div>
            <p className="font-semibold text-orange-200 text-sm">Daire bilginiz eksik</p>
            <p className="text-sm text-orange-300 mt-0.5">
              Bireysel tüketim verilerinizi görmek için{' '}
              <a href="/profil" className="underline font-medium hover:text-orange-900">Profil sayfasından</a>
              {' '}dairenizi seçin.
            </p>
          </div>
        </div>
      )}

      {/* Dairesi var ama veri yoksa bilgilendirme */}
      {sakin && kullanici?.daireId && okumalar.length === 0 && (
        <div className="flex items-start gap-3 bg-[#3D1030] border border-[#F545A0]/40 rounded-2xl px-5 py-4">
          <span className="text-blue-500 text-xl">📊</span>
          <div>
            <p className="font-semibold text-[#FF80C8] text-sm">Henüz tüketim verisi yok</p>
            <p className="text-sm text-[#F545A0] mt-0.5">
              Daireniz sisteme yeni eklendi. Veriler en kısa sürede görünecek.
              Yöneticiniz "Sensör Simülasyonu" ile veri üretebilir.
            </p>
          </div>
        </div>
      )}

      {/* Son ay özeti */}
      {sonOkuma && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Elektrik', deger: `${safeNum(sonOkuma.elektrikKwh).toLocaleString('tr-TR')} kWh`, maliyet: `₺${safeNum(sonOkuma.elektrikMaliyet).toLocaleString('tr-TR')}`, icon: Zap, renk: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Su', deger: `${safeNum(sonOkuma.suM3).toLocaleString('tr-TR')} m³`, maliyet: `₺${safeNum(sonOkuma.suMaliyet).toLocaleString('tr-TR')}`, icon: Droplets, renk: 'text-[#F545A0]', bg: 'bg-[#3D1030]' },
            { label: 'Doğalgaz', deger: `${safeNum(sonOkuma.dogalgazM3).toLocaleString('tr-TR')} m³`, maliyet: `₺${safeNum(sonOkuma.dogalgazMaliyet).toLocaleString('tr-TR')}`, icon: Flame, renk: 'text-orange-600', bg: 'bg-[#2E1A10]' },
          ].map(k => (
            <div key={k.label} className="bg-[#2D1F3A] rounded-2xl p-5 border border-[#3A2849] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center`}>
                  <k.icon size={20} className={k.renk} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{k.label}</p>
                  <p className="font-bold text-white">{k.deger}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${k.renk}`}>{k.maliyet}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ayAdlari[sonOkuma.donemAy]} {sonOkuma.donemYil} dönemi
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tasarruf önerisi */}
      {sonOkuma?.tasarrufOnerisi && (
        <div className="bg-[#1A2E1A] border border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#1A2E1A] rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Tasarruf Önerisi</p>
            <p className="text-sm text-emerald-400 mt-0.5">{sonOkuma.tasarrufOnerisi}</p>
          </div>
        </div>
      )}

      {/* Grafikler */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
            <h2 className="font-semibold text-gray-100 mb-4">Aylık Tüketim</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="ay" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Elektrik" fill="#EAB308" radius={[4,4,0,0]} />
                <Bar dataKey="Su" fill="#3B82F6" radius={[4,4,0,0]} />
                <Bar dataKey="Doğalgaz" fill="#F97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
            <h2 className="font-semibold text-gray-100 mb-4">Aylık Maliyet (₺)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={maliyetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="ay" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `₺${safeNum(v).toLocaleString('tr-TR')}`} />
                <Legend />
                <Bar dataKey="Elektrik" fill="#EAB308" radius={[4,4,0,0]} />
                <Bar dataKey="Su" fill="#3B82F6" radius={[4,4,0,0]} />
                <Bar dataKey="Doğalgaz" fill="#F97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tüm okumalar tablosu */}
      <div className="bg-[#2D1F3A] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-semibold text-gray-100">Okuma Geçmişi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1C1228]">
              <tr>
                {['Dönem', 'Elektrik (kWh)', 'Su (m³)', 'Doğalgaz (m³)', 'Toplam Maliyet'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2849]">
              {okumalar.map(o => (
                <tr key={o.id} className="hover:bg-[#1C1228]">
                  <td className="px-4 py-3 font-medium">{ayAdlari[o.donemAy]} {o.donemYil}</td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">{safeNum(o.elektrikKwh).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-[#F545A0] font-semibold">{safeNum(o.suM3).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 text-orange-600 font-semibold">{safeNum(o.dogalgazM3).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3 font-bold text-gray-100">₺{safeNum(o.toplamMaliyet).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAcik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D1F3A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5">Enerji Okuma Ekle</h2>
            <form onSubmit={handleEkle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Ay</label>
                  <select value={form.ay} onChange={e => setForm({...form, ay: Number(e.target.value)})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none">
                    {['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'].map((a,i) =>
                      <option key={i} value={i+1}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Yıl</label>
                  <input type="number" value={form.yil} onChange={e => setForm({...form, yil: Number(e.target.value)})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
              </div>
              {[
                { key: 'elektrikKwh', label: 'Elektrik (kWh)', icon: '⚡' },
                { key: 'suM3', label: 'Su (m³)', icon: '💧' },
                { key: 'dogalgazM3', label: 'Doğalgaz (m³)', icon: '🔥' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-200 mb-1">{f.icon} {f.label}</label>
                  <input required type="number" step="0.01" value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
              ))}
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
