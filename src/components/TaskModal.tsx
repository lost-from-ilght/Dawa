'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Calendar, AlertCircle } from 'lucide-react';
import { DailyTask, Matter, MatterPriority } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: DailyTask) => void;
  matters: Matter[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  matters,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<MatterPriority>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [associatedMatterId, setAssociatedMatterId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task description cannot be empty.');
      return;
    }

    const matchedMatter = matters.find((m) => m.id === associatedMatterId);
    const subtaskId = matchedMatter ? `st-${Date.now()}` : undefined;

    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      completed: false,
      isMatterSubtask: Boolean(matchedMatter),
      matterId: matchedMatter?.id,
      matterTitle: matchedMatter?.matterTitle,
      clientReference: matchedMatter?.clientReference,
      subtaskId,
      createdAt: new Date().toISOString(),
    };

    onSave(newTask);
    setTitle('');
    setAssociatedMatterId('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 16, 34, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckSquare size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F8FAFC' }}>
                New Daily To-Do Task
              </h2>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Associate Daily Action Items & Follow-ups
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {error && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Task Description *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Call client CFO to verify tax assessment receipt date..."
              className="input-field"
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MatterPriority)}
                className="select-field"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Standard Priority</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Associate with Existing Matter (Optional)
            </label>
            <select
              value={associatedMatterId}
              onChange={(e) => setAssociatedMatterId(e.target.value)}
              className="select-field"
            >
              <option value="">-- Standalone Personal Task --</option>
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.clientReference} · {m.matterTitle.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              marginTop: '0.5rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
