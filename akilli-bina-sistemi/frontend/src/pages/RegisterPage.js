import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Building2, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ adSoyad:'', email:'', telefon:'', sifre:'', sifre2:'' });
  const [gosteriyor, setGosteriyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.sifre !== form.sifre2) { toast.error('Şifreler eşleşmiyor'); return; }
    setYukleniyor(true);
    try {
      await authAPI.register({ adSoyad:form.adSoyad, email:form.email, telefon:form.telefon, sifre:form.sifre });
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.hata || 'Kayıt başarısız');
    } finally {
      setYukleniyor(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'11px 16px', borderRadius:10, fontSize:14,
    background:'rgba(23,15,31,0.8)', color:'#fff',
    border:'1px solid rgba(245,69,160,0.2)', outline:'none', boxSizing:'border-box'
  };

  const fields = [
    { key:'adSoyad', label:'Ad Soyad', type:'text', placeholder:'Adınız Soyadınız' },
    { key:'email',   label:'E-posta',  type:'email', placeholder:'ornek@mail.com' },
    { key:'telefon', label:'Telefon',  type:'tel',   placeholder:'05XX XXX XX XX' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background:'radial-gradient(ellipse at 80% 20%, #2D1040 0%, #21172B 45%, #170F1F 100%)'
    }}>
      <div style={{
        position:'fixed', top:'15%', right:'8%', width:350, height:350,
        background:'radial-gradient(circle, rgba(245,69,160,0.1) 0%, transparent 70%)', pointerEvents:'none'
      }} />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{
            background:'linear-gradient(135deg,#F545A0,#C01A6A)',
            boxShadow:'0 0 35px rgba(245,69,160,0.45)'
          }}>
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Ata Sitesi</h1>
          <p style={{ color:'rgba(255,128,200,0.6)', fontSize:13, marginTop:2 }}>Yeni hesap oluşturun</p>
        </div>

        <div className="rounded-2xl p-7" style={{
          background:'rgba(45,31,58,0.92)', border:'1px solid rgba(245,69,160,0.18)',
          backdropFilter:'blur(16px)', boxShadow:'0 24px 60px rgba(0,0,0,0.5)'
        }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(255,180,220,0.85)', marginBottom:5 }}>
                  {f.label}
                </label>
                <input type={f.type} required value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#F545A0'}
                  onBlur={e => e.target.style.borderColor='rgba(245,69,160,0.2)'}
                />
              </div>
            ))}

            {/* Şifre */}
            {['sifre','sifre2'].map((k,i) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(255,180,220,0.85)', marginBottom:5 }}>
                  {i===0 ? 'Şifre' : 'Şifre Tekrar'}
                </label>
                <div style={{ position:'relative' }}>
                  <input type={gosteriyor ? 'text' : 'password'} required
                    value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight:44 }}
                    onFocus={e => e.target.style.borderColor='#F545A0'}
                    onBlur={e => e.target.style.borderColor='rgba(245,69,160,0.2)'}
                  />
                  {i===1 && (
                    <button type="button" onClick={() => setGosteriyor(!gosteriyor)} style={{
                      position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'rgba(255,128,200,0.5)', display:'flex'
                    }}>
                      {gosteriyor ? <EyeOff size={17}/> : <Eye size={17}/>}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={yukleniyor} style={{
              marginTop:4, width:'100%', padding:'12px 0', borderRadius:12, border:'none',
              cursor: yukleniyor ? 'not-allowed' : 'pointer',
              background: yukleniyor ? 'rgba(245,69,160,0.35)' : 'linear-gradient(135deg,#F545A0,#C01A6A)',
              color:'#fff', fontWeight:700, fontSize:15,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: yukleniyor ? 'none' : '0 4px 18px rgba(245,69,160,0.4)'
            }}>
              {yukleniyor
                ? <div style={{ width:19,height:19,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>
                : <><UserPlus size={17}/> Kayıt Ol</>
              }
            </button>
          </form>

          <p style={{ marginTop:18, textAlign:'center', fontSize:13, color:'rgba(180,150,200,0.6)' }}>
            Zaten hesabınız var mı?{' '}
            <Link to="/login" style={{ color:'#F545A0', fontWeight:600, textDecoration:'none' }}>Giriş yapın</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
