'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { StatsBar } from '@/components/StatsBar';
import { MatterModal } from '@/components/MatterModal';
import { TaskModal } from '@/components/TaskModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';

import { AllEntriesView } from '@/components/Views/AllEntriesView';
import { TimelineView } from '@/components/Views/TimelineView';
import { LessonsView } from '@/components/Views/LessonsView';
import { DeadlinesView } from '@/components/Views/DeadlinesView';
import { CompetencyView } from '@/components/Views/CompetencyView';
import { TodoView } from '@/components/Views/TodoView';

import {
  Matter,
  DailyTask,
  ActiveView,
  DashboardStats,
} from '@/types';
import {
  getStoredMatters,
  saveStoredMatters,
  getStoredTasks,
  saveStoredTasks,
  getLocalSettings,
  saveLocalSettings,
  resetToSeedData,
  syncTaskToggleToMatter,
  syncMatterSubtasksToTasks,
  cleanupDeletedMatterTasks,
  calculateDashboardStats,
  exportMattersToCSV,
  StorageSettings,
} from '@/lib/storage';

export default function HomePage() {
  // Primary States
  const [matters, setMatters] = useState<Matter[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [settings, setSettings] = useState<StorageSettings>(getLocalSettings());
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');

  // Modals
  const [isMatterModalOpen, setIsMatterModalOpen] = useState(false);
  const [editingMatter, setEditingMatter] = useState<Matter | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial client hydration
  useEffect(() => {
    const initialMatters = getStoredMatters();
    const initialTasks = getStoredTasks();
    const initialSettings = getLocalSettings();

    setMatters(initialMatters);
    setTasks(initialTasks);
    setSettings(initialSettings);
  }, []);

  // Compute live stats
  const stats: DashboardStats = calculateDashboardStats(matters, tasks);

  // Matter CRUD
  const handleSaveMatter = (matter: Matter) => {
    const exists = matters.some((m) => m.id === matter.id);
    let updatedMatters: Matter[];

    if (exists) {
      updatedMatters = matters.map((m) => (m.id === matter.id ? matter : m));
      addToast('success', 'Matter Updated', `${matter.clientReference}: ${matter.matterTitle}`);
    } else {
      updatedMatters = [matter, ...matters];
      addToast('success', 'Matter Logged', `${matter.clientReference} recorded in journal`);
    }

    // 2-Way Sync: Update linked subtasks in daily to-do tasks
    const updatedTasks = syncMatterSubtasksToTasks(matter, tasks);

    setMatters(updatedMatters);
    setTasks(updatedTasks);
    saveStoredMatters(updatedMatters);
    saveStoredTasks(updatedTasks);
    setEditingMatter(null);
  };

  const handleDeleteMatter = (id: string) => {
    const target = matters.find((m) => m.id === id);
    if (!window.confirm(`Delete entry "${target?.matterTitle || id}" from legal journal?`)) {
      return;
    }

    const updatedMatters = matters.filter((m) => m.id !== id);
    const updatedTasks = cleanupDeletedMatterTasks(id, tasks);

    setMatters(updatedMatters);
    setTasks(updatedTasks);
    saveStoredMatters(updatedMatters);
    saveStoredTasks(updatedTasks);
    addToast('info', 'Matter Deleted', 'The journal entry and linked subtasks have been removed.');
  };

  const handleDuplicateMatter = (matter: Matter) => {
    const duplicate: Matter = {
      ...matter,
      id: `mla-m-${Date.now()}`,
      matterTitle: `Copy of ${matter.matterTitle}`,
      clientReference: `${matter.clientReference}-COPY`,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Ongoing',
      subtasks: (matter.subtasks || []).map((st, i) => ({
        ...st,
        id: `st-copy-${Date.now()}-${i}`,
        completed: false,
      })),
    };

    const updatedMatters = [duplicate, ...matters];
    const updatedTasks = syncMatterSubtasksToTasks(duplicate, tasks);

    setMatters(updatedMatters);
    setTasks(updatedTasks);
    saveStoredMatters(updatedMatters);
    saveStoredTasks(updatedTasks);
    addToast('success', 'Matter Duplicated', `Created template copy "${duplicate.matterTitle}"`);
  };

  // 2-Way Sync: Toggle Subtask on MatterCard
  const handleToggleMatterSubtask = (matterId: string, subtaskId: string) => {
    let nextCompletedState = false;

    const updatedMatters = matters.map((m) => {
      if (m.id !== matterId) return m;
      const updatedSubtasks = (m.subtasks || []).map((st) => {
        if (st.id === subtaskId) {
          nextCompletedState = !st.completed;
          return { ...st, completed: nextCompletedState };
        }
        return st;
      });
      return { ...m, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
    });

    // Mirror to tasks
    const updatedTasks = tasks.map((t) => {
      if (
        t.matterId === matterId &&
        (t.subtaskId === subtaskId || t.id === `task-linked-${subtaskId}`)
      ) {
        return { ...t, completed: nextCompletedState };
      }
      return t;
    });

    setMatters(updatedMatters);
    setTasks(updatedTasks);
    saveStoredMatters(updatedMatters);
    saveStoredTasks(updatedTasks);
  };

  // 2-Way Sync: Toggle Task in To-Do view or Deadlines view
  const handleToggleTask = (task: DailyTask) => {
    const nextCompleted = !task.completed;
    const updatedTask = { ...task, completed: nextCompleted };

    const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));
    const updatedMatters = syncTaskToggleToMatter(updatedTask, matters);

    setTasks(updatedTasks);
    setMatters(updatedMatters);
    saveStoredTasks(updatedTasks);
    saveStoredMatters(updatedMatters);
  };

  // Daily Tasks CRUD
  const handleAddTask = (task: DailyTask) => {
    const updatedTasks = [task, ...tasks];
    let updatedMatters = matters;

    if (task.isMatterSubtask && task.matterId && task.subtaskId) {
      updatedMatters = matters.map((m) => {
        if (m.id !== task.matterId) return m;
        const newSubtask = {
          id: task.subtaskId!,
          title: task.title,
          completed: false,
          dueDate: task.dueDate,
          priority: task.priority,
        };
        return {
          ...m,
          subtasks: [...(m.subtasks || []), newSubtask],
          updatedAt: new Date().toISOString(),
        };
      });
      setMatters(updatedMatters);
      saveStoredMatters(updatedMatters);
    }

    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);
    addToast('success', 'Action Item Added', task.title);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    const updatedTasks = tasks.filter((t) => t.id !== id);

    if (taskToDelete?.isMatterSubtask && taskToDelete.matterId && taskToDelete.subtaskId) {
      const updatedMatters = matters.map((m) => {
        if (m.id !== taskToDelete.matterId) return m;
        return {
          ...m,
          subtasks: (m.subtasks || []).filter((st) => st.id !== taskToDelete.subtaskId),
          updatedAt: new Date().toISOString(),
        };
      });
      setMatters(updatedMatters);
      saveStoredMatters(updatedMatters);
    }

    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      exportMattersToCSV(matters);
      addToast('success', 'CSV Journal Exported', 'Full practice entries exported to CSV file.');
    } catch {
      addToast('error', 'Export Failed', 'Could not generate CSV file.');
    }
  };

  // Reset to Seed Data
  const handleResetSeedData = () => {
    const { matters: seedMatters, tasks: seedTasks } = resetToSeedData();
    setMatters(seedMatters);
    setTasks(seedTasks);
    addToast('info', 'Demo Data Restored', '8 authentic MLA practice matters loaded.');
  };

  // Copy Lesson Takeaway
  const handleCopyLesson = (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
      addToast('success', 'Legal Takeaway Copied', 'Copied practical lesson to clipboard.');
    } catch {
      addToast('info', 'Lesson Ready', text.slice(0, 60));
    }
  };

  // Save Settings
  const handleSaveSettings = (newSettings: StorageSettings) => {
    setSettings(newSettings);
    saveLocalSettings(newSettings);
    addToast('success', 'Settings Saved', `Active mode: ${newSettings.useMongoBackend ? 'MongoDB Sync' : 'Local Storage'}`);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        stats={stats}
        selectedPracticeArea={selectedPracticeArea}
        onSelectPracticeArea={setSelectedPracticeArea}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Executive Topbar */}
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMatterModal={() => {
            setEditingMatter(null);
            setIsMatterModalOpen(true);
          }}
          onOpenTaskModal={() => setIsTaskModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onExportCSV={handleExportCSV}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMongoActive={settings.useMongoBackend}
        />

        {/* Dashboard Body Container */}
        <main
          style={{
            maxWidth: '1800px',
            width: '100%',
            margin: '0 auto',
            padding: '1.25rem',
          }}
        >
          {/* Section 1: Executive KPI Metrics Bar */}
          <StatsBar stats={stats} onNavigate={setActiveView} />

          {/* Section 2: Main Selected Feature View */}
          {activeView === 'feed' && (
            <AllEntriesView
              matters={matters}
              searchQuery={searchQuery}
              selectedPracticeArea={selectedPracticeArea}
              onSelectPracticeArea={setSelectedPracticeArea}
              onOpenMatterModal={() => {
                setEditingMatter(null);
                setIsMatterModalOpen(true);
              }}
              onEditMatter={(m) => {
                setEditingMatter(m);
                setIsMatterModalOpen(true);
              }}
              onDeleteMatter={handleDeleteMatter}
              onDuplicateMatter={handleDuplicateMatter}
              onToggleSubtask={handleToggleMatterSubtask}
              onCopyLesson={handleCopyLesson}
            />
          )}

          {activeView === 'timeline' && (
            <TimelineView
              matters={matters}
              onEditMatter={(m) => {
                setEditingMatter(m);
                setIsMatterModalOpen(true);
              }}
            />
          )}

          {activeView === 'lessons' && (
            <LessonsView
              matters={matters}
              onCopyLesson={handleCopyLesson}
              onEditMatter={(m) => {
                setEditingMatter(m);
                setIsMatterModalOpen(true);
              }}
            />
          )}

          {activeView === 'deadlines' && (
            <DeadlinesView
              matters={matters}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onEditMatter={(m) => {
                setEditingMatter(m);
                setIsMatterModalOpen(true);
              }}
            />
          )}

          {activeView === 'competency' && (
            <CompetencyView
              matters={matters}
              onSelectPracticeAreaFilter={(area) => {
                setSelectedPracticeArea(area);
                setActiveView('feed');
              }}
            />
          )}

          {activeView === 'todo' && (
            <TodoView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
              onEditMatter={(m) => {
                setEditingMatter(m);
                setIsMatterModalOpen(true);
              }}
              matters={matters}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        onSelectView={setActiveView}
        openTasksCount={stats.openTasksCount}
        overdueCount={stats.overdueCount}
      />

      {/* Matter Entry & Edit Modal */}
      <MatterModal
        isOpen={isMatterModalOpen}
        onClose={() => {
          setIsMatterModalOpen(false);
          setEditingMatter(null);
        }}
        onSave={handleSaveMatter}
        initialMatter={editingMatter}
      />

      {/* Daily Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleAddTask}
        matters={matters}
      />

      {/* System Settings & MongoDB Sync Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetSeedData={handleResetSeedData}
        onExportCSV={handleExportCSV}
      />

      {/* Global Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
