const WORKSPACES_KEY = 'repo_migration_canvas_workspaces';
const ACTIVE_WORKSPACE_KEY = 'repo_migration_canvas_active_id';

const INITIAL_WORKSPACE = {
  id: 'default-workspace',
  name: 'Main Migration Plan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [
    {
      id: 'zone-1',
      type: 'zoneNode',
      position: { x: 50, y: 50 },
      style: { width: 360, height: 420 },
      data: { label: 'Source Repositories', color: 'slate' },
    },
    {
      id: 'zone-2',
      type: 'zoneNode',
      position: { x: 500, y: 50 },
      style: { width: 360, height: 420 },
      data: { label: 'Target Repositories', color: 'blue' },
    },
    {
      id: 'repo-src-1',
      type: 'repoNode',
      position: { x: 80, y: 130 },
      parentId: 'zone-1',
      extent: 'parent',
      data: {
        url: 'https://github.com/facebook/react',
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        platform: 'github',
        role: 'source',
        description: 'Legacy frontend core components',
        tags: ['Frontend', 'Legacy'],
      },
    },
    {
      id: 'repo-tgt-1',
      type: 'repoNode',
      position: { x: 530, y: 130 },
      parentId: 'zone-2',
      extent: 'parent',
      data: {
        url: 'https://github.com/vercel/next.js',
        owner: 'vercel',
        repo: 'next.js',
        fullName: 'vercel/next.js',
        platform: 'github',
        role: 'target',
        description: 'Modern Next.js monorepo target',
        tags: ['Monorepo', 'Target'],
      },
    },
    {
      id: 'task-1',
      type: 'taskNode',
      position: { x: 280, y: 520 },
      data: {
        title: 'Migrate UI Components & Hooks',
        description: 'Extract reusable UI primitive components and custom state hooks into the new target monorepo packages/ui folder.',
        status: 'in-progress',
        priority: 'high',
        checklist: [
          { id: 'c1', text: 'Extract Button & Input components', done: true },
          { id: 'c2', text: 'Migrate custom theme hooks', done: true },
          { id: 'c3', text: 'Setup Tailwind CSS v4 in target', done: false },
          { id: 'c4', text: 'Write Jest / Playwright unit tests', done: false },
        ],
      },
    },
    {
      id: 'note-1',
      type: 'noteNode',
      position: { x: 680, y: 520 },
      data: {
        title: 'Migration Guidelines',
        content: '- Maintain zero breaking changes on exported component APIs\n- Ensure proper TypeScript types are exported\n- Run `npm test` before pushing PRs',
        color: 'amber',
      },
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'repo-src-1',
      target: 'task-1',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      label: 'Extract Source',
    },
    {
      id: 'edge-2',
      source: 'task-1',
      target: 'repo-tgt-1',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
      label: 'Deploy Target',
    },
  ],
};

export function getStoredWorkspaces() {
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) {
      const defaultList = [INITIAL_WORKSPACE];
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(defaultList));
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, INITIAL_WORKSPACE.id);
      return defaultList;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load workspaces from localStorage:', err);
    return [INITIAL_WORKSPACE];
  }
}

export function getActiveWorkspaceId() {
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY) || INITIAL_WORKSPACE.id;
}

export function setActiveWorkspaceId(id) {
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
}

export function saveWorkspace(workspace) {
  try {
    const list = getStoredWorkspaces();
    const index = list.findIndex((w) => w.id === workspace.id);
    const updated = {
      ...workspace,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }

    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(list));
    return updated;
  } catch (err) {
    console.error('Failed to save workspace:', err);
  }
}

export function createNewWorkspace(name = 'New Migration Project') {
  const newWs = {
    id: 'ws-' + Date.now(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  };
  saveWorkspace(newWs);
  setActiveWorkspaceId(newWs.id);
  return newWs;
}

export function deleteWorkspace(id) {
  const list = getStoredWorkspaces().filter((w) => w.id !== id);
  if (list.length === 0) {
    list.push(INITIAL_WORKSPACE);
  }
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(list));
  if (getActiveWorkspaceId() === id) {
    setActiveWorkspaceId(list[0].id);
  }
  return list;
}

export function exportWorkspaceToJson(workspace) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspace, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${workspace.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-canvas.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importWorkspaceFromJson(jsonContent) {
  try {
    const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      throw new Error('Invalid workspace JSON format: missing nodes array');
    }

    const importedWs = {
      id: 'ws-' + Date.now(),
      name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Migration Canvas',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: parsed.nodes || [],
      edges: parsed.edges || [],
    };

    saveWorkspace(importedWs);
    setActiveWorkspaceId(importedWs.id);
    return importedWs;
  } catch (err) {
    console.error('Import error:', err);
    throw err;
  }
}
