'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Star,
  CheckCircle,
  Circle,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Tag,
  BookOpen,
  Share2,
} from 'lucide-react';
import { Matter, Subtask } from '@/types';
import { PRACTICE_AREAS, STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';

interface MatterCardProps {
  matter: Matter;
  onEdit: (matter: Matter) => void;
  onDelete: (id: string) => void;
  onDuplicate: (matter: Matter) => void;
  onToggleSubtask: (matterId: string, subtaskId: string) => void;
  onCopyLesson: (text: string) => void;
}

export const MatterCard: React.FC<MatterCardProps> = ({
  matter,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleSubtask,
  onCopyLesson,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const practiceAreaInfo = PRACTICE_AREAS.find((p) => p.name === matter.practiceArea);
  const statusInfo = STATUS_CONFIG[matter.status] || STATUS_CONFIG.Ongoing;
  const priorityInfo = PRIORITY_CONFIG[matter.priority] || PRIORITY_CONFIG.Medium;

  const totalSubtasks = matter.subtasks?.length || 0;
  const completedSubtasks = matter.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Split skills/laws tags
  const lawsTags = matter.skillsLawsInvolved
    ? matter.skillsLawsInvolved
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <article
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top Header: Badges & Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          {/* Practice Area Badge */}
          <span
            className="badge"
            style={{
              background: practiceAreaInfo ? `${practiceAreaInfo.color}1c` : 'rgba(255,255,255,0.1)',
              color: practiceAreaInfo?.color || '#CBD5E1',
              border: practiceAreaInfo ? `1px solid ${practiceAreaInfo.color}44` : '1px solid var(--border-subtle)',
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: practiceAreaInfo?.color || '#CBD5E1',
              }}
            />
            {matter.practiceArea}
          </span>

          {/* Status Badge */}
          <span
            className="badge"
            style={{
              background: statusInfo.bg,
              color: statusInfo.color,
              border: `1px solid ${statusInfo.border}`,
            }}
          >
            {statusInfo.label}
          </span>

          {/* Priority Badge */}
          <span
            className="badge"
            style={{
              background: priorityInfo.bg,
              color: priorityInfo.color,
              border: `1px solid ${priorityInfo.border}`,
            }}
          >
            {priorityInfo.label}
          </span>
        </div>

        {/* Date & Deadline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.75rem',
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            <span>{matter.date}</span>
          </div>
          {matter.deadline && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: matter.deadline < new Date().toISOString().slice(0, 10) && matter.status !== 'Completed'
                  ? '#F87171'
                  : '#CBD5E1',
                fontWeight: matter.deadline < new Date().toISOString().slice(0, 10) ? 600 : 400,
              }}
            >
              <Clock size={13} />
              <span>Due: {matter.deadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Matter Title & Client Details */}
      <div>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#F8FAFC',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.35,
            marginBottom: '0.35rem',
          }}
        >
          {matter.matterTitle}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ color: '#D4AF37', fontWeight: 600 }}>{matter.clientReference}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <User size={13} color="#94A3B8" />
            <span>Supv: <strong style={{ color: '#CBD5E1' }}>{matter.supervisingLawyer}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} color="#60A5FA" />
            <span><strong style={{ color: '#F8FAFC' }}>{matter.timeSpentHours}</strong> hrs logged</span>
          </div>

          {/* Star Rating Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title={`Confidence: ${matter.confidenceRating} of 5`}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={13}
                color={s <= matter.confidenceRating ? '#F59E0B' : '#475569'}
                fill={s <= matter.confidenceRating ? '#F59E0B' : 'transparent'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Activities Undertaken */}
      {matter.activitiesDone && (
        <div
          style={{
            fontSize: '0.84rem',
            color: '#CBD5E1',
            lineHeight: 1.5,
            background: 'rgba(10, 16, 34, 0.4)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, marginBottom: '0.2rem' }}>
            Activities Undertaken
          </div>
          <p>{matter.activitiesDone}</p>
        </div>
      )}

      {/* Laws & Skills Tags */}
      {lawsTags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
          {lawsTags.map((law, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '0.15rem 0.45rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Tag size={10} color="#D4AF37" />
              {law}
            </span>
          ))}
        </div>
      )}

      {/* Practical Lessons Learned (Executive Serif Blockquote) */}
      {matter.lessonsLearned && (
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.4) 0%, rgba(20, 29, 52, 0.6) 100%)',
            borderLeft: '3px solid #D4AF37',
            padding: '0.75rem 0.9rem',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#D4AF37',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <BookOpen size={12} /> Key Legal Takeaway
            </span>
            <button
              onClick={() => onCopyLesson(matter.lessonsLearned)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.7rem',
              }}
              title="Copy takeaway"
            >
              <Copy size={11} /> Copy
            </button>
          </div>
          <p
            className="serif-quote"
            style={{
              fontSize: '0.825rem',
              color: '#F1F5F9',
              lineHeight: 1.45,
            }}
          >
            "{matter.lessonsLearned}"
          </p>
        </div>
      )}

      {/* Subtasks Progress & Interactive Checklist */}
      {totalSubtasks > 0 && (
        <div
          style={{
            background: 'rgba(7, 12, 26, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.85rem',
          }}
        >
          {/* Progress header */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
              <span style={{ fontWeight: 600, color: '#CBD5E1' }}>
                Sub-Tasks Checklist:
              </span>
              <span style={{ color: progressPercent === 100 ? '#34D399' : '#60A5FA', fontWeight: 600 }}>
                {completedSubtasks} of {totalSubtasks} ({progressPercent}%)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8' }}>
              <span style={{ fontSize: '0.72rem' }}>{isExpanded ? 'Hide' : 'Show details'}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          {/* Mini progress bar */}
          <div
            style={{
              height: '4px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              marginTop: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent === 100
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, #3B82F6, #D4AF37)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Collapsible checklist items */}
          {isExpanded && (
            <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {matter.subtasks.map((st: Subtask) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(matter.id, st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '4px',
                    background: st.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {st.completed ? (
                      <CheckCircle size={15} color="#34D399" />
                    ) : (
                      <Circle size={15} color="#64748B" />
                    )}
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: st.completed ? '#64748B' : '#F1F5F9',
                        textDecoration: st.completed ? 'line-through' : 'none',
                      }}
                    >
                      {st.title}
                    </span>
                  </div>

                  {st.dueDate && (
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {st.dueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Card Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ color: '#64748B' }}>
          {matter.followUpSteps && (
            <span title={matter.followUpSteps} style={{ cursor: 'help' }}>
              <strong>Next:</strong> {matter.followUpSteps.slice(0, 45)}...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => onDuplicate(matter)}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            title="Duplicate matter template"
          >
            <Share2 size={12} />
            <span>Copy</span>
          </button>

          <button
            onClick={() => onEdit(matter)}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            title="Edit matter details"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(matter.id)}
            className="btn btn-danger-ghost"
            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
            title="Delete matter"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};
