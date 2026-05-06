'use client';

import Image from 'next/image';
import { Printer, UserPlus, LogOut, Sun, Moon } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { useTheme } from '@/context/ThemeContext';
import { fmt } from '@/lib/utils';

interface Props { onLogout: () => void; }

export default function Header({ onLogout }: Props) {
  const { employees, openModal, printReport } = useEmployees();
  const { theme, toggle } = useTheme();

  const total    = employees.reduce((s, e) => s + e.salary, 0);
  const depts    = new Set(employees.map((e) => e.dept)).size;
  const branches = new Set(employees.map((e) => e.branch)).size;
  const isLight  = theme === 'light';

  const stats = [
    { val: employees.length, lbl: 'الموظفين',       color: 'var(--amber-light)' },
    { val: fmt(total),        lbl: 'إجمالي الرواتب', color: 'var(--amber-light)' },
    { val: depts,             lbl: 'الأقسام',         color: 'var(--teal-light)'  },
    { val: branches,          lbl: 'الفروع',           color: 'var(--teal)'        },
  ];

  return (
    <header
      data-no-print
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72,
        boxShadow: isLight
          ? '0 2px 16px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(245,166,35,0.12)'
          : '0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,166,35,0.07)',
        position: 'sticky', top: 0, zIndex: 100,
        gap: 16, flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:13, flexShrink:0 }}>
        <div style={{ width:48, height:48, borderRadius:13, overflow:'hidden', background:'#fff', boxShadow:'0 4px 18px rgba(245,166,35,0.38), 0 0 0 3px rgba(245,166,35,0.12)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Image src="/logo.jpg" alt="شعار قرية صويلح" width={48} height={48} style={{ objectFit:'cover' }} priority />
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:900, background:'linear-gradient(135deg, var(--amber-bright) 0%, var(--teal-light) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.2 }}>
            شركة قرية صويلح
          </div>
          <div style={{ fontSize:10, color:'var(--text3)', letterSpacing:'0.04em', marginTop:2 }}>
            نظام إدارة المرتبات والأجور
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {stats.map((s) => (
          <div key={s.lbl} style={{ background:'var(--bg-stat)', border:'1px solid var(--border-subtle)', borderRadius:11, padding:'7px 15px', textAlign:'center', minWidth:82 }}>
            <div style={{ fontSize:18, fontWeight:900, color:s.color, lineHeight:1.1 }}>{s.val}</div>
            <div style={{ fontSize:9, color:'var(--text3)', marginTop:3, letterSpacing:'0.02em' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        {/* Add employee */}
        <button aria-label="إضافة موظف" onClick={() => openModal({ type:'add' })}
          style={{ background:'rgba(61,200,213,0.10)', border:'1px solid rgba(61,200,213,0.32)', color:'var(--teal-light)', padding:'8px 16px', borderRadius:10, fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all var(--transition)', whiteSpace:'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.background='rgba(61,200,213,0.20)'; e.currentTarget.style.boxShadow='0 0 16px rgba(61,200,213,0.20)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background='rgba(61,200,213,0.10)'; e.currentTarget.style.boxShadow='none'; }}>
          <UserPlus size={14} strokeWidth={2.2} /> إضافة موظف
        </button>

        {/* Print */}
        <button aria-label="طباعة التقرير" onClick={printReport}
          style={{ background:'linear-gradient(135deg,var(--amber-light),var(--amber-dark))', color:'#fff', border:'none', padding:'8px 18px', borderRadius:10, fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:'0 4px 16px rgba(245,166,35,0.38)', transition:'all var(--transition)', whiteSpace:'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 7px 22px rgba(245,166,35,0.55)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(245,166,35,0.38)'; }}>
          <Printer size={14} strokeWidth={2.2} /> طباعة التقرير
        </button>

        {/* Theme toggle */}
        <button
          aria-label={isLight ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
          onClick={toggle}
          title={isLight ? 'الوضع الداكن' : 'الوضع الفاتح'}
          style={{
            background: isLight ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isLight ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.12)'}`,
            color: isLight ? 'var(--amber)' : '#c8d4f0',
            padding:'8px 12px', borderRadius:10,
            cursor:'pointer', display:'flex', alignItems:'center', gap:6,
            fontFamily:'inherit', fontSize:12, fontWeight:600,
            transition:'all var(--transition)', whiteSpace:'nowrap',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? 'rgba(245,166,35,0.22)' : 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = isLight ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.06)'; }}
        >
          {isLight ? <Moon size={15} strokeWidth={2.2} /> : <Sun size={15} strokeWidth={2.2} />}
          {isLight ? 'داكن' : 'فاتح'}
        </button>

        {/* Logout */}
        <button aria-label="تسجيل الخروج" onClick={onLogout} title="تسجيل الخروج"
          style={{ background:'var(--bg-btn-ghost)', border:'1px solid var(--border-subtle)', color:'var(--text3)', padding:'8px 12px', borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', transition:'all var(--transition)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.35)'; e.currentTarget.style.color='var(--red)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background='var(--bg-btn-ghost)'; e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text3)'; }}>
          <LogOut size={15} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
