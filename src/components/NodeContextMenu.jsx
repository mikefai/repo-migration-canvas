import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Palette,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  Tag,
  Tags,
} from 'lucide-react';
import { STATUS_COLORS } from '../constants/statusColors';
import { ICON_DEFINITIONS, resolveNodeIcon } from '../utils/nodeIconHelper';
import { NodeStatusBadge, getNodeStatus, STATUS_LIST } from '../utils/nodeStatus';
import { NODE_CATEGORIES } from '../constants/nodeCategories';

export function NodeContextMenu({
  isOpen,
  x,
  y,
  node,
  onClose,
  onSetNodeStatus,
  onSetNodeCategory,
  onSetNodeColor,
  onSetNodeIcon,
  onDuplicateNode,
  onDeleteNode,
}) {
  const menuRef = useRef(null);

  // Close context menu on outside click or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  // Clamped screen coordinates so menu never overflows screen boundaries
  const menuWidth = 290;
  const menuHeight = 520;
  const clampedX = Math.min(Math.max(12, x), window.innerWidth - menuWidth - 16);
  const clampedY = Math.min(Math.max(12, y), window.innerHeight - menuHeight - 16);

  const nodeName =
    node.data?.name ||
    node.data?.repo ||
    node.data?.fullName ||
    node.data?.title ||
    node.data?.label ||
    'Node';

  const currentColor = node.data?.color || 'slate';
  const currentIconDef = resolveNodeIcon(node.type, node.data);
  const CurrentIcon = currentIconDef.icon;
  const currentNodeStatus = getNodeStatus(node.data?.status || 'pending');

  const handleStatusSelect = (statusKey) => {
    onSetNodeStatus?.(node.id, statusKey);
  };

  const handleColorSelect = (colorKey) => {
    onSetNodeColor?.(node.id, colorKey);
  };

  const handleIconSelect = (iconKey) => {
    onSetNodeIcon?.(node.id, iconKey);
  };

  const handleDuplicate = () => {
    onDuplicateNode?.(node);
    onClose();
  };

  const handleDelete = () => {
    onDeleteNode?.(node.id);
    onClose();
  };

  // Primary selectable icons
  const primaryIcons = [
    'database',
    'cloud',
    'github',
    'server',
    'worker',
    'container',
    'cache',
    'storage',
    'security',
    'git',
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ left: clampedX, top: clampedY }}
        className="fixed z-50 w-72 max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-2.5 select-none ring-1 ring-white/10"
      >
        {/* Node Header Preview with current status badge */}
        <div className="px-2 py-1.5 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-sm ${currentIconDef.bg}`}>
              <CurrentIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs text-slate-100 truncate">{nodeName}</span>
          </div>
          <NodeStatusBadge status={node.data?.status} />
        </div>

        {/* Node Migration Status Options */}
        <div className="pt-2 pb-2 border-b border-slate-800/80">
          <div className="px-1.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Migration Status</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              {currentNodeStatus.badgeLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
            {STATUS_LIST.map((s) => {
              const isSelected = currentNodeStatus.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStatusSelect(s.id)}
                  title={s.description}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `${s.badgeClass} ring-1 ring-white/30 font-bold`
                      : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dotClass}`} />
                  <span className="text-[10px] font-mono leading-none truncate flex-1">{s.badgeLabel}</span>
                  {isSelected && <Check className="w-3 h-3 flex-shrink-0 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Selector Grid */}
        <div className="pt-2 pb-2 border-b border-slate-800/80">
          <div className="px-1.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tags className="w-3 h-3 text-amber-400" />
              <span>Category Color</span>
            </span>
            <span className="text-[9px] text-amber-400 font-mono font-bold truncate max-w-[100px]">
              {node.data?.category || 'Auto'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
            {Object.entries(NODE_CATEGORIES).map(([catKey, catCfg]) => {
              const isSelected = (node.data?.category || '').toLowerCase() === catKey.toLowerCase();
              const CatIcon = catCfg.icon;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => onSetNodeCategory?.(node.id, catKey)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `${catCfg.badge} ring-1 ring-white/30 font-bold shadow-sm`
                      : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${catCfg.textColor}`} />
                  <span className="text-[10px] font-mono leading-none truncate flex-1">{catCfg.label}</span>
                  {isSelected && <Check className="w-3 h-3 flex-shrink-0 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Architecture Icon Grid */}
        <div className="pt-2 pb-1.5 border-b border-slate-800/80">
          <div className="px-1.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Architecture Icon</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              {node.data?.icon ? 'Custom' : 'Auto'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1.5">
            {primaryIcons.map((key) => {
              const def = ICON_DEFINITIONS[key];
              if (!def) return null;
              const IconComp = def.icon;
              const isSelected = (node.data?.icon || currentIconDef.id) === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleIconSelect(key)}
                  title={`${def.label} (${def.description})`}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-sm shadow-cyan-500/20'
                      : 'border-slate-800/90 bg-slate-950/60 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${def.color}`} />
                  <span className="text-[8px] font-medium mt-1 text-slate-300 truncate w-full text-center">
                    {def.label.split('/')[0].trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Background Color Section */}
        <div className="pt-2 pb-1">
          <div className="px-1.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-blue-400" />
            <span>Theme Accent Color</span>
          </div>

          <div className="space-y-0.5 mt-1 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
            {Object.entries(STATUS_COLORS).map(([key, cfg]) => {
              const isSelected = currentColor === key;
              return (
                <button
                  key={key}
                  onClick={() => handleColorSelect(key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left group ${
                    isSelected
                      ? 'bg-slate-800/90 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20 shadow-sm"
                      style={{ backgroundColor: cfg.colorHex }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[11px]">{cfg.label.split('(')[0].trim()}</span>
                        <span className="text-[10px] text-slate-400 truncate">
                          ({cfg.label.split('(')[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-1.5 border-t border-slate-800/80 space-y-0.5">
          <button
            onClick={handleDuplicate}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors text-left"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Duplicate Node</span>
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Node</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
