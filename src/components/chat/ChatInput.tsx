'use client';

import { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  input: string;
  setInput: (v: string) => void;
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ input, setInput, onSend, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) onSend(input.trim());
    }
  };

  const canSend = !disabled && input.trim().length > 0;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      padding: '16px 16px 28px',
      background: 'linear-gradient(to top, var(--bg-body) 65%, transparent)',
      zIndex: 40,
    }}>
      <div style={{ maxWidth: 768, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: '10px 10px 10px 14px',
          boxShadow: 'var(--shadow-lg)',
          transition: 'border-color 0.2s',
        }}
          onFocus={(e) => {
            const t = e.currentTarget;
            t.style.borderColor = 'rgba(245,166,35,0.45)';
          }}
          onBlur={(e) => {
            const t = e.currentTarget;
            t.style.borderColor = 'var(--border)';
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اسأل عن بيانات الرواتب والموظفين..."
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--text)',
              fontFamily: 'inherit',
              fontSize: 15,
              lineHeight: 1.65,
              padding: '6px 4px',
              minHeight: 28,
              maxHeight: 140,
              direction: 'rtl',
              overflowY: 'auto',
            }}
          />
          <button
            onClick={() => { if (canSend) onSend(input.trim()); }}
            disabled={!canSend}
            aria-label="إرسال"
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: canSend
                ? 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))'
                : 'var(--bg-btn-ghost)',
              border: canSend ? 'none' : '1px solid var(--border-subtle)',
              color: canSend ? '#fff' : 'var(--text3)',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: canSend ? '0 4px 16px rgba(245,166,35,0.38)' : 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,166,35,0.55)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = canSend ? '0 4px 16px rgba(245,166,35,0.38)' : 'none';
            }}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text3)' }}>
          Enter للإرسال · Shift+Enter لسطر جديد
        </div>
      </div>
    </div>
  );
}
