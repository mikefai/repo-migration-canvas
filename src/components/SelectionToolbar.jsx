import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Copy,
  Tags,
  X,
  Check,
  MousePointer2,
  BoxSelect,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NODE_CATEGORIES } from '../constants/nodeCategories';

export function SelectionToolbar({
  selectedNodes = [],
  selectedEdges = [],
  onDeleteSelected,
  onDuplicateSelected,
  onBatchSetCategory,
  onClearSelection,
  selectMode,
  onToggleSelectMode,
}) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const count = selectedNodes.length;
  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl rounded-2xl px-3.5 py-2 text-slate-100 ring-1 ring-white/10 select-none"
      >
        {/* Count Badge */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono font-bold text-xs flex items-center gap-1.5">
            <BoxSelect className="w-3.5 h-3.5" />
            <span>{count} Selected</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
            (Drag to move batch)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Batch Category Selector */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
              title="Set category for all selected nodes"
            >
              <Tags className="w-3.5 h-3.5 text-amber-400" />
              <span>Set Category</span>
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Batch Category
                </div>
                {Object.entries(NODE_CATEGORIES).map(([catKey, catCfg]) => {
                  const CatIcon = catCfg.icon;
                  return (
                    <button
                      key={catKey}
                      onClick={() => {
                        onBatchSetCategory?.(catKey);
                        setIsCategoryMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 transition-colors text-left"
                    >
                      <CatIcon className={`w-3.5 h-3.5 ${catCfg.textColor}`} />
                      <span className="font-mono">{catCfg.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Batch Duplicate */}
          <button
            type="button"
            onClick={onDuplicateSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            title="Duplicate selected nodes"
          >
            <Copy className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          {/* Batch Delete */}
          <button
            type="button"
            onClick={onDeleteSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-300 transition-colors"
            title="Delete all selected nodes and connected edges"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Delete All</span>
          </button>
        </div>

        {/* Clear Selection */}
        <div className="pl-2 border-l border-slate-800">
          <button
            type="button"
            onClick={onClearSelection}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Deselect All (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
