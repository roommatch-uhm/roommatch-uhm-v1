'use client';

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: number;
  senderId?: number | string;
  sender?: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: number;
  members: { id: number; firstName: string; image?: string; profileName?: string }[];
  messages: Message[];
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let lastDate = '';
  messages.forEach((msg) => {
    const msgDate = new Date(msg.timestamp).toLocaleDateString();
    if (msgDate !== lastDate) {
      groups.push({ date: msgDate, messages: [msg] });
      lastDate = msgDate;
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  });
  return groups;
}

function getOtherMember(chat: Chat | null, userId: number | undefined) {
  return chat?.members?.find((m) => String(m.id) !== String(userId));
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const rawUserId = (session?.user as { id?: number | string } | undefined)?.id;
  const userId: number | undefined =
    typeof rawUserId === 'number'
      ? rawUserId
      : rawUserId
      ? parseInt(String(rawUserId), 10)
      : undefined;
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [otherProfile, setOtherProfile] = useState<{ name: string; image?: string; profileName?: string } | null>(null);
  const [sidebarProfiles, setSidebarProfiles] = useState<Record<number, { name: string; image?: string; profileName?: string }>>({});

  const searchParams = useSearchParams();
  const chatIdParam = searchParams?.get('chatId');

  // Helper to fetch chats
  const fetchChats = () => {
    if (!userId) return;
    fetch('/api/chats', {
      headers: { 'x-user-id': String(userId) },
    })
      .then(res => res.json())
      .then(data => {
        setChats(data);
        if (data.length > 0 && chatIdParam) {
          const foundChat = data.find((chat: Chat) => String(chat.id) === String(chatIdParam));
          if (foundChat) {
            setActiveChat(foundChat);
            return;
          }
        }
        if (data.length > 0) {
          setActiveChat(data[0]);
        }
      });
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [userId, chatIdParam]);

  useEffect(() => {
    if (!activeChat || !userId) return;
    fetch(`/api/chats/${activeChat.id}/messages`, {
      headers: { 'x-user-id': String(userId) },
    })
      .then(res => res.json())
      .then(messages => {
        setActiveChat(chat => chat ? { ...chat, messages } : chat);
      });
  }, [activeChat?.id, userId]);

  // Fetch the profile for the other member whenever activeChat changes
  useEffect(() => {
    const otherMember = getOtherMember(activeChat, userId);
    if (otherMember) {
      // Fetch profile by userId (fixed route)
      fetch(`/api/profiles/by-user/${otherMember.id}`)
        .then(res => res.json())
        .then(profile => setOtherProfile(profile))
        .catch(() => setOtherProfile(null));
    } else {
      setOtherProfile(null);
    }
  }, [activeChat, userId]);

  // Fetch profiles for all sidebar chats whenever chats change
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles: Record<number, { name: string; image?: string; profileName?: string }> = {};
      for (const chat of chats) {
        const otherMember = getOtherMember(chat, userId);
        if (otherMember && !profiles[otherMember.id]) {
          try {
            // Fetch profile by userId (fixed route)
            const res = await fetch(`/api/profiles/by-user/${otherMember.id}`);
            if (res.ok) {
              const profile = await res.json();
              profiles[otherMember.id] = profile;
            }
          } catch {
            profiles[otherMember.id] = { name: otherMember.firstName || 'User' };
          }
        }
      }
      setSidebarProfiles(profiles);
    };
    if (chats.length > 0) fetchProfiles();
  }, [chats, userId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !userId) return;
    const content = newMessage.trim();
    if (!content) return;

    try {
      const res = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(userId),
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        console.error('Failed to send message', await res.text());
        return;
      }

      const createdMessage = await res.json();

      setActiveChat((chat) =>
        chat ? { ...chat, messages: [...(chat.messages || []), createdMessage] } : chat
      );

      setNewMessage('');
      fetchChats();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (status === 'loading') return <p className="text-center mt-5">Loading...</p>;
  if (!session) return <p className="text-center mt-5">Please sign in to view messages.</p>;

  return (
    <div className="container-fluid vh-100 bg-light p-0">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-3 border-end bg-white p-3 overflow-auto">
          <h4 className="fw-bold mb-4" style={{ color: '#000' }}>Chats</h4>
          {chats.map((chat) => {
            const otherMember = getOtherMember(chat, userId);
            const profile = otherMember ? sidebarProfiles[otherMember.id] : null;
            return (
              <div
                key={chat.id}
                className={`d-flex align-items-center p-2 rounded-3 mb-2 ${
                  activeChat && chat.id === activeChat.id ? 'bg-primary text-white' : 'bg-white'
                }`}
                onClick={() => setActiveChat(chat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveChat(chat);
                  }
                }}
                style={{ cursor: 'pointer', transition: '0.2s' }}
              >
                <Image
                  src={profile?.image || otherMember?.image || '/default-avatar.png'}
                  alt={
                    profile?.profileName ||
                    profile?.name ||
                    otherMember?.profileName ||
                    otherMember?.firstName ||
                    'User'
                  }
                  width={45}
                  height={45}
                  className="rounded-circle me-3 object-fit-cover"
                />
                <div>
                  <strong>
                    {profile?.profileName ||
                      profile?.name ||
                      otherMember?.profileName ||
                      otherMember?.firstName ||
                      'User'}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat window */}
        <div className="col-md-9 d-flex flex-column p-0">
          {/* Header */}
          {activeChat && (
            <div className="d-flex align-items-center bg-white border-bottom p-3 shadow-sm">
              <Image
                src={
                  otherProfile?.image ||
                  getOtherMember(activeChat, userId)?.image ||
                  '/default-avatar.png'
                }
                alt={
                  otherProfile?.profileName ||
                  otherProfile?.name ||
                  getOtherMember(activeChat, userId)?.profileName ||
                  getOtherMember(activeChat, userId)?.firstName ||
                  'User'
                }
                width={50}
                height={50}
                className="rounded-circle me-3 object-fit-cover"
              />
              <h5 className="fw-semibold mb-0">
                {otherProfile?.profileName ||
                  otherProfile?.name ||
                  getOtherMember(activeChat, userId)?.profileName ||
                  getOtherMember(activeChat, userId)?.firstName ||
                  'User'}
              </h5>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-grow-1 p-4 overflow-auto"
            style={{ backgroundColor: '#f0f4fa' }}
          >
            {groupMessagesByDate(activeChat?.messages ?? []).map((group) => (
              <React.Fragment key={group.date}>
                <div className="text-center text-muted my-3 fw-semibold" style={{ fontSize: '0.95rem' }}>
                  {group.date}
                </div>
                {group.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mb-3 ${String(m.senderId) === String(userId) ? 'text-end' : 'text-start'}`}
                  >
                    <div
                      className={`d-inline-block p-2 px-3 rounded-3 ${
                        String(m.senderId) === String(userId)
                          ? 'bg-primary text-white'
                          : 'bg-white border'
                      }`}
                    >
                      {m.content}
                    </div>
                    <div className="small text-muted mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-top bg-white p-3">
            <form onSubmit={sendMessage} className="d-flex gap-2">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder={`Message ${
                  otherProfile?.profileName ||
                  otherProfile?.name ||
                  getOtherMember(activeChat, userId)?.profileName ||
                  getOtherMember(activeChat, userId)?.firstName ||
                  'User'
                }...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!activeChat}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
                disabled={!activeChat}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
