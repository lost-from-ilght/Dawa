'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  ArrowUpDown,
  Plus,
  Search,
  Briefcase,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { Matter, PracticeArea, MatterPriority, MatterStatus } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';
import { MatterCard } from '../MatterCard';

interface AllEntriesViewProps {
  matters: Matter[];
  searchQuery: string;
  selectedPracticeArea: string;
  onSelectPracticeArea: (pa: string) => void;
  onOpenMatterModal: () => void;
  onEditMatter: (m: Matter) => void;
  onDeleteMatter: (id: string) => void;
  onDuplicateMatter: (m: Matter) => void;
  onToggleSubtask: (matterId: string, subtaskId: string) => void;
  onCopyLesson: (text: string) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'hours-desc' | 'rating-desc';

export const AllEntriesView: React.FC<AllEntriesViewProps> = ({
  matters,
  searchQuery,
  selectedPracticeArea,
  onSelectPracticeArea,
  onOpenMatterModal,
  onEditMatter,
  onDeleteMatter,
  onDuplicateMatter,
  onToggleSubtask,
  onCopyLesson,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Filter & Sort computation
  const filteredMatters = useMemo(() => {
    return matters
      .filter((m) => {
        // Practice area
        if (selectedPracticeArea && m.practiceArea !== selectedPracticeArea) {
          return false;
        }
        // Status
        if (statusFilter !== 'All' && m.status !== statusFilter) {
          return false;
        }
        // Priority
        if (priorityFilter !== 'All' && m.priority !== priorityFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.matterTitle.toLowerCase().includes(q);
          const matchClient = m.clientReference.toLowerCase().includes(q);
          const matchSupervisor = m.supervisingLawyer.toLowerCase().includes(q);
          const matchLaws = m.skillsLawsInvolved.toLowerCase().includes(q);
          const matchLessons = m.lessonsLearned.toLowerCase().includes(q);
          const matchActivities = m.activitiesDone.toLowerCase().includes(q);
          if (
            !matchTitle &&
            !matchClient &&
            !matchSupervisor &&
            !matchLaws &&
            !matchLessons &&
            !matchActivities
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return b.date.localeCompare(a.date);
        }
        if (sortBy === 'date-asc') {
          return a.date.localeCompare(b.date);
        }
        if (sortBy === 'hours-desc') {
          return b.timeSpentHours - a.timeSpentHours;
        }
        if (sortBy === 'rating-desc') {
          return b.confidenceRating - a.confidenceRating;
        }
        return 0;
      });
  }, [matters, selectedPracticeArea, statusFilter, priorityFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedPracticeArea !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    searchQuery.trim() !== '';

  const clearAllFilters = () => {
    onSelectPracticeArea('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toolbar & Filter bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Left: View title & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <Briefcase size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC' }}>
                All Legal Journal Entries
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Showing {filteredMatters.length} of {matters.length} recorded assignments
              </div>
            </div>
          </div>

          {/* Right: Quick + Log button */}
          <button
            onClick={onOpenMatterModal}
            className="btn btn-gold"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
          >
            <Plus size={16} />
            <span>Log Matter Entry</span>
          </button>
        </div>

        {/* Filter Dropdowns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Practice Area Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#8494AB', marginBottom: '0.25rem' }}>
              Practice Area
            </label>
            <select
              value={selectedPracticeArea}
              onChange={(e) => onSelectPracticeArea(e.target.value)}
              className="select-field"
              style={{ height: '34px', fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              <option value="">All 8 Practice Areas</option>
              {PRACTICE_AREAS.map((pa) => (
                <option key={pa.code} value={pa.name}>
                  {pa.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#8494AB', marginBottom: '0.25rem' }}>
              Matter Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
              style={{ height: '34px', fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending Review</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#8494AB', marginBottom: '0.25rem' }}>
              Priority Level
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select-field"
              style={{ height: '34px', fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Standard Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#8494AB', marginBottom: '0.25rem' }}>
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="select-field"
              style={{ height: '34px', fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="hours-desc">Most Hours Logged</option>
              <option value="rating-desc">Highest Confidence (5★)</option>
            </select>
          </div>
        </div>

        {/* Active filters pill bar */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.4rem',
              paddingTop: '0.4rem',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Active Filters:</span>
            {selectedPracticeArea && (
              <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                Area: {selectedPracticeArea}
                <button onClick={() => onSelectPracticeArea('')} style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                Priority: {priorityFilter}
                <button onClick={() => setPriorityFilter('All')} style={{ background: 'none', border: 'none', color: '#FBBF24', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {searchQuery && (
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid var(--border-medium)' }}>
                Query: "{searchQuery}"
              </span>
            )}
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: '0.72rem',
                color: '#EF4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Entries List */}
      {filteredMatters.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredMatters.map((matter) => (
            <MatterCard
              key={matter.id}
              matter={matter}
              onEdit={onEditMatter}
              onDelete={onDeleteMatter}
              onDuplicate={onDuplicateMatter}
              onToggleSubtask={onToggleSubtask}
              onCopyLesson={onCopyLesson}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
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
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              No Matching Legal Journal Entries Found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '440px', margin: '0 auto' }}>
              {hasActiveFilters
                ? 'Try adjusting your filters or search keywords to view matching matters.'
                : 'Start documenting your associate legal assignments, proclamation research, and practical takeaways.'}
            </p>
          </div>
          {hasActiveFilters ? (
            <button onClick={clearAllFilters} className="btn btn-secondary">
              Clear Active Filters
            </button>
          ) : (
            <button onClick={onOpenMatterModal} className="btn btn-gold">
              <Plus size={16} /> Log First Matter Entry
            </button>
          )}
        </div>
      )}
    </div>
  );
};
