import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Building2, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [gosteriyor, setGosteriyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const { girisYap } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setYukleniyor(true);
    try {
      await girisYap(form.email, form.password);
      toast.success('Giriş başarılı!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.hata || 'Giriş başarısız');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'radial-gradient(ellipse at 20% 50%, #2D1040 0%, #21172B 40%, #170F1F 100%)'
    }}>
      {/* Dekoratif arka plan ışıkları */}
      <div style={{
        position:'fixed', top:'10%', left:'5%', width:400, height:400,
        background:'radial-gradient(circle, rgba(245,69,160,0.12) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />
      <div style={{
        position:'fixed', bottom:'10%', right:'5%', width:300, height:300,
        background:'radial-gradient(circle, rgba(245,69,160,0.08) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{
            background:'linear-gradient(135deg,#F545A0,#C01A6A)',
            boxShadow:'0 0 40px rgba(245,69,160,0.5), 0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <Building2 size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Ata Sitesi</h1>
          <p style={{ color:'rgba(255,128,200,0.65)', fontSize:14 }}>Bina Yönetim Sistemine hoş geldiniz</p>
        </div>

        {/* Demo hesaplar */}
        <div className="rounded-2xl p-4 mb-5 text-sm" style={{
          background:'rgba(245,69,160,0.07)',
          border:'1px solid rgba(245,69,160,0.2)'
        }}>
          <p style={{ color:'#FF80C8', fontWeight:600, marginBottom:8 }}>🔑 Demo Hesapları (şifre: password123)</p>
          <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, color:'rgba(255,180,220,0.7)' }}>
            <div>👑 admin@atasitesi.com — Üst Yönetici</div>
            <div>🔧 yonetici@atasitesi.com — Orta Yönetici</div>
            <div>🏠 sakin1@mail.com — Sakin</div>
          </div>
        </div>

        {/* Form kartı */}
        <div className="rounded-2xl p-8" style={{
          background:'rgba(45,31,58,0.9)',
          border:'1px solid rgba(245,69,160,0.18)',
          backdropFilter:'blur(16px)',
          boxShadow:'0 24px 64px rgba(0,0,0,0.5)'
        }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(255,180,220,0.85)', marginBottom:6 }}>
                E-posta
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="ornek@mail.com"
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:12, fontSize:14,
                  background:'rgba(23,15,31,0.8)', color:'#fff',
                  border:'1px solid rgba(245,69,160,0.2)',
                  outline:'none', boxSizing:'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#F545A0'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,69,160,0.2)'}
              />
            </div>

            {/* Şifre */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(255,180,220,0.85)', marginBottom:6 }}>
                Şifre
              </label>
              <div style={{ position:'relative' }}>
                <input
                  type={gosteriyor ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  style={{
                    width:'100%', padding:'12px 44px 12px 16px', borderRadius:12, fontSize:14,
                    background:'rgba(23,15,31,0.8)', color:'#fff',
                    border:'1px solid rgba(245,69,160,0.2)',
                    outline:'none', boxSizing:'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#F545A0'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,69,160,0.2)'}
                />
                <button type="button" onClick={() => setGosteriyor(!gosteriyor)} style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'rgba(255,128,200,0.5)',
                  display:'flex', alignItems:'center'
                }}>
                  {gosteriyor ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Giriş butonu */}
            <button type="submit" disabled={yukleniyor} style={{
              width:'100%', padding:'13px 0', borderRadius:12, border:'none', cursor: yukleniyor ? 'not-allowed' : 'pointer',
              background: yukleniyor ? 'rgba(245,69,160,0.4)' : 'linear-gradient(135deg,#F545A0,#C01A6A)',
              color:'#fff', fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: yukleniyor ? 'none' : '0 4px 20px rgba(245,69,160,0.45)',
              transition:'all 0.2s'
            }}>
              {yukleniyor ? (
                <div style={{
                  width:20, height:20, border:'2px solid rgba(255,255,255,0.3)',
                  borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite'
                }} />
              ) : (
                <><LogIn size={18} /> Giriş Yap</>
              )}
            </button>
          </form>

          <p style={{ marginTop:20, textAlign:'center', fontSize:13, color:'rgba(180,150,200,0.6)' }}>
            Hesabınız yok mu?{' '}
            <Link to="/register" style={{ color:'#F545A0', fontWeight:600, textDecoration:'none' }}>
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
