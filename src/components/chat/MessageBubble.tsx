'use client';

import type { UIMessage } from 'ai';
import { Sparkles } from 'lucide-react';

interface Props {
  message: UIMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  const text = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('');

  if (!text) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-start' : 'flex-end',
        marginBottom: 20,
        gap: 6,
      }}
    >
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(245,166,35,0.35)',
            flexShrink: 0,
          }}>
            <Sparkles size={13} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>المستشار الذكي</span>
        </div>
      )}

      <div style={{
        maxWidth: '78%',
        padding: '14px 18px',
        borderRadius: isUser ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
        background: isUser
          ? 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))'
          : 'var(--bg-glass)',
        backdropFilter: isUser ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isUser ? 'none' : 'blur(12px)',
        border: isUser ? 'none' : '1px solid var(--border2)',
        color: isUser ? '#fff' : 'var(--text)',
        fontSize: 14,
        lineHeight: 1.85,
        boxShadow: isUser
          ? '0 4px 16px rgba(245,166,35,0.28)'
          : '0 2px 12px rgba(0,0,0,0.18)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {text}
      </div>

      {isUser && (
        <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>أنت</span>
      )}
    </div>
  );
}
