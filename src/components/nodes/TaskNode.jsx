import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckSquare, Square, Plus, Trash2, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const STATUS_CONFIG = {
  'todo': {
    label: 'TO DO',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
  },
  'in-progress': {
    label: 'IN PROGRESS',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    icon: Sparkles,
  },
  'done': {
    label: 'DONE',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: CheckCircle2,
  },
};

const PRIORITY_CONFIG = {
  low: 'text-slate-400 bg-slate-900 border-slate-800',
  medium: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
  high: 'text-orange-400 bg-orange-950/40 border-orange-800/60',
  critical: 'text-rose-400 bg-rose-950/50 border-rose-800/80 font-bold',
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
      className={`w-80 rounded-xl border bg-slate-950/90 backdrop-blur-md shadow-2xl transition-all duration-200 overflow-hidden ${
        selected ? 'ring-2 ring-blue-500 border-blue-500 shadow-blue-500/20' : 'border-slate-800'
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 !-top-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 !-left-2 hover:scale-125 transition-transform"
      />

      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-gradient-to-r from-indigo-950/50 to-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon className={`w-4 h-4 ${status === 'done' ? 'text-emerald-400' : status === 'in-progress' ? 'text-blue-400' : 'text-slate-400'}`} />
          <h3 className="font-semibold text-sm text-slate-100 truncate">{data.title || 'Migration Task'}</h3>
        </div>
        <button
          onClick={handleDeleteNode}
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/50 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-3">
        {/* Status & Priority Selectors */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border cursor-pointer focus:outline-none ${statusConfig.badge}`}
          >
            <option value="todo" className="bg-slate-900 text-slate-300">TO DO</option>
            <option value="in-progress" className="bg-slate-900 text-blue-400">IN PROGRESS</option>
            <option value="done" className="bg-slate-900 text-emerald-400">DONE</option>
          </select>

          <select
            value={priority}
            onChange={handlePriorityChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-2 py-0.5 rounded border uppercase font-mono cursor-pointer focus:outline-none ${PRIORITY_CONFIG[priority]}`}
          >
            <option value="low" className="bg-slate-900 text-slate-300">LOW</option>
            <option value="medium" className="bg-slate-900 text-amber-400">MED</option>
            <option value="high" className="bg-slate-900 text-orange-400">HIGH</option>
            <option value="critical" className="bg-slate-900 text-rose-400">CRITICAL</option>
          </select>
        </div>

        {/* Task Description */}
        {data.description && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            {data.description}
          </p>
        )}

        {/* Checklist section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Checklist</span>
            <span>{completedCount} / {checklist.length} ({progressPct}%)</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                progressPct === 100 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Checklist items list */}
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className="group flex items-center justify-between p-1.5 rounded hover:bg-slate-900/80 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.done ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`truncate text-slate-200 ${item.done ? 'line-through text-slate-500' : ''}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCheckItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add checklist input */}
          <form onSubmit={handleAddChecklist} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={newCheckitem}
              onChange={(e) => setNewCheckitem(e.target.value)}
              placeholder="Add step/subtask..."
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom & Right handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 !-bottom-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 !-right-2 hover:scale-125 transition-transform"
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
