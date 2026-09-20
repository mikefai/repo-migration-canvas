import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Search,
  Download,
  Upload,
  FolderKanban,
  Sun,
  Moon,
  ListTodo,
  StickyNote,
  LayoutGrid,
  Trash2,
} from 'lucide-react';
import { parseRepoUrl } from '../utils/urlParser';

export function Header({
  onAddRepoUrl,
  onAddNode,
  searchQuery,
  onSearchChange,
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  onExportWorkspace,
  onImportWorkspace,
  theme,
  onToggleTheme,
}) {
  const [urlInput, setUrlInput] = useState('');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const parsed = parseRepoUrl(urlInput);
    if (parsed.valid) {
      onAddRepoUrl(parsed);
      setUrlInput('');
    } else {
      alert('Please enter a valid Git repository URL or path (e.g., https://github.com/owner/repo)');
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        onImportWorkspace(event.target.result);
      } catch (err) {
        alert('Failed to import JSON workspace: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl px-4 flex items-center justify-between gap-3 relative z-30 shadow-md transition-colors">
      {/* Left section: App Brand & Workspace Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 dark:bg-clip-text">
              Repo Migration Canvas
            </h1>
            <p className="text-[10px] text-slate-500 font-mono font-medium">v1.0 • Offline Capable</p>
          </div>
        </div>

        {/* Workspace Manager Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <FolderKanban className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="max-w-[140px] truncate">{activeWorkspace?.name || 'Main Workspace'}</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
              {workspaces.length}
            </span>
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 top-12 w-64 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 shadow-2xl p-2 space-y-1 z-50">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-2 py-1 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <span>Workspaces</span>
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onCreateWorkspace();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[10px] font-bold"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => {
                      onSwitchWorkspace(ws.id);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      ws.id === activeWorkspaceId
                        ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-900 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                    }`}
                  >
                    <span className="truncate flex-1">{ws.name}</span>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWorkspace(ws.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Section: Quick URL Paste Bar */}
      <form onSubmit={handleUrlSubmit} className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste repo URL (e.g., https://github.com/owner/repo)..."
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl pl-3.5 pr-24 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all font-mono shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Repo
          </button>
        </div>
      </form>

      {/* Right Section: Add Nodes, Search, Import/Export, Theme */}
      <div className="flex items-center gap-2">
        {/* Add Nodes Palette */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 p-1 rounded-xl shadow-xs">
          <button
            onClick={() => onAddNode('taskNode')}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            title="Add Migration Task Card"
          >
            <ListTodo className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Task
          </button>
          <button
            onClick={() => onAddNode('noteNode')}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            title="Add Sticky Note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Note
          </button>
          <button
            onClick={() => onAddNode('zoneNode')}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            title="Add Visual Zone Container"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" /> Zone
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-40">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-900 dark:text-slate-200 font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Export / Import JSON */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
          <button
            onClick={onExportWorkspace}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Export JSON Workspace"
          >
            <Download className="w-4 h-4" />
          </button>

          <label className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors" title="Import JSON Workspace">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ml-1"
          title="Toggle Dark/Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
}
