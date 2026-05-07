'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import ModalShell from './ModalShell';
import { useEmployees } from '@/context/EmployeeContext';
import { fmt } from '@/lib/utils';
import type { Employee } from '@/types';

export default function DeleteModal({ employee }: { employee: Employee }) {
  const { closeModal, removeEmployee } = useEmployees();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await removeEmployee(employee.id); // optimistic — never throws
    setDeleting(false);
    closeModal();
  };

  return (
    <ModalShell
      title={<><AlertTriangle size={18} color="var(--red)" /> حذف موظف</>}
      onClose={closeModal}
      maxWidth={420}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Trash2 size={28} color="var(--red)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>هل أنت متأكد من الحذف؟</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>
          سيتم حذف بيانات الموظف نهائيًا:
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 10, padding: '14px 18px', margin: '16px 0 22px', textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{employee.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{employee.title} · {employee.dept} · {employee.branch}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold-light)', marginTop: 8 }}>{fmt(employee.salary)}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={closeModal}
            style={{ background: 'var(--bg-btn-ghost)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '10px 24px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            إلغاء
          </button>
          <button onClick={handleDelete} disabled={deleting}
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: 'var(--red)', padding: '10px 24px', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: deleting ? 0.7 : 1 }}>
            <Trash2 size={14} />
            {deleting ? 'جارٍ الحذف...' : 'تأكيد الحذف'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
