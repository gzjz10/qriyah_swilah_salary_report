'use client';

import { useEmployees } from '@/context/EmployeeContext';
import { fmt, DEPT_COLORS } from '@/lib/utils';

export default function PrintReport() {
  const { employees } = useEmployees();

  const deptData: Record<string, typeof employees> = {};
  employees.forEach((e) => {
    if (!deptData[e.dept]) deptData[e.dept] = [];
    deptData[e.dept].push(e);
  });
  Object.values(deptData).forEach((arr) => arr.sort((a, b) => b.salary - a.salary));

  const grandTotal = employees.reduce((s, e) => s + e.salary, 0);
  const depts = Object.keys(deptData);
  const branches = Array.from(new Set(employees.map((e) => e.branch)));

  const today = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div id="print-report" aria-hidden="true">
      {/* ── Cover header ── */}
      <div className="pr-header print-avoid-break">
        <h1>شركة قرية صويلح — تقرير المرتبات الشهري</h1>
        <p>تاريخ التقرير: {today}</p>
      </div>

      {/* ── Global stats ── */}
      <div className="pr-stats-grid print-avoid-break">
        {[
          { lbl: 'إجمالي الموظفين', val: employees.length.toString() },
          { lbl: 'إجمالي الرواتب', val: fmt(grandTotal) },
          { lbl: 'الأقسام', val: depts.length.toString() },
          { lbl: 'الفروع', val: branches.length.toString() },
        ].map(({ lbl, val }) => (
          <div key={lbl} className="pr-stat">
            <div className="pr-stat-lbl">{lbl}</div>
            <div className="pr-stat-val">{val}</div>
          </div>
        ))}
      </div>

      {/* ── Per-department sections ── */}
      <div className="pr-section-title">تفاصيل الموظفين حسب القسم</div>

      {Object.entries(deptData).map(([dept, emps]) => {
        const total = emps.reduce((s, e) => s + e.salary, 0);
        const avg = Math.round(total / emps.length);
        const max = Math.max(...emps.map((e) => e.salary));

        return (
          <div key={dept} className="pr-dept-card print-avoid-break">
            <div className="pr-dept-head">
              <span>{dept}</span>
              <span>{emps.length} موظف</span>
            </div>
            <div className="pr-dept-stats">
              {[
                { lbl: 'إجمالي الرواتب', val: fmt(total) },
                { lbl: 'متوسط الراتب', val: fmt(avg) },
                { lbl: 'أعلى راتب', val: fmt(max) },
              ].map(({ lbl, val }) => (
                <div key={lbl} className="pr-dept-stat">
                  <div className="lbl">{lbl}</div>
                  <div className="val">{val}</div>
                </div>
              ))}
            </div>
            <table className="pr-table">
              <thead>
                <tr>
                  <th style={{ width: 32 }}>#</th>
                  <th>اسم الموظف</th>
                  <th>المسمى الوظيفي</th>
                  <th>الفرع</th>
                  <th>الراتب (ر.س)</th>
                </tr>
              </thead>
              <tbody>
                {emps.map((e, i) => (
                  <tr key={e.id}>
                    <td><span className="pr-rank">{i + 1}</span></td>
                    <td>{e.name}</td>
                    <td>{e.title}</td>
                    <td>{e.branch}</td>
                    <td className="pr-sar">{fmt(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f1f3f5', fontWeight: 700 }}>
                  <td colSpan={4} style={{ padding: '8px 12px', textAlign: 'right' }}>إجمالي {dept}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 800 }}>{fmt(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}

      {/* ── Grand total ── */}
      <div style={{ marginTop: 30, padding: 20, border: '2px solid #1a1a2e', borderRadius: 8, textAlign: 'center' }} className="print-avoid-break">
        <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>الإجمالي الكلي للرواتب</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>{fmt(grandTotal)}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{employees.length} موظف في {depts.length} أقسام</div>
      </div>
    </div>
  );
}
