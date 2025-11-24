'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css'

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  photo: string;
  messages: Message[];
}

export default function MessagesPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p className="text-center mt-5">Loading...</p>;
  if (!session) redirect('/auth/signin');

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Grace Liu',
      photo: '/images/grace.png',
      messages: [
        { id: 1, sender: 'Grace', text: 'Hey! Want to meet later?', time: '9:00 AM' },
        { id: 2, sender: 'You', text: 'Sure! Does 2pm work?', time: '9:05 AM' },
      ],
    },
    {
      id: 2,
      name: 'Jamie Fleming',
      photo: '/images/jamie.png',
      messages: [
        { id: 1, sender: 'Jamie', text: 'Hi! Are you still looking for a roommate?', time: '10:10 AM' },
        { id: 2, sender: 'You', text: 'Yes, still looking :)', time: '10:12 AM' },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<Chat>(chats[0]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: activeChat.messages.length + 1,
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedChats = chats.map((chat) => (
      chat.id === activeChat.id
        ? { ...chat, messages: [...chat.messages, newMsg] }
        : chat
    ));

    setChats(updatedChats);
    setActiveChat({ ...activeChat, messages: [...activeChat.messages, newMsg] });
    setNewMessage('');
  };

  return (
    <div className="container-fluid vh-100 bg-light p-0">
      <div className="row h-100">

        {/* Sidebar */}
        <div className="col-md-3 border-end bg-white p-3 overflow-auto">
          <h4 className="fw-bold mb-4" style={{ color: '#000' }}>Chats</h4>

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`d-flex align-items-center p-2 rounded-3 mb-2 ${
                chat.id === activeChat.id ? 'bg-primary text-white' : 'bg-white'
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
                src={chat.photo}
                alt={chat.name}
                width={45}
                height={45}
                className="rounded-circle me-3 object-fit-cover"
              />
              <div>
                <strong>{chat.name}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div className="col-md-9 d-flex flex-column p-0">

          {/* Header */}
          <div className="d-flex align-items-center bg-white border-bottom p-3 shadow-sm">
            <Image
              src={activeChat.photo}
              alt={activeChat.name}
              width={50}
              height={50}
              className="rounded-circle me-3 object-fit-cover"
            />
            <h5 className="fw-semibold mb-0">{activeChat.name}</h5>
          </div>

          {/* Messages */}
          <div
            className="flex-grow-1 p-4 overflow-auto"
            style={{ backgroundColor: '#f0f4fa' }}
          >
            {activeChat.messages.map((m) => (
              <div
                key={m.id}
                className={`mb-3 ${m.sender === 'You' ? 'text-end' : 'text-start'}`}
              >
                <div
                  className={`d-inline-block p-2 px-3 rounded-3 ${
                    m.sender === 'You'
                      ? 'bg-primary text-white'
                      : 'bg-white border'
                  }`}
                >
                  {m.text}
                </div>
                <div className="small text-muted mt-1">{m.time}</div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-top bg-white p-3">
            <form onSubmit={sendMessage} className="d-flex gap-2">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder={`Message ${activeChat.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
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
