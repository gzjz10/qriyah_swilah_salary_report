'use client';

import { useState, useMemo } from 'react';
import { Search, Pencil, TrendingUp, Trash2 } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS, DEPT_ACCENT, getInitials } from '@/lib/utils';

export default function CardsTab() {
  const { employees, openModal } = useEmployees();
  const [search, setSearch]             = useState('');
  const [deptFilter, setDeptFilter]     = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [sort, setSort] = useState<'sal-desc' | 'sal-asc' | 'name'>('sal-desc');

  const depts    = useMemo(() => Array.from(new Set(employees.map((e) => e.dept))),   [employees]);
  const branches = useMemo(() => Array.from(new Set(employees.map((e) => e.branch))), [employees]);

  const allSorted = useMemo(() => [...employees].sort((a, b) => b.salary - a.salary), [employees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = employees.filter((e) => {
      const mQ = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
      const mD = !deptFilter   || e.dept   === deptFilter;
      const mB = !branchFilter || e.branch === branchFilter;
      return mQ && mD && mB;
    });
    if (sort === 'sal-desc') rows = rows.sort((a, b) => b.salary - a.salary);
    else if (sort === 'sal-asc') rows = rows.sort((a, b) => a.salary - b.salary);
    else rows = rows.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    return rows;
  }, [employees, search, deptFilter, branchFilter, sort]);

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)',
    borderRadius: 10, padding: '9px 14px', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: 13, outline: 'none', cursor: 'pointer', minWidth: 130,
    transition: 'border-color var(--transition)',
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في البطاقات..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', borderRadius: 10, padding: '9px 40px 9px 16px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none', transition: 'border-color var(--transition)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border2)')} />
        </div>
        <select value={deptFilter}   onChange={(e) => setDeptFilter(e.target.value)}   style={selectStyle}>
          <option value="">كل الأقسام</option>
          {depts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={selectStyle}>
          <option value="">كل الفروع</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} style={selectStyle}>
          <option value="sal-desc">الأعلى راتبًا</option>
          <option value="sal-asc">الأقل راتبًا</option>
          <option value="name">الاسم أ-ي</option>
        </select>
        <div style={{ fontSize: 12, color: 'var(--text3)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)', borderRadius: 10, padding: '9px 14px', fontWeight: 600 }}>
          {filtered.length} بطاقة
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '70px 20px', color: 'var(--text3)' }}>
            <Search size={40} style={{ margin: '0 auto 14px', opacity: 0.25, display: 'block' }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>لا توجد نتائج</div>
          </div>
        ) : (
          filtered.map((e, i) => {
            const rank = allSorted.findIndex((x) => x.id === e.id) + 1;
            const col  = DEPT_COLORS[e.dept]  || '#E8B86D';
            const acc  = DEPT_ACCENT[e.dept]  || { bg: 'rgba(200,150,62,0.1)', text: '#E8B86D', border: 'rgba(200,150,62,0.3)' };

            return (
              <div
                key={e.id}
                className={`animate-fade-in-up stagger-${Math.min((i % 5) + 1, 5)}`}
                style={{
                  background: 'rgba(14,20,34,0.75)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid var(--border2)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'all 220ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(el) => {
                  el.currentTarget.style.borderColor = col + '55';
                  el.currentTarget.style.transform   = 'translateY(-4px)';
                  el.currentTarget.style.boxShadow   = `0 12px 36px rgba(0,0,0,0.35), 0 0 24px ${col}22`;
                }}
                onMouseLeave={(el) => {
                  el.currentTarget.style.borderColor = 'var(--border2)';
                  el.currentTarget.style.transform   = '';
                  el.currentTarget.style.boxShadow   = '';
                }}
              >
                {/* medal */}
                {rank <= 3 && (
                  <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 18, zIndex: 2 }}>
                    {['🥇','🥈','🥉'][rank - 1]}
                  </div>
                )}

                {/* header */}
                <div style={{
                  padding: '18px 16px 14px',
                  background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))`,
                  borderBottom: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', gap: 13,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 800, flexShrink: 0,
                    background: `${col}18`,
                    color: col,
                    border: `2px solid ${col}40`,
                    boxShadow: `0 0 14px ${col}20`,
                  }}>{getInitials(e.name)}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{e.title}</div>
                  </div>
                </div>

                {/* body */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>القسم</span>
                    <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 7, fontSize: 10, fontWeight: 700, background: acc.bg, color: acc.text, border: `1px solid ${acc.border}` }}>{e.dept}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>الفرع</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>{e.branch}</span>
                  </div>

                  {/* salary badge */}
                  <div style={{
                    background: 'rgba(200,150,62,0.07)',
                    border: '1px solid rgba(200,150,62,0.18)',
                    borderRadius: 10, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 12,
                    boxShadow: 'inset 0 1px 0 rgba(200,150,62,0.08)',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>الراتب الإجمالي</span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--gold-light)', textShadow: '0 0 14px rgba(200,150,62,0.3)' }}>{fmt(e.salary)}</span>
                  </div>

                  {/* actions */}
                  <div style={{ display: 'flex', gap: 7 }}>
                    <button onClick={() => openModal({ type: 'edit', employee: e })} aria-label="تعديل"
                      style={{ flex: 1, background: 'linear-gradient(135deg,var(--gold),var(--gold-dark))', color: '#fff', border: 'none', padding: '8px', borderRadius: 9, fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all var(--transition)', boxShadow: '0 3px 10px rgba(200,150,62,0.3)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 5px 16px rgba(200,150,62,0.5)')}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 3px 10px rgba(200,150,62,0.3)')}>
                      <Pencil size={12} /> تعديل
                    </button>
                    <button onClick={() => openModal({ type: 'raise', employee: e })} aria-label="زيادة الراتب"
                      style={{ background: 'rgba(34,197,94,0.09)', border: '1px solid rgba(34,197,94,0.28)', color: 'var(--green)', padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all var(--transition)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.18)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.09)')}>
                      <TrendingUp size={13} />
                    </button>
                    <button onClick={() => openModal({ type: 'delete', employee: e })} aria-label="حذف"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--red)', padding: '8px 12px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all var(--transition)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.18)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
