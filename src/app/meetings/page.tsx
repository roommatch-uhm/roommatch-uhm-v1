'use client';


import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  date: string;
  time: string;
  title: string;
}

export default function MeetingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p className="text-center mt-5">Loading...</p>;
  if (!session) redirect('/auth/signin');
  
  const [value, setValue] = useState<Value>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([
    { date: '2025-11-21', time: '10:00', title: 'Coffee chat with Jamie @ Campus Center' },
    { date: '2025-11-26', time: '14:00', title: 'Meeting with Grace @ Hamilton Library' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newMeeting, setNewMeeting] = useState<Meeting>({
    title: '',
    date: '',
    time: '',
  });

  // Calendar highlight logic
  const meetingDates = meetings.map((m) => m.date);
  const isMeetingDate = (date: Date) => meetingDates.includes(date.toISOString().split('T')[0]);

  const selectedDateValue = Array.isArray(value) ? value[0] : value ?? new Date();
  const selectedDate = selectedDateValue instanceof Date ? selectedDateValue : new Date();

  const selectedMeetings = meetings.filter(
    (m) => m.date === selectedDate.toISOString().split('T')[0],
  );

  // Add / Edit / Delete handlers
  const handleAddOrEditMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return;

    if (editingIndex !== null) {
      const updated = [...meetings];
      updated[editingIndex] = newMeeting;
      setMeetings(updated);
      setEditingIndex(null);
    } else {
      setMeetings([...meetings, newMeeting]);
    }

    setNewMeeting({ title: '', date: '', time: '' });
    setShowForm(false);
  };

  const handleDeleteMeeting = (index: number) => setMeetings(meetings.filter((_, i) => i !== index));

  const handleEditMeeting = (index: number) => {
    setNewMeeting(meetings[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  return (
    <div className="container-fluid min-vh-100 py-5 meetings-page bg-light">
      <div className="text-center mb-5">
        <h2 className="fw-bold page-title text-dark">My Meetings</h2>
        <p className="text-muted page-subtitle">
          Stay organized and easily manage your meetings.
        </p>
      </div>

      {/* Centered Calendar */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="calendar-container bg-white p-4 rounded-4 shadow-sm">
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={({ date }: { date: Date }) => (isMeetingDate(date) ? 'meeting-day' : '')}
          />
        </div>
      </div>

      {/* Meeting List */}
      <div className="text-center">
        <h5 className="fw-semibold mb-3">{selectedDate.toDateString()}</h5>

        {selectedMeetings.length > 0 ? (
          selectedMeetings.map((m) => (
            <div
              key={`${m.date}-${m.time}-${m.title}`}
              className="meeting-card mx-auto mb-3 p-3 rounded-3 shadow-sm bg-white"
              style={{ maxWidth: '500px' }}
            >
              <h6 className="fw-semibold mb-1">{m.title}</h6>
              <p className="text-muted mb-2">
                {m.date}
                <br />
                {m.time}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleEditMeeting(meetings.indexOf(m))}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteMeeting(meetings.indexOf(m))}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No meetings scheduled for this date.</p>
        )}

        {/* Add Meeting Button */}
        <button
          type="button"
          className="btn btn-coral mt-3 px-4"
          onClick={() => {
            setShowForm(!showForm);
            setEditingIndex(null);
            setNewMeeting({ title: '', date: '', time: '' });
          }}
        >
          {showForm ? 'Cancel' : '➕ Add New Meeting'}
        </button>

        {/* Add/Edit Form */}
        {showForm && (
          <form
            onSubmit={handleAddOrEditMeeting}
            className="mt-4 d-flex flex-column align-items-center"
          >
            <input
              type="date"
              className="form-control mb-2"
              style={{ width: '250px' }}
              value={newMeeting.date}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            />
            <input
              type="time"
              className="form-control mb-2"
              style={{ width: '250px' }}
              value={newMeeting.time}
              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              style={{ width: '250px' }}
              placeholder="Enter meeting title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            />
            <button type="submit" className="btn btn-coral mt-2 px-4">
              {editingIndex !== null ? 'Update Meeting' : 'Save Meeting'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
