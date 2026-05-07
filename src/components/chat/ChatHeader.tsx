'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Trash2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  onClear: () => void;
  hasMessages: boolean;
}

export default function ChatHeader({ onClear, hasMessages }: Props) {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: 60,
      background: 'var(--bg-header)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: isLight
        ? '0 2px 16px rgba(0,0,0,0.08)'
        : '0 4px 24px rgba(0,0,0,0.45)',
      flexShrink: 0,
    }}>
      {/* Right: back to dashboard */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: 7,
        color: 'var(--text2)',
        textDecoration: 'none',
        fontSize: 13, fontWeight: 700,
        padding: '7px 13px',
        borderRadius: 10,
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-btn-ghost)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(61,200,213,0.10)';
          e.currentTarget.style.borderColor = 'rgba(61,200,213,0.32)';
          e.currentTarget.style.color = 'var(--teal-light)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-btn-ghost)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text2)';
        }}
      >
        <ArrowLeft size={14} strokeWidth={2.2} />
        لوحة التحكم
      </Link>

      {/* Center: title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Sparkles size={16} color="var(--amber-light)" strokeWidth={2.2} />
        <span style={{
          fontSize: 16, fontWeight: 900,
          background: 'linear-gradient(135deg, var(--amber-bright), var(--teal-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          المستشار الذكي
        </span>
      </div>

      {/* Left: actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onClear}
          disabled={!hasMessages}
          aria-label="مسح المحادثة"
          title="مسح المحادثة"
          style={{
            background: 'var(--bg-btn-ghost)',
            border: '1px solid var(--border-subtle)',
            color: hasMessages ? 'var(--text3)' : 'var(--text3)',
            padding: '7px 12px',
            borderRadius: 10,
            cursor: hasMessages ? 'pointer' : 'not-allowed',
            opacity: hasMessages ? 1 : 0.4,
            display: 'flex', alignItems: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (hasMessages) {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
              e.currentTarget.style.color = 'var(--red)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-btn-ghost)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text3)';
          }}
        >
          <Trash2 size={14} strokeWidth={2.2} />
        </button>

        <button
          onClick={toggle}
          aria-label={isLight ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
          style={{
            background: isLight ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isLight ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.12)'}`,
            color: isLight ? 'var(--amber)' : '#c8d4f0',
            padding: '7px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = isLight ? 'rgba(245,166,35,0.22)' : 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = isLight ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.06)'; }}
        >
          {isLight ? <Moon size={14} strokeWidth={2.2} /> : <Sun size={14} strokeWidth={2.2} />}
          {isLight ? 'داكن' : 'فاتح'}
        </button>
      </div>
    </header>
  );
}
