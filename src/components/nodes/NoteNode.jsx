import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { StickyNote, Trash2, Palette } from 'lucide-react';

const NOTE_COLORS = {
  amber: {
    card: 'bg-amber-100 border-amber-300 dark:bg-amber-950/70 dark:border-amber-500/40 text-amber-950 dark:text-amber-100',
    header: 'bg-amber-200/80 border-amber-300 text-amber-950 dark:bg-amber-900/40 dark:border-amber-500/30 dark:text-amber-200',
    indicator: 'bg-amber-500',
  },
  emerald: {
    card: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100',
    header: 'bg-emerald-200/80 border-emerald-300 text-emerald-950 dark:bg-emerald-900/40 dark:border-emerald-500/30 dark:text-emerald-200',
    indicator: 'bg-emerald-500',
  },
  blue: {
    card: 'bg-blue-100 border-blue-300 dark:bg-blue-950/70 dark:border-blue-500/40 text-blue-950 dark:text-blue-100',
    header: 'bg-blue-200/80 border-blue-300 text-blue-950 dark:bg-blue-900/40 dark:border-blue-500/30 dark:text-blue-200',
    indicator: 'bg-blue-500',
  },
  purple: {
    card: 'bg-purple-100 border-purple-300 dark:bg-purple-950/70 dark:border-purple-500/40 text-purple-950 dark:text-purple-100',
    header: 'bg-purple-200/80 border-purple-300 text-purple-950 dark:bg-purple-900/40 dark:border-purple-500/30 dark:text-purple-200',
    indicator: 'bg-purple-500',
  },
  rose: {
    card: 'bg-rose-100 border-rose-300 dark:bg-rose-950/70 dark:border-rose-500/40 text-rose-950 dark:text-rose-100',
    header: 'bg-rose-200/80 border-rose-300 text-rose-950 dark:bg-rose-900/40 dark:border-rose-500/30 dark:text-rose-200',
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
      className={`w-64 rounded-xl border-2 backdrop-blur-md shadow-xl transition-all duration-200 overflow-hidden ${
        colorStyle.card
      } ${selected ? 'ring-4 ring-amber-500/40 border-amber-600 scale-[1.02]' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3.5 h-3.5 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-top-2"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between ${colorStyle.header}`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <StickyNote className="w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onClick={(e) => e.stopPropagation()}
            className="font-bold text-xs bg-transparent border-none focus:outline-none w-full truncate text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDeleteNode}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentBlur}
          onClick={(e) => e.stopPropagation()}
          placeholder="Write notes, CLI commands, or reminders..."
          className="w-full bg-white/90 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none h-28 font-mono font-medium leading-relaxed"
        />

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-300/60 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1">
            <Palette className="w-3 h-3" /> Color
          </span>
          <div className="flex items-center gap-1.5">
            {Object.keys(NOTE_COLORS).map((cKey) => (
              <button
                key={cKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(cKey);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  NOTE_COLORS[cKey].indicator
                } ${color === cKey ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3.5 h-3.5 bg-amber-600 dark:bg-amber-400 border-2 border-white dark:border-slate-900 !-bottom-2"
      />
    </div>
  );
});

NoteNode.displayName = 'NoteNode';
