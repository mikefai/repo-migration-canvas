import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Server,
  Layers,
  ListTodo,
  StickyNote,
  LayoutGrid,
  Plus,
  ExternalLink,
  Cpu,
  Database,
  Cloud,
  ArrowRight,
  Globe,
  Radio,
  Check,
  X,
} from 'lucide-react';
import { parseRepoUrl } from '../utils/urlParser';

export function ContextMenu({
  isOpen,
  x,
  y,
  flowPosition,
  onClose,
  onAddNode,
}) {
  const menuRef = useRef(null);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'quick-repo' | 'quick-service'
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('REST API');
  const [serviceStack, setServiceStack] = useState('Node.js');

  // Close context menu on outside click or escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset tab when reopened
  useEffect(() => {
    if (isOpen) {
      setActiveTab('menu');
      setRepoUrlInput('');
      setServiceName('');
    }
  }, [isOpen, x, y]);

  if (!isOpen) return null;

  // Calculate clamped screen position so menu never falls off viewport
  const menuWidth = 280;
  const menuHeight = 380;
  const clampedX = Math.min(Math.max(12, x), window.innerWidth - menuWidth - 16);
  const clampedY = Math.min(Math.max(12, y), window.innerHeight - menuHeight - 16);

  const handleQuickAddRepo = (role) => {
    onAddNode(
      'repoNode',
      flowPosition,
      {
        owner: role === 'target' ? 'target-org' : 'source-org',
        repo: role === 'target' ? 'target-monorepo' : 'legacy-service',
        fullName: role === 'target' ? 'target-org/target-monorepo' : 'source-org/legacy-service',
        role,
        status: role === 'target' ? 'done' : 'draft',
        platform: 'github',
        description: role === 'target' ? 'New destination repository' : 'Source repository to extract modules from',
        tags: [role],
      }
    );
    onClose();
  };

  const handleRepoUrlSubmit = (e) => {
    e.preventDefault();
    if (!repoUrlInput.trim()) return;

    const parsed = parseRepoUrl(repoUrlInput);
    if (parsed.valid) {
      onAddNode('repoNode', flowPosition, {
        url: parsed.url,
        owner: parsed.owner,
        repo: parsed.repo,
        fullName: parsed.fullName,
        platform: parsed.platform,
        role: 'source',
        status: 'draft',
        description: `Pasted ${parsed.domain} repository`,
        tags: [parsed.platform],
      });
      onClose();
    } else {
      // Fallback repo
      onAddNode('repoNode', flowPosition, {
        owner: 'custom',
        repo: repoUrlInput.trim(),
        fullName: `custom/${repoUrlInput.trim()}`,
        role: 'source',
        status: 'draft',
        platform: 'git',
        description: 'Custom repository node',
        tags: ['custom'],
      });
      onClose();
    }
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const finalName = serviceName.trim() || 'core-api';
    onAddNode('serviceNode', flowPosition, {
      name: finalName,
      serviceType,
      techStack: serviceStack,
      port: ':8080',
      status: 'in-progress',
      description: `${serviceType} powered by ${serviceStack}`,
      endpoints: ['/health', '/api/v1/status'],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ left: clampedX, top: clampedY }}
        className="fixed z-50 w-72 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-2 select-none overflow-hidden ring-1 ring-white/10"
      >
        {activeTab === 'menu' && (
          <div className="space-y-1">
            {/* Header info */}
            <div className="px-2.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                Add At Cursor
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {Math.round(flowPosition.x)}, {Math.round(flowPosition.y)}
              </span>
            </div>

            {/* Repositories Section */}
            <div className="pt-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3 h-3 text-blue-400" />
                <span>Repository Nodes</span>
              </div>

              <button
                onClick={() => handleQuickAddRepo('source')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-blue-600/15 hover:text-blue-300 transition-colors group text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <GitBranch className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 group-hover:text-blue-200">Source Repository</div>
                  <div className="text-[10px] text-slate-400 truncate">Legacy or upstream codebase</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAddRepo('target')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-600/15 hover:text-emerald-300 transition-colors group text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 group-hover:text-emerald-200">Target Repository</div>
                  <div className="text-[10px] text-slate-400 truncate">Destination or monorepo target</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('quick-repo')}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-left"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                <span className="text-[11px] text-slate-300">Paste Git URL directly...</span>
              </button>
            </div>

            {/* Microservices & Components */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3 h-3 text-cyan-400" />
                <span>Services & Architecture</span>
              </div>

              <button
                onClick={() => setActiveTab('quick-service')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-cyan-600/15 hover:text-cyan-300 transition-colors group text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 group-hover:text-cyan-200">Service / Microservice</div>
                  <div className="text-[10px] text-slate-400 truncate">API, Worker, or Backend component</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onAddNode('serviceNode', flowPosition, {
                    name: 'primary-db',
                    serviceType: 'Database',
                    techStack: 'PostgreSQL',
                    port: ':5432',
                    status: 'ready',
                    icon: 'database',
                    description: 'Shared relational database cluster',
                    endpoints: ['postgres://db.internal:5432'],
                  });
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-left"
              >
                <Database className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
                <span className="text-[11px] text-slate-300">Quick Database Node</span>
              </button>

              <button
                onClick={() => {
                  onAddNode('serviceNode', flowPosition, {
                    name: 'cloud-cluster',
                    serviceType: 'Cloud / Kubernetes',
                    techStack: 'AWS / EKS',
                    port: ':443',
                    status: 'ready',
                    icon: 'cloud',
                    description: 'Cloud infrastructure & cluster',
                    endpoints: ['https://k8s.internal'],
                  });
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors text-left"
              >
                <Cloud className="w-3.5 h-3.5 text-sky-400 ml-1.5" />
                <span className="text-[11px] text-slate-300">Quick Cloud / Infra Node</span>
              </button>
            </div>

            {/* Canvas Objects */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Canvas Elements</span>
              </div>

              <button
                onClick={() => {
                  onAddNode('taskNode', flowPosition);
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-indigo-600/15 hover:text-indigo-300 transition-colors group text-left"
              >
                <ListTodo className="w-4 h-4 text-indigo-400 ml-1" />
                <span className="text-xs">Migration Task Card</span>
              </button>

              <button
                onClick={() => {
                  onAddNode('noteNode', flowPosition);
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-amber-600/15 hover:text-amber-300 transition-colors group text-left"
              >
                <StickyNote className="w-4 h-4 text-amber-400 ml-1" />
                <span className="text-xs">Architectural Sticky Note</span>
              </button>

              <button
                onClick={() => {
                  onAddNode('zoneNode', flowPosition);
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-slate-100 transition-colors group text-left"
              >
                <LayoutGrid className="w-4 h-4 text-slate-400 ml-1" />
                <span className="text-xs">Visual Boundary Zone</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Paste Repo URL Form */}
        {activeTab === 'quick-repo' && (
          <form onSubmit={handleRepoUrlSubmit} className="p-1 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" /> Add from Git URL
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-medium">Git URL or identifier</label>
              <input
                type="text"
                autoFocus
                value={repoUrlInput}
                onChange={(e) => setRepoUrlInput(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Node
              </button>
            </div>
          </form>
        )}

        {/* Quick Service Creator Form */}
        {activeTab === 'quick-service' && (
          <form onSubmit={handleServiceSubmit} className="p-1 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> New Service Node
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">Service Name</label>
              <input
                type="text"
                autoFocus
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. auth-service, payment-api"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">Type / Protocol</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="REST API">REST API</option>
                  <option value="Cloud / Serverless">Cloud / Serverless</option>
                  <option value="Database">Database</option>
                  <option value="gRPC Service">gRPC Service</option>
                  <option value="GraphQL API">GraphQL API</option>
                  <option value="Worker / Queue">Worker / Queue</option>
                  <option value="WebSocket">WebSocket</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">Tech Stack</label>
                <select
                  value={serviceStack}
                  onChange={(e) => setServiceStack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Node.js">Node.js</option>
                  <option value="AWS / Kubernetes">AWS / Kubernetes</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="Go">Go</option>
                  <option value="Python">Python</option>
                  <option value="Rust">Rust</option>
                  <option value="Java">Java / Spring</option>
                  <option value="Redis">Redis</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-600/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Create Service
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
