import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const kaydedilmisKullanici = localStorage.getItem('kullanici');
    if (token && kaydedilmisKullanici) {
      setKullanici(JSON.parse(kaydedilmisKullanici));
    }
    setYukleniyor(false);
  }, []);

  const girisYap = async (email, sifre) => {
    const response = await authAPI.login(email, sifre);
    const { token, kullanici: kullaniciBilgileri } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('kullanici', JSON.stringify(kullaniciBilgileri));
    setKullanici(kullaniciBilgileri);
    return kullaniciBilgileri;
  };

  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    setKullanici(null);
  };

  // Daire güncellemesi sonrası /me endpoint'inden taze veri çek
  const guncelleKullanici = async () => {
    try {
      const res = await authAPI.getMe();
      const taze = res.data;
      localStorage.setItem('kullanici', JSON.stringify(taze));
      setKullanici(taze);
    } catch {}
  };

  const ust_yonetici = kullanici?.rol === 'UST_YONETICI';
  const orta_yonetici = kullanici?.rol === 'ORTA_YONETICI';
  const yonetici = ust_yonetici || orta_yonetici;
  const sakin = kullanici?.rol === 'SAKIN';

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap, yukleniyor, ust_yonetici, orta_yonetici, yonetici, sakin, guncelleKullanici }}>
      {!yukleniyor && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı');
  return ctx;
};
