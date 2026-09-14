'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Briefcase,
  Star,
  CheckCircle,
  Tag,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Matter, PracticeArea, MatterPriority, MatterStatus, Subtask } from '@/types';
import { PRACTICE_AREAS, DEFAULT_SUPERVISORS } from '@/lib/constants';

interface MatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (matter: Matter) => void;
  initialMatter?: Matter | null;
}

export const MatterModal: React.FC<MatterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMatter,
}) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState<MatterPriority>('Medium');
  const [status, setStatus] = useState<MatterStatus>('Ongoing');
  const [practiceArea, setPracticeArea] = useState<PracticeArea>('Corporate');
  const [matterTitle, setMatterTitle] = useState('');
  const [clientReference, setClientReference] = useState('');
  const [supervisingLawyer, setSupervisingLawyer] = useState(DEFAULT_SUPERVISORS[0]);
  const [deadline, setDeadline] = useState('');
  const [timeSpentHours, setTimeSpentHours] = useState('2.5');
  const [activitiesDone, setActivitiesDone] = useState('');
  const [skillsLawsInvolved, setSkillsLawsInvolved] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [followUpSteps, setFollowUpSteps] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [confidenceRating, setConfidenceRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);

  // New subtask inputs
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('');

  // Form error
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialMatter) {
      setDate(initialMatter.date || new Date().toISOString().slice(0, 10));
      setPriority(initialMatter.priority || 'Medium');
      setStatus(initialMatter.status || 'Ongoing');
      setPracticeArea(initialMatter.practiceArea || 'Corporate');
      setMatterTitle(initialMatter.matterTitle || '');
      setClientReference(initialMatter.clientReference || '');
      setSupervisingLawyer(initialMatter.supervisingLawyer || DEFAULT_SUPERVISORS[0]);
      setDeadline(initialMatter.deadline || '');
      setTimeSpentHours(String(initialMatter.timeSpentHours || 0));
      setActivitiesDone(initialMatter.activitiesDone || '');
      setSkillsLawsInvolved(initialMatter.skillsLawsInvolved || '');
      setLessonsLearned(initialMatter.lessonsLearned || '');
      setFollowUpSteps(initialMatter.followUpSteps || '');
      setSubtasks(initialMatter.subtasks ? [...initialMatter.subtasks] : []);
      setConfidenceRating(initialMatter.confidenceRating || 3);
    } else {
      // New matter defaults
      setDate(new Date().toISOString().slice(0, 10));
      setPriority('Medium');
      setStatus('Ongoing');
      setPracticeArea('Corporate');
      setMatterTitle('');
      setClientReference(`Client · MLA/CORP/${Math.floor(100 + Math.random() * 900)}/2026`);
      setSupervisingLawyer(DEFAULT_SUPERVISORS[0]);
      setDeadline('');
      setTimeSpentHours('2.5');
      setActivitiesDone('');
      setSkillsLawsInvolved('');
      setLessonsLearned('');
      setFollowUpSteps('');
      setSubtasks([]);
      setConfidenceRating(3);
    }
    setError('');
  }, [initialMatter, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newTask: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
      dueDate: newSubtaskDueDate || deadline || undefined,
      priority: priority,
    };
    setSubtasks([...subtasks, newTask]);
    setNewSubtaskTitle('');
    setNewSubtaskDueDate('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matterTitle.trim()) {
      setError('Please provide a matter title.');
      return;
    }
    if (!clientReference.trim()) {
      setError('Please enter a client reference code.');
      return;
    }

    const matterData: Matter = {
      id: initialMatter?.id || `mla-m-${Date.now()}`,
      date,
      priority,
      status,
      practiceArea,
      matterTitle: matterTitle.trim(),
      clientReference: clientReference.trim(),
      supervisingLawyer: supervisingLawyer.trim(),
      deadline: deadline || undefined,
      timeSpentHours: parseFloat(timeSpentHours) || 0,
      activitiesDone: activitiesDone.trim(),
      skillsLawsInvolved: skillsLawsInvolved.trim(),
      lessonsLearned: lessonsLearned.trim(),
      followUpSteps: followUpSteps.trim() || undefined,
      subtasks,
      confidenceRating,
      createdAt: initialMatter?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (status === 'Completed' || confidenceRating === 5) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3CF65', '#3B82F6', '#10B981'],
        });
      } catch {
        // Confetti optional
      }
    }

    onSave(matterData);
    onClose();
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1:
        return 'Novice (Required direct line-by-line supervision)';
      case 2:
        return 'Developing (Understood issues; required revision)';
      case 3:
        return 'Competent (Solid draft, minor partner feedback)';
      case 4:
        return 'Proficient (Client-ready, high strategic quality)';
      case 5:
        return 'Senior Ready (Autonomous, partner-level execution)';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', height: '92vh' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.5rem',
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
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={18} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {initialMatter ? 'Edit Matter Journal Entry' : 'Log New MLA Practice Matter'}
              </h2>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Mehrteab & Getu Advocates LLP · Associate Competency System
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {error && (
            <div
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Matter Identification & Classification */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.5)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              1. Classification & Firm References
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Practice Area (MLA 8) *
                </label>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value as PracticeArea)}
                  className="select-field"
                  required
                >
                  {PRACTICE_AREAS.map((pa) => (
                    <option key={pa.code} value={pa.name}>
                      {pa.name} ({pa.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Current Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MatterStatus)}
                  className="select-field"
                  required
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending Review / Filing</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Priority Level
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['Low', 'Medium', 'High'] as MatterPriority[]).map((p) => {
                    const isSelected = priority === p;
                    let activeBg = '#94A3B8';
                    if (p === 'High') activeBg = '#EF4444';
                    if (p === 'Medium') activeBg = '#F59E0B';

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          flex: 1,
                          padding: '0.45rem',
                          borderRadius: '6px',
                          border: isSelected ? `1px solid ${activeBg}` : '1px solid var(--border-medium)',
                          background: isSelected ? `${activeBg}22` : 'rgba(10, 18, 38, 0.6)',
                          color: isSelected ? '#FFFFFF' : '#94A3B8',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Matter Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Matter Title / Assignment Name *
              </label>
              <input
                type="text"
                value={matterTitle}
                onChange={(e) => setMatterTitle(e.target.value)}
                placeholder="e.g. Legal Due Diligence for Renewable Energy EPC Contractor"
                className="input-field"
                required
              />
            </div>

            {/* Client Ref & Supervisor */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Anonymized Client Reference *
                </label>
                <input
                  type="text"
                  value={clientReference}
                  onChange={(e) => setClientReference(e.target.value)}
                  placeholder="e.g. Client · MLA/CORP/042/2026"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Supervising Partner / Lawyer
                </label>
                <input
                  type="text"
                  value={supervisingLawyer}
                  onChange={(e) => setSupervisingLawyer(e.target.value)}
                  placeholder="e.g. Mehrteab Leul (Managing Partner)"
                  className="input-field"
                  list="supervisors-list"
                />
                <datalist id="supervisors-list">
                  {DEFAULT_SUPERVISORS.map((s, idx) => (
                    <option key={idx} value={s} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Date, Deadline & Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Entry Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Matter Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  Billable Hours (hrs)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={timeSpentHours}
                  onChange={(e) => setTimeSpentHours(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Practical Experience & Legal Analysis */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.5)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              2. Activities, Legal Citations & Lessons Learned
            </div>

            {/* Activities Undertaken */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Activities Undertaken (Work Performed)
              </label>
              <textarea
                rows={3}
                value={activitiesDone}
                onChange={(e) => setActivitiesDone(e.target.value)}
                placeholder="Drafted legal memorandum, conducted Land Administration inquiry at Addis Ababa Land Management Bureau, reviewed joint venture shareholders agreement..."
                className="textarea-field"
              />
            </div>

            {/* Skills & Laws Involved */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Skills & Laws Involved (Separate with semicolons)
              </label>
              <input
                type="text"
                value={skillsLawsInvolved}
                onChange={(e) => setSkillsLawsInvolved(e.target.value)}
                placeholder="e.g. Commercial Code Procl. 1243/2021; Investment Proclamation 1180/2020; FIDIC Red Book"
                className="input-field"
              />
            </div>

            {/* Lessons Learned / Key Takeaway */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600 }}>
                  Personal Lessons Learned / Practical Takeaway
                </label>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Feeds into firm Knowledge Base</span>
              </div>
              <textarea
                rows={3}
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="Key substantive or procedural takeaway (e.g. Under Ethiopian law, foreign debt registration with NBE must precede repayment repatriation...)"
                className="textarea-field"
                style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
              />
            </div>

            {/* Follow-up steps */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                Follow-Up Steps / Next Action
              </label>
              <input
                type="text"
                value={followUpSteps}
                onChange={(e) => setFollowUpSteps(e.target.value)}
                placeholder="e.g. Follow up with Ministry of Mines Licensing Directorate on Thursday"
                className="input-field"
              />
            </div>
          </div>

          {/* Section 3: Subtasks & Action Items (2-way synced) */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.5)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                3. Matter Sub-Tasks & Action Items
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                Syncs with Daily To-Do list
              </span>
            </div>

            {/* Add Subtask row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Add sub-task or milestone item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="input-field"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <input
                type="date"
                value={newSubtaskDueDate}
                onChange={(e) => setNewSubtaskDueDate(e.target.value)}
                className="input-field"
                style={{ width: '140px' }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Subtasks checklist */}
            {subtasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      background: st.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(10, 18, 38, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div
                      onClick={() => handleToggleSubtask(st.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                      <span
                        style={{
                          fontSize: '0.825rem',
                          color: st.completed ? '#64748B' : '#F8FAFC',
                          textDecoration: st.completed ? 'line-through' : 'none',
                        }}
                      >
                        {st.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {st.dueDate && (
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                          Due {st.dueDate}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#F87171',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        aria-label="Remove subtask"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic' }}>
                No subtasks added yet. Break this matter into actionable items.
              </div>
            )}
          </div>

          {/* Section 4: Confidence & Mastery Rating */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.5)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              4. Competency & Confidence Self-Rating
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((val) => {
                const isHoveredOrActive = (hoverRating || confidenceRating) >= val;
                return (
                  <button
                    key={val}
                    type="button"
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setConfidenceRating(val)}
                    aria-label={`Rate confidence ${val} stars`}
                  >
                    <Star
                      size={24}
                      color={isHoveredOrActive ? '#F59E0B' : '#475569'}
                      fill={isHoveredOrActive ? '#F59E0B' : 'transparent'}
                    />
                  </button>
                );
              })}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F59E0B', marginLeft: '0.5rem' }}>
                {hoverRating || confidenceRating} / 5
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', fontStyle: 'italic' }}>
              {getRatingLabel(hoverRating || confidenceRating)}
            </div>
          </div>

          {/* Modal Footer actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle size={16} />
              <span>{initialMatter ? 'Save Changes' : 'Log Matter Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
