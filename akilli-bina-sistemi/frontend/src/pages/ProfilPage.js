import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { daireAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Home, User, Phone, Mail, CheckCircle, Users, Search, Building2 } from 'lucide-react';

export default function ProfilPage() {
  const { kullanici, yonetici } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profil</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {yonetici ? 'Sakin listesi ve daire bilgileri' : 'Hesap bilgileri ve daire seçimi'}
        </p>
      </div>

      {/* Sakin → kendi profil kartı + daire seçimi */}
      {!yonetici && <SakinProfil kullanici={kullanici} />}

      {/* Yönetici → tüm sakin listesi */}
      {yonetici && <SakinListesi />}
    </div>
  );
}

/* ─── Sakin: kendi profil kartı + daire seçimi ─── */
function SakinProfil({ kullanici }) {
  const { guncelleKullanici } = useAuth();
  const [daireler, setDaireler] = useState([]);
  const [seciliDaireId, setSeciliDaireId] = useState('');
  const [mevcutDaire, setMevcutDaire] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    daireAPI.getAll().then(res => {
      setDaireler(res.data || []);
    }).catch(() => {});

    // Mevcut daire
    if (kullanici?.daireId) {
      setSeciliDaireId(String(kullanici.daireId));
    }
  }, [kullanici]);

  // Seçili daire etiketini bul
  useEffect(() => {
    if (seciliDaireId && daireler.length > 0) {
      const d = daireler.find(d => String(d.id) === String(seciliDaireId));
      setMevcutDaire(d || null);
    } else {
      setMevcutDaire(null);
    }
  }, [seciliDaireId, daireler]);

  const handleDaireKaydet = async () => {
    if (!seciliDaireId) {
      toast.error('Lütfen bir daire seçin');
      return;
    }
    setYukleniyor(true);
    try {
      await daireAPI.daireGuncelle(Number(seciliDaireId));
      // AuthContext'teki kullanıcı verisini güncelle
      if (guncelleKullanici) await guncelleKullanici();
      toast.success('✅ Daire bilginiz güncellendi! Enerji verileri hazırlanıyor…');
    } catch (e) {
      toast.error('Daire güncellenemedi');
    } finally {
      setYukleniyor(false);
    }
  };

  const handleDaireKaldir = async () => {
    setYukleniyor(true);
    try {
      await daireAPI.daireKaldir();
      setSeciliDaireId('');
      if (guncelleKullanici) await guncelleKullanici();
      toast.success('Daire bilgisi kaldırıldı');
    } catch {
      toast.error('İşlem başarısız');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kişisel bilgiler kartı */}
      <div className="bg-[#2D1F3A] rounded-2xl border border-[#3A2849] bg-[#2D1F3A] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#3D1030] flex items-center justify-center">
            <User size={20} className="text-[#F545A0]" />
          </div>
          <h2 className="font-semibold text-gray-100 text-lg">Kişisel Bilgiler</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#1C1228] rounded-xl">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Ad Soyad</p>
              <p className="text-sm font-medium text-gray-100">{kullanici?.adSoyad || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#1C1228] rounded-xl">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">E-posta</p>
              <p className="text-sm font-medium text-gray-100">{kullanici?.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#1C1228] rounded-xl">
            <Home size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Mevcut Daire</p>
              <p className="text-sm font-medium text-gray-100">
                {mevcutDaire
                  ? `Kat ${mevcutDaire.katNo} - Daire ${mevcutDaire.daireNo}`
                  : 'Henüz seçilmedi'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daire seçimi kartı */}
      <div className="bg-[#2D1F3A] rounded-2xl border border-[#3A2849] bg-[#2D1F3A] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1A2E1A] flex items-center justify-center">
            <Building2 size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-100 text-lg">Daire Seçimi</h2>
            <p className="text-xs text-gray-400">Hangi dairede oturduğunuzu belirtin</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Dairenizi seçin</label>
            <select
              value={seciliDaireId}
              onChange={e => setSeciliDaireId(e.target.value)}
              className="w-full border border-[#3A2849] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F545A0] bg-[#1C1228]"
            >
              <option value="">— Daire seçiniz —</option>
              {daireler.map(d => (
                <option key={d.id} value={d.id}>
                  {d.etiket} {d.dolu && String(d.id) !== String(kullanici?.daireId) ? '(Dolu)' : ''}
                </option>
              ))}
            </select>
          </div>

          {mevcutDaire && (
            <div className="flex items-center gap-2 bg-[#1A2E1A] border border-emerald-800 rounded-xl px-4 py-3">
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-400">
                <span className="font-semibold">{mevcutDaire.etiket}</span> seçildi
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleDaireKaydet}
              disabled={yukleniyor || !seciliDaireId}
              className="flex-1 bg-[#F545A0] hover:bg-[#E02080] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {yukleniyor ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            {kullanici?.daireId && (
              <button
                onClick={handleDaireKaldir}
                disabled={yukleniyor}
                className="px-4 bg-[#2D1F3A] hover:bg-[#4A3560] text-gray-300 rounded-xl text-sm font-medium transition-colors"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Yönetici: tüm sakin listesi ─── */
function SakinListesi() {
  const [sakinler, setSakinler] = useState([]);
  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState('tumu'); // tumu | daireli | dairesiz

  useEffect(() => {
    daireAPI.getSakinler().then(res => {
      setSakinler(res.data || []);
    }).catch(() => toast.error('Sakin listesi yüklenemedi'));
  }, []);

  const filtrelenmis = sakinler.filter(s => {
    const aramaEsles = s.adSoyad?.toLowerCase().includes(arama.toLowerCase()) ||
                       s.email?.toLowerCase().includes(arama.toLowerCase()) ||
                       s.daire?.etiket?.toLowerCase().includes(arama.toLowerCase());
    if (filtre === 'daireli') return aramaEsles && s.daire;
    if (filtre === 'dairesiz') return aramaEsles && !s.daire;
    return aramaEsles;
  });

  const daireli = sakinler.filter(s => s.daire).length;
  const dairesiz = sakinler.filter(s => !s.daire).length;

  return (
    <div className="space-y-4">
      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Toplam Sakin', deger: sakinler.length, renk: 'bg-[#3D1030] text-[#F545A0]', icon: Users },
          { label: 'Dairesi Belirlenen', deger: daireli, renk: 'bg-[#1A2E1A] text-emerald-400', icon: CheckCircle },
          { label: 'Daire Seçmemiş', deger: dairesiz, renk: 'bg-[#2E1A10] text-orange-300', icon: Home },
        ].map((k, i) => (
          <div key={i} className={`rounded-2xl border border-[#3A2849] bg-[#2D1F3A] p-4 ${k.renk.split(' ')[0]} bg-opacity-40`}>
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.renk.split(' ')[1]}`}>{k.deger}</p>
          </div>
        ))}
      </div>

      {/* Filtre ve arama */}
      <div className="bg-[#2D1F3A] rounded-2xl border border-[#3A2849] bg-[#2D1F3A] p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="İsim, e-posta veya daire ara…"
              value={arama}
              onChange={e => setArama(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#3A2849] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F545A0]"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'tumu', label: 'Tümü' },
              { key: 'daireli', label: 'Daireli' },
              { key: 'dairesiz', label: 'Dairesiz' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFiltre(f.key)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filtre === f.key
                    ? 'bg-[#F545A0] text-white'
                    : 'bg-[#2D1F3A] text-gray-300 hover:bg-[#4A3560]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A2849]">
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sakin</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">İletişim</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Daire</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2849]">
              {filtrelenmis.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">Sakin bulunamadı</td>
                </tr>
              ) : filtrelenmis.map(s => (
                <tr key={s.id} className="hover:bg-[#1C1228] transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3D1030] flex items-center justify-center text-[#F545A0] font-semibold text-xs flex-shrink-0">
                        {s.adSoyad?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-100">{s.adSoyad}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400">
                    <div>{s.email}</div>
                    {s.telefon && <div className="text-xs text-gray-400">{s.telefon}</div>}
                  </td>
                  <td className="px-3 py-3">
                    {s.daire ? (
                      <div className="flex items-center gap-1.5">
                        <Home size={14} className="text-green-500" />
                        <span className="font-medium text-gray-200">{s.daire.etiket}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Henüz seçmemiş</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      s.daire
                        ? 'bg-[#1A2E1A] text-emerald-400'
                        : 'bg-orange-100 text-orange-300'
                    }`}>
                      {s.daire ? 'Daire Belirlendi' : 'Daire Yok'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
