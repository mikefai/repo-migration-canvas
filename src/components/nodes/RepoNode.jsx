import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ExternalLink, Copy, Check, GitBranch, Github, Trash2, Tag, Edit2 } from 'lucide-react';

const ROLE_STYLES = {
  source: {
    cardBg: 'bg-white dark:bg-blue-950/80 border-blue-400 dark:border-blue-500/50 shadow-lg shadow-blue-500/10',
    badge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    headerBg: 'from-blue-100/90 to-blue-50/50 dark:from-blue-900/40 dark:to-slate-900/40',
    indicator: 'bg-blue-600 dark:bg-blue-500',
    iconBg: 'bg-blue-600 text-white dark:bg-slate-900/80 dark:text-slate-200 border-blue-400 dark:border-slate-700/60',
  },
  target: {
    cardBg: 'bg-white dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-500/50 shadow-lg shadow-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    headerBg: 'from-emerald-100/90 to-emerald-50/50 dark:from-emerald-900/40 dark:to-slate-900/40',
    indicator: 'bg-emerald-600 dark:bg-emerald-500',
    iconBg: 'bg-emerald-600 text-white dark:bg-slate-900/80 dark:text-slate-200 border-emerald-400 dark:border-slate-700/60',
  },
  reference: {
    cardBg: 'bg-white dark:bg-purple-950/80 border-purple-400 dark:border-purple-500/50 shadow-lg shadow-purple-500/10',
    badge: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    headerBg: 'from-purple-100/90 to-purple-50/50 dark:from-purple-900/40 dark:to-slate-900/40',
    indicator: 'bg-purple-600 dark:bg-purple-500',
    iconBg: 'bg-purple-600 text-white dark:bg-slate-900/80 dark:text-slate-200 border-purple-400 dark:border-slate-700/60',
  },
  archived: {
    cardBg: 'bg-white dark:bg-amber-950/80 border-amber-400 dark:border-amber-500/50 shadow-lg shadow-amber-500/10',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    headerBg: 'from-amber-100/90 to-amber-50/50 dark:from-amber-900/40 dark:to-slate-900/40',
    indicator: 'bg-amber-600 dark:bg-amber-500',
    iconBg: 'bg-amber-600 text-white dark:bg-slate-900/80 dark:text-slate-200 border-amber-400 dark:border-slate-700/60',
  },
};

export const RepoNode = memo(({ id, data, selected }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.description || '');

  const roleKey = data.role && ROLE_STYLES[data.role] ? data.role : 'source';
  const roleStyle = ROLE_STYLES[roleKey];

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    if (data.url) {
      navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRoleChange = (e) => {
    e.stopPropagation();
    const newRole = e.target.value;
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, role: newRole });
    }
  };

  const handleDescriptionBlur = () => {
    setIsEditing(false);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, description });
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
      className={`w-72 rounded-xl border-2 backdrop-blur-md transition-all duration-200 overflow-hidden ${
        roleStyle.cardBg
      } ${selected ? 'ring-4 ring-blue-500/40 border-blue-600 dark:border-blue-400 scale-[1.02]' : ''}`}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-900 !-top-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-900 !-left-2 hover:scale-125 transition-transform"
      />

      {/* Header bar */}
      <div className={`p-3 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-r ${roleStyle.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 font-bold shadow-sm ${roleStyle.iconBg}`}>
            {data.platform === 'github' ? <Github className="w-4 h-4" /> : <GitBranch className="w-4 h-4 text-orange-200 dark:text-orange-400" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate tracking-tight">{data.repo || data.fullName || 'Repository'}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">{data.owner || 'git-repo'}</p>
          </div>
        </div>

        <button
          onClick={handleDeleteNode}
          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/50 transition-colors"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body content */}
      <div className="p-3.5 space-y-3 bg-white/90 dark:bg-transparent">
        {/* Role & Platform Badges */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={roleKey}
            onChange={handleRoleChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-3 py-1 rounded-full font-bold border cursor-pointer focus:outline-none shadow-xs ${roleStyle.badge}`}
          >
            <option value="source">SOURCE REPO</option>
            <option value="target">TARGET REPO</option>
            <option value="reference">REFERENCE</option>
            <option value="archived">ARCHIVED</option>
          </select>

          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800">
            {data.platform || 'git'}
          </span>
        </div>

        {/* URL Link Bar */}
        {data.url && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-300 dark:bg-slate-900/70 dark:border-slate-800/80 text-xs font-mono">
            <span className="truncate flex-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">{data.url}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleCopyUrl}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                title="Open Repository"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Description / Notes */}
        <div className="text-xs">
          {isEditing ? (
            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add migration notes or purpose..."
              className="w-full bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-200 text-xs focus:outline-none resize-none h-16 font-medium"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-start gap-1.5 p-2 rounded-lg bg-slate-50/60 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900/40 cursor-pointer text-slate-800 dark:text-slate-300 min-h-[36px] border border-slate-200/60 dark:border-transparent"
            >
              <span className="flex-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium italic">
                {description || 'Click to add notes/description...'}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          )}
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200 dark:border-slate-800/60">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-900/80 dark:text-slate-400 dark:border-slate-800 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom & Right handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-900 !-bottom-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-900 !-right-2 hover:scale-125 transition-transform"
      />
    </div>
  );
});

RepoNode.displayName = 'RepoNode';
