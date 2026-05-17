import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aidatAPI, bakimAPI, duyuruAPI, enerjiAPI } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  CreditCard, Wrench, Bell, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

const RENKLER = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const StatKart = ({ baslik, deger, renk, icon: Icon, alt }) => (
  <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 font-medium">{baslik}</p>
        <p className={`text-2xl font-bold mt-1 ${renk}`}>{deger}</p>
        {alt && <p className="text-xs text-gray-400 mt-1">{alt}</p>}
      </div>
      <div className={`p-3 rounded-xl ${renk === 'text-[#F545A0]' ? 'bg-[#3D1030]' : renk === 'text-emerald-400' ? 'bg-[#1A2E1A]' : renk === 'text-orange-600' ? 'bg-[#2E1A10]' : 'bg-red-50'}`}>
        <Icon size={22} className={renk} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { kullanici, yonetici, sakin } = useAuth();
  const [aidatOzet, setAidatOzet] = useState(null);
  const [bakimIstatistik, setBakimIstatistik] = useState(null);
  const [duyurular, setDuyurular] = useState([]);
  const [enerjiVerileri, setEnerjiVerileri] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      try {
        const [duyuruRes, enerjiRes] = await Promise.all([
          duyuruAPI.getAll(),
          enerjiAPI.getAll(1),
        ]);
        setDuyurular(duyuruRes.data.slice(0, 3));

        const enerji = enerjiRes.data.slice(0, 6).reverse();
        setEnerjiVerileri(enerji.map(e => ({
          ay: `${e.donemAy}/${e.donemYil}`,
          elektrik: Number(e.elektrikKwh),
          su: Number(e.suM3),
          maliyet: Number(e.toplamMaliyet),
        })));

        if (yonetici) {
          const [aidatRes, bakimRes] = await Promise.all([
            aidatAPI.getOzet(),
            bakimAPI.getIstatistik(),
          ]);
          setAidatOzet(aidatRes.data);
          setBakimIstatistik(bakimRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, [yonetici]);

  if (yukleniyor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#F545A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const bakimPieData = bakimIstatistik ? [
    { name: 'Açık', value: bakimIstatistik.acik },
    { name: 'İşlemde', value: bakimIstatistik.islemde },
    { name: 'Çözüldü', value: bakimIstatistik.cozuldu },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gösterge Paneli</h1>
        <p className="text-gray-400 mt-1">
          Hoş geldiniz, <span className="font-medium text-gray-200">{kullanici?.adSoyad}</span> 👋
        </p>
      </div>

      {/* Yönetici İstatistik Kartları */}
      {yonetici && aidatOzet && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatKart
            baslik="Yıllık Aidat Geliri"
            deger={`₺${Number(aidatOzet.yillikGelir).toLocaleString('tr-TR')}`}
            renk="text-[#F545A0]"
            icon={CreditCard}
            alt="Bu yıl tahsil edilen"
          />
          <StatKart
            baslik="Bekleyen Aidat"
            deger={`₺${Number(aidatOzet.bekleyenTutar).toLocaleString('tr-TR')}`}
            renk="text-orange-600"
            icon={Clock}
            alt="Ödeme bekleyen"
          />
          <StatKart
            baslik="Gecikmiş Aidat"
            deger={aidatOzet.gecikmisSayisi}
            renk="text-red-600"
            icon={AlertTriangle}
            alt="Adet"
          />
          <StatKart
            baslik="Açık Bakım Talebi"
            deger={bakimIstatistik?.acik || 0}
            renk="text-emerald-400"
            icon={Wrench}
            alt={`${bakimIstatistik?.cozuldu || 0} adet çözüldü`}
          />
        </div>
      )}

      {/* Sakin Özet */}
      {sakin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatKart baslik="Bekleyen Aidat" deger="₺750" renk="text-orange-600" icon={CreditCard} alt="Mayıs 2026" />
          <StatKart baslik="Bakım Talebim" deger="2" renk="text-[#F545A0]" icon={Wrench} alt="Açık talep" />
          <StatKart baslik="Yeni Duyuru" deger="3" renk="text-emerald-400" icon={Bell} alt="Okunmamış" />
        </div>
      )}

      {/* Grafikler */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enerji Tüketim Grafiği */}
        <div className="xl:col-span-2 bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-100">Enerji Tüketim Trendi</h2>
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-[#1A2E1A] px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              Son 6 Ay
            </div>
          </div>
          {enerjiVerileri.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={enerjiVerileri}>
                <defs>
                  <linearGradient id="elektrikGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="ay" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => [n === 'elektrik' ? `${v} kWh` : `${v} m³`, n === 'elektrik' ? 'Elektrik' : 'Su']} />
                <Area type="monotone" dataKey="elektrik" stroke="#3B82F6" fill="url(#elektrikGrad)" strokeWidth={2} name="elektrik" />
                <Area type="monotone" dataKey="su" stroke="#10B981" fill="none" strokeWidth={2} strokeDasharray="5 5" name="su" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              <Zap size={20} className="mr-2" /> Enerji verisi yükleniyor...
            </div>
          )}
        </div>

        {/* Bakım Talepleri Pie veya Duyurular */}
        <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
          {yonetici && bakimPieData.length > 0 ? (
            <>
              <h2 className="font-semibold text-gray-100 mb-4">Bakım Talepleri Durumu</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={bakimPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {bakimPieData.map((_, i) => <Cell key={i} fill={RENKLER[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-gray-100 mb-4">Son Duyurular</h2>
              <div className="space-y-3">
                {duyurular.map(d => (
                  <div key={d.id} className="p-3 rounded-xl bg-[#1C1228] border border-[#3A2849]">
                    {d.onemli && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                        Önemli
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-100 leading-tight">{d.baslik}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{d.icerik}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Son Duyurular (Yönetici için ayrı bölüm) */}
      {yonetici && (
        <div className="bg-[#2D1F3A] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849]">
          <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#F545A0]" /> Son Duyurular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {duyurular.map(d => (
              <div key={d.id} className={`p-4 rounded-xl border ${d.onemli ? 'border-red-200 bg-red-50' : 'border-[#3A2849] bg-[#1C1228]'}`}>
                {d.onemli && (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium mb-1">
                    <AlertTriangle size={12} /> Önemli
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-100">{d.baslik}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-3">{d.icerik}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
