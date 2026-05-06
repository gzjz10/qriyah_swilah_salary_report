'use client';

import { useMemo } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS, DEPT_ACCENT } from '@/lib/utils';

export default function DeptsTab() {
  const { employees, openModal } = useEmployees();

  const deptData = useMemo(() => {
    const m: Record<string, { emps: typeof employees; total:number; avg:number }> = {};
    employees.forEach((e) => { if(!m[e.dept]) m[e.dept]={emps:[],total:0,avg:0}; m[e.dept].emps.push(e); m[e.dept].total+=e.salary; });
    Object.values(m).forEach((d) => { d.emps.sort((a,b) => b.salary-a.salary); d.avg=Math.round(d.total/d.emps.length); });
    return m;
  }, [employees]);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))', gap:18 }}>
      {Object.entries(deptData).map(([dept, { emps, total, avg }], i) => {
        const col = DEPT_COLORS[dept] || '#F5A623';
        const acc = DEPT_ACCENT[dept] || { bg:'rgba(245,166,35,0.1)', text:'#F5A623', border:'rgba(245,166,35,0.3)' };
        return (
          <div key={dept} className={`animate-fade-in-up stagger-${Math.min(i+1,5)}`}
            style={{ background:'var(--bg-glass)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', border:'1px solid var(--border2)', borderRadius:16, overflow:'hidden', transition:'all 220ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor=col+'44'; e.currentTarget.style.boxShadow=`0 0 24px ${col}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow=''; }}>

            <div style={{ padding:'16px 20px', background:`linear-gradient(135deg,${col}10,transparent)`, borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:15, fontWeight:800, color:col }}>{dept}</div>
              <span style={{ fontSize:11, color:'var(--text3)', padding:'3px 9px', background:'var(--bg-inset)', borderRadius:7, border:'1px solid var(--border2)' }}>{emps.length} موظف</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'var(--border2)' }}>
              {[{lbl:'إجمالي الرواتب',val:fmt(total)},{lbl:'متوسط الراتب',val:fmt(avg)}].map(({lbl,val}) => (
                <div key={lbl} style={{ background:'var(--bg-dark-block)', padding:'12px 16px' }}>
                  <div style={{ fontSize:14, fontWeight:800, color:col }}>{val}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ maxHeight:230, overflowY:'auto' }}>
              {emps.map((e) => (
                <div key={e.id} onClick={() => openModal({ type:'edit', employee:e })} role="button" tabIndex={0}
                  onKeyDown={(ev) => ev.key==='Enter' && openModal({ type:'edit', employee:e })}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 16px', borderBottom:'1px solid var(--border2)', transition:'background var(--transition)', cursor:'pointer' }}
                  onMouseEnter={(el) => (el.currentTarget.style.background='var(--bg-row-hover)')}
                  onMouseLeave={(el) => (el.currentTarget.style.background='')}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{e.name}</div>
                    <div style={{ fontSize:10, color:'var(--text3)' }}>{e.title} · {e.branch}</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:col }}>{fmt(e.salary)}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border2)' }}>
              <button onClick={() => openModal({ type:'dept', dept })}
                style={{ width:'100%', background:acc.bg, border:`1px solid ${acc.border}`, color:acc.text, padding:'8px', borderRadius:9, fontFamily:'inherit', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all var(--transition)' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter='brightness(1.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter='')}>
                عرض تفاصيل القسم
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
