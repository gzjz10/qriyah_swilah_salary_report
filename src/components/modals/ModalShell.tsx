'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props { title: React.ReactNode; onClose: () => void; children: React.ReactNode; maxWidth?: number; }

export default function ModalShell({ title, onClose, children, maxWidth = 680 }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="animate-fade-in" role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'var(--bg-overlay)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div className="animate-scale-in"
        style={{ background:'var(--bg-modal)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'var(--shadow-lg)' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,rgba(245,166,35,0.05),transparent)', flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:800, color:'var(--amber-light)', display:'flex', alignItems:'center', gap:10 }}>
            {title}
          </div>
          <button aria-label="إغلاق" onClick={onClose}
            style={{ width:34, height:34, background:'var(--bg-btn-ghost)', border:'1px solid var(--border-subtle)', borderRadius:9, color:'var(--text3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--transition)', flexShrink:0 }}
            onMouseEnter={(e) => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.35)'; e.currentTarget.style.color='var(--red)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background='var(--bg-btn-ghost)'; e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text3)'; }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px 24px' }}>{children}</div>
      </div>
    </div>
  );
}
