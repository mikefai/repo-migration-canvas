import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  ExternalLink,
  Copy,
  Check,
  GitBranch,
  Trash2,
  Tag,
  Edit2,
  X,
  FileEdit,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { STATUS_COLORS } from '../../constants/statusColors';
import { resolveNodeIcon } from '../../utils/nodeIconHelper';
import {
  NodeStatusBadge,
  getNodeStatus,
  STATUS_LIST,
  PRIMARY_STATUS_KEYS,
} from '../../utils/nodeStatus';
import { getNodeCategoryConfig } from '../../constants/nodeCategories';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(data.repo || data.fullName || 'Repository');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(data.description || '');

  // Keep state in sync with external prop updates
  useEffect(() => {
    setTitleInput(data.repo || data.fullName || 'Repository');
  }, [data.repo, data.fullName]);

  useEffect(() => {
    setDescription(data.description || '');
  }, [data.description]);

  const roleKey = data.role && ROLE_STYLES[data.role] ? data.role : 'source';
  const roleStyle = ROLE_STYLES[roleKey];

  // Resolve dynamic architecture Lucide icon (github, cloud, database, etc.)
  const iconDef = resolveNodeIcon('repoNode', data);
  const NodeIcon = iconDef.icon;

  // Resolve node migration status ('draft', 'in-progress', 'done', etc.)
  const nodeStatus = getNodeStatus(
    data.status || (data.role === 'target' ? 'done' : data.role === 'reference' ? 'stable' : 'draft')
  );

  const categoryCfg = getNodeCategoryConfig(data.category);

  // Custom status color override from right-click context menu or node status
  const activeColorKey = data.color || nodeStatus.colorKey;
  const customColor = activeColorKey && STATUS_COLORS[activeColorKey] ? STATUS_COLORS[activeColorKey] : null;

  // Category color coding automatically applies when no manual color override is active
  const activeBg = customColor ? customColor.bg : categoryCfg ? categoryCfg.bg : roleStyle.bg;
  const activeHeaderBg = customColor ? customColor.headerBg : categoryCfg ? categoryCfg.headerBg : roleStyle.headerBg;
  const activeRing = customColor
    ? customColor.selectedRing
    : categoryCfg
    ? categoryCfg.selectedRing
    : 'ring-2 ring-blue-400 border-blue-400 shadow-blue-500/20';
  const handleBg = customColor ? customColor.handle : categoryCfg ? categoryCfg.handle : 'bg-blue-500';

  const handleStatusChange = (newStatus) => {
    if (data.onUpdateData) {
      const meta = getNodeStatus(newStatus);
      data.onUpdateData(id, {
        ...data,
        status: newStatus,
        color: data.color || meta.colorKey,
      });
    }
  };

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

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim() || 'repository';
    if (data.onUpdateData) {
      data.onUpdateData(id, {
        ...data,
        repo: trimmed,
        fullName: data.owner ? `${data.owner}/${trimmed}` : trimmed,
      });
    }
  };

  const handleCancelTitle = () => {
    setTitleInput(data.repo || data.fullName || 'Repository');
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    setIsEditingDesc(false);
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

  const isFocused = data.isFocused;
  const isSearchMatch = data.isSearchMatch;

  return (
    <div
      title="Click or double-click to edit repository name. Right-click to configure icon and theme."
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
      {/* Top handles */}
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

      {/* Header bar */}
      <div className={`p-3 border-b border-slate-800/80 bg-gradient-to-r ${activeHeaderBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-sm ${iconDef.bg}`}>
            <NodeIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveTitle();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      handleCancelTitle();
                    }
                  }}
                  placeholder="Repository name..."
                  className="w-full bg-slate-950 border border-blue-400 rounded px-1.5 py-0.5 text-xs text-white font-semibold font-mono focus:outline-none ring-1 ring-blue-500/50 shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white flex-shrink-0"
                  title="Save name"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelTitle}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="group/title flex items-center gap-1.5 cursor-pointer max-w-full"
                title="Click to edit repository name"
              >
                <h3 className="font-semibold text-sm text-slate-100 truncate tracking-tight group-hover/title:text-blue-300 transition-colors">
                  {data.repo || data.fullName || 'Repository'}
                </h3>
                <Edit2 className="w-3 h-3 text-slate-400 opacity-60 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <NodeStatusBadge
                status={nodeStatus.id}
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
              <p className="text-[10px] text-slate-400 font-mono truncate">{data.owner || data.role?.toUpperCase() || 'REPOSITORY'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDeleteNode}
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/50 transition-colors flex-shrink-0"
          title="Delete Node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body content */}
      <div className="p-3.5 space-y-3">
        {/* Editable Repository Name Input Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3 h-3 text-blue-400" />
              <span>Repository Name</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Editable field</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => {
                const val = e.target.value;
                setTitleInput(val);
              }}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveTitle();
                  e.target.blur();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelTitle();
                  e.target.blur();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="e.g. frontend-core or org/repo"
              className="w-full bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-950 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono font-medium placeholder-slate-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Status Badges Selector (Draft, In Progress, Done) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">Status Badges</span>
            <span className="text-[9px] text-slate-400 font-mono">
              Status: <span className={`font-bold ${nodeStatus.textClass}`}>{nodeStatus.badgeLabel}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {PRIMARY_STATUS_KEYS.map((key) => {
              const s = getNodeStatus(key);
              const isCurrent = nodeStatus.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(s.id);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-all ${
                    isCurrent
                      ? `${s.badgeClass} ring-1 ring-white/30 shadow-md font-bold`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Set status to ${s.label}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dotClass}`} />
                  <span className="text-[10px] truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role & Platform Badges */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
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
          {isEditingDesc ? (
            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDesc}
              placeholder="Add migration notes or purpose..."
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none h-16"
            />
          ) : (
            <div
              onClick={() => setIsEditingDesc(true)}
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

RepoNode.displayName = 'RepoNode';
