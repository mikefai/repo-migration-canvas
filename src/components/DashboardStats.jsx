import React from 'react';
import { GitBranch, ListTodo, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Layers, Server, Activity } from 'lucide-react';
import { getNodeStatus } from '../utils/nodeStatus';

export function DashboardStats({ nodes, edges, onAutoLayout }) {
  const repoNodes = nodes.filter((n) => n.type === 'repoNode');
  const sourceCount = repoNodes.filter((n) => n.data?.role === 'source').length;
  const targetCount = repoNodes.filter((n) => n.data?.role === 'target').length;

  const serviceNodes = nodes.filter((n) => n.type === 'serviceNode');

  // Node status aggregation across all components
  const architectureNodes = nodes.filter((n) => n.type !== 'zoneNode' && n.type !== 'noteNode');
  const doneNodesCount = architectureNodes.filter((n) => {
    const s = getNodeStatus(n.data?.status || (n.data?.role === 'target' ? 'done' : ''));
    return s.id === 'done' || s.id === 'migrated' || s.id === 'stable';
  }).length;
  const inProgressNodesCount = architectureNodes.filter((n) => {
    const s = getNodeStatus(n.data?.status || '');
    return s.id === 'in-progress';
  }).length;
  const draftNodesCount = architectureNodes.filter((n) => {
    const s = getNodeStatus(n.data?.status || '');
    return s.id === 'draft' || s.id === 'pending';
  }).length;
  const deprecatedNodesCount = architectureNodes.filter((n) => {
    const s = getNodeStatus(n.data?.status || (n.data?.role === 'source' ? 'deprecated' : ''));
    return s.id === 'deprecated';
  }).length;

  const taskNodes = nodes.filter((n) => n.type === 'taskNode');
  const doneTasks = taskNodes.filter((n) => n.data?.status === 'done').length;
  const inProgressTasks = taskNodes.filter((n) => n.data?.status === 'in-progress').length;
  const todoTasks = taskNodes.filter((n) => n.data?.status === 'todo').length;

  const totalTasks = taskNodes.length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-11 bg-slate-900/95 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs z-20 shadow-md">
      {/* Metrics breakdown */}
      <div className="flex items-center gap-6">
        {/* Repo counts */}
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Repositories:</span>
          <span className="font-semibold text-slate-200">{repoNodes.length}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
            {sourceCount} Source
          </span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
            {targetCount} Target
          </span>
          {serviceNodes.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-1 ml-1">
              <Server className="w-2.5 h-2.5" /> {serviceNodes.length} Services
            </span>
          )}
        </div>

        {/* Node Status Breakdown (Draft, In Progress, Done, Deprecated) */}
        <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-slate-500 font-medium">Status:</span>
          {doneNodesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1" title="Done or Completed Nodes">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {doneNodesCount} Done
            </span>
          )}
          {inProgressNodesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 flex items-center gap-1" title="In Progress Nodes">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {inProgressNodesCount} In Progress
            </span>
          )}
          {draftNodesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1" title="Draft / Planning Nodes">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {draftNodesCount} Draft
            </span>
          )}
          {deprecatedNodesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1" title="Deprecated / Legacy Nodes">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {deprecatedNodesCount} Deprecated
            </span>
          )}
        </div>

        {/* Task progress metrics */}
        <div className="flex items-center gap-2">
          <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Tasks:</span>
          <span className="font-semibold text-slate-200">{totalTasks}</span>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-emerald-400 font-medium">{doneTasks} Done</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-medium">{inProgressTasks} Active</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">{todoTasks} To Do</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-slate-400 text-[11px]">Progress:</span>
          <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-slate-200 font-semibold">{progressPct}%</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {onAutoLayout && (
          <button
            onClick={onAutoLayout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-medium transition-colors"
            title="Rearrange Nodes Grid"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" /> Auto-Arrange
          </button>
        )}
      </div>
    </div>
  );
}
