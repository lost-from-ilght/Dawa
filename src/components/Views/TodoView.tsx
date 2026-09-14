'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  CheckCircle,
  Circle,
  Trash2,
  Briefcase,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyTask, Matter, MatterPriority } from '@/types';

interface TodoViewProps {
  tasks: DailyTask[];
  onToggleTask: (task: DailyTask) => void;
  onAddTask: (task: DailyTask) => void;
  onDeleteTask: (id: string) => void;
  onOpenTaskModal: () => void;
  onEditMatter?: (m: Matter) => void;
  matters: Matter[];
}

type TodoFilter = 'all' | 'today' | 'upcoming' | 'matter-only' | 'completed';

export const TodoView: React.FC<TodoViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenTaskModal,
  onEditMatter,
  matters,
}) => {
  const [activeFilter, setActiveFilter] = useState<TodoFilter>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<MatterPriority>('Medium');
  const todayStr = new Date().toISOString().slice(0, 10);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: quickTitle.trim(),
      priority: quickPriority,
      dueDate: todayStr,
      completed: false,
      isMatterSubtask: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setQuickTitle('');
  };

  const handleToggle = (task: DailyTask) => {
    if (!task.completed) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#3B82F6', '#10B981', '#D4AF37'],
        });
      } catch {
        // Confetti optional
      }
    }
    onToggleTask(task);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeFilter === 'today') {
        return !t.completed && t.dueDate === todayStr;
      }
      if (activeFilter === 'upcoming') {
        return !t.completed && Boolean(t.dueDate && t.dueDate > todayStr);
      }
      if (activeFilter === 'matter-only') {
        return t.isMatterSubtask;
      }
      if (activeFilter === 'completed') {
        return t.completed;
      }
      return true; // 'all'
    });
  }, [tasks, activeFilter, todayStr]);

  const openCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* View Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckSquare size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F8FAFC' }}>
              Daily Action Items & Docket To-Do
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              2-way synchronized with active matter subtasks ({openCount} open, {completedCount} completed)
            </div>
          </div>
        </div>

        <button
          onClick={onOpenTaskModal}
          className="btn btn-gold"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
        >
          <Plus size={15} />
          <span>New Detailed Task</span>
        </button>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="glass-panel"
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="+ Quick add a daily action item or client follow-up..."
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="input-field"
          style={{ flex: 1, minWidth: '220px', height: '36px', fontSize: '0.825rem' }}
        />

        <select
          value={quickPriority}
          onChange={(e) => setQuickPriority(e.target.value as MatterPriority)}
          className="select-field"
          style={{ width: '130px', height: '36px', fontSize: '0.78rem' }}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium</option>
          <option value="Low">Standard</option>
        </select>

        <button
          type="submit"
          className="btn btn-secondary"
          style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.8rem' }}
        >
          <Plus size={15} /> Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {[
          { id: 'all' as TodoFilter, label: 'All Tasks', count: tasks.length },
          { id: 'today' as TodoFilter, label: 'Due Today', count: tasks.filter((t) => !t.completed && t.dueDate === todayStr).length },
          { id: 'upcoming' as TodoFilter, label: 'Upcoming', count: tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr).length },
          { id: 'matter-only' as TodoFilter, label: 'Matter Subtasks', count: tasks.filter((t) => t.isMatterSubtask).length },
          { id: 'completed' as TodoFilter, label: 'Completed', count: completedCount },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: isActive ? '1px solid #D4AF37' : '1px solid var(--border-subtle)',
                color: isActive ? '#F8FAFC' : '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#D4AF37' : '#94A3B8',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task Items List */}
      {filteredTasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredTasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
            let priorityColor = '#94A3B8';
            if (task.priority === 'High') priorityColor = '#EF4444';
            if (task.priority === 'Medium') priorityColor = '#F59E0B';

            return (
              <div
                key={task.id}
                className="glass-panel"
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  background: task.completed ? 'rgba(10, 16, 34, 0.4)' : undefined,
                  borderLeft: `3px solid ${priorityColor}`,
                  opacity: task.completed ? 0.75 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <button
                    onClick={() => handleToggle(task)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                  >
                    {task.completed ? (
                      <CheckCircle size={19} color="#34D399" />
                    ) : (
                      <Circle size={19} color="#64748B" />
                    )}
                  </button>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: task.completed ? '#64748B' : '#F8FAFC',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        fontWeight: task.completed ? 400 : 500,
                        lineHeight: 1.35,
                      }}
                    >
                      {task.title}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.72rem',
                        color: '#94A3B8',
                        marginTop: '3px',
                      }}
                    >
                      {task.isMatterSubtask && task.clientReference && (
                        <span
                          style={{
                            background: 'rgba(212, 175, 55, 0.12)',
                            color: '#D4AF37',
                            border: '1px solid rgba(212, 175, 55, 0.25)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          {task.clientReference}
                        </span>
                      )}

                      {task.matterTitle && (
                        <span style={{ color: '#94A3B8' }}>
                          Matter: {task.matterTitle.slice(0, 35)}...
                        </span>
                      )}

                      <span style={{ color: priorityColor, fontWeight: 500 }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                  {task.dueDate && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: isOverdue ? '#F87171' : '#94A3B8',
                        fontWeight: isOverdue ? 700 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Calendar size={12} />
                      <span>{task.dueDate}</span>
                    </span>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="btn btn-ghost"
                    style={{ padding: '0.3rem', color: '#94A3B8' }}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
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
          <CheckSquare size={36} color="#64748B" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#F8FAFC' }}>No tasks in this view</h3>
          <p style={{ fontSize: '0.85rem' }}>
            {activeFilter === 'completed'
              ? 'No completed tasks yet. Check off items as you finish them!'
              : 'All caught up on action items. Add a new task above.'}
          </p>
        </div>
      )}
    </div>
  );
};
