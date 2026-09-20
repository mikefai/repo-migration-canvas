import React, { memo, useState } from 'react';
import { NodeResizer } from '@xyflow/react';
import { LayoutGrid, Trash2, Palette, Edit2 } from 'lucide-react';

const ZONE_STYLES = {
  slate: {
    bg: 'bg-slate-900/40 border-slate-700/60',
    header: 'bg-slate-800/80 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
  },
  blue: {
    bg: 'bg-blue-950/20 border-blue-500/40',
    header: 'bg-blue-900/60 text-blue-300 border-blue-500/50',
    dot: 'bg-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-950/20 border-emerald-500/40',
    header: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50',
    dot: 'bg-emerald-400',
  },
  purple: {
    bg: 'bg-purple-950/20 border-purple-500/40',
    header: 'bg-purple-900/60 text-purple-300 border-purple-500/50',
    dot: 'bg-purple-400',
  },
  amber: {
    bg: 'bg-amber-950/20 border-amber-500/40',
    header: 'bg-amber-900/60 text-amber-300 border-amber-500/50',
    dot: 'bg-amber-400',
  },
  rose: {
    bg: 'bg-rose-950/20 border-rose-500/40',
    header: 'bg-rose-900/60 text-rose-300 border-rose-500/50',
    dot: 'bg-rose-400',
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
      className={`relative w-full h-full rounded-2xl border-2 border-dashed backdrop-blur-xs transition-all ${
        style.bg
      } ${selected ? 'border-solid ring-2 ring-blue-500 border-blue-400' : ''}`}
    >
      <NodeResizer minWidth={200} minHeight={150} isVisible={selected} lineClassName="border-blue-500" handleClassName="h-3 w-3 bg-blue-500 rounded-full" />

      {/* Top zone label bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-lg backdrop-blur-md ${style.header}`}>
          <LayoutGrid className="w-3.5 h-3.5" />
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelBlur}
              className="bg-slate-900/80 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="font-semibold text-xs tracking-wide cursor-pointer hover:underline flex items-center gap-1.5"
            >
              {label}
              <Edit2 className="w-3 h-3 opacity-60" />
            </span>
          )}
        </div>

        {/* Color Palette & Actions */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-md ${style.header}`}>
          <div className="flex items-center gap-1 pr-1 border-r border-slate-700/50">
            {Object.keys(ZONE_STYLES).map((cKey) => (
              <button
                key={cKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(cKey);
                }}
                className={`w-3 h-3 rounded-full transition-transform ${
                  ZONE_STYLES[cKey].dot
                } ${color === cKey ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'}`}
              />
            ))}
          </div>

          <button
            onClick={handleDeleteNode}
            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            title="Delete Zone"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

ZoneNode.displayName = 'ZoneNode';
