import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';

import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { Canvas } from './components/Canvas';
import { TaskModal } from './components/TaskModal';

import {
  getStoredWorkspaces,
  getActiveWorkspaceId,
  setActiveWorkspaceId,
  saveWorkspace,
  createNewWorkspace,
  deleteWorkspace,
  exportWorkspaceToJson,
  importWorkspaceFromJson,
} from './utils/storage';

export function App() {
  const [workspaces, setWorkspaces] = useState(() => getStoredWorkspaces());
  const [activeId, setActiveId] = useState(() => getActiveWorkspaceId());
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');

  // Active workspace object
  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeId) || workspaces[0],
    [workspaces, activeId]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(activeWorkspace?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeWorkspace?.edges || []);

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Sync state when active workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      setNodes(activeWorkspace.nodes || []);
      setEdges(activeWorkspace.edges || []);
    }
  }, [activeId, activeWorkspace, setNodes, setEdges]);

  // Auto-save changes to current workspace
  useEffect(() => {
    if (!activeWorkspace) return;
    saveWorkspace({
      ...activeWorkspace,
      nodes,
      edges,
    });
  }, [nodes, edges, activeWorkspace]);

  // Node update callback passed down into custom nodes
  const handleUpdateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node))
      );
    },
    [setNodes]
  );

  // Node delete callback passed down into custom nodes
  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Augment node data with handlers so custom nodes can dispatch updates
  const augmentedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onUpdateData: handleUpdateNodeData,
        onDeleteNode: handleDeleteNode,
      },
    }));
  }, [nodes, handleUpdateNodeData, handleDeleteNode]);

  // Filter nodes based on search bar query
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return augmentedNodes;
    const q = searchQuery.toLowerCase();
    return augmentedNodes.map((node) => {
      let isMatch = false;
      if (node.data) {
        if (node.data.repo && node.data.repo.toLowerCase().includes(q)) isMatch = true;
        if (node.data.owner && node.data.owner.toLowerCase().includes(q)) isMatch = true;
        if (node.data.url && node.data.url.toLowerCase().includes(q)) isMatch = true;
        if (node.data.title && node.data.title.toLowerCase().includes(q)) isMatch = true;
        if (node.data.description && node.data.description.toLowerCase().includes(q)) isMatch = true;
        if (node.data.label && node.data.label.toLowerCase().includes(q)) isMatch = true;
      }
      return {
        ...node,
        style: {
          ...node.style,
          opacity: isMatch ? 1 : 0.25,
        },
      };
    });
  }, [augmentedNodes, searchQuery]);

  // Add Repository Card from Pasted URL
  const handleAddRepoUrl = (parsed) => {
    const newNode = {
      id: 'repo-' + Date.now(),
      type: 'repoNode',
      position: {
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 100,
      },
      data: {
        url: parsed.url,
        owner: parsed.owner,
        repo: parsed.repo,
        fullName: parsed.fullName,
        platform: parsed.platform,
        role: 'source',
        description: `Pasted ${parsed.domain} repository`,
        tags: [parsed.platform],
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Add generic node (Task, Note, Zone)
  const handleAddNode = (type) => {
    const randomOffset = () => Math.random() * 150 + 120;

    if (type === 'taskNode') {
      const newNode = {
        id: 'task-' + Date.now(),
        type: 'taskNode',
        position: { x: randomOffset() + 200, y: randomOffset() + 100 },
        data: {
          title: 'New Migration Task',
          description: 'Scope and details of code to move...',
          status: 'todo',
          priority: 'medium',
          checklist: [{ id: 'c-1', text: 'Initial code review', done: false }],
        },
      };
      setNodes((nds) => [...nds, newNode]);
    } else if (type === 'noteNode') {
      const newNode = {
        id: 'note-' + Date.now(),
        type: 'noteNode',
        position: { x: randomOffset() + 300, y: randomOffset() + 150 },
        data: {
          title: 'Architectural Note',
          content: 'Add technical commands or reminders here...',
          color: 'amber',
        },
      };
      setNodes((nds) => [...nds, newNode]);
    } else if (type === 'zoneNode') {
      const newNode = {
        id: 'zone-' + Date.now(),
        type: 'zoneNode',
        position: { x: randomOffset(), y: randomOffset() },
        style: { width: 380, height: 420 },
        data: {
          label: 'New Migration Zone',
          color: 'blue',
        },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  };

  // Connection handler (connecting handles creates animated arrow & task label)
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: 'edge-' + Date.now(),
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
        label: 'Migration Task',
        labelStyle: { fill: '#cbd5e1', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: '#0f172a', rx: 6, ry: 6 },
        labelBgPadding: [8, 4],
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle Edge click to open modal
  const handleEdgeClick = (event, edge) => {
    setSelectedEdge(edge);
    setIsTaskModalOpen(true);
  };

  const handleSaveEdgeTask = (edgeData) => {
    if (!selectedEdge) return;
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedEdge.id
          ? {
              ...e,
              label: edgeData.title || e.label,
              data: edgeData,
            }
          : e
      )
    );
  };

  const handleDeleteEdge = () => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setIsTaskModalOpen(false);
  };

  // Workspace Switch & Creation Handlers
  const handleSwitchWorkspace = (id) => {
    setActiveWorkspaceId(id);
    setActiveId(id);
  };

  const handleCreateWorkspace = () => {
    const title = prompt('Enter new workspace name:', 'Project Consolidation');
    if (title) {
      const newWs = createNewWorkspace(title);
      setWorkspaces(getStoredWorkspaces());
      setActiveId(newWs.id);
    }
  };

  const handleDeleteWorkspace = (id) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      const updatedList = deleteWorkspace(id);
      setWorkspaces(updatedList);
      setActiveId(getActiveWorkspaceId());
    }
  };

  const handleExportWorkspace = () => {
    if (activeWorkspace) {
      exportWorkspaceToJson({ ...activeWorkspace, nodes, edges });
    }
  };

  const handleImportWorkspace = (jsonStr) => {
    const imported = importWorkspaceFromJson(jsonStr);
    setWorkspaces(getStoredWorkspaces());
    setActiveId(imported.id);
  };

  // Auto-arrange layout grid
  const handleAutoLayout = () => {
    let col = 0;
    let row = 0;
    const spacingX = 320;
    const spacingY = 280;
    const colsMax = 3;

    setNodes((nds) =>
      nds.map((node, index) => {
        if (node.type === 'zoneNode') return node;
        const x = 80 + col * spacingX;
        const y = 80 + row * spacingY;
        col++;
        if (col >= colsMax) {
          col = 0;
          row++;
        }
        return {
          ...node,
          position: { x, y },
        };
      })
    );
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Header Navigation */}
      <Header
        onAddRepoUrl={handleAddRepoUrl}
        onAddNode={handleAddNode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        workspaces={workspaces}
        activeWorkspaceId={activeId}
        onSwitchWorkspace={handleSwitchWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        onExportWorkspace={handleExportWorkspace}
        onImportWorkspace={handleImportWorkspace}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Top Dashboard Metrics Bar */}
      <DashboardStats nodes={nodes} edges={edges} onAutoLayout={handleAutoLayout} />

      {/* Main React Flow Canvas */}
      <main className="flex-1 w-full h-full relative">
        <Canvas
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={handleEdgeClick}
          theme={theme}
        />
      </main>

      {/* Edge & Task Details Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskData={selectedEdge?.data || { title: selectedEdge?.label }}
        onSave={handleSaveEdgeTask}
        onDelete={handleDeleteEdge}
      />
    </div>
  );
}
