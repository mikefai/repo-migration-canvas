import React from 'react';
import {
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  FileEdit,
} from 'lucide-react';

export const NODE_STATUSES = {
  draft: {
    id: 'draft',
    label: 'Draft',
    badgeLabel: 'DRAFT',
    colorKey: 'slate',
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40 shadow-sm shadow-slate-950/30',
    textClass: 'text-slate-300',
    bgClass: 'bg-slate-950/40',
    borderClass: 'border-slate-500/40',
    icon: FileEdit,
    description: 'Initial draft or planning stage',
  },
  'in-progress': {
    id: 'in-progress',
    label: 'In Progress',
    badgeLabel: 'IN PROGRESS',
    colorKey: 'blue',
    dotClass: 'bg-blue-400 animate-pulse',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-950/30',
    textClass: 'text-blue-300',
    bgClass: 'bg-blue-950/40',
    borderClass: 'border-blue-500/40',
    icon: RefreshCw,
    description: 'Actively in progress / migration',
  },
  done: {
    id: 'done',
    label: 'Done',
    badgeLabel: 'DONE',
    colorKey: 'green',
    dotClass: 'bg-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/30',
    textClass: 'text-emerald-300',
    bgClass: 'bg-emerald-950/40',
    borderClass: 'border-emerald-500/40',
    icon: CheckCircle2,
    description: 'Completed and verified',
  },
  pending: {
    id: 'pending',
    label: 'Pending',
    badgeLabel: 'PENDING',
    colorKey: 'amber',
    dotClass: 'bg-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/30',
    textClass: 'text-amber-300',
    bgClass: 'bg-amber-950/40',
    borderClass: 'border-amber-500/40',
    icon: Clock,
    description: 'Awaiting migration / queued in roadmap',
  },
  migrated: {
    id: 'migrated',
    label: 'Migrated',
    badgeLabel: 'MIGRATED',
    colorKey: 'green',
    dotClass: 'bg-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/30',
    textClass: 'text-emerald-300',
    bgClass: 'bg-emerald-950/40',
    borderClass: 'border-emerald-500/40',
    icon: CheckCircle2,
    description: 'Successfully migrated & verified',
  },
  deprecated: {
    id: 'deprecated',
    label: 'Deprecated',
    badgeLabel: 'DEPRECATED',
    colorKey: 'red',
    dotClass: 'bg-rose-400',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950/30',
    textClass: 'text-rose-300',
    bgClass: 'bg-rose-950/40',
    borderClass: 'border-rose-500/40',
    icon: AlertTriangle,
    description: 'Marked as legacy / deprecated for removal',
  },
  stable: {
    id: 'stable',
    label: 'Stable',
    badgeLabel: 'STABLE',
    colorKey: 'green',
    dotClass: 'bg-teal-400',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm shadow-teal-950/30',
    textClass: 'text-teal-300',
    bgClass: 'bg-teal-950/40',
    borderClass: 'border-teal-500/40',
    icon: ShieldCheck,
    description: 'Production stable in destination architecture',
  },
  blocked: {
    id: 'blocked',
    label: 'Blocked',
    badgeLabel: 'BLOCKED',
    colorKey: 'amber',
    dotClass: 'bg-orange-400',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm shadow-orange-950/30',
    textClass: 'text-orange-300',
    bgClass: 'bg-orange-950/40',
    borderClass: 'border-orange-500/40',
    icon: AlertOctagon,
    description: 'Migration blocked by upstream dependency',
  },
};

export const PRIMARY_STATUS_KEYS = ['draft', 'in-progress', 'done'];

export const STATUS_LIST = Object.values(NODE_STATUSES);

/**
 * Resolves a status string into a normalized status configuration object.
 * Handles aliases such as 'draft', 'todo', 'done', 'planned', 'ready', 'archived', etc.
 */
export function getNodeStatus(status) {
  if (!status) return NODE_STATUSES['draft'];
  const key = String(status).toLowerCase().trim().replace(/\s+/g, '-');

  if (NODE_STATUSES[key]) return NODE_STATUSES[key];

  // Specific aliases
  if (key === 'draft' || key === 'new' || key === 'init') {
    return NODE_STATUSES['draft'];
  }
  if (key === 'done' || key === 'completed' || key === 'finished') {
    return NODE_STATUSES['done'];
  }
  if (key === 'in-progress' || key === 'inprogress' || key === 'active' || key === 'wip' || key === 'migrating') {
    return NODE_STATUSES['in-progress'];
  }
  if (key === 'todo' || key === 'planned' || key === 'planning' || key === 'queued' || key === 'backlog') {
    return NODE_STATUSES['pending'];
  }
  if (key === 'migrated') {
    return NODE_STATUSES['migrated'];
  }
  if (key === 'ready') {
    return NODE_STATUSES['stable'];
  }
  if (key === 'archived' || key === 'legacy' || key === 'deprecating') {
    return NODE_STATUSES['deprecated'];
  }

  return NODE_STATUSES['draft'];
}

/**
 * Colored Status Badge component for rendering directly on nodes.
 */
export function NodeStatusBadge({
  status,
  size = 'sm', // 'xs' | 'sm' | 'md'
  showIcon = false,
  interactive = false,
  onStatusChange,
  className = '',
}) {
  const current = getNodeStatus(status);
  const StatusIcon = current.icon;

  if (interactive && onStatusChange) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <select
          value={current.id}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className={`appearance-none cursor-pointer pl-4 pr-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono border focus:outline-none transition-all shadow-sm ${current.badgeClass}`}
          title={`Status: ${current.label} - ${current.description}`}
        >
          {STATUS_LIST.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100 font-sans text-xs">
              {s.badgeLabel} ({s.label})
            </option>
          ))}
        </select>
        <span
          className={`absolute left-1.5 w-1.5 h-1.5 rounded-full pointer-events-none ${current.dotClass}`}
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider border transition-colors ${current.badgeClass} ${className}`}
      title={`Status: ${current.label} (${current.description})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${current.dotClass}`} />
      {showIcon && <StatusIcon className="w-2.5 h-2.5 flex-shrink-0" />}
      <span>{current.badgeLabel}</span>
    </span>
  );
}
