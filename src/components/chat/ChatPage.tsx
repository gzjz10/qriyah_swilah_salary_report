'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatHeader from './ChatHeader';
import WelcomeScreen from './WelcomeScreen';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';
  const hasMessages = messages.length > 0;

  const handleSend = (text: string) => {
    if (!text.trim() || isStreaming) return;
    sendMessage({ text });
    setInput('');
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
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

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        disabled={isStreaming}
      />
    </div>
  );
}
