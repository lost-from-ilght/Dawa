'use client';

import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  Briefcase,
  History,
  Star,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Matter } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';

interface TimelineViewProps {
  matters: Matter[];
  onEditMatter: (m: Matter) => void;
}

interface MonthGroup {
  monthKey: string;
  monthName: string;
  totalHours: number;
  matters: Matter[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ matters, onEditMatter }) => {
  // Group matters by Year-Month
  const groups: MonthGroup[] = useMemo(() => {
    const sorted = [...matters].sort((a, b) => b.date.localeCompare(a.date));
    const map = new Map<string, Matter[]>();

    sorted.forEach((m) => {
      const ym = m.date.slice(0, 7); // YYYY-MM
      if (!map.has(ym)) {
        map.set(ym, []);
      }
      map.get(ym)!.push(m);
    });

    return Array.from(map.entries()).map(([ym, groupMatters]) => {
      const [year, month] = ym.split('-');
      const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const monthName = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const totalHours = Number(
        groupMatters.reduce((acc, cur) => acc + (cur.timeSpentHours || 0), 0).toFixed(1)
      );

      return {
        monthKey: ym,
        monthName,
        totalHours,
        matters: groupMatters,
      };
    });
  }, [matters]);

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
              background: 'rgba(212, 175, 55, 0.15)',
              color: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <History size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC' }}>
              Practice Progression Timeline
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Chronological log of legal assignments and cumulative associate development
            </div>
          </div>
        </div>
      </div>

      {/* Timeline groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {groups.map((group) => (
          <div key={group.monthKey} style={{ position: 'relative' }}>
            {/* Month Header Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.9) 0%, rgba(14, 23, 46, 0.9) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                <Calendar size={14} color="#D4AF37" />
                <span>{group.monthName}</span>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                {group.matters.length} Assignments · {group.totalHours} billable hours
              </div>
            </div>

            {/* Timeline track and items */}
            <div
              style={{
                position: 'relative',
                paddingLeft: '1.75rem',
                borderLeft: '2px solid rgba(212, 175, 55, 0.25)',
                marginLeft: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {group.matters.map((matter) => {
                const practiceInfo = PRACTICE_AREAS.find((p) => p.name === matter.practiceArea);
                const areaColor = practiceInfo?.color || '#3B82F6';

                return (
                  <div key={matter.id} style={{ position: 'relative' }}>
                    {/* Glowing Node Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2.35rem',
                        top: '1.1rem',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: areaColor,
                        border: '3px solid #070C1A',
                        boxShadow: `0 0 10px ${areaColor}88`,
                      }}
                    />

                    {/* Timeline Item Card */}
                    <div
                      className="glass-panel"
                      onClick={() => onEditMatter(matter)}
                      style={{
                        padding: '1.1rem 1.25rem',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          marginBottom: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            className="badge"
                            style={{
                              background: `${areaColor}18`,
                              color: areaColor,
                              border: `1px solid ${areaColor}44`,
                              fontWeight: 600,
                            }}
                          >
                            {matter.practiceArea}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600 }}>
                            {matter.clientReference}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                          <span>{matter.date}</span>
                          <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{matter.timeSpentHours} hrs</span>
                        </div>
                      </div>

                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#F8FAFC',
                          lineHeight: 1.35,
                          marginBottom: '0.4rem',
                        }}
                      >
                        {matter.matterTitle}
                      </h4>

                      {matter.activitiesDone && (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: '#94A3B8',
                            lineHeight: 1.45,
                            marginBottom: '0.5rem',
                          }}
                        >
                          {matter.activitiesDone.slice(0, 160)}
                          {matter.activitiesDone.length > 160 ? '...' : ''}
                        </p>
                      )}

                      {matter.lessonsLearned && (
                        <div
                          style={{
                            background: 'rgba(212, 175, 55, 0.07)',
                            borderLeft: '2px solid #D4AF37',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '0 4px 4px 0',
                            fontSize: '0.78rem',
                            color: '#E2E8F0',
                          }}
                        >
                          <span style={{ color: '#D4AF37', fontWeight: 600 }}>Takeaway: </span>
                          <span className="serif-quote">"{matter.lessonsLearned.slice(0, 130)}..."</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
