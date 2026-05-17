import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CreditCard, Wrench, Bell, Zap, Receipt,
  Vote, LogOut, Menu, Building2, ChevronRight, User
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Gösterge Paneli',   roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/aidatlar',  icon: CreditCard,       label: 'Aidat Yönetimi',   roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/bakim',     icon: Wrench,            label: 'Bakım Talepleri',  roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/duyurular', icon: Bell,              label: 'Duyurular',        roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/enerji',    icon: Zap,               label: 'Enerji Takibi',    roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/giderler',  icon: Receipt,           label: 'Gelir-Gider',      roller: ['UST_YONETICI','ORTA_YONETICI'] },
  { to: '/oylamalar', icon: Vote,              label: 'Oylamalar',        roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
  { to: '/profil',    icon: User,              label: 'Profil / Sakinler',roller: ['UST_YONETICI','ORTA_YONETICI','SAKIN'] },
];

const rolEtiketi = {
  UST_YONETICI:  { label: 'Üst Yönetici',  css: { background:'rgba(245,69,160,0.18)', color:'#FF80C8' } },
  ORTA_YONETICI: { label: 'Orta Yönetici', css: { background:'rgba(245,69,160,0.12)', color:'#FF80C8' } },
  SAKIN:         { label: 'Sakin',          css: { background:'rgba(16,185,129,0.15)', color:'#6ee7b7' } },
};

function SidebarContent({ onClose, kullanici, onCikis, navlar }) {
  return (
    <div className="flex flex-col h-full" style={{
      background: 'linear-gradient(180deg,#170F1F 0%,#21172B 100%)',
      borderRight: '1px solid rgba(245,69,160,0.13)'
    }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom:'1px solid rgba(245,69,160,0.12)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
          background:'linear-gradient(135deg,#F545A0,#C01A6A)',
          boxShadow:'0 0 18px rgba(245,69,160,0.45)'
        }}>
          <Building2 size={20} className="text-white" />
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:'#fff', letterSpacing:'0.04em' }}>Ata Sitesi</div>
          <div style={{ fontSize:11, color:'rgba(255,128,200,0.55)' }}>Bina Yönetim Sistemi</div>
        </div>
      </div>

      {/* Kullanıcı */}
      <div className="px-4 py-4" style={{ borderBottom:'1px solid rgba(245,69,160,0.10)' }}>
        <div className="flex items-center gap-3 rounded-xl p-3" style={{
          background:'rgba(245,69,160,0.07)',
          border:'1px solid rgba(245,69,160,0.16)'
        }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{
            background:'linear-gradient(135deg,#F545A0,#C01A6A)'
          }}>
            {kullanici?.adSoyad?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{kullanici?.adSoyad}</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-0.5"
              style={rolEtiketi[kullanici?.rol]?.css}>
              {rolEtiketi[kullanici?.rol]?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {navlar.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {({ isActive }) => (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all" style={
                isActive ? {
                  background:'linear-gradient(90deg,rgba(245,69,160,0.22),rgba(245,69,160,0.06))',
                  color:'#FF80C8',
                  borderLeft:'2px solid #F545A0',
                  paddingLeft:14
                } : { color:'rgba(180,160,200,0.8)' }
              }
              onMouseEnter={isActive ? undefined : e => { e.currentTarget.style.background='rgba(245,69,160,0.07)'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={isActive ? undefined : e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(180,160,200,0.8)'; }}
              >
                <Icon size={17} style={isActive ? { color:'#F545A0' } : {}} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight size={13} style={{ opacity:0.3 }} />
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Çıkış */}
      <div className="px-3 py-4" style={{ borderTop:'1px solid rgba(245,69,160,0.10)' }}>
        <button onClick={onCikis}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-xl transition-all"
          style={{ color:'rgba(180,160,200,0.7)' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.10)'; e.currentTarget.style.color='#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(180,160,200,0.7)'; }}
        >
          <LogOut size={17} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { kullanici, cikisYap } = useAuth();
  const [menuAcik, setMenuAcik] = useState(false);
  const navigate = useNavigate();
  const handleCikis = () => { cikisYap(); navigate('/login'); };
  const navlar = navItems.filter(i => i.roller.includes(kullanici?.rol));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#1C1228' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <SidebarContent kullanici={kullanici} onCikis={handleCikis} navlar={navlar} onClose={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {menuAcik && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuAcik(false)} />
          <aside className="relative w-64 h-full">
            <SidebarContent kullanici={kullanici} onCikis={handleCikis} navlar={navlar} onClose={() => setMenuAcik(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3" style={{
          background:'#21172B', borderBottom:'1px solid rgba(245,69,160,0.13)'
        }}>
          <button onClick={() => setMenuAcik(true)} className="p-2 rounded-lg" style={{ background:'rgba(245,69,160,0.1)', color:'#FF80C8' }}>
            <Menu size={20} />
          </button>
          <span className="font-bold text-white">Ata Sitesi</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
