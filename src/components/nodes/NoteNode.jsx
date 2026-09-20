import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { StickyNote, Trash2, Palette } from 'lucide-react';

const NOTE_COLORS = {
  amber: {
    bg: 'bg-amber-950/70 border-amber-500/40 text-amber-100',
    header: 'bg-amber-900/40 border-amber-500/30 text-amber-200',
    indicator: 'bg-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100',
    header: 'bg-emerald-900/40 border-emerald-500/30 text-emerald-200',
    indicator: 'bg-emerald-400',
  },
  blue: {
    bg: 'bg-blue-950/70 border-blue-500/40 text-blue-100',
    header: 'bg-blue-900/40 border-blue-500/30 text-blue-200',
    indicator: 'bg-blue-400',
  },
  purple: {
    bg: 'bg-purple-950/70 border-purple-500/40 text-purple-100',
    header: 'bg-purple-900/40 border-purple-500/30 text-purple-200',
    indicator: 'bg-purple-400',
  },
  rose: {
    bg: 'bg-rose-950/70 border-rose-500/40 text-rose-100',
    header: 'bg-rose-900/40 border-rose-500/30 text-rose-200',
    indicator: 'bg-rose-400',
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
      className={`w-64 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 overflow-hidden ${
        colorStyle.bg
      } ${selected ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-400 border-2 border-slate-900 !-top-1.5"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between ${colorStyle.header}`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <StickyNote className="w-3.5 h-3.5 flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-xs bg-transparent border-none focus:outline-none w-full truncate"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDeleteNode}
            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
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
          className="w-full bg-slate-900/50 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none h-28 font-mono leading-relaxed"
        />

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
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
                } ${color === cKey ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-400 border-2 border-slate-900 !-bottom-1.5"
      />
    </div>
  );
});

NoteNode.displayName = 'NoteNode';
