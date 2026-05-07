'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import ChatHeader from './ChatHeader';
import WelcomeScreen from './WelcomeScreen';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const STORAGE_KEY = 'qriyah-chat-history';

function loadSavedMessages(): UIMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const initialMessages = useRef(loadSavedMessages());

  const { messages, sendMessage, setMessages, status, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: initialMessages.current,
    onError: (err) => {
      setErrorMsg(err.message || 'حدث خطأ أثناء المعالجة. حاول مجدداً.');
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch { /* quota exceeded — ignore */ }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages]);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const hasMessages = messages.length > 0;

  const handleSend = (text: string) => {
    if (!text.trim() || isStreaming) return;
    if (error) clearError();
    setErrorMsg('');
    sendMessage({ text });
    setInput('');
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
    setErrorMsg('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ChatHeader onClear={handleClear} hasMessages={hasMessages} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
        {hasMessages ? (
          <MessageList messages={messages} isStreaming={isStreaming} />
        ) : (
          <WelcomeScreen onSelect={handleSend} />
        )}
      </div>

      {errorMsg && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
          color: 'var(--red, #ef4444)', padding: '10px 20px', borderRadius: 12,
          fontSize: 13, fontWeight: 600, zIndex: 50, maxWidth: 500, textAlign: 'center',
          backdropFilter: 'blur(12px)', direction: 'rtl',
        }}>
          {errorMsg}
        </div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        disabled={isStreaming}
      />
    </div>
  );
}
