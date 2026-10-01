import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  Plus,
  Search,
  Download,
  Upload,
  Sun,
  Moon,
  ListTodo,
  StickyNote,
  LayoutGrid,
  Trash2,
  Server,
  ChevronUp,
  ChevronDown,
  X,
  Focus,
  Sparkles,
} from 'lucide-react';
import { parseRepoUrl } from '../utils/urlParser';
import { NodeStatusBadge } from '../utils/nodeStatus';

export function Header({
  nodes = [],
  onAddRepoUrl,
  onAddNode,
  searchQuery,
  onSearchChange,
  focusedNodeId,
  onFocusNode,
  searchMatchingNodeIds = [],
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
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const parsed = parseRepoUrl(urlInput);
    if (parsed.valid) {
      onAddRepoUrl(parsed);
      setUrlInput('');
    } else {
      // Create fallback repo node with the raw name
      onAddRepoUrl({
        valid: true,
        url: '',
        owner: 'custom',
        repo: urlInput.trim(),
        fullName: `custom/${urlInput.trim()}`,
        platform: 'git',
        domain: 'git',
      });
      setUrlInput('');
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
        console.error('Failed to import JSON workspace:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Compute matching nodes for search
  const matchingNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return nodes.filter((n) => searchMatchingNodeIds.includes(n.id));
  }, [nodes, searchMatchingNodeIds, searchQuery]);

  const currentIndex = useMemo(() => {
    if (!focusedNodeId || matchingNodes.length === 0) return -1;
    return matchingNodes.findIndex((n) => n.id === focusedNodeId);
  }, [focusedNodeId, matchingNodes]);

  const handleNextMatch = () => {
    if (matchingNodes.length === 0) return;
    const nextIdx = currentIndex < 0 ? 0 : (currentIndex + 1) % matchingNodes.length;
    onFocusNode?.(matchingNodes[nextIdx].id);
  };

  const handlePrevMatch = () => {
    if (matchingNodes.length === 0) return;
    const prevIdx = currentIndex < 0 ? 0 : (currentIndex - 1 + matchingNodes.length) % matchingNodes.length;
    onFocusNode?.(matchingNodes[prevIdx].id);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrevMatch();
      } else {
        handleNextMatch();
      }
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 flex items-center justify-between gap-3 relative z-30 shadow-lg select-none">
      {/* Left section: App Brand & Workspace Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Repo Migration Canvas
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">v1.0 • Auto-Panning Canvas</p>
          </div>
        </div>

        {/* Workspace Manager Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:text-white hover:border-slate-700 flex items-center gap-2 transition-all"
          >
            <span className="font-semibold">{activeWorkspace?.name || 'Workspace'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-mono">
              {nodes.length} cards
            </span>
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-2 z-50 ring-1 ring-white/10">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Switch Workspace</span>
                <button
                  onClick={onCreateWorkspace}
                  className="text-blue-400 hover:text-blue-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              <div className="space-y-1 mt-1 max-h-48 overflow-y-auto">
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      ws.id === activeWorkspaceId
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                    onClick={() => {
                      onSwitchWorkspace(ws.id);
                      setShowWorkspaceMenu(false);
                    }}
                  >
                    <span className="truncate font-medium">{ws.name}</span>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWorkspace(ws.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete Workspace"
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
      <form onSubmit={handleUrlSubmit} className="flex-1 max-w-md hidden md:flex">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste repo URL (e.g., https://github.com/owner/repo)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-24 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Repo
          </button>
        </div>
      </form>

      {/* Right Section: Interactive Search Bar, Quick Palette, Import/Export */}
      <div className="flex items-center gap-2">
        {/* Interactive Search Bar with Auto-Panning */}
        <div className="relative w-64">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search repository / node..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-20 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />

            {/* Counter badge & Navigation arrows */}
            {searchQuery.trim() && (
              <div className="absolute right-1.5 flex items-center gap-1 text-[10px] font-mono">
                <span className="text-slate-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {matchingNodes.length > 0 ? `${currentIndex >= 0 ? currentIndex + 1 : 1}/${matchingNodes.length}` : '0'}
                </span>
                <button
                  type="button"
                  onClick={handlePrevMatch}
                  disabled={matchingNodes.length === 0}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                  title="Previous match (Shift+Enter)"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMatch}
                  disabled={matchingNodes.length === 0}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                  title="Next match (Enter)"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onFocusNode?.(null);
                    setShowSearchDropdown(false);
                  }}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 ml-0.5"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Search Results Autocomplete Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-full right-0 mt-2 w-80 z-50 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 space-y-1 max-h-80 overflow-y-auto ring-1 ring-white/10">
              <div className="px-2 py-1 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Matching Nodes</span>
                </span>
                <span className="text-slate-500">{matchingNodes.length} found</span>
              </div>

              {matchingNodes.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  No matching repository or node names
                </div>
              ) : (
                matchingNodes.map((node) => {
                  const isSelected = node.id === focusedNodeId;
                  const nodeLabel = node.data?.repo || node.data?.fullName || node.data?.name || node.data?.title || 'Node';
                  const nodeSub = node.data?.owner || node.data?.serviceType || node.type;
                  const status = node.data?.status;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        onFocusNode?.(node.id);
                        setShowSearchDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/30 border border-blue-500/60 text-white font-semibold ring-1 ring-blue-500/40 shadow-md'
                          : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-xs truncate font-mono font-medium">{nodeLabel}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate pl-5">
                          {nodeSub}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {status && <NodeStatusBadge status={status} size="xs" />}
                        <Focus className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Quick Add Nodes Palette */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onAddNode('serviceNode')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Add Service / Microservice Node"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" /> Service
          </button>
          <button
            onClick={() => onAddNode('taskNode')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Add Migration Task Card"
          >
            <ListTodo className="w-3.5 h-3.5 text-indigo-400" /> Task
          </button>
          <button
            onClick={() => onAddNode('noteNode')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Add Sticky Note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-400" /> Note
          </button>
          <button
            onClick={() => onAddNode('zoneNode')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Add Visual Zone Container"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" /> Zone
          </button>
        </div>

        {/* Export / Import JSON */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={onExportWorkspace}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
            title="Export JSON Workspace"
          >
            <Download className="w-4 h-4" />
          </button>

          <label className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors" title="Import JSON Workspace">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors ml-1"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
}
