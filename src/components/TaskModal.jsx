import React, { useState } from 'react';
import { X, Trash2, ListTodo } from 'lucide-react';

export function TaskModal({ isOpen, onClose, taskData, onSave, onDelete }) {
  if (!isOpen || !taskData) return null;

  const [title, setTitle] = useState(taskData.title || '');
  const [description, setDescription] = useState(taskData.description || '');
  const [status, setStatus] = useState(taskData.status || 'todo');
  const [priority, setPriority] = useState(taskData.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...taskData,
      title,
      description,
      status,
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-slate-900">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Migration Connection & Task Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Task / Flow Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Move Auth Module & User Schemas"
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-600"
              >
                <option value="todo">TO DO</option>
                <option value="in-progress">IN PROGRESS</option>
                <option value="done">DONE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-600"
              >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
                <option value="critical">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Scope & Technical Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what files, packages, or routes to copy/refactor..."
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Connection
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                Save Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
