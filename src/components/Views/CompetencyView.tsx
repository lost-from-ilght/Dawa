'use client';

import React, { useMemo } from 'react';
import {
  Compass,
  Award,
  Star,
  TrendingUp,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Matter, PracticeArea } from '@/types';
import { PRACTICE_AREAS } from '@/lib/constants';

interface CompetencyViewProps {
  matters: Matter[];
  onSelectPracticeAreaFilter: (area: string) => void;
}

export const CompetencyView: React.FC<CompetencyViewProps> = ({
  matters,
  onSelectPracticeAreaFilter,
}) => {
  // Aggregate data per practice area
  const areaStats = useMemo(() => {
    return PRACTICE_AREAS.map((pa) => {
      const areaMatters = matters.filter((m) => m.practiceArea === pa.name);
      const totalHours = Number(
        areaMatters.reduce((acc, m) => acc + (m.timeSpentHours || 0), 0).toFixed(1)
      );
      const mattersCount = areaMatters.length;
      const totalStars = areaMatters.reduce((acc, m) => acc + (m.confidenceRating || 3), 0);
      const avgConfidence = mattersCount > 0 ? Number((totalStars / mattersCount).toFixed(1)) : 0;
      const progressPercent = Math.min(100, Math.round((totalHours / pa.targetHours) * 100));

      let tier = 'Novice / Induction';
      let tierColor = '#94A3B8';
      if (totalHours >= pa.targetHours * 0.9) {
        tier = 'Senior Associate Ready';
        tierColor = '#D4AF37';
      } else if (totalHours >= pa.targetHours * 0.6) {
        tier = 'Advanced Practice';
        tierColor = '#10B981';
      } else if (totalHours >= pa.targetHours * 0.3) {
        tier = 'Proficient';
        tierColor = '#3B82F6';
      } else if (totalHours > 0) {
        tier = 'Developing';
        tierColor = '#F59E0B';
      }

      // Collect sample laws involved
      const lawsSet = new Set<string>();
      areaMatters.forEach((m) => {
        if (m.skillsLawsInvolved) {
          m.skillsLawsInvolved
            .split(';')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((law) => lawsSet.add(law));
        }
      });

      return {
        ...pa,
        totalHours,
        mattersCount,
        avgConfidence,
        progressPercent,
        tier,
        tierColor,
        laws: Array.from(lawsSet).slice(0, 3),
      };
    });
  }, [matters]);

  const totalOverallHours = useMemo(
    () => Number(matters.reduce((acc, m) => acc + (m.timeSpentHours || 0), 0).toFixed(1)),
    [matters]
  );

  const coveredCount = areaStats.filter((a) => a.mattersCount > 0).length;
  const coveragePercent = Math.round((coveredCount / 8) * 100);

  // Identify areas needing focus
  const focusAreas = areaStats.filter((a) => a.totalHours < a.targetHours * 0.3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Executive Competency Overview Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.85) 0%, rgba(14, 23, 46, 0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F8FAFC' }}>
                MLA 8 Practice Area Competency Dashboard
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Mehrteab & Getu Advocates LLP Associate Progression & Partner Evaluation Matrix
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#D4AF37',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} />
            <span>Associate Practice Year 2</span>
          </div>
        </div>

        {/* High-level KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(7, 12, 26, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Practice Breadth</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.2rem' }}>
              {coveredCount} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ 8 Areas</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399' }}>{coveragePercent}% of MLA scope</span>
          </div>

          <div style={{ background: 'rgba(7, 12, 26, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Total Hours Logged</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#D4AF37', marginTop: '0.2rem' }}>
              {totalOverallHours} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>hrs</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Across all active matters</span>
          </div>

          <div style={{ background: 'rgba(7, 12, 26, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Senior Readiness</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60A5FA', marginTop: '0.2rem' }}>
              Proficient
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>On track for Senior Associate</span>
          </div>
        </div>
      </div>

      {/* Focus Area Advisory Note */}
      {focusAreas.length > 0 && (
        <div
          style={{
            padding: '0.85rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '0.825rem', color: '#F8FAFC' }}>
              <strong>Development Recommendation:</strong> Consider requesting upcoming assignments in{' '}
              <strong style={{ color: '#FBBF24' }}>
                {focusAreas.map((f) => f.name).join(', ')}
              </strong>{' '}
              to ensure comprehensive full-service firm readiness.
            </span>
          </div>
        </div>
      )}

      {/* Practice Areas Detailed Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
        {areaStats.map((area) => (
          <div
            key={area.code}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderTop: `4px solid ${area.color}`,
            }}
          >
            <div>
              {/* Card top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {area.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: `${area.color}22`,
                        color: area.color,
                        fontWeight: 600,
                      }}
                    >
                      {area.code}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {area.description}
                  </p>
                </div>

                {/* Tier Badge */}
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    background: `${area.tierColor}18`,
                    color: area.tierColor,
                    border: `1px solid ${area.tierColor}44`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {area.tier}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#94A3B8' }}>
                    {area.totalHours} of {area.targetHours} benchmark hrs
                  </span>
                  <span style={{ color: area.color, fontWeight: 700 }}>
                    {area.progressPercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${area.progressPercent}%`,
                      background: area.color,
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Metric stats row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginTop: '0.85rem',
                  padding: '0.65rem',
                  background: 'rgba(7, 12, 26, 0.5)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Matters Handled</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
                    {area.mattersCount} assignments
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Avg. Confidence</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F59E0B' }}>
                      {area.avgConfidence > 0 ? `${area.avgConfidence} / 5` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Laws Involved */}
              {area.laws.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Key Laws & Proclamations Applied:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {area.laws.map((law, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.68rem',
                          color: '#CBD5E1',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                        }}
                      >
                        {law}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Action */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem' }}>
              <button
                onClick={() => onSelectPracticeAreaFilter(area.name)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.78rem' }}
              >
                <span>View {area.name} Matters</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
