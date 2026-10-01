import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Server,
  Layers,
  ListTodo,
  StickyNote,
  LayoutGrid,
  Database,
  Cloud,
  Cpu,
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Sparkles,
  Code2,
  Terminal,
  Shield,
  Box,
  FolderGit2,
} from 'lucide-react';

export function SideDrawer({ onAddNode, screenToFlowPosition }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'repos' | 'services' | 'other'
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');

  // Node templates definition
  const nodeTemplates = [
    // Repositories
    {
      id: 'source-repo',
      category: 'repos',
      nodeType: 'repoNode',
      title: 'Source Repository',
      subtitle: 'Legacy codebase to extract modules from',
      icon: GitBranch,
      badge: 'SOURCE',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      iconBg: 'bg-blue-950 text-blue-400 border-blue-500/50',
      extraData: {
        role: 'source',
        repo: 'legacy-core',
        owner: 'source-org',
        fullName: 'source-org/legacy-core',
        platform: 'github',
        status: 'draft',
        color: 'slate',
        description: 'Monolith or legacy repo to migrate code out of',
        tags: ['Source', 'Legacy'],
      },
    },
    {
      id: 'target-repo',
      category: 'repos',
      nodeType: 'repoNode',
      title: 'Target Repository',
      subtitle: 'Destination architecture or monorepo',
      icon: FolderGit2,
      badge: 'TARGET',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      iconBg: 'bg-emerald-950 text-emerald-400 border-emerald-500/50',
      extraData: {
        role: 'target',
        repo: 'next-monorepo',
        owner: 'target-org',
        fullName: 'target-org/next-monorepo',
        platform: 'github',
        status: 'done',
        color: 'green',
        description: 'Modern destination monorepo for clean components',
        tags: ['Target', 'Monorepo'],
      },
    },
    {
      id: 'reference-repo',
      category: 'repos',
      nodeType: 'repoNode',
      title: 'Reference Repository',
      subtitle: 'Shared library, docs, or SDK spec',
      icon: Code2,
      badge: 'REF',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      iconBg: 'bg-purple-950 text-purple-400 border-purple-500/50',
      extraData: {
        role: 'reference',
        repo: 'shared-utils',
        owner: 'core-team',
        fullName: 'core-team/shared-utils',
        platform: 'github',
        status: 'stable',
        color: 'green',
        description: 'Shared design system, utilities, or types',
        tags: ['Reference', 'Shared'],
      },
    },

    // Services
    {
      id: 'api-service',
      category: 'services',
      nodeType: 'serviceNode',
      title: 'REST API Service',
      subtitle: 'Backend API or Express / Node microservice',
      icon: Server,
      badge: 'REST API',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      iconBg: 'bg-cyan-950 text-cyan-400 border-cyan-500/50',
      extraData: {
        name: 'api-gateway',
        serviceType: 'REST API',
        techStack: 'Node.js / Express',
        port: ':8080',
        status: 'in-progress',
        color: 'blue',
        description: 'Core backend service routing API requests',
        endpoints: ['/health', '/api/v1/auth', '/api/v1/users'],
      },
    },
    {
      id: 'database-service',
      category: 'services',
      nodeType: 'serviceNode',
      title: 'Database Instance',
      subtitle: 'PostgreSQL, MySQL, or Cloud SQL',
      icon: Database,
      badge: 'DATABASE',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      iconBg: 'bg-indigo-950 text-indigo-400 border-indigo-500/50',
      extraData: {
        name: 'main-postgres',
        serviceType: 'Database',
        techStack: 'PostgreSQL 16',
        port: ':5432',
        status: 'migrated',
        color: 'green',
        description: 'Relational data store for application persistence',
        endpoints: ['postgres://db:5432/app'],
      },
    },
    {
      id: 'worker-service',
      category: 'services',
      nodeType: 'serviceNode',
      title: 'Background Worker',
      subtitle: 'Async task queue or cron job handler',
      icon: Cpu,
      badge: 'WORKER',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconBg: 'bg-amber-950 text-amber-400 border-amber-500/50',
      extraData: {
        name: 'queue-processor',
        serviceType: 'Queue Worker',
        techStack: 'Redis / BullMQ',
        port: ':6379',
        status: 'in-progress',
        color: 'blue',
        description: 'Background job processor for data pipeline tasks',
        endpoints: ['/metrics', '/jobs/status'],
      },
    },
    {
      id: 'cloud-function',
      category: 'services',
      nodeType: 'serviceNode',
      title: 'Serverless Function',
      subtitle: 'Cloud Run, Lambda, or Edge worker',
      icon: Cloud,
      badge: 'SERVERLESS',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      iconBg: 'bg-sky-950 text-sky-400 border-sky-500/50',
      extraData: {
        name: 'auth-function',
        serviceType: 'Serverless',
        techStack: 'Cloud Run / TypeScript',
        port: ':443',
        status: 'stable',
        color: 'green',
        description: 'Auto-scaling stateless function for authentication',
        endpoints: ['/verify-token', '/oauth/callback'],
      },
    },

    // Other Structures
    {
      id: 'task-card',
      category: 'other',
      nodeType: 'taskNode',
      title: 'Migration Task',
      subtitle: 'Trackable work item or checklist',
      icon: ListTodo,
      badge: 'TASK',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      iconBg: 'bg-indigo-950 text-indigo-400 border-indigo-500/50',
      extraData: {
        title: 'Extract Authentication Module',
        description: 'Decouple passport auth logic into standalone package',
        status: 'todo',
        priority: 'high',
        checklist: [
          { id: '1', text: 'Identify legacy dependencies', done: true },
          { id: '2', text: 'Extract helper functions', done: false },
          { id: '3', text: 'Write integration unit tests', done: false },
        ],
      },
    },
    {
      id: 'note-card',
      category: 'other',
      nodeType: 'noteNode',
      title: 'Architectural Note',
      subtitle: 'Sticky note for technical notes & rems',
      icon: StickyNote,
      badge: 'NOTE',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconBg: 'bg-amber-950 text-amber-400 border-amber-500/50',
      extraData: {
        title: 'Refactoring Note',
        content: 'Ensure all environment variables are synced before deploying target service.',
        color: 'amber',
      },
    },
    {
      id: 'zone-box',
      category: 'other',
      nodeType: 'zoneNode',
      title: 'Architecture Zone',
      subtitle: 'Visual boundary box to group nodes',
      icon: LayoutGrid,
      badge: 'ZONE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      iconBg: 'bg-emerald-950 text-emerald-400 border-emerald-500/50',
      extraData: {
        label: 'Target Microservices Domain',
        color: 'emerald',
      },
    },
  ];

  // Drag start handler
  const handleDragStart = (e, item) => {
    e.stopPropagation();
    const payload = {
      nodeType: item.nodeType,
      extraData: {
        ...item.extraData,
        ...(customName.trim()
          ? item.nodeType === 'repoNode'
            ? { repo: customName.trim(), fullName: `org/${customName.trim()}` }
            : { name: customName.trim() }
          : {}),
      },
    };

    e.dataTransfer.setData('application/reactflow', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Direct click to add handler
  const handleDirectAdd = (item) => {
    const extraData = {
      ...item.extraData,
      ...(customName.trim()
        ? item.nodeType === 'repoNode'
          ? { repo: customName.trim(), fullName: `org/${customName.trim()}` }
          : { name: customName.trim() }
        : {}),
    };

    onAddNode(item.nodeType, null, extraData);
  };

  // Filter templates
  const filteredTemplates = nodeTemplates.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="absolute top-4 left-4 z-30 select-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="drawer-open"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 overflow-hidden"
          >
            {/* Header bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>Component Palette</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Drag items onto canvas or click +</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Collapse Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Name Customizer Field */}
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/40 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter nodes..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Preset name (e.g., auth-service)..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-2.5 py-2 border-b border-slate-800/60 bg-slate-900/40 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all flex-shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({nodeTemplates.length})
              </button>
              <button
                onClick={() => setActiveCategory('repos')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all flex-shrink-0 flex items-center gap-1 ${
                  activeCategory === 'repos'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-2.5 h-2.5" /> Repos
              </button>
              <button
                onClick={() => setActiveCategory('services')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all flex-shrink-0 flex items-center gap-1 ${
                  activeCategory === 'services'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Server className="w-2.5 h-2.5" /> Services
              </button>
              <button
                onClick={() => setActiveCategory('other')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all flex-shrink-0 flex items-center gap-1 ${
                  activeCategory === 'other'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Box className="w-2.5 h-2.5" /> Tasks
              </button>
            </div>

            {/* Draggable Component List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-[50vh]">
              {filteredTemplates.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No matching components found
                </div>
              ) : (
                filteredTemplates.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="group relative flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md"
                    >
                      {/* Grip handle */}
                      <div className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>

                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-inner ${item.iconBg}`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>

                      {/* Label & Description */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-xs text-slate-100 truncate group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </h4>
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Quick 1-click add button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectAdd(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
                        title="Click to add to canvas center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer footer hint */}
            <div className="p-2 border-t border-slate-800/80 bg-slate-950/80 text-[10px] text-slate-500 text-center font-mono">
              💡 Drag card directly onto the canvas position
            </div>
          </motion.div>
        ) : (
          /* Collapsed toggle button */
          <motion.button
            key="drawer-collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/95 border border-slate-800/90 text-slate-200 hover:text-white hover:border-blue-500/50 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-all group"
            title="Open Component Palette Side Drawer"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold font-mono">Node Palette</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
