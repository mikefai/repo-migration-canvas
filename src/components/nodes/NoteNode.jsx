import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { StickyNote, Trash2, Palette } from 'lucide-react';

const NOTE_COLORS = {
  amber: {
    card: 'bg-amber-100 border-amber-400 dark:bg-amber-950/80 dark:border-amber-500/50 text-amber-950 dark:text-amber-100 shadow-xl',
    header: 'bg-amber-200 border-amber-300 text-amber-950 dark:bg-amber-900/50 dark:border-amber-500/30 dark:text-amber-200',
    indicator: 'bg-amber-500',
  },
  emerald: {
    card: 'bg-emerald-100 border-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/50 text-emerald-950 dark:text-emerald-100 shadow-xl',
    header: 'bg-emerald-200 border-emerald-300 text-emerald-950 dark:bg-emerald-900/50 dark:border-emerald-500/30 dark:text-emerald-200',
    indicator: 'bg-emerald-500',
  },
  blue: {
    card: 'bg-blue-100 border-blue-400 dark:bg-blue-950/80 dark:border-blue-500/50 text-blue-950 dark:text-blue-100 shadow-xl',
    header: 'bg-blue-200 border-blue-300 text-blue-950 dark:bg-blue-900/50 dark:border-blue-500/30 dark:text-blue-200',
    indicator: 'bg-blue-500',
  },
  purple: {
    card: 'bg-purple-100 border-purple-400 dark:bg-purple-950/80 dark:border-purple-500/50 text-purple-950 dark:text-purple-100 shadow-xl',
    header: 'bg-purple-200 border-purple-300 text-purple-950 dark:bg-purple-900/50 dark:border-purple-500/30 dark:text-purple-200',
    indicator: 'bg-purple-500',
  },
  rose: {
    card: 'bg-rose-100 border-rose-400 dark:bg-rose-950/80 dark:border-rose-500/50 text-rose-950 dark:text-rose-100 shadow-xl',
    header: 'bg-rose-200 border-rose-300 text-rose-950 dark:bg-rose-900/50 dark:border-rose-500/30 dark:text-rose-200',
    indicator: 'bg-rose-500',
  },
};

export const NoteNode = memo(({ id, data, selected }) => {
  const [color, setColor] = useState(data.color || 'amber');
  const [title, setTitle] = useState(data.title || 'Migration Note');
  const [content, setContent] = useState(data.content || '');

  const colorStyle = NOTE_COLORS[color] || NOTE_COLORS.amber;

  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, color: newColor });
    }
  };

  const handleTitleBlur = () => {
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, title });
    }
  };

  const handleContentBlur = () => {
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, content });
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
      className={`w-72 rounded-2xl border-3 backdrop-blur-md transition-all duration-200 overflow-visible relative ${
        colorStyle.card
      } ${selected ? 'ring-4 ring-amber-500/50 border-amber-600 scale-[1.02] shadow-2xl' : ''}`}
    >
      {/* 4-Directional Dual Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-4 h-4 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-top-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
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
        className="w-4 h-4 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-bottom-2.5 !left-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-4 h-4 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-left-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-4 h-4 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-1/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-4 h-4 bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-slate-900 !-right-2.5 !top-2/3 hover:scale-150 transition-transform shadow-md cursor-crosshair z-50"
      />

      {/* Header */}
      <div className={`px-3.5 py-2.5 border-b-2 flex items-center justify-between rounded-t-xl ${colorStyle.header}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <StickyNote className="w-4.5 h-4.5 flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onClick={(e) => e.stopPropagation()}
            className="font-extrabold text-sm bg-transparent border-none focus:outline-none w-full truncate text-slate-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDeleteNode}
            className="p-1 text-slate-700 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
            title="Delete Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentBlur}
          onClick={(e) => e.stopPropagation()}
          placeholder="Write notes, CLI commands, or reminders..."
          className="w-full bg-white/95 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-950 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none h-32 font-mono font-bold leading-relaxed"
        />

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-300/80 dark:border-slate-800">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> Color
          </span>
          <div className="flex items-center gap-1.5">
            {Object.keys(NOTE_COLORS).map((cKey) => (
              <button
                key={cKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(cKey);
                }}
                className={`w-4 h-4 rounded-full transition-transform ${
                  NOTE_COLORS[cKey].indicator
                } ${color === cKey ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

NoteNode.displayName = 'NoteNode';
