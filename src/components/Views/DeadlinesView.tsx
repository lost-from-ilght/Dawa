'use client';

import React, { useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Circle,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Matter, DailyTask } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';

interface DeadlinesViewProps {
  matters: Matter[];
  tasks: DailyTask[];
  onToggleTask: (task: DailyTask) => void;
  onEditMatter: (m: Matter) => void;
}

interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  type: 'matter' | 'task';
  priority: string;
  completed: boolean;
  matterId?: string;
  clientReference?: string;
  practiceArea?: string;
  originalMatter?: Matter;
  originalTask?: DailyTask;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  matters,
  tasks,
  onToggleTask,
  onEditMatter,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date(todayStr);

  // Combine matters with deadlines and tasks with dueDates
  const categorized = useMemo(() => {
    const items: DeadlineItem[] = [];

    // Matter deadlines
    matters.forEach((m) => {
      if (m.deadline) {
        items.push({
          id: `deadline-m-${m.id}`,
          title: m.matterTitle,
          dueDate: m.deadline,
          type: 'matter',
          priority: m.priority,
          completed: m.status === 'Completed',
          matterId: m.id,
          clientReference: m.clientReference,
          practiceArea: m.practiceArea,
          originalMatter: m,
        });
      }
    });

    // Task due dates
    tasks.forEach((t) => {
      if (t.dueDate) {
        items.push({
          id: `deadline-t-${t.id}`,
          title: t.title,
          dueDate: t.dueDate,
          type: 'task',
          priority: t.priority,
          completed: t.completed,
          matterId: t.matterId,
          clientReference: t.clientReference,
          originalTask: t,
        });
      }
    });

    // Sort by dueDate
    items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const overdue: DeadlineItem[] = [];
    const dueToday: DeadlineItem[] = [];
    const dueThisWeek: DeadlineItem[] = [];
    const dueLater: DeadlineItem[] = [];

    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    items.forEach((item) => {
      if (item.completed) return; // Only show pending/open deadlines in urgent docket

      if (item.dueDate < todayStr) {
        overdue.push(item);
      } else if (item.dueDate === todayStr) {
        dueToday.push(item);
      } else if (item.dueDate <= weekFromNow) {
        dueThisWeek.push(item);
      } else {
        dueLater.push(item);
      }
    });

    return { overdue, dueToday, dueThisWeek, dueLater };
  }, [matters, tasks, todayStr]);

  const renderSection = (
    title: string,
    items: DeadlineItem[],
    accentColor: string,
    badgeBg: string,
    badgeBorder: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
              color: accentColor,
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {title} ({items.length})
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '0.85rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: `4px solid ${accentColor}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                {item.type === 'task' && item.originalTask ? (
                  <button
                    onClick={() => onToggleTask(item.originalTask!)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Mark action item complete"
                  >
                    <Circle size={18} color="#94A3B8" />
                  </button>
                ) : (
                  <div
                    style={{
                      padding: '4px',
                      borderRadius: '6px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                    }}
                  >
                    <Briefcase size={15} />
                  </div>
                )}

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#F8FAFC',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                    {item.clientReference && (
                      <span style={{ color: '#D4AF37', fontWeight: 600 }}>{item.clientReference}</span>
                    )}
                    {item.practiceArea && <span>{item.practiceArea}</span>}
                    <span style={{ textTransform: 'uppercase', fontSize: '0.68rem', color: '#64748B' }}>
                      {item.type === 'matter' ? 'Matter Filing' : 'Action Item'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: accentColor }}>
                    {item.dueDate}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {item.priority} Priority
                  </div>
                </div>

                {item.originalMatter && (
                  <button
                    onClick={() => onEditMatter(item.originalMatter!)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <span>View</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalUrgent =
    categorized.overdue.length +
    categorized.dueToday.length +
    categorized.dueThisWeek.length +
    categorized.dueLater.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC' }}>
              Urgent Docket & Deadlines
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Calendar and statutory filing countdown for court filings, MoR tax appeals, and client deliverables
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.825rem', color: '#D4AF37', fontWeight: 600 }}>
          Today: {todayStr}
        </div>
      </div>

      {totalUrgent > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Overdue Items */}
          {renderSection(
            '⚠️ OVERDUE DEADLINES',
            categorized.overdue,
            '#EF4444',
            'rgba(239, 68, 68, 0.15)',
            'rgba(239, 68, 68, 0.35)'
          )}

          {/* Due Today */}
          {renderSection(
            '🔔 DUE TODAY',
            categorized.dueToday,
            '#F59E0B',
            'rgba(245, 158, 11, 0.15)',
            'rgba(245, 158, 11, 0.35)'
          )}

          {/* Due This Week */}
          {renderSection(
            '📅 DUE THIS WEEK (NEXT 7 DAYS)',
            categorized.dueThisWeek,
            '#3B82F6',
            'rgba(59, 130, 246, 0.15)',
            'rgba(59, 130, 246, 0.35)'
          )}

          {/* Due Later */}
          {renderSection(
            '🗓️ UPCOMING DEADLINES',
            categorized.dueLater,
            '#10B981',
            'rgba(16, 185, 129, 0.15)',
            'rgba(16, 185, 129, 0.35)'
          )}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <CheckCircle size={40} color="#34D399" />
          <h3 style={{ color: '#F8FAFC' }}>All Deadlines Met!</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            There are currently no overdue or upcoming pending deadlines. Excellent docket management!
          </p>
        </div>
      )}
    </div>
  );
};
