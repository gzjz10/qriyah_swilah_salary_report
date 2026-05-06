'use client';

import { Printer, UserPlus, Building2, LogOut } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt } from '@/lib/utils';

interface Props { onLogout: () => void; }

export default function Header({ onLogout }: Props) {
  const { employees, openModal, printReport } = useEmployees();

  const total    = employees.reduce((s, e) => s + e.salary, 0);
  const depts    = new Set(employees.map((e) => e.dept)).size;
  const branches = new Set(employees.map((e) => e.branch)).size;

  const stats = [
    { val: employees.length, lbl: 'الموظفين',      color: 'var(--gold-light)' },
    { val: fmt(total),        lbl: 'إجمالي الرواتب', color: 'var(--gold-light)' },
    { val: depts,             lbl: 'الأقسام',        color: '#60A5FA' },
    { val: branches,          lbl: 'الفروع',          color: '#34D399' },
  ];

  return (
    <header
      data-no-print
      style={{
        background: 'rgba(8,12,22,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,150,62,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(200,150,62,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
          flexShrink: 0,
        }}>
          <Building2 size={20} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{
            fontSize: 16, fontWeight: 800,
            background: 'linear-gradient(135deg, var(--gold-light), #fff 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', lineHeight: 1.2,
          }}>
            شركة قرية صويلح
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.03em', marginTop: 1 }}>
            نظام إدارة المرتبات والأجور
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <div key={s.lbl} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border2)',
            borderRadius: 10,
            padding: '7px 14px',
            textAlign: 'center',
            minWidth: 78,
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          aria-label="إضافة موظف"
          onClick={() => openModal({ type: 'add' })}
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: 'var(--green)', padding: '8px 16px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all var(--transition)', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.22)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(34,197,94,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <UserPlus size={14} strokeWidth={2.2} />
          إضافة موظف
        </button>

        <button
          aria-label="طباعة التقرير"
          onClick={printReport}
          style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(200,150,62,0.4)', transition: 'all var(--transition)', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,150,62,0.55)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(200,150,62,0.4)'; }}
        >
          <Printer size={14} strokeWidth={2.2} />
          طباعة التقرير
        </button>

        {/* Logout */}
        <button
          aria-label="تسجيل الخروج"
          onClick={onLogout}
          title="تسجيل الخروج"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', color: 'var(--text3)', padding: '8px 12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all var(--transition)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text3)'; }}
        >
          <LogOut size={15} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
