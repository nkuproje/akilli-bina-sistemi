import React, { useState, useEffect } from 'react';
import { oylamaAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OylamaPage = () => {
  const { kullanici, yonetici } = useAuth();
  const [oylamalar, setOylamalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [seciliOylama, setSeciliOylama] = useState(null);
  const [form, setForm] = useState({ baslik: '', aciklama: '', secenekler: ['', ''] });
  const [mesaj, setMesaj] = useState(null);

  const isYonetici = yonetici;

  useEffect(() => {
    fetchOylamalar();
  }, []);

  const fetchOylamalar = async () => {
    try {
      setLoading(true);
      const res = await oylamaAPI.getAll();
      setOylamalar(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMesaj({ tip: 'hata', metin: 'Oylamalar yüklenemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOyVer = async (oylamaId, secenek) => {
    try {
      await oylamaAPI.oyVer(oylamaId, { secenek });
      setMesaj({ tip: 'basari', metin: 'Oyunuz kaydedildi!' });
      fetchOylamalar();
      setSeciliOylama(null);
    } catch (err) {
      setMesaj({ tip: 'hata', metin: err.response?.data?.mesaj || 'Oy kullanılamadı.' });
    }
  };

  const handleOlustur = async (e) => {
    e.preventDefault();
    try {
      const data = {
        baslik: form.baslik,
        aciklama: form.aciklama,
        secenekler: form.secenekler.filter(s => s.trim() !== '')
      };
      await oylamaAPI.olustur(data);
      setMesaj({ tip: 'basari', metin: 'Oylama başarıyla oluşturuldu.' });
      setShowForm(false);
      setForm({ baslik: '', aciklama: '', secenekler: ['', ''] });
      fetchOylamalar();
    } catch (err) {
      setMesaj({ tip: 'hata', metin: 'Oylama oluşturulamadı.' });
    }
  };

  const secenek_ekle = () => {
    if (form.secenekler.length < 6) {
      setForm({ ...form, secenekler: [...form.secenekler, ''] });
    }
  };

  const secenek_guncelle = (index, value) => {
    const yeni = [...form.secenekler];
    yeni[index] = value;
    setForm({ ...form, secenekler: yeni });
  };

  // Seçenekler {ad, oySayisi} objeleri olarak geliyor
  const toplamOy = (oylama) => oylama.secenekler?.reduce((sum, s) => sum + (Number(s.oySayisi) || 0), 0) || 0;

  const yuzde = (oySayisi, toplam) => toplam === 0 ? 0 : Math.round((oySayisi / toplam) * 100);

  const getDurum = (oylama) => {
    if (oylama.durum === 'AKTIF') return { label: 'Aktif', color: 'bg-[#1A2E1A] text-emerald-300' };
    if (oylama.durum === 'TAMAMLANDI') return { label: 'Tamamlandı', color: 'bg-[#2D1F3A] text-gray-300' };
    if (oylama.durum === 'IPTAL_EDILDI') return { label: 'İptal Edildi', color: 'bg-red-100 text-red-600' };
    return { label: oylama.durum, color: 'bg-[#3D1030] text-[#FF80C8]' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Oylama Sistemi</h1>
          <p className="text-gray-400 text-sm mt-1">Site kararlarına katılın</p>
        </div>
        {isYonetici && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#F545A0] text-white px-4 py-2 rounded-lg hover:bg-[#E02080] transition-colors font-medium"
          >
            + Yeni Oylama
          </button>
        )}
      </div>

      {mesaj && (
        <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${mesaj.tip === 'basari' ? 'bg-[#1A2E1A] text-emerald-300 border border-emerald-800' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {mesaj.metin}
          <button onClick={() => setMesaj(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {showForm && (
        <div className="bg-[#2D1F3A] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Yeni Oylama Oluştur</h2>
          <form onSubmit={handleOlustur} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Başlık</label>
              <input
                type="text"
                required
                value={form.baslik}
                onChange={e => setForm({ ...form, baslik: e.target.value })}
                className="w-full border border-[#3A2849] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F545A0]"
                placeholder="Oylama başlığı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label>
              <textarea
                value={form.aciklama}
                onChange={e => setForm({ ...form, aciklama: e.target.value })}
                rows={3}
                className="w-full border border-[#3A2849] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F545A0]"
                placeholder="Oylama hakkında açıklama..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Seçenekler</label>
              <div className="space-y-2">
                {form.secenekler.map((s, i) => (
                  <input
                    key={i}
                    type="text"
                    value={s}
                    onChange={e => secenek_guncelle(i, e.target.value)}
                    className="w-full border border-[#3A2849] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F545A0]"
                    placeholder={`Seçenek ${i + 1}`}
                    required
                  />
                ))}
              </div>
              {form.secenekler.length < 6 && (
                <button type="button" onClick={secenek_ekle} className="mt-2 text-sm text-[#F545A0] hover:underline">
                  + Seçenek Ekle
                </button>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-[#F545A0] text-white px-5 py-2 rounded-lg hover:bg-[#E02080] text-sm font-medium">
                Oluştur
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-[#3A2849] text-gray-300 px-5 py-2 rounded-lg hover:bg-[#1C1228] text-sm">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F545A0]"></div>
        </div>
      ) : oylamalar.length === 0 ? (
        <div className="bg-[#2D1F3A] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] p-12 text-center">
          <div className="text-5xl mb-4">🗳️</div>
          <p className="text-gray-400">Henüz oylama bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {oylamalar.map(oylama => {
            const durum = getDurum(oylama);
            const toplam = toplamOy(oylama);
            const kullandiMi = oylama.kullaniciOyKullandimi;

            return (
              <div key={oylama.id} className="bg-[#2D1F3A] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#3A2849] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-100 text-lg">{oylama.baslik}</h3>
                    {oylama.aciklama && <p className="text-sm text-gray-400 mt-1">{oylama.aciklama}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${durum.color}`}>
                    {durum.label}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-4">Toplam oy: {toplam}</p>

                {/* Sonuçlar */}
                <div className="space-y-2 mb-4">
                  {oylama.secenekler?.map((secenek, idx) => {
                    const oySayisi = Number(secenek.oySayisi) || 0;
                    const pct = yuzde(oySayisi, toplam);
                    const kullaniciSecenegi = oylama.kullaniciSecenegi;
                    const buSecenekSecildi = kullandiMi && kullaniciSecenegi === secenek.ad;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`text-gray-200 ${buSecenekSecildi ? 'font-semibold text-[#F545A0]' : ''}`}>
                            {secenek.ad} {buSecenekSecildi && '✓'}
                          </span>
                          <span className="font-medium text-gray-300">{oySayisi} oy ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#2D1F3A] rounded-full h-2">
                          <div className="bg-[#3D1030]0 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Oy kullan */}
                {oylama.durum === 'AKTIF' && !kullandiMi && !isYonetici && (
                  <div>
                    {seciliOylama === oylama.id ? (
                      <div className="border-t border-[#3A2849] pt-4">
                        <p className="text-sm font-medium text-gray-200 mb-2">Oyunuzu kullanın:</p>
                        <div className="flex flex-wrap gap-2">
                          {oylama.secenekler?.map((secenek, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOyVer(oylama.id, secenek.ad)}
                              className="bg-[#F545A0] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#E02080] transition-colors"
                            >
                              {secenek.ad}
                            </button>
                          ))}
                          <button
                            onClick={() => setSeciliOylama(null)}
                            className="border border-[#3A2849] text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-[#1C1228]"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSeciliOylama(oylama.id)}
                        className="text-sm text-[#F545A0] font-medium hover:underline border border-[#F545A0]/40 px-4 py-2 rounded-lg hover:bg-[#3D1030] transition-colors"
                      >
                        Oy Kullan
                      </button>
                    )}
                  </div>
                )}

                {kullandiMi && (
                  <p className="text-xs text-emerald-400 font-medium">✓ Bu oylamada oyunuzu kullandınız.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OylamaPage;
