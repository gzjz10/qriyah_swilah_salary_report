'use client';

import { useState } from 'react';
import { UserPlus, Pencil, Save } from 'lucide-react';
import ModalShell from './ModalShell';
import { useEmployees } from '@/context/EmployeeContext';
import { DEPT_LIST, BRANCH_LIST } from '@/lib/utils';
import type { Employee } from '@/types';

interface Props {
  mode: 'add' | 'edit';
  employee?: Employee;
}

const inputStyle: React.CSSProperties = {
  background: 'var(--dark3)',
  border: '1px solid var(--border2)',
  borderRadius: 10,
  padding: '10px 14px',
  color: 'var(--text)',
  fontFamily: 'inherit',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  transition: 'border .2s',
};

export default function EmployeeModal({ mode, employee }: Props) {
  const { closeModal, addEmployee, editEmployee } = useEmployees();

  const [form, setForm] = useState({
    name: employee?.name ?? '',
    title: employee?.title ?? '',
    dept: employee?.dept ?? DEPT_LIST[0],
    branch: employee?.branch ?? BRANCH_LIST[0],
    salary: employee?.salary?.toString() ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.salary) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        dept: form.dept,
        branch: form.branch,
        salary: parseInt(form.salary, 10) || 0,
      };
      if (mode === 'add') {
        await addEmployee(payload);
      } else if (employee) {
        await editEmployee(employee.id, payload);
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const fields: { label: string; key: keyof typeof form; type?: string }[] = [
    { label: 'اسم الموظف', key: 'name' },
    { label: 'المسمى الوظيفي', key: 'title' },
  ];

  return (
    <ModalShell
      title={<>{mode === 'add' ? <UserPlus size={18} /> : <Pencil size={18} />} {mode === 'add' ? 'إضافة موظف جديد' : 'تعديل بيانات الموظف'}</>}
      onClose={closeModal}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Name - full width */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>اسم الموظف</label>
          <input value={form.name} onChange={set('name')} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
        </div>

        {/* Title - full width */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>المسمى الوظيفي</label>
          <input value={form.title} onChange={set('title')} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
        </div>

        {/* Dept */}
        <div>
          <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>القسم</label>
          <select value={form.dept} onChange={set('dept')} style={{ ...inputStyle, cursor: 'pointer' }}>
            {DEPT_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Branch */}
        <div>
          <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>الفرع</label>
          <select value={form.branch} onChange={set('branch')} style={{ ...inputStyle, cursor: 'pointer' }}>
            {BRANCH_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>الراتب الإجمالي (ر.س)</label>
          <input value={form.salary} onChange={set('salary')} type="number" min={0} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
        </div>

        {/* Actions */}
        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={closeModal}
            style={{ background: 'var(--dark4)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '10px 20px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
            إلغاء
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold-dark))', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: saving ? 0.7 : 1, transition: 'all .2s' }}>
            <Save size={14} />
            {saving ? 'جارٍ الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
