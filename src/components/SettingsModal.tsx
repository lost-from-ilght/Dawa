'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Server,
  Shield,
  HardDrive,
} from 'lucide-react';
import { StorageSettings } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StorageSettings;
  onSaveSettings: (settings: StorageSettings) => void;
  onResetSeedData: () => void;
  onExportCSV: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetSeedData,
  onExportCSV,
}) => {
  const [useMongo, setUseMongo] = useState(settings.useMongoBackend);
  const [mongoUri, setMongoUri] = useState(settings.mongoUri || '');
  const [testingStatus, setTestingStatus] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [isResetDone, setIsResetDone] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingStatus('Testing connection to MongoDB...');
    setTestSuccess(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.connected) {
        setTestingStatus(data.message || 'Connected successfully!');
        setTestSuccess(true);
      } else {
        setTestingStatus(data.message || 'Could not connect to MongoDB server.');
        setTestSuccess(false);
      }
    } catch {
      setTestingStatus('Failed to test MongoDB connection.');
      setTestSuccess(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      useMongoBackend: useMongo,
      mongoUri: mongoUri.trim(),
      autoSync: useMongo,
    });
    onClose();
  };

  const handleTriggerReset = () => {
    if (window.confirm('Reset all matters, subtasks, and to-do items back to the official Mehrteab & Getu Advocates LLP seed demonstration dataset?')) {
      onResetSeedData();
      setIsResetDone(true);
      setTimeout(() => setIsResetDone(false), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 16, 34, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              <Database size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC' }}>
                System & Storage Settings
              </h2>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Dual-Mode Data Architecture (Local Offline + MongoDB Sync)
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto',
          }}
        >
          {/* Storage Mode Selector */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.6)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
              Storage Mode Selection
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Option 1: Local Storage */}
              <div
                onClick={() => setUseMongo(false)}
                style={{
                  border: !useMongo ? '2px solid #D4AF37' : '1px solid var(--border-medium)',
                  background: !useMongo ? 'rgba(212, 175, 55, 0.08)' : 'rgba(10, 18, 38, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <HardDrive size={18} color={!useMongo ? '#D4AF37' : '#94A3B8'} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F8FAFC' }}>
                    Local Client Mode
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  Zero setup required. Instant offline persistence across browser sessions on desktop and mobile.
                </p>
                {!useMongo && (
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.68rem', color: '#D4AF37', fontWeight: 600 }}>
                    ✓ Active Mode
                  </span>
                )}
              </div>

              {/* Option 2: MongoDB Backend */}
              <div
                onClick={() => setUseMongo(true)}
                style={{
                  border: useMongo ? '2px solid #3B82F6' : '1px solid var(--border-medium)',
                  background: useMongo ? 'rgba(59, 130, 246, 0.08)' : 'rgba(10, 18, 38, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Server size={18} color={useMongo ? '#3B82F6' : '#94A3B8'} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F8FAFC' }}>
                    MongoDB Sync Mode
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  Connects via Next.js server API to MongoDB Atlas or local daemon for multi-device cross-sync.
                </p>
                {useMongo && (
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.68rem', color: '#60A5FA', fontWeight: 600 }}>
                    ✓ Active Mode
                  </span>
                )}
              </div>
            </div>

            {/* MongoDB URI Input (if enabled) */}
            {useMongo && (
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                  MongoDB Connection URI (or set MONGODB_URI in .env.local)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="password"
                    value={mongoUri}
                    onChange={(e) => setMongoUri(e.target.value)}
                    placeholder="mongodb+srv://user:pass@cluster.mongodb.net/mla_legal_journal"
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    Test Ping
                  </button>
                </div>

                {testingStatus && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      background: testSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: testSuccess ? '#34D399' : '#F87171',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    {testSuccess ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    <span>{testingStatus}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seed Data Reset & Demo Restoration */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.6)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
              MLA Seed Demonstration Data
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Includes 8 authentic matters across all MLA practice areas (Corporate, Tax, Employment, Litigation, Finance, IP, Mining/Energy, NGO) with Ethiopian Commercial Code and Labour Proclamation citations.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleTriggerReset}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              >
                <RefreshCw size={14} />
                <span>Reset to MLA Seed Dataset</span>
              </button>

              {isResetDone && (
                <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                  ✓ Restored successfully!
                </span>
              )}
            </div>
          </div>

          {/* Backup & CSV Export */}
          <div
            style={{
              background: 'rgba(14, 23, 46, 0.6)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
              Data Export & Performance Reviews
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
              Export complete practice records including hours, supervisors, lessons learned, and competency ratings for partner evaluations and spreadsheet analysis.
            </p>
            <div>
              <button
                type="button"
                onClick={onExportCSV}
                className="btn btn-gold"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              >
                <Download size={14} />
                <span>Download Full CSV Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn btn-gold">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
