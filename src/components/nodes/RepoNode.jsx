import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ExternalLink, Copy, Check, GitBranch, Github, Code, Trash2, Tag, Edit2 } from 'lucide-react';

const ROLE_STYLES = {
  source: {
    bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    headerBg: 'from-blue-900/40 to-slate-900/40',
    indicator: 'bg-blue-500',
    title: 'SOURCE REPO',
  },
  target: {
    bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    headerBg: 'from-emerald-900/40 to-slate-900/40',
    indicator: 'bg-emerald-500',
    title: 'TARGET REPO',
  },
  reference: {
    bg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    headerBg: 'from-purple-900/40 to-slate-900/40',
    indicator: 'bg-purple-500',
    title: 'REFERENCE',
  },
  archived: {
    bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    headerBg: 'from-amber-900/40 to-slate-900/40',
    indicator: 'bg-amber-500',
    title: 'ARCHIVED',
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
      className={`w-72 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 overflow-hidden ${
        roleStyle.bg
      } ${selected ? 'ring-2 ring-blue-400 border-blue-400 shadow-blue-500/20' : 'border-slate-800'}`}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 !-top-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 !-left-2 hover:scale-125 transition-transform"
      />

      {/* Header bar */}
      <div className={`p-3 border-b border-slate-800/80 bg-gradient-to-r ${roleStyle.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-200 flex-shrink-0">
            {data.platform === 'github' ? <Github className="w-4 h-4" /> : <GitBranch className="w-4 h-4 text-orange-400" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-slate-100 truncate tracking-tight">{data.repo || data.fullName || 'Repository'}</h3>
            <p className="text-xs text-slate-400 truncate">{data.owner || 'git-repo'}</p>
          </div>
        </div>

        <button
          onClick={handleDeleteNode}
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/50 transition-colors"
          title="Delete Node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body content */}
      <div className="p-3.5 space-y-3">
        {/* Role & Platform Badges */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={roleKey}
            onChange={handleRoleChange}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border cursor-pointer focus:outline-none ${roleStyle.badge}`}
          >
            <option value="source" className="bg-slate-900 text-blue-300">SOURCE REPO</option>
            <option value="target" className="bg-slate-900 text-emerald-300">TARGET REPO</option>
            <option value="reference" className="bg-slate-900 text-purple-300">REFERENCE</option>
            <option value="archived" className="bg-slate-900 text-amber-300">ARCHIVED</option>
          </select>

          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800">
            {data.platform || 'git'}
          </span>
        </div>

        {/* URL Link Bar */}
        {data.url && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 font-mono">
            <span className="truncate flex-1 text-slate-400 text-[11px]">{data.url}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleCopyUrl}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
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
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none h-16"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-start gap-1.5 p-2 rounded hover:bg-slate-900/40 cursor-pointer text-slate-300 min-h-[36px]"
            >
              <span className="flex-1 text-[11px] leading-relaxed text-slate-300 italic">
                {description || 'Click to add notes/description...'}
              </span>
              <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          )}
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-400 border border-slate-800 flex items-center gap-1"
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
        className="w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 !-bottom-2 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3.5 h-3.5 bg-blue-500 border-2 border-slate-900 !-right-2 hover:scale-125 transition-transform"
      />
    </div>
  );
});

RepoNode.displayName = 'RepoNode';
