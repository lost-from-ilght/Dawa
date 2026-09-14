'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Tag,
  Briefcase,
  User,
  Quote,
  Sparkles,
} from 'lucide-react';
import { Matter } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';

interface LessonsViewProps {
  matters: Matter[];
  onCopyLesson: (text: string) => void;
  onEditMatter: (m: Matter) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  matters,
  onCopyLesson,
  onEditMatter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Extract all matters that have lessons learned
  const lessons = useMemo(() => {
    return matters
      .filter((m) => m.lessonsLearned && m.lessonsLearned.trim().length > 0)
      .filter((m) => {
        if (selectedArea && m.practiceArea !== selectedArea) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchLesson = m.lessonsLearned.toLowerCase().includes(q);
          const matchLaws = m.skillsLawsInvolved.toLowerCase().includes(q);
          const matchTitle = m.matterTitle.toLowerCase().includes(q);
          return matchLesson || matchLaws || matchTitle;
        }
        return true;
      });
  }, [matters, selectedArea, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* View Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F8FAFC' }}>
                Lessons Learned Knowledge Base
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Curated library of {lessons.length} practical Ethiopian legal takeaways & precedents
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Area Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8494AB',
              }}
            />
            <input
              type="text"
              placeholder="Search legal precedents, proclamation citations, procedural lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.825rem' }}
            />
          </div>

          {/* Area pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            <button
              onClick={() => setSelectedArea('')}
              className="badge"
              style={{
                background: !selectedArea ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: !selectedArea ? '#D4AF37' : '#94A3B8',
                border: !selectedArea ? '1px solid #D4AF37' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                padding: '0.3rem 0.65rem',
              }}
            >
              All Practice Areas ({matters.filter((m) => m.lessonsLearned).length})
            </button>

            {PRACTICE_AREAS.map((pa) => {
              const count = matters.filter((m) => m.practiceArea === pa.name && m.lessonsLearned).length;
              if (count === 0) return null;
              const isSelected = selectedArea === pa.name;

              return (
                <button
                  key={pa.code}
                  onClick={() => setSelectedArea(isSelected ? '' : pa.name)}
                  className="badge"
                  style={{
                    background: isSelected ? `${pa.color}25` : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? pa.color : '#94A3B8',
                    border: isSelected ? `1px solid ${pa.color}` : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    padding: '0.3rem 0.65rem',
                  }}
                >
                  {pa.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {lessons.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
          {lessons.map((matter) => {
            const practiceInfo = PRACTICE_AREAS.find((p) => p.name === matter.practiceArea);
            const areaColor = practiceInfo?.color || '#3B82F6';

            return (
              <div
                key={matter.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  borderTop: `3px solid ${areaColor}`,
                }}
              >
                <div>
                  {/* Card top info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
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

                    <button
                      onClick={() => onCopyLesson(matter.lessonsLearned)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                      title="Copy lesson"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>

                  {/* Main Quote */}
                  <div style={{ position: 'relative', paddingLeft: '1.25rem', marginBottom: '0.85rem' }}>
                    <Quote
                      size={18}
                      color="#D4AF37"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        opacity: 0.7,
                      }}
                    />
                    <p
                      className="serif-quote"
                      style={{
                        fontSize: '0.9rem',
                        color: '#F8FAFC',
                        lineHeight: 1.55,
                      }}
                    >
                      "{matter.lessonsLearned}"
                    </p>
                  </div>

                  {/* Laws & Proclamation Citations */}
                  {matter.skillsLawsInvolved && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {matter.skillsLawsInvolved
                        .split(';')
                        .map((law, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.7rem',
                              color: '#D4AF37',
                              background: 'rgba(212, 175, 55, 0.08)',
                              border: '1px solid rgba(212, 175, 55, 0.2)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Tag size={10} />
                            {law.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Card footer: Matter context & supervisor */}
                <div
                  style={{
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                  }}
                >
                  <div
                    onClick={() => onEditMatter(matter)}
                    style={{
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '220px',
                    }}
                    title={matter.matterTitle}
                  >
                    <strong style={{ color: '#CBD5E1' }}>{matter.clientReference}</strong>: {matter.matterTitle}
                  </div>
                  <div>
                    <span>{matter.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#94A3B8',
          }}
        >
          <p>No lessons matching your search query or practice area.</p>
        </div>
      )}
    </div>
  );
};
