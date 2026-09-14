'use client';

import React from 'react';
import {
  FileText,
  Compass,
  CheckSquare,
  Clock,
  BookOpen,
} from 'lucide-react';
import { ActiveView } from '@/types';

interface MobileBottomNavProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  openTasksCount: number;
  overdueCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onSelectView,
  openTasksCount,
  overdueCount,
}) => {
  const items = [
    { id: 'feed' as ActiveView, label: 'Feed', icon: <FileText size={20} /> },
    { id: 'competency' as ActiveView, label: 'Competency', icon: <Compass size={20} /> },
    {
      id: 'todo' as ActiveView,
      label: 'To-Do',
      icon: <CheckSquare size={20} />,
      badge: openTasksCount > 0 ? `${openTasksCount}` : undefined,
    },
    {
      id: 'deadlines' as ActiveView,
      label: 'Deadlines',
      icon: <Clock size={20} />,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
      badgeColor: '#EF4444',
    },
    { id: 'lessons' as ActiveView, label: 'Lessons', icon: <BookOpen size={20} /> },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        background: 'rgba(7, 12, 26, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 35,
        padding: '0 0.5rem',
      }}
    >
      {items.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: isActive ? '#D4AF37' : '#8494AB',
              cursor: 'pointer',
              flex: 1,
              height: '100%',
              position: 'relative',
              paddingTop: '4px',
              transition: 'color 0.15s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              {item.icon}
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    background: item.badgeColor || '#3B82F6',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    padding: '1px 5px',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: isActive ? 600 : 500,
                marginTop: '3px',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
