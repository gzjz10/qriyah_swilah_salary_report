'use client';

import { Building2, Pencil } from 'lucide-react';
import ModalShell from './ModalShell';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS } from '@/lib/utils';

export default function DeptModal({ dept }: { dept: string }) {
  const { employees, closeModal, openModal } = useEmployees();

  const emps = [...employees]
    .filter((e) => e.dept === dept)
    .sort((a, b) => b.salary - a.salary);

  const total = emps.reduce((s, e) => s + e.salary, 0);
  const avg = emps.length ? Math.round(total / emps.length) : 0;
  const max = emps.length ? Math.max(...emps.map((e) => e.salary)) : 0;
  const col = DEPT_COLORS[dept] || '#E8B86D';

  return (
    <ModalShell
      title={<><Building2 size={18} /> {dept} — {emps.length} موظف</>}
      onClose={closeModal}
    >
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { lbl: 'إجمالي الرواتب', val: fmt(total) },
          { lbl: 'متوسط الراتب', val: fmt(avg) },
          { lbl: 'أعلى راتب', val: fmt(max) },
        ].map(({ lbl, val }) => (
          <div key={lbl} style={{ flex: 1, minWidth: 120, background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-light)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'الموظف', 'الوظيفة', 'الفرع', 'الراتب', ''].map((h) => (
                <th key={h} style={{ background: 'var(--dark3)', padding: '11px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--text3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emps.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border2)', transition: 'background .15s', cursor: 'pointer' }}
                onMouseEnter={(el) => (el.currentTarget.style.background = 'rgba(200,150,62,0.04)')}
                onMouseLeave={(el) => (el.currentTarget.style.background = '')}>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text3)', fontWeight: 700 }}>{i + 1}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>{e.name}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text3)' }}>{e.title}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text2)' }}>{e.branch}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 800, color: 'var(--gold-light)' }}>{fmt(e.salary)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <button onClick={() => { closeModal(); setTimeout(() => openModal({ type: 'edit', employee: e }), 50); }}
                    style={{ background: 'rgba(200,150,62,0.1)', border: '1px solid rgba(200,150,62,0.25)', color: 'var(--gold-light)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}>
                    <Pencil size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
}
