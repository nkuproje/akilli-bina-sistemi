import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aidatAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, AlertTriangle, Clock, Plus, Filter } from 'lucide-react';

const durumRenk = {
  ODENDI: 'bg-[#1A2E1A] text-emerald-400',
  BEKLIYOR: 'bg-yellow-100 text-yellow-700',
  GECIKTI: 'bg-red-100 text-red-700',
};

const durumIcon = {
  ODENDI: <CheckCircle size={14} />,
  BEKLIYOR: <Clock size={14} />,
  GECIKTI: <AlertTriangle size={14} />,
};

const ayAdlari = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export default function AidatPage() {
  const { yonetici, sakin } = useAuth();
  const [aidatlar, setAidatlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [filtre, setFiltre] = useState('');
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ tutar: 750, ay: new Date().getMonth() + 1, yil: 2026, sonGun: 25 });

  const yukle = async () => {
    try {
      setYukleniyor(true);
      const res = sakin ? await aidatAPI.getBenim() : await aidatAPI.getAll();
      setAidatlar(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => { yukle(); }, []);

  const handleOde = async (id) => {
    try {
      await aidatAPI.ode(id);
      toast.success('Aidat ödendi!');
      yukle();
    } catch {
      toast.error('İşlem başarısız');
    }
  };

  const handleOlustur = async (e) => {
    e.preventDefault();
    try {
      await aidatAPI.olustur({
        tutar: parseFloat(form.tutar),
        ay: parseInt(form.ay),
        yil: parseInt(form.yil),
        sonGun: parseInt(form.sonGun),
      });
      toast.success('Aidatlar oluşturuldu!');
      setModalAcik(false);
      yukle();
    } catch {
      toast.error('Aidat oluşturulamadı');
    }
  };

  const filtrelenmis = aidatlar.filter(a =>
    !filtre || a.durum === filtre
  );

  const toplam = aidatlar.reduce((s, a) => s + Number(a.tutar), 0);
  const odenen = aidatlar.filter(a => a.durum === 'ODENDI').reduce((s, a) => s + Number(a.tutar), 0);
  const bekleyen = aidatlar.filter(a => a.durum === 'BEKLIYOR').length;
  const gecikti = aidatlar.filter(a => a.durum === 'GECIKTI').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Aidat Yönetimi</h1>
          <p className="text-gray-400 text-sm mt-0.5">Dönem aidat takip ve yönetimi</p>
        </div>
        {yonetici && (
          <button
            onClick={() => setModalAcik(true)}
            className="flex items-center gap-2 bg-[#F545A0] hover:bg-[#E02080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          >
            <Plus size={16} /> Aidat Oluştur
          </button>
        )}
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Toplam', deger: `₺${toplam.toLocaleString('tr-TR')}`, renk: 'text-gray-100', bg: 'bg-[#1C1228]' },
          { label: 'Tahsil Edilen', deger: `₺${odenen.toLocaleString('tr-TR')}`, renk: 'text-emerald-400', bg: 'bg-[#1A2E1A]' },
          { label: 'Bekleyen', deger: bekleyen, renk: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Gecikmiş', deger: gecikti, renk: 'text-red-700', bg: 'bg-red-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-[#3A2849]`}>
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.renk}`}>{k.deger}</p>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-gray-400" />
        {['', 'ODENDI', 'BEKLIYOR', 'GECIKTI'].map(d => (
          <button
            key={d}
            onClick={() => setFiltre(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filtre === d ? 'bg-[#F545A0] text-white border-[#F545A0]' : 'bg-[#2D1F3A] text-gray-300 border-[#3A2849] hover:border-blue-300'
            }`}
          >
            {d || 'Tümü'}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className="bg-[#2D1F3A] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] overflow-hidden">
        {yukleniyor ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Yükleniyor...</div>
        ) : filtrelenmis.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <CreditCard size={24} className="mr-2" /> Kayıt bulunamadı
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1C1228] border-b border-[#3A2849]">
                <tr>
                  {sakin ? null : <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Daire</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dönem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tutar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Son Ödeme</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                  {yonetici && <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">İşlem</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A2849]">
                {filtrelenmis.map(aidat => (
                  <tr key={aidat.id} className="hover:bg-[#1C1228] transition-colors">
                    {!sakin && (
                      <td className="px-4 py-3 font-medium text-gray-100">
                        {aidat.daire?.bina?.ad} - Daire {aidat.daire?.daireNo}
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-300">
                      {ayAdlari[aidat.donemAy]} {aidat.donemYil}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-100">
                      ₺{aidat.tutar ? Number(aidat.tutar).toLocaleString('tr-TR') : '0'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{aidat.sonOdemeTarihi}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${durumRenk[aidat.durum]}`}>
                        {durumIcon[aidat.durum]} {aidat.durum === 'ODENDI' ? 'Ödendi' : aidat.durum === 'BEKLIYOR' ? 'Bekliyor' : 'Gecikti'}
                      </span>
                    </td>
                    {yonetici && (
                      <td className="px-4 py-3">
                        {aidat.durum !== 'ODENDI' && (
                          <button
                            onClick={() => handleOde(aidat.id)}
                            className="text-xs bg-[#1A2E1A] hover:bg-green-200 text-emerald-400 px-3 py-1 rounded-lg font-medium transition-colors"
                          >
                            Tahsil Et
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Aidat Oluştur */}
      {modalAcik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D1F3A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-5">Dönem Aidatı Oluştur</h2>
            <form onSubmit={handleOlustur} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Ay</label>
                  <select value={form.ay} onChange={e => setForm({...form, ay: Number(e.target.value)})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none">
                    {ayAdlari.slice(1).map((ad, i) => <option key={i+1} value={i+1}>{ad}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Yıl</label>
                  <input type="number" value={form.yil} onChange={e => setForm({...form, yil: Number(e.target.value)})}
                    className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Aidat Tutarı (₺)</label>
                <input type="number" value={form.tutar} onChange={e => setForm({...form, tutar: Number(e.target.value)})}
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Son Ödeme Günü</label>
                <input type="number" min="1" max="31" value={form.sonGun} onChange={e => setForm({...form, sonGun: Number(e.target.value)})}
                  className="w-full border border-[#3A2849] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F545A0] focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalAcik(false)}
                  className="flex-1 border border-[#3A2849] text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1C1228]">
                  İptal
                </button>
                <button type="submit"
                  className="flex-1 bg-[#F545A0] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#E02080]">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
