import React from 'react';
import { GitBranch, ListTodo, ArrowRight, RefreshCw } from 'lucide-react';

export function DashboardStats({ nodes, edges, onAutoLayout }) {
  const repoNodes = nodes.filter((n) => n.type === 'repoNode');
  const sourceCount = repoNodes.filter((n) => n.data?.role === 'source').length;
  const targetCount = repoNodes.filter((n) => n.data?.role === 'target').length;

  const taskNodes = nodes.filter((n) => n.type === 'taskNode');
  const doneTasks = taskNodes.filter((n) => n.data?.status === 'done').length;
  const inProgressTasks = taskNodes.filter((n) => n.data?.status === 'in-progress').length;
  const todoTasks = taskNodes.filter((n) => n.data?.status === 'todo').length;

  const totalTasks = taskNodes.length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-11 bg-slate-100/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between text-xs z-20 shadow-xs transition-colors">
      {/* Metrics breakdown */}
      <div className="flex items-center gap-6">
        {/* Repo counts */}
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Repositories:</span>
          <span className="font-bold text-slate-900 dark:text-slate-200">{repoNodes.length}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/50">
            {sourceCount} Source
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50">
            {targetCount} Target
          </span>
        </div>

        {/* Task progress metrics */}
        <div className="flex items-center gap-2">
          <ListTodo className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Tasks:</span>
          <span className="font-bold text-slate-900 dark:text-slate-200">{totalTasks}</span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-700 dark:text-emerald-400">{doneTasks} Done</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-blue-700 dark:text-blue-400">{inProgressTasks} Active</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400">{todoTasks} To Do</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Progress:</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-500 dark:to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{progressPct}%</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {onAutoLayout && (
          <button
            onClick={onAutoLayout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 text-slate-800 dark:text-slate-300 text-[11px] font-bold shadow-xs transition-colors"
            title="Rearrange Nodes Grid"
          >
            <RefreshCw className="w-3 h-3 text-slate-600 dark:text-slate-400" /> Auto-Arrange
          </button>
        )}
      </div>
    </div>
  );
}
