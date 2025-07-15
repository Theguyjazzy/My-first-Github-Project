"use client";

import React, { useEffect, useState } from 'react';

interface Submission {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const AUTH_KEY = 'admin_authed';

export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check localStorage for session
    if (typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY) === 'true') {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/contact/list')
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      });
  }, [authed]);

  const handleDelete = async (index: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this submission?');
    if (!confirmed) return;
    const res = await fetch('/api/contact/list', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });
    if (res.ok) {
      setSubmissions((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert('Failed to delete submission.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, 'true');
      }
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setPassword('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
    // Optionally, clear the cookie by calling a logout API route
  };

  if (!authed) {
    return (
      <div className="max-w-xs mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="border rounded p-2"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition" type="submit">
            Login
          </button>
        </form>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>
        <button
          className="bg-gray-300 text-gray-800 rounded px-3 py-1 text-xs hover:bg-gray-400 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="w-full border-collapse border mt-4">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Timestamp</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.email}</td>
                <td className="border p-2">{s.message}</td>
                <td className="border p-2 text-xs">{s.timestamp}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700 transition"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 