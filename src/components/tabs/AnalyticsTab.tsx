'use client';

import { useMemo } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS } from '@/lib/utils';

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(14,20,32,0.72)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border2)',
      borderRadius: 16,
      padding: '22px 24px',
      boxShadow: 'var(--shadow)',
      transition: 'border-color var(--transition)',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border2)')}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: 'var(--text2)', letterSpacing: '0.02em' }}>{title}</div>
      {children}
    </div>
  );
}

function HBar({ label, value, max, color, sub, delay = 0 }: {
  label: string; value: number; max: number; color: string; sub?: string; delay?: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
      <div style={{ width: 118, fontSize: 12, color: 'var(--text2)', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={label}>{label}</div>
      <div style={{ flex: 1, height: 8, background: 'var(--dark4)', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'height 180ms ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.height = '12px')}
        onMouseLeave={(e) => (e.currentTarget.style.height = '8px')}>
        <div className="bar-animate" style={{
          width: `${pct}%`, height: '100%', borderRadius: 4,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          animationDelay: `${delay}ms`,
          boxShadow: `0 0 8px ${color}44`,
        }} />
      </div>
      <div style={{ width: 96, fontSize: 11, fontWeight: 700, color, flexShrink: 0, textAlign: 'left' }}>
        {sub ?? fmt(value)}
      </div>
    </div>
  );
}

export default function AnalyticsTab() {
  const { employees } = useEmployees();

  const deptTotals = useMemo(() => {
    const m: Record<string, number> = {};
    employees.forEach((e) => { m[e.dept] = (m[e.dept] || 0) + e.salary; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  const branchTotals = useMemo(() => {
    const m: Record<string, number> = {};
    employees.forEach((e) => { m[e.branch] = (m[e.branch] || 0) + e.salary; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  const top10 = useMemo(
    () => [...employees].sort((a, b) => b.salary - a.salary).slice(0, 10),
    [employees]
  );

  const ranges = useMemo(() => [
    { lbl: 'أقل من 2,000',    min: 0,     max: 2000     },
    { lbl: '2,000 – 4,000',   min: 2000,  max: 4000     },
    { lbl: '4,000 – 8,000',   min: 4000,  max: 8000     },
    { lbl: '8,000 – 15,000',  min: 8000,  max: 15000    },
    { lbl: 'أكثر من 15,000',  min: 15000, max: Infinity },
  ].map((b) => ({ lbl: b.lbl, count: employees.filter((e) => e.salary >= b.min && e.salary < b.max).length })),
  [employees]);

  const total  = deptTotals.reduce((s, [, v]) => s + v, 0);
  const R = 66; const CX = 76; const CY = 76;
  const CIRC   = 2 * Math.PI * R;
  let   offset = 0;
  const slices = deptTotals.map(([dept, val]) => {
    const pct = total > 0 ? val / total : 0;
    const dash = pct * CIRC; const gap = (1 - pct) * CIRC;
    const dashOffset = -(offset * CIRC);
    offset += pct;
    return { dept, val, dash, gap, dashOffset, color: DEPT_COLORS[dept] || '#E8B86D' };
  });

  const COLORS = ['#E8B86D','#F472B6','#FB923C','#22C55E','#60A5FA','#8B5CF6','#34D399','#F59E0B'];
  const maxBranch = branchTotals.length ? branchTotals[0][1] : 1;
  const maxTop    = top10.length ? top10[0].salary : 1;
  const maxRange  = ranges.length ? Math.max(...ranges.map((r) => r.count), 1) : 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

      {/* Donut */}
      <ChartCard title="توزيع الرواتب حسب القسم">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width={152} height={152} viewBox="0 0 152 152" style={{ flexShrink: 0 }}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--dark4)" strokeWidth={16} />
            {slices.map((s, i) => (
              <circle key={s.dept} cx={CX} cy={CY} r={R} fill="none"
                stroke={s.color} strokeWidth={16}
                strokeDasharray={`${s.dash.toFixed(2)} ${s.gap.toFixed(2)}`}
                strokeDashoffset={s.dashOffset.toFixed(2)}
                style={{ cursor: 'pointer', transition: 'stroke-width 200ms ease', filter: `drop-shadow(0 0 6px ${s.color}66)` }}
                onMouseEnter={(e) => (e.currentTarget.style.strokeWidth = '22')}
                onMouseLeave={(e) => (e.currentTarget.style.strokeWidth = '16')}
              />
            ))}
            <text x={CX} y={CY - 7} textAnchor="middle" fill="var(--text3)" fontSize={9} fontFamily="Cairo">الإجمالي</text>
            <text x={CX} y={CY + 8} textAnchor="middle" fill="var(--gold-light)" fontSize={8} fontWeight="800" fontFamily="Cairo">
              {fmt(total)}
            </text>
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {slices.map((s) => (
              <div key={s.dept} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}88` }} />
                <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{s.dept}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{fmt(s.val)}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Branch bars */}
      <ChartCard title="إجمالي الرواتب حسب الفرع">
        {branchTotals.map(([branch, val], i) => (
          <HBar key={branch} label={branch} value={val} max={maxBranch} color={COLORS[i % COLORS.length]} delay={i * 80} />
        ))}
      </ChartCard>

      {/* Top 10 */}
      <ChartCard title="أعلى 10 رواتب">
        {top10.map((e, i) => (
          <HBar key={e.id}
            label={`${i + 1}. ${e.name.split(' ').slice(0, 2).join(' ')}`}
            value={e.salary} max={maxTop}
            color={COLORS[i % COLORS.length]}
            delay={i * 60}
          />
        ))}
      </ChartCard>

      {/* Salary ranges */}
      <ChartCard title="توزيع الرواتب بالفئات">
        {ranges.map((r, i) => (
          <HBar key={r.lbl} label={r.lbl} value={r.count} max={maxRange} color={COLORS[i % COLORS.length]} sub={`${r.count} موظف`} delay={i * 80} />
        ))}
      </ChartCard>

    </div>
  );
}
