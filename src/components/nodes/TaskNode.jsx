import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckSquare, Square, Plus, Trash2, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const STATUS_CONFIG = {
  'todo': {
    label: 'TO DO',
    badge: 'bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-extrabold',
    icon: Clock,
  },
  'in-progress': {
    label: 'IN PROGRESS',
    badge: 'bg-blue-100 text-blue-900 border-blue-400 dark:bg-blue-500/30 dark:text-blue-300 dark:border-blue-400 font-extrabold',
    icon: Sparkles,
  },
  'done': {
    label: 'DONE',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-400 font-extrabold',
    icon: CheckCircle2,
  },
};

const PRIORITY_CONFIG = {
  low: 'text-slate-800 bg-slate-100 border-slate-300 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 font-bold',
  medium: 'text-amber-900 bg-amber-100 border-amber-300 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800/60 font-bold',
  high: 'text-orange-900 bg-orange-100 border-orange-300 dark:text-orange-300 dark:bg-orange-950/40 dark:border-orange-800/60 font-extrabold',
  critical: 'text-rose-900 bg-rose-100 border-rose-300 dark:text-rose-300 dark:bg-rose-950/50 dark:border-rose-800/80 font-extrabold',
};

export const TaskNode = memo(({ id, data, selected }) => {
  const [newCheckitem, setNewCheckitem] = useState('');

  const status = data.status || 'todo';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
  const StatusIcon = statusConfig.icon;

  const priority = data.priority || 'medium';
  const checklist = data.checklist || [];

  const completedCount = checklist.filter((item) => item.done).length;
  const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const handleStatusChange = (e) => {
    e.stopPropagation();
    const nextStatus = e.target.value;
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, status: nextStatus });
    }
  };

  const handlePriorityChange = (e) => {
    e.stopPropagation();
    const nextPriority = e.target.value;
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, priority: nextPriority });
    }
  };

  const handleToggleChecklist = (checkId) => {
    const updated = checklist.map((item) =>
      item.id === checkId ? { ...item, done: !item.done } : item
    );
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, checklist: updated });
    }
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newCheckitem.trim()) return;
    const updated = [
      ...checklist,
      { id: 'c-' + Date.now(), text: newCheckitem.trim(), done: false },
    ];
    setNewCheckitem('');
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, checklist: updated });
    }
  };

  const handleDeleteCheckItem = (checkId) => {
    const updated = checklist.filter((item) => item.id !== checkId);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, checklist: updated });
    }
  };

  const handleDeleteNode = (e) => {
    e.stopPropagation();
    if (data.onDeleteNode) {
      data.onDeleteNode(id);
    }
  };

  return (
    <div
      className={`w-84 rounded-2xl border-2 bg-white dark:bg-slate-950 backdrop-blur-md shadow-xl transition-all duration-200 overflow-visible relative ${
        selected ? 'ring-4 ring-indigo-500/50 border-indigo-600 dark:border-indigo-400 scale-[1.02] shadow-2xl' : 'border-indigo-400 dark:border-indigo-600'
      }`}
    >
      {/* 4-Directional Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      {/* Solid High-Contrast Header */}
      <div className="p-3.5 border-b-2 border-indigo-700 dark:border-indigo-900 bg-indigo-600 dark:bg-indigo-950 text-white flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <StatusIcon className="w-5 h-5 text-indigo-100 dark:text-indigo-300" />
          <h3 className="font-extrabold text-base text-white dark:text-indigo-100 truncate">{data.title || 'Migration Task'}</h3>
        </div>
        <button
          onClick={handleDeleteNode}
          className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-black/20 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3.5 bg-white/95 dark:bg-slate-950/90 rounded-b-xl">
        {/* Status & Priority Selectors */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-3.5 py-1.5 rounded-full font-extrabold border-2 cursor-pointer focus:outline-none shadow-xs uppercase tracking-wide ${statusConfig.badge}`}
          >
            <option value="todo">TO DO</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="done">DONE</option>
          </select>

          <select
            value={priority}
            onChange={handlePriorityChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-3 py-1 rounded-lg border-2 uppercase font-mono cursor-pointer focus:outline-none ${PRIORITY_CONFIG[priority]}`}
          >
            <option value="low">LOW</option>
            <option value="medium">MED</option>
            <option value="high">HIGH</option>
            <option value="critical">CRITICAL</option>
          </select>
        </div>

        {/* Task Description */}
        {data.description && (
          <p className="text-xs text-slate-900 dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-800">
            {data.description}
          </p>
        )}

        {/* Checklist section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-900 dark:text-slate-300 font-extrabold">
            <span>Checklist</span>
            <span>{completedCount} / {checklist.length} ({progressPct}%)</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                progressPct === 100 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Checklist items list */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/80 cursor-pointer text-xs transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.done ? (
                    <CheckSquare className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`truncate font-semibold text-slate-900 dark:text-slate-200 text-xs ${item.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCheckItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add checklist input */}
          <form onSubmit={handleAddChecklist} className="flex items-center gap-1.5 pt-1.5">
            <input
              type="text"
              value={newCheckitem}
              onChange={(e) => setNewCheckitem(e.target.value)}
              placeholder="Add step/subtask..."
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
