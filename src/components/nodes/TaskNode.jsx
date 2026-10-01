import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  Edit2,
} from 'lucide-react';
import { STATUS_COLORS } from '../../constants/statusColors';
import { resolveNodeIcon } from '../../utils/nodeIconHelper';
import { NodeStatusBadge, getNodeStatus, STATUS_LIST } from '../../utils/nodeStatus';
import { getNodeCategoryConfig } from '../../constants/nodeCategories';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(data.title || 'Migration Task');

  useEffect(() => {
    setTitleInput(data.title || 'Migration Task');
  }, [data.title]);

  const nodeStatus = getNodeStatus(data.status || 'todo');
  const statusConfig = nodeStatus;
  const StatusIcon = nodeStatus.icon;

  // Resolve dynamic architecture Lucide icon
  const iconDef = resolveNodeIcon('taskNode', data);
  const NodeIcon = iconDef.icon;

  const priority = data.priority || 'medium';
  const checklist = data.checklist || [];

  const completedCount = checklist.filter((item) => item.done).length;
  const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const categoryCfg = getNodeCategoryConfig(data.category);

  // Custom status color override from right-click context menu or node status
  const activeColorKey = data.color || nodeStatus.colorKey;
  const customColor = activeColorKey && STATUS_COLORS[activeColorKey] ? STATUS_COLORS[activeColorKey] : null;
  const activeBg = customColor ? customColor.bg : categoryCfg ? categoryCfg.bg : 'bg-slate-950/90 border-slate-800';
  const activeHeaderBg = customColor
    ? customColor.headerBg
    : categoryCfg
    ? categoryCfg.headerBg
    : 'from-indigo-950/50 to-slate-900/50';
  const activeRing = customColor
    ? customColor.selectedRing
    : categoryCfg
    ? categoryCfg.selectedRing
    : 'ring-2 ring-indigo-500 border-indigo-500 shadow-indigo-500/20';
  const handleBg = customColor ? customColor.handle : categoryCfg ? categoryCfg.handle : 'bg-indigo-500';

  const handleStatusChange = (nextStatusOrEvent) => {
    const nextStatus = typeof nextStatusOrEvent === 'string'
      ? nextStatusOrEvent
      : nextStatusOrEvent?.target?.value;
    if (!nextStatus) return;
    if (data.onUpdateData) {
      const meta = getNodeStatus(nextStatus);
      data.onUpdateData(id, {
        ...data,
        status: nextStatus,
        color: data.color || meta.colorKey,
      });
    }
  };

  const handlePriorityChange = (e) => {
    e.stopPropagation();
    const nextPriority = e.target.value;
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, priority: nextPriority });
    }
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim() || 'Migration Task';
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, title: trimmed });
    }
  };

  const handleCancelTitle = () => {
    setTitleInput(data.title || 'Migration Task');
    setIsEditingTitle(false);
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const isFocused = data.isFocused;
  const isSearchMatch = data.isSearchMatch;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      title="Double-click node to edit task label. Right-click to change color/status."
      className={`w-80 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 overflow-hidden ${
        activeBg
      } ${
        isFocused
          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-amber-500/50 z-50 animate-pulse'
          : isSearchMatch
          ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-slate-950 scale-[1.01] shadow-amber-500/30 z-40'
          : selected
          ? activeRing
          : 'border-slate-800'
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3.5 h-3.5 ${handleBg} border-2 border-slate-900 !-top-2 hover:scale-125 transition-transform`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`w-3.5 h-3.5 ${handleBg} border-2 border-slate-900 !-left-2 hover:scale-125 transition-transform`}
      />

      {/* Header */}
      <div className={`p-3 border-b border-slate-800 bg-gradient-to-r ${activeHeaderBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-sm ${iconDef.bg}`}>
            <NodeIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveTitle();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelTitle();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                placeholder="Task title..."
                className="w-full bg-slate-950 border border-indigo-400 rounded px-1.5 py-0.5 text-xs text-white font-semibold focus:outline-none ring-1 ring-indigo-500/50 shadow-inner"
              />
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="group/title flex items-center gap-1.5 cursor-pointer max-w-full"
                title="Double-click to edit task label"
              >
                <h3 className="font-semibold text-sm text-slate-100 truncate group-hover/title:text-indigo-300 transition-colors">
                  {data.title || 'Migration Task'}
                </h3>
                <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <NodeStatusBadge
                status={data.status || 'todo'}
                interactive={true}
                onStatusChange={handleStatusChange}
              />
              {categoryCfg ? (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border flex items-center gap-1 shadow-sm ${categoryCfg.badge}`}>
                  <categoryCfg.icon className="w-2.5 h-2.5" />
                  <span>{categoryCfg.id}</span>
                </span>
              ) : (
                <span className={`text-[9px] px-1 py-0.5 rounded font-mono font-medium border ${iconDef.badge}`}>
                  {iconDef.label}
                </span>
              )}
              <p className="text-[10px] text-slate-400 font-mono truncate">{nodeStatus.badgeLabel}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDeleteNode}
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/50 transition-colors flex-shrink-0"
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
            value={nodeStatus.id}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border cursor-pointer focus:outline-none ${nodeStatus.badgeClass}`}
          >
            {STATUS_LIST.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100 font-sans text-xs">
                {s.badgeLabel} ({s.label})
              </option>
            ))}
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
        className={`w-3.5 h-3.5 ${handleBg} border-2 border-slate-900 !-bottom-2 hover:scale-125 transition-transform`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-3.5 h-3.5 ${handleBg} border-2 border-slate-900 !-right-2 hover:scale-125 transition-transform`}
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
