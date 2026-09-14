'use client';

import React from 'react';
import {
  FileText,
  Compass,
  CheckSquare,
  Clock,
  History,
  BookOpen,
  X,
  Briefcase,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ActiveView, DashboardStats, PracticeArea } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  stats: DashboardStats;
  selectedPracticeArea: string;
  onSelectPracticeArea: (area: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  stats,
  selectedPracticeArea,
  onSelectPracticeArea,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'feed' as ActiveView,
      label: 'All Entries Feed',
      icon: <FileText size={18} />,
      badge: stats.totalMatters > 0 ? `${stats.totalMatters}` : undefined,
    },
    {
      id: 'competency' as ActiveView,
      label: 'Competency Map',
      icon: <Compass size={18} />,
      badge: `${stats.practiceAreasCovered}/8`,
      badgeColor: '#D4AF37',
    },
    {
      id: 'todo' as ActiveView,
      label: 'Daily To-Do List',
      icon: <CheckSquare size={18} />,
      badge: stats.openTasksCount > 0 ? `${stats.openTasksCount}` : undefined,
      badgeColor: '#3B82F6',
    },
    {
      id: 'deadlines' as ActiveView,
      label: 'Urgent Deadlines',
      icon: <Clock size={18} />,
      badge: stats.overdueCount > 0 ? `${stats.overdueCount} Overdue` : undefined,
      badgeColor: '#EF4444',
    },
    {
      id: 'timeline' as ActiveView,
      label: 'Practice Timeline',
      icon: <History size={18} />,
    },
    {
      id: 'lessons' as ActiveView,
      label: 'Lessons Knowledge Base',
      icon: <BookOpen size={18} />,
      badge: stats.lessonsCount > 0 ? `${stats.lessonsCount}` : undefined,
      badgeColor: '#10B981',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Section */}
        <div style={{ padding: '1.25rem 1rem', overflowY: 'auto' }}>
          {/* Mobile close header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
            className="mobile-close-header"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#D4AF37" />
              <span
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  letterSpacing: '0.04em',
                }}
              >
                DAWA · MLA NAVIGATION
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="btn btn-ghost"
              style={{ padding: '0.35rem' }}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Associate Quick Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.8) 0%, rgba(14, 23, 46, 0.9) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #856312 100%)',
                  color: '#070C1A',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                }}
              >
                MLA
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
                  Associate Counsel
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Addis Ababa · Practice Year 2
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.75rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ color: '#94A3B8' }}>Logged Practice Hours:</span>
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>{stats.totalHours} hrs</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
                paddingLeft: '0.5rem',
              }}
            >
              Core Journal Modules
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.05) 100%)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(212, 175, 55, 0.35)'
                        : '1px solid transparent',
                      color: isActive ? '#F8FAFC' : '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: isActive ? '#D4AF37' : '#64748B' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '999px',
                          background: item.badgeColor
                            ? `${item.badgeColor}22`
                            : 'rgba(255, 255, 255, 0.1)',
                          color: item.badgeColor || '#CBD5E1',
                          border: item.badgeColor
                            ? `1px solid ${item.badgeColor}44`
                            : '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* MLA 8 Practice Areas Quick Filter */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '0.5rem',
                marginBottom: '0.6rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                MLA Practice Areas (8)
              </span>
              {selectedPracticeArea && (
                <button
                  onClick={() => onSelectPracticeArea('')}
                  style={{
                    fontSize: '0.68rem',
                    color: '#D4AF37',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear filter
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {PRACTICE_AREAS.map((pa) => {
                const isSelected = selectedPracticeArea === pa.name;
                return (
                  <button
                    key={pa.code}
                    onClick={() => {
                      onSelectPracticeArea(isSelected ? '' : pa.name);
                      if (activeView !== 'feed' && activeView !== 'competency') {
                        onSelectView('feed');
                      }
                      onCloseMobile();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? `${pa.color}20` : 'transparent',
                      border: isSelected ? `1px solid ${pa.color}60` : '1px solid transparent',
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: pa.color,
                        }}
                      />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                        {pa.name}
                      </span>
                    </div>
                    {isSelected && <ChevronRight size={14} color={pa.color} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(7, 12, 26, 0.7)',
            fontSize: '0.72rem',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Mehrteab & Getu Advocates</span>
          <span style={{ color: '#D4AF37' }}>v1.0</span>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1023px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 50;
            width: 285px;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-header {
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .mobile-close-header {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
