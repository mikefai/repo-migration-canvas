import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ExternalLink, Copy, Check, GitBranch, Github, Trash2, Tag, Edit2, Link2 } from 'lucide-react';

const ROLE_STYLES = {
  source: {
    cardBg: 'bg-white dark:bg-slate-950 border-2 border-blue-400 dark:border-blue-600 shadow-xl shadow-blue-500/10',
    badge: 'bg-blue-100 text-blue-950 border-blue-400 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500 font-extrabold',
    headerBg: 'bg-blue-600 dark:bg-blue-950 border-b-2 border-blue-700 dark:border-blue-900 text-white',
    titleText: 'text-white font-extrabold text-base',
    ownerText: 'text-blue-100 dark:text-blue-300 font-bold text-xs',
    iconBg: 'bg-blue-700 text-white dark:bg-blue-900 border-blue-500',
  },
  target: {
    cardBg: 'bg-white dark:bg-slate-950 border-2 border-emerald-400 dark:border-emerald-600 shadow-xl shadow-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500 font-extrabold',
    headerBg: 'bg-emerald-600 dark:bg-emerald-950 border-b-2 border-emerald-700 dark:border-emerald-900 text-white',
    titleText: 'text-white font-extrabold text-base',
    ownerText: 'text-emerald-100 dark:text-emerald-300 font-bold text-xs',
    iconBg: 'bg-emerald-700 text-white dark:bg-emerald-900 border-emerald-500',
  },
  reference: {
    cardBg: 'bg-white dark:bg-slate-950 border-2 border-purple-400 dark:border-purple-600 shadow-xl shadow-purple-500/10',
    badge: 'bg-purple-100 text-purple-950 border-purple-400 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500 font-extrabold',
    headerBg: 'bg-purple-600 dark:bg-purple-950 border-b-2 border-purple-700 dark:border-purple-900 text-white',
    titleText: 'text-white font-extrabold text-base',
    ownerText: 'text-purple-100 dark:text-purple-300 font-bold text-xs',
    iconBg: 'bg-purple-700 text-white dark:bg-purple-900 border-purple-500',
  },
  archived: {
    cardBg: 'bg-white dark:bg-slate-950 border-2 border-amber-400 dark:border-amber-600 shadow-xl shadow-amber-500/10',
    badge: 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500 font-extrabold',
    headerBg: 'bg-amber-600 dark:bg-amber-950 border-b-2 border-amber-700 dark:border-amber-900 text-white',
    titleText: 'text-white font-extrabold text-base',
    ownerText: 'text-amber-100 dark:text-amber-300 font-bold text-xs',
    iconBg: 'bg-amber-700 text-white dark:bg-amber-900 border-amber-500',
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
      className={`w-84 rounded-2xl border-2 backdrop-blur-md transition-all duration-200 overflow-visible relative ${
        roleStyle.cardBg
      } ${selected ? 'ring-4 ring-blue-500/50 border-blue-600 dark:border-blue-400 scale-[1.02] shadow-2xl' : ''}`}
    >
      {/* 4-Directional Dual Source & Target Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect to Top (Target)"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect from Top (Source)"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect to Bottom (Target)"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect from Bottom (Source)"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect to Left (Target)"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect from Left (Source)"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect to Right (Target)"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
        title="Connect from Right (Source)"
      />

      {/* Solid High-Contrast Header Bar */}
      <div className={`p-3.5 ${roleStyle.headerBg} flex items-center justify-between rounded-t-xl`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center flex-shrink-0 font-bold shadow-sm ${roleStyle.iconBg}`}>
            {data.platform === 'github' ? <Github className="w-5 h-5" /> : <GitBranch className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h3 className={`${roleStyle.titleText} truncate tracking-tight`}>{data.repo || data.fullName || 'Repository'}</h3>
            <p className={`${roleStyle.ownerText} truncate`}>{data.owner || 'git-repo'}</p>
          </div>
        </div>

        <button
          onClick={handleDeleteNode}
          className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-black/20 transition-colors"
          title="Delete Repository Card"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3.5 bg-white/95 dark:bg-slate-950/90 rounded-b-xl">
        {/* Role & Platform Badges */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={roleKey}
            onChange={handleRoleChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-3.5 py-1.5 rounded-full font-extrabold border-2 cursor-pointer focus:outline-none shadow-xs uppercase tracking-wide ${roleStyle.badge}`}
          >
            <option value="source">SOURCE REPO</option>
            <option value="target">TARGET REPO</option>
            <option value="reference">REFERENCE</option>
            <option value="archived">ARCHIVED</option>
          </select>

          <span className="text-xs font-mono uppercase font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border-2 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700">
            {data.platform || 'git'}
          </span>
        </div>

        {/* HIGH VISIBILITY REPOSITORY URL LINK */}
        {data.url && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Repository URL
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-50/90 border-2 border-blue-300 dark:bg-slate-900 dark:border-blue-500/50 shadow-inner">
              <span className="truncate flex-1 text-slate-900 dark:text-blue-300 text-xs font-mono font-bold select-all leading-normal">
                {data.url}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-colors"
                  title="Open Repository in Browser"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
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
              className="w-full bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-400 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none resize-none h-20 font-medium"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-slate-800 dark:text-slate-200 min-h-[40px] border border-slate-200 dark:border-slate-800"
            >
              <span className="flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium italic">
                {description || 'Click to add notes/description...'}
              </span>
              <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          )}
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-slate-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RepoNode.displayName = 'RepoNode';
