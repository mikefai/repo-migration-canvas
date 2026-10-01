import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Server,
  Trash2,
  Edit2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { STATUS_COLORS } from '../../constants/statusColors';
import { resolveNodeIcon } from '../../utils/nodeIconHelper';
import { NodeStatusBadge, getNodeStatus, STATUS_LIST } from '../../utils/nodeStatus';
import { getNodeCategoryConfig } from '../../constants/nodeCategories';

const STATUS_MAP = {
  'in-progress': {
    label: 'MIGRATING',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    indicator: 'bg-cyan-400',
    icon: Activity,
  },
  'ready': {
    label: 'READY',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    indicator: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  'planned': {
    label: 'PLANNED',
    badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    indicator: 'bg-indigo-400',
    icon: Clock,
  },
  'deprecated': {
    label: 'DEPRECATING',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    indicator: 'bg-rose-400',
    icon: AlertTriangle,
  },
};

export const ServiceNode = memo(({ id, data, selected }) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(data.name || 'service');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(data.description || '');

  // Synchronize state with external data updates
  useEffect(() => {
    setTitleInput(data.name || 'service');
  }, [data.name]);

  useEffect(() => {
    setDescription(data.description || '');
  }, [data.description]);

  // Resolve node migration status
  const nodeStatus = getNodeStatus(data.status || 'in-progress');
  const statusCfg = nodeStatus;

  // Resolve dynamic architecture Lucide icon (database, cloud, server, etc.)
  const iconDef = resolveNodeIcon('serviceNode', data);
  const NodeIcon = iconDef.icon;

  const categoryCfg = getNodeCategoryConfig(data.category);

  // Custom status color override from right-click context menu or node status
  const activeColorKey = data.color || nodeStatus.colorKey;
  const customColor = activeColorKey && STATUS_COLORS[activeColorKey] ? STATUS_COLORS[activeColorKey] : null;
  const activeBg = customColor ? customColor.bg : categoryCfg ? categoryCfg.bg : 'bg-slate-950/90 border-slate-800';
  const activeHeaderBg = customColor
    ? customColor.headerBg
    : categoryCfg
    ? categoryCfg.headerBg
    : 'from-cyan-950/50 via-slate-900/60 to-slate-900/40';
  const activeRing = customColor
    ? customColor.selectedRing
    : categoryCfg
    ? categoryCfg.selectedRing
    : 'ring-2 ring-cyan-400 border-cyan-400 shadow-cyan-500/20';
  const handleBg = customColor ? customColor.handle : categoryCfg ? categoryCfg.handle : 'bg-cyan-500';

  const handleCopyEndpoint = (e) => {
    e.stopPropagation();
    const endpointStr = data.endpoints?.[0] || data.port || data.name;
    navigator.clipboard.writeText(endpointStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim() || 'service';
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, name: trimmed });
    }
  };

  const handleCancelTitle = () => {
    setTitleInput(data.name || 'service');
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const isFocused = data.isFocused;
  const isSearchMatch = data.isSearchMatch;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      title="Double-click node to edit service label. Right-click to change color/status."
      className={`w-72 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 overflow-hidden ${
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

      {/* Header */}
      <div className={`p-3 border-b border-slate-800 bg-gradient-to-r ${activeHeaderBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
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
                placeholder="Service name..."
                className="w-full bg-slate-950 border border-cyan-400 rounded px-1.5 py-0.5 text-xs text-white font-mono font-semibold focus:outline-none ring-1 ring-cyan-500/50 shadow-inner"
              />
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="group/title flex items-center gap-1.5 cursor-pointer max-w-full"
                title="Double-click to edit service label"
              >
                <h3 className="font-semibold text-sm text-slate-100 truncate tracking-tight font-mono group-hover/title:text-cyan-300 transition-colors">
                  {data.name || 'service'}
                </h3>
                <Edit2 className="w-2.5 h-2.5 text-slate-500 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <NodeStatusBadge
                status={data.status || 'in-progress'}
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
              <p className="text-[10px] text-slate-400 font-mono truncate">{data.serviceType || 'Service / API'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDeleteNode}
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/50 transition-colors flex-shrink-0"
          title="Delete Service Node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-3">
        {/* Status & Tech Stack */}
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

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 border border-slate-800">
            {data.techStack || 'Node.js'}
          </span>
        </div>

        {/* Port & Endpoint Details */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-500 text-[10px]">PORT:</span>
            <span className="text-slate-200 text-xs font-semibold">{data.port || ':8080'}</span>
          </div>
          <button
            onClick={handleCopyEndpoint}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[10px]"
            title="Copy Endpoint"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Description / Scope */}
        <div className="text-xs">
          {isEditingDesc ? (
            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDesc}
              placeholder="Describe service role, endpoints, or dependencies..."
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none h-16"
            />
          ) : (
            <div
              onClick={() => setIsEditingDesc(true)}
              className="group flex items-start gap-1.5 p-2 rounded hover:bg-slate-900/40 cursor-pointer text-slate-300 min-h-[36px]"
            >
              <span className="flex-1 text-[11px] leading-relaxed text-slate-300 italic">
                {description || 'Click to add service contracts & notes...'}
              </span>
              <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </div>
          )}
        </div>

        {/* Endpoints Pill List */}
        {data.endpoints && data.endpoints.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/80">
            {data.endpoints.map((ep, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
              >
                {ep}
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

ServiceNode.displayName = 'ServiceNode';
