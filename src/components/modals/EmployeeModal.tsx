'use client';

import { useState } from 'react';
import { UserPlus, Pencil, Save, AlertCircle } from 'lucide-react';
import ModalShell from './ModalShell';
import { useEmployees } from '@/context/EmployeeContext';
import { DEPT_LIST, BRANCH_LIST, DEPT_COLORS } from '@/lib/utils';
import type { Employee } from '@/types';

interface Props {
  mode: 'add' | 'edit';
  employee?: Employee;
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border2)',
  borderRadius: 10,
  padding: '11px 14px',
  color: 'var(--text)',
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  transition: 'border-color 180ms ease, box-shadow 180ms ease',
};

export default function EmployeeModal({ mode, employee }: Props) {
  const { closeModal, addEmployee, editEmployee } = useEmployees();

  const [form, setForm] = useState({
    name:   employee?.name   ?? '',
    title:  employee?.title  ?? '',
    dept:   employee?.dept   ?? DEPT_LIST[0],
    branch: employee?.branch ?? BRANCH_LIST[0],
    salary: employee?.salary?.toString() ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setError('');
    if (!form.name.trim())  { setError('يرجى إدخال اسم الموظف');    return; }
    if (!form.title.trim()) { setError('يرجى إدخال المسمى الوظيفي'); return; }
    if (!form.salary)       { setError('يرجى إدخال الراتب');          return; }

    setSaving(true);
    const payload = {
      name:   form.name.trim(),
      title:  form.title.trim(),
      dept:   form.dept,
      branch: form.branch,
      salary: parseInt(form.salary, 10) || 0,
    };

    // Context uses optimistic updates — always succeeds locally
    if (mode === 'add') {
      await addEmployee(payload);
    } else if (employee) {
      await editEmployee(employee.id, payload);
    }

    setSaving(false);
    closeModal();
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--amber-light)';
    e.target.style.boxShadow   = '0 0 0 3px rgba(245,166,35,0.12)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--border2)';
    e.target.style.boxShadow   = 'none';
  };

  const selectedDeptColor = DEPT_COLORS[form.dept] || 'var(--amber-light)';

  return (
    <ModalShell
      title={
        <>
          {mode === 'add' ? <UserPlus size={18} /> : <Pencil size={18} />}
          {mode === 'add' ? ' إضافة موظف جديد' : ' تعديل بيانات الموظف'}
        </>
      }
      onClose={closeModal}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Name */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text3)', marginBottom:7 }}>
            اسم الموظف <span style={{ color:'var(--red)' }}>*</span>
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="الاسم الكامل للموظف"
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Title */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text3)', marginBottom:7 }}>
            المسمى الوظيفي <span style={{ color:'var(--red)' }}>*</span>
          </label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="مثال: مدير التسويق"
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Dept */}
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text3)', marginBottom:7 }}>القسم</label>
          <select
            value={form.dept}
            onChange={set('dept')}
            style={{ ...inputStyle, cursor:'pointer', borderColor: selectedDeptColor + '55' }}
            onFocus={focusStyle}
            onBlur={(e) => { e.target.style.borderColor = selectedDeptColor + '55'; e.target.style.boxShadow = 'none'; }}
          >
            {DEPT_LIST.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {/* Dept color indicator */}
          <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:selectedDeptColor, boxShadow:`0 0 6px ${selectedDeptColor}88` }} />
            <span style={{ fontSize:11, color:'var(--text3)' }}>{form.dept}</span>
          </div>
        </div>

        {/* Branch */}
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text3)', marginBottom:7 }}>الفرع</label>
          <select
            value={form.branch}
            onChange={set('branch')}
            style={{ ...inputStyle, cursor:'pointer' }}
            onFocus={focusStyle}
            onBlur={blurStyle}
          >
            {BRANCH_LIST.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--text3)', marginBottom:7 }}>
            الراتب الإجمالي <span style={{ color:'var(--red)' }}>*</span>
          </label>
          <div style={{ position:'relative' }}>
            <input
              value={form.salary}
              onChange={set('salary')}
              type="number"
              min={0}
              placeholder="0"
              style={{ ...inputStyle, paddingLeft: 56 }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, fontWeight:700, color:'var(--amber-light)', pointerEvents:'none' }}>
              ⃁
            </span>
          </div>
          {form.salary && !isNaN(Number(form.salary)) && (
            <div style={{ marginTop:6, fontSize:12, color:'var(--amber-light)', fontWeight:700 }}>
              {Number(form.salary).toLocaleString('en-SA')} ⃁
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'flex-start', gap:8, background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.30)', borderRadius:10, padding:'10px 14px', fontSize:13, fontWeight:600, color:'var(--red)' }}>
            <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }} />
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ gridColumn:'1/-1', display:'flex', gap:10, justifyContent:'flex-end', marginTop:4, paddingTop:4, borderTop:'1px solid var(--border2)' }}>
          <button
            onClick={closeModal}
            style={{ background:'var(--bg-btn-ghost)', border:'1px solid var(--border2)', color:'var(--text2)', padding:'10px 20px', borderRadius:10, fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all var(--transition)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--red)'; e.currentTarget.style.color='var(--red)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--text2)'; }}
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background:'linear-gradient(135deg,var(--amber-light),var(--amber-dark))', color:'#fff', border:'none', padding:'10px 28px', borderRadius:10, fontFamily:'inherit', fontSize:13, fontWeight:700, cursor: saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:7, opacity: saving ? 0.75 : 1, transition:'all var(--transition)', boxShadow:'0 4px 14px rgba(245,166,35,0.35)' }}
            onMouseEnter={(e) => { if(!saving){ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(245,166,35,0.55)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 14px rgba(245,166,35,0.35)'; }}
          >
            {saving ? (
              <>
                <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                جارٍ الحفظ...
              </>
            ) : (
              <><Save size={14} /> حفظ التغييرات</>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
