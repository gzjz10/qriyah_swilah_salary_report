'use client';

import { useMemo, useState } from 'react';
import { useEmployees } from '@/context/EmployeeContext';
import type { Employee } from '@/types';
import { fmt, median, DEPT_COLORS } from '@/lib/utils';

function ChartCard({ title, children, style }: { title:string; children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <div style={{ background:'var(--bg-glass)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid var(--border2)', borderRadius:16, padding:'22px 24px', boxShadow:'var(--shadow)', transition:'border-color var(--transition)', ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor='var(--border)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor='var(--border2)')}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:20, color:'var(--text2)', letterSpacing:'0.02em' }}>{title}</div>
      {children}
    </div>
  );
}

const AR_MONTHS = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function TrendChart({ data }: { data: { label: string; total: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const allFlat = data.every((d) => d.total === data[0]?.total);

  const W = 540, H = 110;
  const PAD = { l: 8, r: 8, t: 18, b: 30 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const vals = data.map((d) => d.total);
  const maxVal = Math.max(...vals, 1);
  const minVal = allFlat ? 0 : Math.min(...vals);
  const range = maxVal - minVal || 1;

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * pw,
    y: PAD.t + (1 - (d.total - minVal) / range) * ph * 0.82 + ph * 0.09,
    label: d.label,
    total: d.total,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.t + ph).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD.t + ph).toFixed(1)}Z`;

  const last = data[data.length - 1]?.total ?? 0;
  const prev = data[data.length - 2]?.total ?? 0;
  const growth = prev ? ((last - prev) / prev) * 100 : 0;
  const growthColor = growth >= 0 ? '#34D399' : '#F43F5E';

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ fontSize:11, color:'var(--text3)' }}>آخر 12 شهراً</span>
        <span style={{ fontSize:12, fontWeight:700, color:growthColor }}>
          {growth >= 0 ? '▲' : '▼'} {Math.abs(growth).toFixed(1)}٪ مقارنة بالشهر الماضي
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', overflow:'visible', display:'block' }}
        onMouseLeave={() => setHovered(null)}>
        <defs>
          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3DC8D5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3DC8D5" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const gy = PAD.t + t * ph;
          return <line key={t} x1={PAD.l} y1={gy} x2={W - PAD.r} y2={gy} stroke="var(--dark4)" strokeWidth="1" strokeDasharray="3,5" />;
        })}
        <path d={areaPath} fill="url(#trendAreaGrad)" />
        <path d={linePath} fill="none" stroke="#3DC8D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => {
          const tx = Math.min(Math.max(p.x, 50), W - 50);
          return (
            <g key={i} style={{ cursor:'pointer' }} onMouseEnter={() => setHovered(i)}>
              <rect x={p.x - 18} y={PAD.t} width={36} height={ph} fill="transparent" />
              {hovered === i && <line x1={p.x} y1={PAD.t} x2={p.x} y2={PAD.t + ph} stroke="#3DC8D533" strokeWidth="1" strokeDasharray="3,3" />}
              <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3}
                fill={hovered === i ? '#3DC8D5' : 'var(--dark3)'}
                stroke="#3DC8D5" strokeWidth="1.5" />
              <text x={p.x} y={H - 5} textAnchor="middle" fill="var(--text3)" fontSize={8} fontFamily="Cairo">{p.label}</text>
              {hovered === i && (
                <g>
                  <rect x={tx - 48} y={p.y - 28} width={96} height={20} rx={5} fill="var(--dark3)" stroke="#3DC8D544" strokeWidth={1} />
                  <text x={tx} y={p.y - 14} textAnchor="middle" fill="#3DC8D5" fontSize={8.5} fontWeight="700" fontFamily="Cairo">{fmt(p.total)}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Treemap({ data, onSelect }: { data: { dept: string; val: number }[]; onSelect?: (dept: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.val, 0);
  const maxVal = data.length ? Math.max(...data.map((d) => d.val)) : 1;
  const sorted = [...data].sort((a, b) => b.val - a.val);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
      {sorted.map((item) => {
        const pct  = total > 0 ? (item.val / total) * 100 : 0;
        const fill = (item.val / maxVal) * 100;
        const color = DEPT_COLORS[item.dept] || '#F5A623';
        const isHov = hovered === item.dept;
        return (
          <div key={item.dept}
            style={{ position:'relative', overflow:'hidden', height:58, background:'var(--dark4)', borderRadius:9, cursor:'pointer', transition:'box-shadow 180ms', boxShadow: isHov ? `0 0 18px ${color}44, inset 0 0 0 1.5px ${color}` : `inset 0 0 0 1px ${color}33` }}
            onMouseEnter={() => setHovered(item.dept)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect?.(item.dept)}>
            {/* proportional background fill — width scales with salary vs max dept */}
            <div style={{ position:'absolute', top:0, left:0, bottom:0, width:`${fill}%`, background:`${color}18`, transition:'background 180ms' }} />
            {/* bottom accent bar */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}55)` }} />
            <div style={{ position:'relative', padding:'7px 10px 12px' }}>
              <div style={{ fontSize:11.5, fontWeight:700, color, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.2 }}>{item.dept}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:3 }}>
                <span style={{ fontSize:9, color:'var(--text3)' }}>{fmt(item.val)}</span>
                <span style={{ fontSize:10, fontWeight:800, color }}>{pct.toFixed(1)}٪</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label:string; value:string; sub?:string; color:string }) {
  return (
    <div style={{ background:'var(--bg-glass)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid var(--border2)', borderRadius:14, padding:'20px 18px', flex:1, minWidth:130, display:'flex', flexDirection:'column', gap:6, boxShadow:'var(--shadow)', position:'relative', overflow:'hidden', transition:'border-color var(--transition)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor=color+'66')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor='var(--border2)')}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color}00,${color},${color}00)` }} />
      <div style={{ fontSize:22, fontWeight:800, color, fontFamily:'Cairo', lineHeight:1.1, marginTop:4 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color, opacity:0.75, fontWeight:600 }}>{sub}</div>}
      <div style={{ fontSize:11, color:'var(--text2)', fontWeight:600 }}>{label}</div>
    </div>
  );
}

function HBar({ label, value, max, color, sub, delay=0, total, onClick }: { label:string; value:number; max:number; color:string; sub?:string; delay?:number; total?:number; onClick?:()=>void }) {
  const [hov, setHov] = useState(false);
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const sharePct = total && total > 0 ? ((value / total) * 100).toFixed(1) : null;

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11, position:'relative', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}>
      {hov && (
        <div style={{ position:'absolute', bottom:'calc(100% + 7px)', left:'50%', transform:'translateX(-50%)', background:'var(--dark3)', border:`1px solid ${color}66`, borderRadius:8, padding:'6px 13px', whiteSpace:'nowrap', zIndex:20, pointerEvents:'none', boxShadow:`0 6px 22px rgba(0,0,0,0.45), 0 0 12px ${color}22`, display:'flex', alignItems:'baseline', gap:5 }}>
          <span style={{ fontSize:12, fontWeight:700, color }}>{label}</span>
          <span style={{ fontSize:12, color:'var(--text3)' }}>:</span>
          <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{sub ?? fmt(value)}</span>
          {sharePct !== null && (
            <span style={{ fontSize:10, color:'var(--text3)' }}>({sharePct}٪ من الإجمالي)</span>
          )}
        </div>
      )}
      <div style={{ width:118, fontSize:12, color:'var(--text2)', textAlign:'right', flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }} title={label}>{label}</div>
      <div style={{ flex:1, height: hov ? 12 : 8, background:'var(--dark4)', borderRadius:4, overflow:'hidden', cursor:'pointer', transition:'height 180ms ease' }}>
        <div className="bar-animate" style={{ width:`${pct}%`, height:'100%', borderRadius:4, background:`linear-gradient(90deg,${color}99,${color})`, animationDelay:`${delay}ms`, boxShadow:`0 0 8px ${color}44` }} />
      </div>
      <div style={{ width:96, fontSize:11, fontWeight:700, color, flexShrink:0, textAlign:'left' }}>{sub ?? fmt(value)}</div>
    </div>
  );
}

function DrillDownPanel({ name, type, emps, onBack }: { name:string; type:'dept'|'branch'; emps:Employee[]; onBack:()=>void }) {
  const ddTotal = emps.reduce((s, e) => s + e.salary, 0);
  const ddAvg   = emps.length ? Math.round(ddTotal / emps.length) : 0;
  const ddMax   = emps.length ? emps[0].salary : 0;
  const ddMin   = emps.length ? emps[emps.length - 1].salary : 0;
  const color   = DEPT_COLORS[name] || '#3DC8D5';
  const typeLabel = type === 'dept' ? 'قسم' : 'فرع';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:4, height:22, borderRadius:2, background:color, flexShrink:0 }} />
          <span style={{ fontSize:17, fontWeight:800, color }}>{name}</span>
          <span style={{ fontSize:11, color:'var(--text3)', background:'var(--dark4)', border:'1px solid var(--border2)', padding:'2px 10px', borderRadius:20 }}>{typeLabel}</span>
        </div>
        <button type="button" onClick={onBack}
          style={{ background:'var(--dark4)', border:'1px solid var(--border2)', borderRadius:8, padding:'7px 16px', color:'var(--text2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', transition:'border-color var(--transition), color var(--transition)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--text2)'; }}>
          العودة للتحليل الكامل
        </button>
      </div>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <KpiCard label="عدد الموظفين" value={`${emps.length}`} color="#3DC8D5" />
        <KpiCard label="إجمالي الرواتب" value={fmt(ddTotal)} color={color} />
        <KpiCard label="متوسط الراتب" value={fmt(ddAvg)} color="#60A5FA" />
        <KpiCard label="أعلى راتب" value={fmt(ddMax)} color="#34D399" />
        <KpiCard label="أدنى راتب" value={fmt(ddMin)} color="#F472B6" />
      </div>

      <ChartCard title={`موظفو ${name} — مرتبون حسب الراتب (${emps.length} موظف)`}>
        {emps.map((emp, i) => (
          <HBar
            key={emp.id}
            label={`${i + 1}. ${emp.name.split(' ').slice(0, 2).join(' ')}`}
            value={emp.salary}
            max={ddMax}
            color={DEPT_COLORS[emp.dept] || color}
            delay={i * 25}
            total={ddTotal}
          />
        ))}
      </ChartCard>
    </div>
  );
}

export default function AnalyticsTab() {
  const { employees } = useEmployees();
  const [drillDown, setDrillDown] = useState<{ type:'dept'|'branch'; name:string } | null>(null);

  const deptTotals  = useMemo(() => { const m:Record<string,number>={}; employees.forEach((e) => {m[e.dept]=(m[e.dept]||0)+e.salary;}); return Object.entries(m).sort((a,b) => b[1]-a[1]); }, [employees]);
  const branchTotals = useMemo(() => { const m:Record<string,number>={}; employees.forEach((e) => {m[e.branch]=(m[e.branch]||0)+e.salary;}); return Object.entries(m).sort((a,b) => b[1]-a[1]); }, [employees]);
  const top10        = useMemo(() => [...employees].sort((a,b) => b.salary-a.salary).slice(0,10), [employees]);
  const ranges       = useMemo(() => [
    {lbl:'أقل من 2,000',min:0,max:2000},{lbl:'2,000 – 4,000',min:2000,max:4000},
    {lbl:'4,000 – 8,000',min:4000,max:8000},{lbl:'8,000 – 15,000',min:8000,max:15000},
    {lbl:'أكثر من 15,000',min:15000,max:Infinity},
  ].map((b) => ({lbl:b.lbl,count:employees.filter((e) => e.salary>=b.min&&e.salary<b.max).length})),[employees]);

  const med = useMemo(() => median(employees.map((e) => e.salary)), [employees]);

  const drillEmployees = useMemo(() => {
    if (!drillDown) return [];
    return employees
      .filter((e) => drillDown.type === 'dept' ? e.dept === drillDown.name : e.branch === drillDown.name)
      .sort((a, b) => b.salary - a.salary);
  }, [employees, drillDown]);

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const total = employees.reduce((sum, emp) => {
        if (!emp.created_at) return sum + emp.salary;
        return new Date(emp.created_at) <= monthEnd ? sum + emp.salary : sum;
      }, 0);
      return { label: AR_MONTHS[d.getMonth()], total };
    });
  }, [employees]);

  const total=deptTotals.reduce((s,[,v])=>s+v,0);
  const avg = employees.length ? total / employees.length : 0;
  const topDept = deptTotals.length ? deptTotals[0][0] : '—';
  const topDeptTotal = deptTotals.length ? deptTotals[0][1] : 0;

  const COLORS=['#F5A623','#3DC8D5','#FB923C','#22C55E','#8B5CF6','#F472B6','#34D399','#F59E0B'];
  const maxBranch=branchTotals.length?branchTotals[0][1]:1;
  const maxTop=top10.length?top10[0].salary:1;
  const maxRange=ranges.length?Math.max(...ranges.map((r)=>r.count),1):1;

  if (drillDown) {
    return (
      <DrillDownPanel
        name={drillDown.name}
        type={drillDown.type}
        emps={drillEmployees}
        onBack={() => setDrillDown(null)}
      />
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <KpiCard label="إجمالي الرواتب" value={fmt(total)} color="#F5A623" />
        <KpiCard label="عدد الموظفين" value={`${employees.length}`} color="#3DC8D5" />
        <KpiCard label="متوسط الراتب" value={fmt(Math.round(avg))} color="#60A5FA" />
        <KpiCard label="الوسيط" value={fmt(Math.round(med))} color="#34D399" />
        <KpiCard label="أعلى قسم تكلفة" value={topDept} sub={fmt(topDeptTotal)} color="#F472B6" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        <ChartCard title="حصة كل قسم من إجمالي الرواتب — اضغط للتفاصيل">
          <Treemap data={deptTotals.map(([dept, val]) => ({ dept, val }))} onSelect={(dept) => setDrillDown({ type:'dept', name:dept })} />
        </ChartCard>

        <ChartCard title="إجمالي الرواتب حسب الفرع — اضغط للتفاصيل">
          {branchTotals.map(([branch,val],i) => <HBar key={branch} label={branch} value={val} max={maxBranch} color={COLORS[i%COLORS.length]} delay={i*80} total={total} onClick={() => setDrillDown({ type:'branch', name:branch })} />)}
        </ChartCard>

        <ChartCard title="أعلى 10 رواتب">
          {top10.map((e,i) => <HBar key={e.id} label={`${i+1}. ${e.name.split(' ').slice(0,2).join(' ')}`} value={e.salary} max={maxTop} color={COLORS[i%COLORS.length]} delay={i*60} total={total} />)}
        </ChartCard>

        <ChartCard title="توزيع الرواتب بالفئات">
          {ranges.map((r,i) => <HBar key={r.lbl} label={r.lbl} value={r.count} max={maxRange} color={COLORS[i%COLORS.length]} sub={`${r.count} موظف`} delay={i*80} total={employees.length} />)}
        </ChartCard>

        <ChartCard title="اتجاه إجمالي الرواتب الشهري" style={{ gridColumn:'1 / -1' }}>
          <TrendChart data={monthlyTotals} />
        </ChartCard>
      </div>
    </div>
  );
}
