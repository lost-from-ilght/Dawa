'use client';

import React from 'react';
import {
  Briefcase,
  BookOpen,
  Clock,
  Layers,
  TrendingUp,
  AlertCircle,
  Star,
} from 'lucide-react';
import { DashboardStats, ActiveView } from '@/types';

interface StatsBarProps {
  stats: DashboardStats;
  onNavigate: (view: ActiveView) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, onNavigate }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* 1.1 Total Entries & Ongoing Matters */}
      <div
        className="glass-panel"
        onClick={() => onNavigate('feed')}
        style={{
          padding: '1.1rem 1.25rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            bottom: 0,
            background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
            MATTER JOURNAL ENTRIES
          </span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
            }}
          >
            <Briefcase size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC' }}>
            {stats.totalMatters}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#60A5FA', fontWeight: 500 }}>
            {stats.ongoingMatters} Active / Ongoing
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          <TrendingUp size={14} color="#34D399" />
          <span>{stats.totalHours} billable hours recorded</span>
        </div>
      </div>

      {/* 1.2 Lessons Captured */}
      <div
        className="glass-panel"
        onClick={() => onNavigate('lessons')}
        style={{
          padding: '1.1rem 1.25rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            bottom: 0,
            background: 'linear-gradient(180deg, #10B981 0%, #047857 100%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
            PRACTICAL LESSONS CAPTURED
          </span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
            }}
          >
            <BookOpen size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC' }}>
            {stats.lessonsCount}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 500 }}>
            Takeaways & Precedents
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          <span>Searchable legal wisdom & citations</span>
        </div>
      </div>

      {/* 1.3 Open Tasks & Overdue Deadlines */}
      <div
        className="glass-panel"
        onClick={() => onNavigate(stats.overdueCount > 0 ? 'deadlines' : 'todo')}
        style={{
          padding: '1.1rem 1.25rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            bottom: 0,
            background: stats.overdueCount > 0
              ? 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)'
              : 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
            ACTION ITEMS & DOCKET
          </span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: stats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: stats.overdueCount > 0 ? '#F87171' : '#FBBF24',
            }}
          >
            {stats.overdueCount > 0 ? <AlertCircle size={18} /> : <Clock size={18} />}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC' }}>
            {stats.openTasksCount}
          </span>
          {stats.overdueCount > 0 ? (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {stats.overdueCount} Overdue
            </span>
          ) : (
            <span style={{ fontSize: '0.82rem', color: '#FBBF24', fontWeight: 500 }}>
              All on schedule
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          <span>2-way synchronized with matter subtasks</span>
        </div>
      </div>

      {/* 1.4 Practice Areas Covered */}
      <div
        className="glass-panel"
        onClick={() => onNavigate('competency')}
        style={{
          padding: '1.1rem 1.25rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            bottom: 0,
            background: 'linear-gradient(180deg, #D4AF37 0%, #856312 100%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
            MLA PRACTICE COVERAGE
          </span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(212, 175, 55, 0.15)',
              color: '#D4AF37',
            }}
          >
            <Layers size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC' }}>
            {stats.practiceAreasCovered} <span style={{ fontSize: '1.1rem', color: '#64748B' }}>/ 8</span>
          </span>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 500 }}>
            {Math.round((stats.practiceAreasCovered / 8) * 100)}% Breadth
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          <Star size={13} color="#D4AF37" fill="#D4AF37" />
          <span>Avg. Confidence: {stats.averageConfidence} / 5.0</span>
        </div>
      </div>
    </div>
  );
};
