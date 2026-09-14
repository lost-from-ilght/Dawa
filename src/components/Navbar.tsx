'use client';

import React from 'react';
import {
  Plus,
  Search,
  Download,
  Settings,
  Scale,
  Menu,
  CheckCircle2,
  Database,
  CalendarCheck,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMatterModal: () => void;
  onOpenTaskModal: () => void;
  onOpenSettingsModal: () => void;
  onExportCSV: () => void;
  onToggleMobileMenu: () => void;
  isMongoActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMatterModal,
  onOpenTaskModal,
  onOpenSettingsModal,
  onExportCSV,
  onToggleMobileMenu,
  isMongoActive,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(7, 12, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.75rem 1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          maxWidth: '1800px',
          margin: '0 auto',
        }}
      >
        {/* Left: Mobile toggle + MLA Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onToggleMobileMenu}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              padding: '0.45rem',
              borderRadius: '8px',
            }}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2A3B66 0%, #162244 100%)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                flexShrink: 0,
              }}
            >
              <Scale size={20} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#F8FAFC',
                  letterSpacing: '0.05em',
                  lineHeight: 1.15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span style={{ color: '#F8FAFC' }}>DAWA</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>|</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.02em' }}>
                  MEHRTEAB & GETU
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#D4AF37',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                }}
              >
                ADVOCATES LLP · ASSOCIATE PRACTICE JOURNAL
              </div>
            </div>
          </div>
        </div>

        {/* Center: Real-time Global Search */}
        <div
          style={{
            flex: '1',
            maxWidth: '480px',
            position: 'relative',
            display: 'none',
          }}
          className="desktop-search"
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8494AB',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search matters, proclamations, clients, lessons..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.4rem',
              paddingRight: '0.85rem',
              height: '38px',
              fontSize: '0.825rem',
              background: 'rgba(14, 23, 46, 0.8)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Status pill */}
          <div
            className="badge"
            style={{
              background: isMongoActive
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(59, 130, 246, 0.12)',
              border: isMongoActive
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(59, 130, 246, 0.3)',
              color: isMongoActive ? '#34D399' : '#60A5FA',
              display: 'none',
            }}
            id="status-badge"
          >
            {isMongoActive ? <Database size={12} /> : <CheckCircle2 size={12} />}
            <span>{isMongoActive ? 'MongoDB Synced' : 'Fast Local Mode'}</span>
          </div>

          <button
            onClick={onExportCSV}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem 0.8rem',
              fontSize: '0.8rem',
            }}
            title="Download full CSV journal for partner evaluation or Excel"
          >
            <Download size={15} />
            <span className="hide-on-mobile">Export CSV</span>
          </button>

          <button
            onClick={onOpenTaskModal}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem 0.8rem',
              fontSize: '0.8rem',
            }}
            title="Add a standalone to-do task"
          >
            <CalendarCheck size={15} />
            <span className="hide-on-mobile">+ Task</span>
          </button>

          <button
            onClick={onOpenMatterModal}
            className="btn btn-gold"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.825rem',
            }}
            title="Log new matter entry"
          >
            <Plus size={16} />
            <span>Log Matter</span>
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
            }}
            title="Database & Storage Settings"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Mobile search bar visible on small screens */}
      <div
        className="mobile-search-bar"
        style={{
          marginTop: '0.65rem',
          position: 'relative',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8494AB',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search matters, laws, clients, notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field"
          style={{
            paddingLeft: '2.4rem',
            paddingRight: '0.85rem',
            height: '36px',
            fontSize: '0.825rem',
          }}
        />
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-search {
            display: block !important;
          }
          .mobile-search-bar {
            display: none !important;
          }
          #status-badge {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
