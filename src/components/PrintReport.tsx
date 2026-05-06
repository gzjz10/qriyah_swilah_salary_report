'use client';

import { useEmployees } from '@/context/EmployeeContext';
import { fmt } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
   Professional salary report — prints only what the user filtered
   ───────────────────────────────────────────────────────────── */
export default function PrintReport() {
  const { printEmployees, printFilter, employees } = useEmployees();

  const isFiltered = !!(printFilter.dept || printFilter.branch || printFilter.search);
  const data       = printEmployees;

  // Group by dept — skip empty depts
  const deptMap: Record<string, typeof data> = {};
  data.forEach((e) => {
    if (!deptMap[e.dept]) deptMap[e.dept] = [];
    deptMap[e.dept].push(e);
  });

  const grandTotal  = data.reduce((s, e) => s + e.salary, 0);
  const grandAvg    = data.length ? Math.round(grandTotal / data.length) : 0;
  const grandMax    = data.length ? Math.max(...data.map((e) => e.salary)) : 0;
  const grandMin    = data.length ? Math.min(...data.map((e) => e.salary)) : 0;
  const deptEntries = Object.entries(deptMap);

  const today = new Date().toLocaleDateString('ar-SA-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const monthYear = new Date().toLocaleDateString('ar-SA-u-nu-latn', {
    year: 'numeric', month: 'long',
  });

  return (
    <div id="print-report" aria-hidden="true">

      {/* ══════════════════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════════════════ */}
      <div className="pr-cover print-avoid-break">
        {/* Top amber stripe */}
        <div className="pr-stripe-amber" />

        {/* Header bar */}
        <div className="pr-cover-topbar">
          <div className="pr-cover-topbar-text">شركة قرية صويلح للتجارة والتوزيع</div>
          <div className="pr-cover-topbar-sub">نظام إدارة المرتبات والأجور — نسخة رسمية</div>
        </div>

        {/* Central logo + title */}
        <div className="pr-cover-center">
          <div className="pr-logo-ring">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="شركة قرية صويلح" className="pr-logo-img" />
          </div>
          <div className="pr-cover-company">شركة قرية صويلح</div>
          <div className="pr-cover-title">تقرير المرتبات والأجور الشهري</div>
          <div className="pr-cover-period">{monthYear}</div>
          <div className="pr-cover-divider" />

          {/* Filter chip if active */}
          {isFiltered && (
            <div className="pr-filter-chip">
              <span className="pr-filter-chip-label">نطاق التقرير:</span>
              {printFilter.dept   && <span className="pr-filter-tag">القسم: {printFilter.dept}</span>}
              {printFilter.branch && <span className="pr-filter-tag">الفرع: {printFilter.branch}</span>}
              {printFilter.search && <span className="pr-filter-tag">بحث: "{printFilter.search}"</span>}
              <span className="pr-filter-tag pr-filter-count">{data.length} موظف</span>
            </div>
          )}
        </div>

        {/* Key metrics panel */}
        <div className="pr-cover-metrics">
          {[
            { lbl: 'إجمالي الموظفين',  val: data.length.toString() },
            { lbl: 'الأقسام',           val: deptEntries.length.toString() },
            { lbl: 'إجمالي الرواتب',   val: fmt(grandTotal) },
            { lbl: 'متوسط الراتب',     val: fmt(grandAvg)   },
          ].map(({ lbl, val }) => (
            <div key={lbl} className="pr-cover-metric">
              <div className="pr-cover-metric-val">{val}</div>
              <div className="pr-cover-metric-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pr-cover-footer">
          <div>تاريخ الإصدار: {today}</div>
          <div>تم الإعداد بواسطة نظام إدارة المرتبات الإلكتروني</div>
          {isFiltered && <div style={{ color:'#D4891A', fontWeight:700 }}>⚠ هذا التقرير يعرض بيانات مصفّاة وليس إجمالي الموظفين</div>}
        </div>

        {/* Bottom teal stripe */}
        <div className="pr-stripe-teal" />
      </div>

      {/* ══════════════════════════════════════════
          PAGE 2 — EXECUTIVE SUMMARY
      ══════════════════════════════════════════ */}
      <div className="pr-page print-page-break print-avoid-break">
        <div className="pr-page-header">
          <div className="pr-page-header-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" className="pr-page-logo-img" />
          </div>
          <div>
            <div className="pr-page-header-company">شركة قرية صويلح</div>
            <div className="pr-page-header-title">تقرير المرتبات — {monthYear}</div>
          </div>
        </div>

        <div className="pr-section-title">الملخص التنفيذي</div>

        {/* KPI row */}
        <div className="pr-kpi-grid">
          {[
            { lbl:'إجمالي الموظفين', val:data.length.toString(),  accent:'#D4891A' },
            { lbl:'إجمالي الرواتب',  val:fmt(grandTotal),          accent:'#D4891A' },
            { lbl:'متوسط الراتب',    val:fmt(grandAvg),            accent:'#2098A8' },
            { lbl:'أعلى راتب',       val:fmt(grandMax),            accent:'#2098A8' },
            { lbl:'أقل راتب',        val:fmt(grandMin),            accent:'#555'    },
            { lbl:'عدد الأقسام',     val:deptEntries.length.toString(), accent:'#555' },
          ].map(({ lbl, val, accent }) => (
            <div key={lbl} className="pr-kpi-card" style={{ borderTopColor: accent }}>
              <div className="pr-kpi-val" style={{ color: accent }}>{val}</div>
              <div className="pr-kpi-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Dept summary table */}
        <div className="pr-section-title" style={{ marginTop: 28 }}>ملخص الأقسام</div>
        <table className="pr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>القسم</th>
              <th>عدد الموظفين</th>
              <th>إجمالي الرواتب</th>
              <th>متوسط الراتب</th>
              <th>أعلى راتب</th>
              <th>النسبة</th>
            </tr>
          </thead>
          <tbody>
            {deptEntries.map(([dept, emps], i) => {
              const tot = emps.reduce((s, e) => s + e.salary, 0);
              const avg = Math.round(tot / emps.length);
              const max = Math.max(...emps.map((e) => e.salary));
              const pct = grandTotal > 0 ? Math.round((tot / grandTotal) * 100) : 0;
              return (
                <tr key={dept}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{dept}</td>
                  <td style={{ textAlign:'center' }}>{emps.length}</td>
                  <td className="pr-sar">{fmt(tot)}</td>
                  <td className="pr-sar">{fmt(avg)}</td>
                  <td className="pr-sar">{fmt(max)}</td>
                  <td style={{ textAlign:'center', fontWeight:700, color:'#D4891A' }}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="pr-tfoot-row">
              <td colSpan={2} style={{ fontWeight:800 }}>الإجمالي</td>
              <td style={{ textAlign:'center', fontWeight:800 }}>{data.length}</td>
              <td className="pr-sar" style={{ fontWeight:900, color:'#D4891A' }}>{fmt(grandTotal)}</td>
              <td className="pr-sar">{fmt(grandAvg)}</td>
              <td className="pr-sar">{fmt(grandMax)}</td>
              <td style={{ textAlign:'center', fontWeight:800 }}>100%</td>
            </tr>
          </tfoot>
        </table>

        <div className="pr-page-footer">
          <span>تقرير سري — شركة قرية صويلح</span>
          <span>{today}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PAGES 3+ — PER-DEPARTMENT DETAIL
      ══════════════════════════════════════════ */}
      {deptEntries.map(([dept, emps]) => {
        const tot = emps.reduce((s, e) => s + e.salary, 0);
        const avg = Math.round(tot / emps.length);
        const max = Math.max(...emps.map((e) => e.salary));
        const min = Math.min(...emps.map((e) => e.salary));
        const pct = grandTotal > 0 ? Math.round((tot / grandTotal) * 100) : 0;

        return (
          <div key={dept} className="pr-page print-page-break">
            {/* Page header */}
            <div className="pr-page-header">
              <div className="pr-page-header-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="" className="pr-page-logo-img" />
              </div>
              <div>
                <div className="pr-page-header-company">شركة قرية صويلح</div>
                <div className="pr-page-header-title">تقرير المرتبات — {monthYear}</div>
              </div>
            </div>

            {/* Dept header */}
            <div className="pr-dept-header">
              <div className="pr-dept-header-name">{dept}</div>
              <div className="pr-dept-header-count">{emps.length} موظف</div>
            </div>

            {/* Dept KPIs */}
            <div className="pr-dept-kpis">
              {[
                { lbl:'إجمالي الرواتب', val:fmt(tot) },
                { lbl:'متوسط الراتب',   val:fmt(avg) },
                { lbl:'أعلى راتب',      val:fmt(max) },
                { lbl:'أقل راتب',       val:fmt(min) },
                { lbl:'نسبة من الإجمالي', val:`${pct}%` },
              ].map(({ lbl, val }) => (
                <div key={lbl} className="pr-dept-kpi">
                  <div className="pr-dept-kpi-val">{val}</div>
                  <div className="pr-dept-kpi-lbl">{lbl}</div>
                </div>
              ))}
            </div>

            {/* Employee table */}
            <table className="pr-table" style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th style={{ width:36 }}>الترتيب</th>
                  <th>اسم الموظف</th>
                  <th>المسمى الوظيفي</th>
                  <th>الفرع</th>
                  <th>الراتب</th>
                  <th>النسبة من القسم</th>
                </tr>
              </thead>
              <tbody>
                {emps.map((e, i) => {
                  const pctOfDept = tot > 0 ? Math.round((e.salary / tot) * 100) : 0;
                  return (
                    <tr key={e.id}>
                      <td style={{ textAlign:'center' }}>
                        <span className="pr-rank">{i + 1}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{e.name}</td>
                      <td style={{ color:'#555' }}>{e.title}</td>
                      <td>{e.branch}</td>
                      <td className="pr-sar">{fmt(e.salary)}</td>
                      <td>
                        <div className="pr-bar-wrap">
                          <div className="pr-bar-fill" style={{ width:`${pctOfDept}%` }} />
                          <span className="pr-bar-label">{pctOfDept}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="pr-tfoot-row">
                  <td colSpan={3} style={{ fontWeight:800 }}>إجمالي {dept}</td>
                  <td />
                  <td className="pr-sar" style={{ fontWeight:900, color:'#D4891A' }}>{fmt(tot)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>

            <div className="pr-page-footer">
              <span>تقرير سري — شركة قرية صويلح</span>
              <span>{today}</span>
            </div>
          </div>
        );
      })}

      {/* ══════════════════════════════════════════
          FINAL PAGE — GRAND TOTAL + SIGNATURE
      ══════════════════════════════════════════ */}
      <div className="pr-page print-page-break print-avoid-break">
        <div className="pr-page-header">
          <div className="pr-page-header-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" className="pr-page-logo-img" />
          </div>
          <div>
            <div className="pr-page-header-company">شركة قرية صويلح</div>
            <div className="pr-page-header-title">تقرير المرتبات — {monthYear}</div>
          </div>
        </div>

        <div className="pr-section-title">الملخص الختامي والاعتمادات</div>

        {/* Grand total box */}
        <div className="pr-grand-box">
          <div className="pr-grand-title">الإجمالي الكلي للرواتب</div>
          <div className="pr-grand-val">{fmt(grandTotal)}</div>
          <div className="pr-grand-sub">{data.length} موظف في {deptEntries.length} أقسام</div>
        </div>

        {/* Signature grid */}
        <div className="pr-sig-grid">
          {[
            { title:'مدير الموارد البشرية', name:'.................................' },
            { title:'المدير المالي',          name:'.................................' },
            { title:'المدير العام',            name:'.................................' },
          ].map(({ title, name }) => (
            <div key={title} className="pr-sig-card">
              <div className="pr-sig-title">{title}</div>
              <div className="pr-sig-line" />
              <div className="pr-sig-name">{name}</div>
              <div className="pr-sig-label">التوقيع والختم</div>
              <div className="pr-sig-date">التاريخ: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            </div>
          ))}
        </div>

        <div className="pr-disclaimer">
          هذا التقرير سري ومعد للاستخدام الداخلي فقط · شركة قرية صويلح للتجارة والتوزيع · {today}
        </div>

        <div className="pr-stripe-amber" style={{ position:'static', marginTop:'auto', height:6 }} />
        <div className="pr-stripe-teal"  style={{ position:'static', height:4 }} />
      </div>

    </div>
  );
}
