'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import MessageBubble from './MessageBubble';

interface Props {
  messages: UIMessage[];
  isStreaming: boolean;
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, gap: 6, alignItems: 'flex-end' }}>
      <div style={{
        padding: '14px 20px',
        borderRadius: '18px 18px 4px 18px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border2)',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`typing-dot stagger-${i + 1}`}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--amber-light)',
              animation: 'dotPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MessageList({ messages, isStreaming }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const lastIsUser = messages.length > 0 && messages[messages.length - 1].role === 'user';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 16px 140px' }}>
      <div style={{ maxWidth: 768, margin: '0 auto', width: '100%' }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && lastIsUser && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  );
}
