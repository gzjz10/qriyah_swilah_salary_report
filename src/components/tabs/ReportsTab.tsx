'use client';

import { useMemo } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS, DEPT_ACCENT } from '@/lib/utils';

export default function ReportsTab() {
  const { employees } = useEmployees();

  const deptData = useMemo(() => {
    const m: Record<string, { emps: typeof employees; total: number; avg: number; max: number; min: number }> = {};
    employees.forEach((e) => {
      if (!m[e.dept]) m[e.dept] = { emps: [], total: 0, avg: 0, max: 0, min: Infinity };
      m[e.dept].emps.push(e);
      m[e.dept].total += e.salary;
      if (e.salary > m[e.dept].max) m[e.dept].max = e.salary;
      if (e.salary < m[e.dept].min) m[e.dept].min = e.salary;
    });
    Object.values(m).forEach((d) => { d.avg = Math.round(d.total / d.emps.length); });
    return m;
  }, [employees]);

  const grandTotal = employees.reduce((s, e) => s + e.salary, 0);
  const grandAvg   = employees.length ? Math.round(grandTotal / employees.length) : 0;
  const grandMax   = employees.length ? Math.max(...employees.map((e) => e.salary)) : 0;
  const grandMin   = employees.length ? Math.min(...employees.map((e) => e.salary)) : 0;
  const depts      = Object.keys(deptData);

  return (
    <div>
      {/* Summary card */}
      <div className="animate-fade-in-up" style={{
        background: 'rgba(14,20,32,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border2)', borderRadius: 16,
        padding: '22px 24px', marginBottom: 24, boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text2)' }}>ملخص إجمالي الشركة</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          {[
            { lbl: 'إجمالي الموظفين', val: employees.length.toString(), color: '#60A5FA' },
            { lbl: 'إجمالي الرواتب',  val: fmt(grandTotal),             color: 'var(--gold-light)' },
            { lbl: 'متوسط الراتب',    val: fmt(grandAvg),               color: '#34D399' },
            { lbl: 'أعلى راتب',       val: fmt(grandMax),               color: '#F472B6' },
            { lbl: 'أقل راتب',        val: fmt(grandMin),               color: 'var(--text2)' },
          ].map(({ lbl, val, color }) => (
            <div key={lbl} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)',
              borderRadius: 10, padding: '14px 16px',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 7 }}>{lbl}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-dept cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: 18 }}>
        {Object.entries(deptData).map(([dept, { emps, total, avg, max, min }], i) => {
          const col = DEPT_COLORS[dept] || '#E8B86D';
          const acc = DEPT_ACCENT[dept] || { bg: 'rgba(200,150,62,0.1)', text: '#E8B86D', border: 'rgba(200,150,62,0.3)' };
          const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;

          return (
            <div key={dept}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
              style={{
                background: 'rgba(14,20,32,0.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid var(--border2)', borderRadius: 14, overflow: 'hidden',
                transition: 'all 220ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = col + '44'; e.currentTarget.style.boxShadow = `0 0 20px ${col}14`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ padding: '14px 18px', background: `linear-gradient(135deg, ${col}10, transparent)`, borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{dept}</div>
                <span style={{ fontSize: 11, color: 'var(--text3)', background: 'rgba(0,0,0,0.25)', padding: '3px 9px', borderRadius: 7, border: '1px solid var(--border2)' }}>{emps.length} موظف</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border2)' }}>
                {[
                  { lbl: 'إجمالي الرواتب', val: fmt(total) },
                  { lbl: 'متوسط الراتب',   val: fmt(avg)   },
                  { lbl: 'أعلى راتب',      val: fmt(max)   },
                  { lbl: 'أقل راتب',       val: fmt(min)   },
                ].map(({ lbl, val }) => (
                  <div key={lbl} style={{ background: 'rgba(0,0,0,0.18)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{lbl}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: col }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>نسبة من إجمالي الرواتب</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: col }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--dark4)', borderRadius: 3, overflow: 'hidden' }}>
                  <div className="bar-animate" style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3, boxShadow: `0 0 8px ${col}55` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
