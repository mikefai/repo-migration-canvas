import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  GitBranch,
  ArrowRight,
  Sparkles,
  Link2,
  BookOpen,
  AlertTriangle,
  Zap,
  Check,
  Send,
  Boxes,
} from 'lucide-react';

const RELATIONSHIP_PRESETS = [
  {
    id: 'dependency',
    label: 'dependency',
    description: 'Required upstream or package dependency',
    color: '#3b82f6', // blue
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30',
    icon: Link2,
    animated: true,
    dashed: false,
  },
  {
    id: 'reference',
    label: 'reference',
    description: 'Shared code, pattern, or documentation reference',
    color: '#a855f7', // purple
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
    icon: BookOpen,
    animated: false,
    dashed: false,
  },
  {
    id: 'deprecated',
    label: 'deprecated',
    description: 'Legacy connection scheduled to be removed',
    color: '#f59e0b', // amber
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
    icon: AlertTriangle,
    animated: false,
    dashed: true,
  },
  {
    id: 'extract-source',
    label: 'extract-source',
    description: 'Modules or logic to extract from source repo',
    color: '#06b6d4', // cyan
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
    icon: Boxes,
    animated: true,
    dashed: false,
  },
  {
    id: 'deploy-target',
    label: 'deploy-target',
    description: 'Destination monorepo package or service',
    color: '#10b981', // emerald
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
    icon: Send,
    animated: true,
    dashed: false,
  },
  {
    id: 'api-call',
    label: 'api-call',
    description: 'HTTP REST, gRPC, or microservice invocation',
    color: '#ec4899', // pink
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40 hover:bg-pink-500/30',
    icon: Zap,
    animated: true,
    dashed: false,
  },
];

const COLOR_OPTIONS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Slate', hex: '#94a3b8' },
];

export function EdgeModal({
  isOpen,
  onClose,
  edge,
  sourceNode,
  targetNode,
  onSave,
  onDelete,
}) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [animated, setAnimated] = useState(true);
  const [isDashed, setIsDashed] = useState(false);

  // Sync state when edge changes
  useEffect(() => {
    if (edge) {
      setLabel(edge.label || edge.data?.label || '');
      setColor(edge.style?.stroke || '#3b82f6');
      setAnimated(edge.animated ?? true);
      setIsDashed(Boolean(edge.style?.strokeDasharray));
    }
  }, [edge]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !edge) return null;

  const handleSelectPreset = (preset) => {
    setLabel(preset.label);
    setColor(preset.color);
    setAnimated(preset.animated);
    setIsDashed(preset.dashed);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalLabel = label.trim() || 'connection';

    onSave({
      ...edge,
      label: finalLabel,
      animated,
      style: {
        ...edge.style,
        stroke: color,
        strokeWidth: 2.5,
        ...(isDashed ? { strokeDasharray: '5,5' } : { strokeDasharray: undefined }),
      },
      markerEnd: {
        ...edge.markerEnd,
        color,
      },
      data: {
        ...(edge.data || {}),
        label: finalLabel,
        color,
        animated,
        isDashed,
      },
    });
    onClose();
  };

  const getDisplayName = (node) => {
    if (!node) return 'Node';
    return (
      node.data?.repo ||
      node.data?.fullName ||
      node.data?.name ||
      node.data?.title ||
      node.data?.label ||
      node.id
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Edit Connection Label</h3>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 truncate">
                <span className="text-slate-300 font-semibold truncate max-w-[120px]">{getDisplayName(sourceNode)}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="text-slate-300 font-semibold truncate max-w-[120px]">{getDisplayName(targetNode)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Preset Relationship Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RELATIONSHIP_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = label.toLowerCase() === preset.label.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-start gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-blue-400 ring-1 ring-blue-400/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${preset.color}25`, color: preset.color }}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-between">
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-blue-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Label Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Edge Label
            </label>
            <input
              type="text"
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. dependency, reference, deprecated, subrepo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 ring-1 focus:ring-blue-500/40"
            />
          </div>

          {/* Visual Line Style Controls */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Stroke Color</span>
              <div className="flex items-center gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      color === c.hex ? 'ring-2 ring-white scale-125' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={animated}
                  onChange={(e) => setAnimated(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Animated Flow</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isDashed}
                  onChange={(e) => setIsDashed(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                <span>Dashed Line</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Save Label
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
