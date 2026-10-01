import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  StickyNote,
  Trash2,
  Palette,
  Copy,
  Check,
  Pin,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

const NOTE_THEMES = {
  amber: {
    bg: 'bg-amber-950/80 border-amber-500/50 text-amber-100 shadow-amber-950/50',
    header: 'bg-amber-900/50 border-amber-500/40 text-amber-200',
    textarea: 'bg-amber-950/60 border-amber-800/60 text-amber-100 placeholder-amber-500/60 focus:border-amber-400',
    handle: 'bg-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accentHex: '#f59e0b',
  },
  emerald: {
    bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50',
    header: 'bg-emerald-900/50 border-emerald-500/40 text-emerald-200',
    textarea: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-100 placeholder-emerald-500/60 focus:border-emerald-400',
    handle: 'bg-emerald-400',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentHex: '#10b981',
  },
  blue: {
    bg: 'bg-blue-950/80 border-blue-500/50 text-blue-100 shadow-blue-950/50',
    header: 'bg-blue-900/50 border-blue-500/40 text-blue-200',
    textarea: 'bg-blue-950/60 border-blue-800/60 text-blue-100 placeholder-blue-500/60 focus:border-blue-400',
    handle: 'bg-blue-400',
    dot: 'bg-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    accentHex: '#3b82f6',
  },
  purple: {
    bg: 'bg-purple-950/80 border-purple-500/50 text-purple-100 shadow-purple-950/50',
    header: 'bg-purple-900/50 border-purple-500/40 text-purple-200',
    textarea: 'bg-purple-950/60 border-purple-800/60 text-purple-100 placeholder-purple-500/60 focus:border-purple-400',
    handle: 'bg-purple-400',
    dot: 'bg-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accentHex: '#a855f7',
  },
  rose: {
    bg: 'bg-rose-950/80 border-rose-500/50 text-rose-100 shadow-rose-950/50',
    header: 'bg-rose-900/50 border-rose-500/40 text-rose-200',
    textarea: 'bg-rose-950/60 border-rose-800/60 text-rose-100 placeholder-rose-500/60 focus:border-rose-400',
    handle: 'bg-rose-400',
    dot: 'bg-rose-400',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    accentHex: '#f43f5e',
  },
};

export const NoteNode = memo(({ id, data, selected }) => {
  const [color, setColor] = useState(data.color || 'amber');
  const [title, setTitle] = useState(data.title || 'Architecture Note');
  const [content, setContent] = useState(data.content || '');
  const [copied, setCopied] = useState(false);
  const [isPinned, setIsPinned] = useState(data.pinned || false);

  // Sync state with props
  useEffect(() => {
    if (data.color) {
      const normalized = data.color === 'red' ? 'rose' : data.color === 'green' ? 'emerald' : data.color;
      setColor(NOTE_THEMES[normalized] ? normalized : 'amber');
    }
  }, [data.color]);

  useEffect(() => {
    setTitle(data.title || 'Architecture Note');
  }, [data.title]);

  useEffect(() => {
    setContent(data.content || '');
  }, [data.content]);

  const currentTheme = NOTE_THEMES[color] || NOTE_THEMES.amber;

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

  const handleCopyNote = (e) => {
    e.stopPropagation();
    const textToCopy = `${title}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePin = (e) => {
    e.stopPropagation();
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    if (data.onUpdateData) {
      data.onUpdateData(id, { ...data, pinned: nextPinned });
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
      className={`w-72 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 overflow-hidden relative group/note ${
        currentTheme.bg
      } ${
        isFocused
          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-amber-500/50 z-50 animate-pulse'
          : isSearchMatch
          ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-slate-950 scale-[1.01] shadow-amber-500/30 z-40'
          : selected
          ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20'
          : ''
      }`}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3.5 h-3.5 ${currentTheme.handle} border-2 border-slate-900 !-top-2 hover:scale-125 transition-transform`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`w-3.5 h-3.5 ${currentTheme.handle} border-2 border-slate-900 !-left-2 hover:scale-125 transition-transform`}
      />

      {/* Decorative sticky tape at top */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-b shadow-sm pointer-events-none" />

      {/* Header */}
      <div className={`p-2.5 border-b flex items-center justify-between gap-1.5 ${currentTheme.header}`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <StickyNote className="w-4 h-4 flex-shrink-0 text-amber-300" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onClick={(e) => e.stopPropagation()}
            placeholder="Note title..."
            className="font-bold text-xs bg-transparent border-none focus:outline-none w-full truncate placeholder-amber-200/50"
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={togglePin}
            className={`p-1 rounded transition-colors ${
              isPinned ? 'text-amber-300 bg-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title={isPinned ? 'Unpin Note' : 'Pin Note'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCopyNote}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title="Copy Note Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleDeleteNode}
            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleContentBlur}
          onClick={(e) => e.stopPropagation()}
          placeholder="Type documentation, migration steps, CLI commands, or reminders..."
          className={`w-full rounded-lg p-2.5 text-xs font-mono leading-relaxed resize-none h-32 focus:outline-none transition-all ${currentTheme.textarea}`}
        />

        {/* Color Switcher & Metadata Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px]">
          <span className="text-slate-400 flex items-center gap-1 font-mono">
            <Palette className="w-3 h-3" /> Sticky Style
          </span>

          <div className="flex items-center gap-1.5">
            {Object.keys(NOTE_THEMES).map((cKey) => (
              <button
                key={cKey}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(cKey);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  NOTE_THEMES[cKey].dot
                } ${color === cKey ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'}`}
                title={`Theme: ${cKey}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom & Right handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3.5 h-3.5 ${currentTheme.handle} border-2 border-slate-900 !-bottom-2 hover:scale-125 transition-transform`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-3.5 h-3.5 ${currentTheme.handle} border-2 border-slate-900 !-right-2 hover:scale-125 transition-transform`}
      />
    </div>
  );
});

NoteNode.displayName = 'NoteNode';
