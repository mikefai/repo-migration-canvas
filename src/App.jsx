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
import { EdgeModal } from './components/EdgeModal';
import { ConnectionToast } from './components/ConnectionToast';
import { validateConnection } from './utils/connectionValidator';

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
import { getLayoutedElements } from './utils/layout';

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

  const [editingEdge, setEditingEdge] = useState(null);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);

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

  // Duplicate node callback
  const handleDuplicateNode = useCallback(
    (nodeToClone) => {
      if (!nodeToClone) return;
      const clone = {
        ...nodeToClone,
        id: `${nodeToClone.type.replace('Node', '')}-${Date.now()}`,
        position: {
          x: nodeToClone.position.x + 40,
          y: nodeToClone.position.y + 40,
        },
        data: {
          ...nodeToClone.data,
          name: nodeToClone.data?.name ? `${nodeToClone.data.name}-copy` : undefined,
          repo: nodeToClone.data?.repo ? `${nodeToClone.data.repo}-copy` : undefined,
          fullName: nodeToClone.data?.fullName ? `${nodeToClone.data.fullName}-copy` : undefined,
          title: nodeToClone.data?.title ? `${nodeToClone.data.title} (Copy)` : undefined,
        },
        selected: false,
      };
      setNodes((nds) => [...nds, clone]);
    },
    [setNodes]
  );

  const [focusedNodeId, setFocusedNodeId] = useState(null);

  // Compute search matching node IDs
  const searchMatchingNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return nodes
      .filter((node) => {
        if (node.type === 'zoneNode') return false;
        const d = node.data || {};
        return (
          (d.repo && d.repo.toLowerCase().includes(q)) ||
          (d.owner && d.owner.toLowerCase().includes(q)) ||
          (d.fullName && d.fullName.toLowerCase().includes(q)) ||
          (d.url && d.url.toLowerCase().includes(q)) ||
          (d.name && d.name.toLowerCase().includes(q)) ||
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q))
        );
      })
      .map((n) => n.id);
  }, [nodes, searchQuery]);

  // Sync focusedNodeId when search query changes
  useEffect(() => {
    if (searchQuery.trim() && searchMatchingNodeIds.length > 0) {
      if (!focusedNodeId || !searchMatchingNodeIds.includes(focusedNodeId)) {
        setFocusedNodeId(searchMatchingNodeIds[0]);
      }
    } else if (!searchQuery.trim()) {
      setFocusedNodeId(null);
    }
  }, [searchQuery, searchMatchingNodeIds, focusedNodeId]);

  // Augment node data with handlers & search highlight state
  const augmentedNodes = useMemo(() => {
    const isSearching = Boolean(searchQuery.trim());
    return nodes.map((node) => {
      const isMatch = isSearching && searchMatchingNodeIds.includes(node.id);
      const isFocused = node.id === focusedNodeId;

      return {
        ...node,
        data: {
          ...node.data,
          isSearchMatch: isMatch,
          isFocused: isFocused,
          onUpdateData: handleUpdateNodeData,
          onDeleteNode: handleDeleteNode,
        },
      };
    });
  }, [nodes, searchQuery, searchMatchingNodeIds, focusedNodeId, handleUpdateNodeData, handleDeleteNode]);

  // Filter node opacity based on search bar query
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return augmentedNodes;
    return augmentedNodes.map((node) => {
      const isMatch = node.data?.isSearchMatch || node.data?.isFocused;
      return {
        ...node,
        style: {
          ...node.style,
          opacity: isMatch ? 1 : 0.2,
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

  // Add node at optional cursor position with custom metadata
  const handleAddNode = useCallback(
    (type, position = null, extraData = {}) => {
      const randomOffset = () => Math.random() * 150 + 120;

      if (type === 'repoNode') {
        const role = extraData.role || 'source';
        const defaultName = role === 'target' ? 'target-service' : 'legacy-repo';
        const defaultOwner = role === 'target' ? 'target-org' : 'source-org';
        const repoName = extraData.repo || defaultName;
        const ownerName = extraData.owner || defaultOwner;
        const newNode = {
          id: 'repo-' + Date.now(),
          type: 'repoNode',
          position: position || { x: randomOffset() + 100, y: randomOffset() + 80 },
          data: {
            url: extraData.url || '',
            owner: ownerName,
            repo: repoName,
            fullName: extraData.fullName || `${ownerName}/${repoName}`,
            platform: extraData.platform || 'github',
            role,
            category: extraData.category || (role === 'target' ? 'Microservice' : 'Frontend'),
            description: extraData.description || (role === 'target' ? 'Target migration repository' : 'Source repository to extract code from'),
            tags: extraData.tags || [role],
          },
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (type === 'serviceNode') {
        const defaultCategory =
          extraData.category ||
          (extraData.serviceType?.includes('Database')
            ? 'Database'
            : extraData.serviceType?.includes('Worker')
            ? 'Worker'
            : extraData.serviceType?.includes('Serverless')
            ? 'DevOps'
            : 'API');

        const newNode = {
          id: 'service-' + Date.now(),
          type: 'serviceNode',
          position: position || { x: randomOffset() + 160, y: randomOffset() + 100 },
          data: {
            name: extraData.name || 'core-api',
            serviceType: extraData.serviceType || 'REST API',
            techStack: extraData.techStack || 'Node.js',
            port: extraData.port || ':8080',
            status: extraData.status || 'in-progress',
            category: defaultCategory,
            description: extraData.description || 'Service component managed in migration',
            endpoints: extraData.endpoints || ['/health', '/api/v1'],
          },
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (type === 'taskNode') {
        const newNode = {
          id: 'task-' + Date.now(),
          type: 'taskNode',
          position: position || { x: randomOffset() + 200, y: randomOffset() + 100 },
          data: {
            title: extraData.title || 'New Migration Task',
            description: extraData.description || 'Scope and details of code to move...',
            status: extraData.status || 'todo',
            priority: extraData.priority || 'medium',
            category: extraData.category || 'DevOps',
            checklist: extraData.checklist || [{ id: 'c-1', text: 'Initial code review', done: false }],
          },
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (type === 'noteNode') {
        const newNode = {
          id: 'note-' + Date.now(),
          type: 'noteNode',
          position: position || { x: randomOffset() + 300, y: randomOffset() + 150 },
          data: {
            title: extraData.title || 'Architectural Note',
            content: extraData.content || 'Add technical commands or reminders here...',
            color: extraData.color || 'amber',
            category: extraData.category || 'Documentation',
          },
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (type === 'zoneNode') {
        const newNode = {
          id: 'zone-' + Date.now(),
          type: 'zoneNode',
          position: position || { x: randomOffset(), y: randomOffset() },
          style: { width: 380, height: 420 },
          data: {
            label: extraData.label || 'New Migration Zone',
            color: extraData.color || 'blue',
          },
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [setNodes]
  );

  const [connectionToast, setConnectionToast] = useState(null);

  // Connection handler with multi-linking support
  const onConnect = useCallback(
    (params) => {
      const check = validateConnection(params, nodes, edges);
      if (!check.valid) {
        setConnectionToast({
          reason: check.reason,
        });
        return;
      }

      const strokeColor = check.strokeColor || '#3b82f6';
      const uniqueEdgeId = `edge-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newEdge = {
        ...params,
        id: uniqueEdgeId,
        animated: true,
        style: { stroke: strokeColor, strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
        },
        label: check.defaultLabel || 'Migration Dependency',
        labelStyle: { fill: '#cbd5e1', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: '#0f172a', rx: 6, ry: 6 },
        labelBgPadding: [8, 4],
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, edges, setEdges]
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

  // Handle Edge double-click to customize relationship label & style
  const handleEdgeDoubleClick = useCallback((event, edge) => {
    event?.stopPropagation?.();
    setEditingEdge(edge);
    setIsEdgeModalOpen(true);
  }, []);

  const handleSaveEdge = useCallback((updatedEdge) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
    );
  }, [setEdges]);

  const handleDeleteEditingEdge = useCallback(() => {
    if (!editingEdge) return;
    setEdges((eds) => eds.filter((e) => e.id !== editingEdge.id));
    setIsEdgeModalOpen(false);
  }, [editingEdge, setEdges]);

  // Workspace Switch & Creation Handlers
  const handleSwitchWorkspace = (id) => {
    setActiveWorkspaceId(id);
    setActiveId(id);
  };

  const handleCreateWorkspace = () => {
    const title = `Migration Plan ${workspaces.length + 1}`;
    const newWs = createNewWorkspace(title);
    setWorkspaces(getStoredWorkspaces());
    setActiveId(newWs.id);
  };

  const handleDeleteWorkspace = (id) => {
    const updatedList = deleteWorkspace(id);
    setWorkspaces(updatedList);
    setActiveId(getActiveWorkspaceId());
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

  // Auto-arrange layout using Dagre directed graph layout
  const handleAutoLayout = useCallback(
    (direction = 'LR') => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
      setNodes(layouted.nodes);
    },
    [nodes, edges, setNodes]
  );

  return (
    <div className={`w-screen h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Header Navigation */}
      <Header
        nodes={augmentedNodes}
        onAddRepoUrl={handleAddRepoUrl}
        onAddNode={handleAddNode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        focusedNodeId={focusedNodeId}
        onFocusNode={setFocusedNodeId}
        searchMatchingNodeIds={searchMatchingNodeIds}
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
      <DashboardStats nodes={nodes} edges={edges} onAutoLayout={() => handleAutoLayout('LR')} />

      {/* Main React Flow Canvas */}
      <main className="flex-1 w-full h-full relative">
        <Canvas
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={handleEdgeClick}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onAddNode={handleAddNode}
          onAutoLayout={handleAutoLayout}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
          focusedNodeId={focusedNodeId}
          theme={theme}
        />
      </main>

      {/* Task Details Modal (Single Click) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskData={selectedEdge?.data || { title: selectedEdge?.label }}
        onSave={handleSaveEdgeTask}
        onDelete={handleDeleteEdge}
      />

      {/* Edge Label & Relationship Editor Modal (Double Click) */}
      <EdgeModal
        isOpen={isEdgeModalOpen}
        onClose={() => setIsEdgeModalOpen(false)}
        edge={editingEdge}
        sourceNode={nodes.find((n) => n.id === editingEdge?.source)}
        targetNode={nodes.find((n) => n.id === editingEdge?.target)}
        onSave={handleSaveEdge}
        onDelete={handleDeleteEditingEdge}
      />
      {/* Connection Restriction Toast Alert */}
      <ConnectionToast
        toast={connectionToast}
        onClose={() => setConnectionToast(null)}
      />
    </div>
  );
}
