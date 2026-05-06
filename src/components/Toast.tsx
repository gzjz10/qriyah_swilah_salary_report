'use client';

import { CheckCircle2 } from 'lucide-react';
import { useEmployees } from '@/context/EmployeeContext';

export default function Toast() {
  const { toast } = useEmployees();
  return (
    <div role="status" aria-live="polite"
      style={{ position:'fixed', bottom:28, left:'50%', transform:`translateX(-50%) translateY(${toast.visible ? '0' : '100px'})`, opacity: toast.visible ? 1 : 0, transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease', background:'var(--bg-modal)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(34,197,94,0.35)', borderRadius:14, padding:'11px 22px', fontSize:13, fontWeight:700, color:'var(--green)', display:'flex', alignItems:'center', gap:9, boxShadow:'var(--shadow-lg), 0 0 20px rgba(34,197,94,0.15)', zIndex:9999, whiteSpace:'nowrap', pointerEvents:'none' }}>
      <CheckCircle2 size={16} strokeWidth={2.5} />
      {toast.message}
    </div>
  );
}
