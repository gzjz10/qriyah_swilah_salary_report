'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_ACCENT } from '@/lib/utils';

const BRANCH_ICON: Record<string, string> = { قرطبة:'🏙', 'مستودع الشفا':'🏭', 'مستودع قوين':'📦' };

const DEPT_STAT_COLORS: Record<string, { accent: string; glow: string }> = {
  'الإدارة':           { accent:'#F5A623', glow:'rgba(245,166,35,0.15)' },
  'المالية والمحاسبة': { accent:'#E8B86D', glow:'rgba(232,184,109,0.15)' },
  'الموارد البشرية':   { accent:'#3DC8D5', glow:'rgba(61,200,213,0.15)' },
  'تقنية المعلومات':   { accent:'#60A5FA', glow:'rgba(96,165,250,0.15)' },
  'التسويق':           { accent:'#F472B6', glow:'rgba(244,114,182,0.15)' },
  'المبيعات':          { accent:'#A78BFA', glow:'rgba(167,139,250,0.15)' },
  'خدمة العملاء':      { accent:'#34D399', glow:'rgba(52,211,153,0.15)' },
  'المعارض':           { accent:'#22C55E', glow:'rgba(34,197,94,0.15)' },
  'المشتريات':         { accent:'#F43F5E', glow:'rgba(244,63,94,0.15)' },
  'المستودع':          { accent:'#FB923C', glow:'rgba(251,146,60,0.15)' },
  'النقل':             { accent:'#FBBF24', glow:'rgba(251,191,36,0.15)' },
  'الصيانة والهندسة':  { accent:'#6EE7B7', glow:'rgba(110,231,183,0.15)' },
  'الجودة والرقابة':   { accent:'#38BDF8', glow:'rgba(56,189,248,0.15)' },
  'الشؤون القانونية':  { accent:'#C084FC', glow:'rgba(192,132,252,0.15)' },
  'خدمات':             { accent:'#8B5CF6', glow:'rgba(139,92,246,0.15)' },
};
const FALLBACK_STAT_COLOR = { accent:'#94A3B8', glow:'rgba(148,163,184,0.15)' };

export default function SalariesTab() {
  const { employees, openModal, printFilter, setPrintFilter } = useEmployees();
  const search       = printFilter.search;
  const deptFilter   = printFilter.dept;
  const branchFilter = printFilter.branch;
  const setSearch        = (v: string) => setPrintFilter({ search: v });
  const setDeptFilter    = (v: string) => setPrintFilter({ dept: v });
  const setBranchFilter  = (v: string) => setPrintFilter({ branch: v });
  const [sortDesc, setSortDesc] = useState(true);

  const depts    = useMemo(() => Array.from(new Set(employees.map((e) => e.dept))),   [employees]);
  const branches = useMemo(() => Array.from(new Set(employees.map((e) => e.branch))), [employees]);

  const deptStats = useMemo(() => {
    const m: Record<string, { count:number; total:number }> = {};
    employees.forEach((e) => { if(!m[e.dept]) m[e.dept]={count:0,total:0}; m[e.dept].count++; m[e.dept].total+=e.salary; });
    return m;
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = employees.filter((e) => {
      const mQ = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
      return mQ && (!deptFilter || e.dept===deptFilter) && (!branchFilter || e.branch===branchFilter);
    });
    return rows.slice().sort((a,b) => sortDesc ? b.salary-a.salary : a.salary-b.salary);
  }, [employees, search, deptFilter, branchFilter, sortDesc]);

  const allSorted = useMemo(() => [...employees].sort((a,b) => b.salary-a.salary), [employees]);
  const maxSal    = useMemo(() => employees.length ? Math.max(...employees.map((e) => e.salary)) : 1, [employees]);

  const selectStyle: React.CSSProperties = { background:'var(--bg-input)', border:'1px solid var(--border2)', borderRadius:10, padding:'9px 14px', color:'var(--text)', fontFamily:'inherit', fontSize:13, outline:'none', cursor:'pointer', minWidth:130, transition:'border-color var(--transition)' };

  return (
    <div>
      {/* Dept stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:14, marginBottom:24 }}>
        {Object.entries(deptStats).map(([dept, s], i) => {
          const { accent, glow } = DEPT_STAT_COLORS[dept] || FALLBACK_STAT_COLOR;
          const active = deptFilter === dept;
          return (
            <button key={dept} onClick={() => setDeptFilter(active ? '' : dept)}
              className={`animate-fade-in-up stagger-${Math.min(i+1,5)}`}
              style={{ background: active ? `${accent}1A` : 'var(--bg-stat)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:`1px solid ${active ? accent+'55' : 'var(--border2)'}`, borderRadius:14, padding:'18px 20px', cursor:'pointer', textAlign:'right', fontFamily:'inherit', transition:'all var(--transition)', position:'relative', overflow:'hidden', boxShadow: active ? `0 0 20px ${glow}` : 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor=accent+'55'; e.currentTarget.style.boxShadow=`0 0 20px ${glow}`; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={(e) => { if(!active){ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='none'; } e.currentTarget.style.transform='none'; }}>
              <div style={{ position:'absolute', top:-20, left:-20, width:80, height:80, borderRadius:'50%', background:accent, opacity:0.06, pointerEvents:'none' }} />
              <div style={{ fontSize:24, fontWeight:900, color:accent, lineHeight:1, marginBottom:4 }}>{s.count}</div>
              <div style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{dept}</div>
              <div style={{ fontSize:11, color:accent, marginTop:5, opacity:0.9 }}>{fmt(s.total)}</div>
              {active && <div style={{ position:'absolute', top:10, left:10, width:6, height:6, borderRadius:'50%', background:accent, boxShadow:`0 0 8px ${accent}` }} />}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap', alignItems:'center' }} data-no-print>
        <div style={{ position:'relative', flex:1, minWidth:200, maxWidth:360 }}>
          <Search size={14} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو المسمى الوظيفي..."
            style={{ width:'100%', background:'var(--bg-input)', border:'1px solid var(--border2)', borderRadius:10, padding:'9px 40px 9px 16px', color:'var(--text)', fontFamily:'inherit', fontSize:13, outline:'none', transition:'border-color var(--transition)' }}
            onFocus={(e) => (e.target.style.borderColor='var(--amber-light)')}
            onBlur={(e)  => (e.target.style.borderColor='var(--border2)')} />
        </div>
        <select value={deptFilter}   onChange={(e) => setDeptFilter(e.target.value)}   style={selectStyle} onFocus={(e) => (e.target.style.borderColor='var(--amber-light)')} onBlur={(e) => (e.target.style.borderColor='var(--border2)')}>
          <option value="">كل الأقسام</option>
          {depts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={selectStyle} onFocus={(e) => (e.target.style.borderColor='var(--amber-light)')} onBlur={(e) => (e.target.style.borderColor='var(--border2)')}>
          <option value="">كل الفروع</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <button onClick={() => setSortDesc(!sortDesc)}
          style={{ background:'var(--bg-input)', border:`1px solid ${sortDesc ? 'var(--amber-light)' : 'var(--border2)'}`, borderRadius:10, padding:'9px 16px', color: sortDesc ? 'var(--amber-light)' : 'var(--text2)', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all var(--transition)' }}>
          <ArrowUpDown size={13} />
          {sortDesc ? 'من الأعلى' : 'من الأقل'}
        </button>
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-glass)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderRadius:16, border:'1px solid var(--border2)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px 22px', borderBottom:'1px solid var(--border2)' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>قائمة الموظفين</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>
              {filtered.length} موظف&nbsp;·&nbsp;إجمالي: <span style={{ color:'var(--amber-light)', fontWeight:700 }}>{fmt(filtered.reduce((s,e) => s+e.salary,0))}</span>
            </div>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['#','اسم الموظف','المسمى الوظيفي','القسم','الفرع','الراتب',''].map((h) => (
                  <th key={h} style={{ background:'var(--bg-table-head)', padding:'11px 18px', textAlign:'right', fontSize:11, fontWeight:700, color:'var(--text3)', whiteSpace:'nowrap', letterSpacing:'0.03em', borderBottom:'1px solid var(--border2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text3)' }}><Search size={36} style={{ margin:'0 auto 12px', opacity:0.25, display:'block' }} /><div style={{ fontSize:14, fontWeight:600 }}>لا توجد نتائج</div></div></td></tr>
              ) : filtered.map((e, idx) => {
                const rank = allSorted.findIndex((x) => x.id===e.id)+1;
                const pct  = Math.round((e.salary/maxSal)*100);
                const acc  = DEPT_ACCENT[e.dept] || { bg:'rgba(245,166,35,0.1)', text:'var(--amber-light)', border:'rgba(245,166,35,0.3)' };
                let rankBg='var(--dark4)', rankColor='var(--text3)', rankShadow='none';
                if(rank===1){rankBg='linear-gradient(135deg,#FFD700,#B8860B)';rankColor='#000';rankShadow='0 2px 8px rgba(255,215,0,0.4)';}
                else if(rank===2){rankBg='linear-gradient(135deg,#D4D4D4,#8A8A8A)';rankColor='#000';}
                else if(rank===3){rankBg='linear-gradient(135deg,#CD7F32,#8B4513)';rankColor='#fff';}
                return (
                  <tr key={e.id} className={`animate-fade-in-up stagger-${Math.min((idx%8)+1,5)}`}
                    onClick={() => openModal({ type:'edit', employee:e })}
                    style={{ borderBottom:'1px solid var(--border2)', cursor:'pointer', transition:'background var(--transition)' }}
                    onMouseEnter={(el) => (el.currentTarget.style.background='var(--bg-row-hover)')}
                    onMouseLeave={(el) => (el.currentTarget.style.background='')}>
                    <td style={{ padding:'11px 18px' }}><div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, background:rankBg, color:rankColor, boxShadow:rankShadow, flexShrink:0 }}>{rank}</div></td>
                    <td style={{ padding:'11px 18px', fontWeight:600, fontSize:13, color:'var(--text)' }}>{e.name}</td>
                    <td style={{ padding:'11px 18px', fontSize:12, color:'var(--text3)' }}>{e.title}</td>
                    <td style={{ padding:'11px 18px' }}><span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:8, fontSize:11, fontWeight:700, background:acc.bg, color:acc.text, border:`1px solid ${acc.border}` }}>{e.dept}</span></td>
                    <td style={{ padding:'11px 18px', fontSize:12, color:'var(--text3)' }}>{BRANCH_ICON[e.branch]||'🏢'} {e.branch}</td>
                    <td style={{ padding:'11px 18px' }}><div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:800, fontSize:13, color:'var(--amber-light)' }}>{fmt(e.salary)}<div className="salary-bar"><div className="salary-fill bar-animate" style={{ width:`${pct}%` }} /></div></div></td>
                    <td style={{ padding:'11px 18px' }}>
                      <div style={{ display:'flex', gap:6 }} onClick={(ev) => ev.stopPropagation()}>
                        <button aria-label="تعديل" onClick={() => openModal({ type:'edit', employee:e })} style={{ background:'rgba(245,166,35,0.10)', border:'1px solid rgba(245,166,35,0.25)', color:'var(--amber-light)', padding:'6px 10px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', transition:'all var(--transition)' }} onMouseEnter={(e) => (e.currentTarget.style.background='rgba(245,166,35,0.20)')} onMouseLeave={(e) => (e.currentTarget.style.background='rgba(245,166,35,0.10)')}><Pencil size={13} /></button>
                        <button aria-label="حذف"   onClick={() => openModal({ type:'delete', employee:e })} style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.20)', color:'var(--red)', padding:'6px 10px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', transition:'all var(--transition)' }} onMouseEnter={(e) => (e.currentTarget.style.background='rgba(239,68,68,0.18)')} onMouseLeave={(e) => (e.currentTarget.style.background='rgba(239,68,68,0.08)')}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
