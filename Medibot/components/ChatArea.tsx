'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/lib/types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  loading: boolean;
}

export default function ChatArea({ messages, onSendMessage, loading }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#999',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '18px' }}>👋 Welcome to MediBot</div>
            <div style={{ fontSize: '14px' }}>Start by asking a medical-related question</div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-bubble" style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ animation: 'bounce 1.4s infinite' }}>.</span>
                  <span style={{ animation: 'bounce 1.4s infinite 0.2s' }}>.</span>
                  <span style={{ animation: 'bounce 1.4s infinite 0.4s' }}>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput onSendMessage={onSendMessage} disabled={loading} />
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.5; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
