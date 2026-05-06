'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import ModalShell from './ModalShell';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt } from '@/lib/utils';
import type { Employee } from '@/types';

const PCT_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function RaiseModal({ employee }: { employee: Employee }) {
  const { closeModal, raiseEmployee } = useEmployees();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);

  const raiseAmt = selected !== null
    ? Math.round(employee.salary * selected / 100)
    : (parseInt(custom, 10) || 0);
  const newSalary = employee.salary + raiseAmt;

  const handleSave = async () => {
    if (newSalary <= employee.salary) return;
    setSaving(true);
    try {
      await raiseEmployee(employee.id, newSalary);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={<><TrendingUp size={18} /> زيادة الراتب — {employee.name.split(' ').slice(0, 2).join(' ')}</>}
      onClose={closeModal}
      maxWidth={440}
    >
      {/* Current salary */}
      <div style={{ background: 'var(--dark3)', border: '1px solid var(--border2)', borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>الراتب الحالي</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gold-light)' }}>{fmt(employee.salary)}</div>
      </div>

      {/* Percentage options */}
      <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, marginBottom: 10 }}>اختر نسبة الزيادة</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {PCT_OPTIONS.map((p) => (
          <button key={p}
            onClick={() => { setSelected(selected === p ? null : p); setCustom(''); }}
            style={{
              background: selected === p ? 'rgba(200,150,62,0.15)' : 'var(--dark3)',
              border: `1px solid ${selected === p ? 'var(--gold)' : 'var(--border2)'}`,
              borderRadius: 8, padding: '10px', textAlign: 'center', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
              color: selected === p ? 'var(--gold-light)' : 'var(--text2)',
              transition: 'all .2s',
            }}>
            +{p}%
            <div style={{ fontSize: 10, marginTop: 2, color: 'var(--text3)' }}>
              +{fmt(Math.round(employee.salary * p / 100))}
            </div>
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, display: 'block', marginBottom: 6 }}>أو أدخل مبلغ الزيادة (ر.س)</label>
        <input type="number" min={0} value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
          placeholder="مثال: 500"
          style={{ width: '100%', background: 'var(--dark3)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border2)')} />
      </div>

      {/* Preview */}
      {raiseAmt > 0 && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: 14, textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>الراتب الجديد</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>{fmt(newSalary)}</div>
          <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>+{fmt(raiseAmt)} زيادة</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={closeModal}
          style={{ background: 'var(--dark4)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '10px 20px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          إلغاء
        </button>
        <button onClick={handleSave} disabled={saving || raiseAmt <= 0}
          style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: saving || raiseAmt <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: raiseAmt <= 0 ? 0.5 : 1, transition: 'all .2s' }}>
          <TrendingUp size={14} />
          {saving ? 'جارٍ الحفظ...' : 'تطبيق الزيادة'}
        </button>
      </div>
    </ModalShell>
  );
}
