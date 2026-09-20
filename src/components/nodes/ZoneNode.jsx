import React, { memo, useState } from 'react';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import { LayoutGrid, Trash2, Edit2 } from 'lucide-react';

const ZONE_STYLES = {
  slate: {
    card: 'bg-slate-100/60 border-slate-400 dark:bg-slate-900/40 dark:border-slate-700/60',
    header: 'bg-white text-slate-900 border-slate-300 dark:bg-slate-800/90 dark:text-slate-200 dark:border-slate-700',
    dot: 'bg-slate-600 dark:bg-slate-400',
  },
  blue: {
    card: 'bg-blue-50/60 border-blue-400 dark:bg-blue-950/20 dark:border-blue-500/40',
    header: 'bg-blue-600 text-white border-blue-500 dark:bg-blue-900/90 dark:text-blue-200 dark:border-blue-500/50',
    dot: 'bg-blue-600 dark:bg-blue-400',
  },
  emerald: {
    card: 'bg-emerald-50/60 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-500/40',
    header: 'bg-emerald-600 text-white border-emerald-500 dark:bg-emerald-900/90 dark:text-emerald-200 dark:border-emerald-500/50',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
  },
  purple: {
    card: 'bg-purple-50/60 border-purple-400 dark:bg-purple-950/20 dark:border-purple-500/40',
    header: 'bg-purple-600 text-white border-purple-500 dark:bg-purple-900/90 dark:text-purple-200 dark:border-purple-500/50',
    dot: 'bg-purple-600 dark:bg-purple-400',
  },
  amber: {
    card: 'bg-amber-50/60 border-amber-400 dark:bg-amber-950/20 dark:border-amber-500/40',
    header: 'bg-amber-600 text-white border-amber-500 dark:bg-amber-900/90 dark:text-amber-200 dark:border-amber-500/50',
    dot: 'bg-amber-600 dark:bg-amber-400',
  },
  rose: {
    card: 'bg-rose-50/60 border-rose-400 dark:bg-rose-950/20 dark:border-rose-500/40',
    header: 'bg-rose-600 text-white border-rose-500 dark:bg-rose-900/90 dark:text-rose-200 dark:border-rose-500/50',
    dot: 'bg-rose-600 dark:bg-rose-400',
  },
};

export const ZoneNode = memo(({ id, data, selected }) => {
  const [label, setLabel] = useState(data.label || 'Visual Zone');
  const [color, setColor] = useState(data.color || 'slate');
  const [isEditing, setIsEditing] = useState(false);

  const style = ZONE_STYLES[color] || ZONE_STYLES.slate;

  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, color: newColor });
    }
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, label });
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
      className={`relative w-full h-full rounded-2xl border-3 border-dashed backdrop-blur-xs transition-all overflow-visible ${
        style.card
      } ${selected ? 'border-solid ring-4 ring-blue-500/30 border-blue-600' : ''}`}
    >
      <NodeResizer minWidth={200} minHeight={150} isVisible={selected} lineClassName="border-blue-600" handleClassName="h-4 w-4 bg-blue-600 border-2 border-white rounded-full shadow-md" />

      {/* 4-Directional Dual Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-4 h-4 bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      {/* Top zone label bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 shadow-md backdrop-blur-md ${style.header}`}>
          <LayoutGrid className="w-4 h-4" />
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelBlur}
              className="bg-white/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-sm text-slate-900 dark:text-white font-extrabold focus:outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="font-extrabold text-sm tracking-wide cursor-pointer hover:underline flex items-center gap-1.5"
            >
              {label}
              <Edit2 className="w-3.5 h-3.5 opacity-70" />
            </span>
          )}
        </div>

        {/* Color Palette & Actions */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 shadow-md backdrop-blur-md ${style.header}`}>
          <div className="flex items-center gap-1.5 pr-1 border-r border-slate-300 dark:border-slate-700">
            {Object.keys(ZONE_STYLES).map((cKey) => (
              <button
                key={cKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(cKey);
                }}
                className={`w-4 h-4 rounded-full transition-transform ${
                  ZONE_STYLES[cKey].dot
                } ${color === cKey ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>

          <button
            onClick={handleDeleteNode}
            className="p-1 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
            title="Delete Zone"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

ZoneNode.displayName = 'ZoneNode';
