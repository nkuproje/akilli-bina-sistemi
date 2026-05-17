import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: 401 → login sayfasına yönlendir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('kullanici');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ====== AUTH ======
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (data) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
};

// ====== AİDAT ======
export const aidatAPI = {
  getAll: (params) => api.get('/api/aidatlar', { params }),
  getBenim: () => api.get('/api/aidatlar/benim'),
  olustur: (data) => api.post('/api/aidatlar/olustur', data),
  ode: (id) => api.put(`/api/aidatlar/${id}/ode`),
  getOzet: () => api.get('/api/aidatlar/ozet'),
};

// ====== BAKIM TALEBİ ======
export const bakimAPI = {
  getAll: () => api.get('/api/bakim'),
  getBenim: () => api.get('/api/bakim/benim'),
  olustur: (data) => api.post('/api/bakim', data),
  durumGuncelle: (id, data) => api.put(`/api/bakim/${id}/durum`, data),
  getIstatistik: () => api.get('/api/bakim/istatistik'),
};

// ====== DUYURU ======
export const duyuruAPI = {
  getAll: () => api.get('/api/duyurular'),
  olustur: (data) => api.post('/api/duyurular', data),
  sil: (id) => api.delete(`/api/duyurular/${id}`),
};

// ====== DAİRE ======
export const daireAPI = {
  getAll: () => api.get('/api/daireler'),
  daireGuncelle: (daireId) => api.put('/api/kullanicilar/benim/daire', { daireId }),
  daireKaldir: () => api.put('/api/kullanicilar/benim/daire', { daireId: null }),
  getSakinler: () => api.get('/api/kullanicilar/sakinler'),
};

// ====== ENERJİ ======
export const enerjiAPI = {
  getAll: (binaId) => api.get('/api/enerji', { params: { binaId } }),
  getYillik: (binaId, yil) => api.get(`/api/enerji/yillik/${yil}`, { params: { binaId } }),
  ekle: (data) => api.post('/api/enerji', data),
  // IoT sensör simülasyonu — rastgele gerçekçi veri üretir
  simule: (binaId = 1) => api.post('/api/enerji/simule', null, { params: { binaId } }),
};

// ====== GİDER ======
export const giderAPI = {
  getAll: (binaId) => api.get('/api/giderler', { params: { binaId } }),
  ekle: (data) => api.post('/api/giderler', data),
  getOzet: (yil) => api.get(`/api/giderler/ozet/${yil}`),
};

// ====== OYLAMA ======
export const oylamaAPI = {
  getAll: () => api.get('/api/oylamalar'),
  olustur: (data) => api.post('/api/oylamalar', data),
  oyVer: (id, data) => api.post(`/api/oylamalar/${id}/oy-ver`, data),
  getSonuclar: (id) => api.get(`/api/oylamalar/${id}/sonuclar`),
};

export default api;
