'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, clearUser } from '@/lib/auth';
import { User, ChatMessage, ROLE_COLLECTIONS } from '@/lib/types';
import { generateBotMessageFromApi } from '@/lib/medibot';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import Header from '@/components/Header';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.push('/');
    } else {
      setUser(storedUser);
      setInitialized(true);
    }
  }, [router]);

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    const trimmed = content.trim();

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const botMessage = await generateBotMessageFromApi(trimmed, user);
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot-error`,
        sender: 'bot',
        content: `Error: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: new Date(),
        citations: [],
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  if (!initialized || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header user={user} onLogout={handleLogout} />
      <div className="chat-container" style={{ flex: 1 }}>
        <Sidebar user={user} collections={ROLE_COLLECTIONS[user.role]} />
        <ChatArea messages={messages} onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}
