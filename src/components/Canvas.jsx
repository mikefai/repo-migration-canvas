import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  MiniMap,
  MarkerType,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  SelectionMode,
} from '@xyflow/react';
import {
  Workflow,
  Network,
  Download,
  Magnet,
  Grid,
  Check,
  Sliders,
  MousePointer2,
  BoxSelect,
} from 'lucide-react';

import { RepoNode } from './nodes/RepoNode';
import { ServiceNode } from './nodes/ServiceNode';
import { TaskNode } from './nodes/TaskNode';
import { NoteNode } from './nodes/NoteNode';
import { ZoneNode } from './nodes/ZoneNode';
import { ContextMenu } from './ContextMenu';
import { NodeContextMenu } from './NodeContextMenu';
import { SideDrawer } from './SideDrawer';
import { SelectionToolbar } from './SelectionToolbar';
import { STATUS_COLORS } from '../constants/statusColors';
import { getNodeStatus } from '../utils/nodeStatus';

import { validateConnection } from '../utils/connectionValidator';

function CanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeClick,
  onEdgeDoubleClick,
  onNodeClick,
  onAddNode,
  onAutoLayout,
  onUpdateNodeData,
  onDeleteNode,
  onDuplicateNode,
  onDownloadFlow,
  focusedNodeId,
  theme,
}) {
  const { screenToFlowPosition, fitView, toObject, setCenter } = useReactFlow();

  // Validate handle connections in real-time
  const isValidConnection = useCallback(
    (connection) => {
      const check = validateConnection(connection, nodes, edges);
      return check.valid;
    },
    [nodes, edges]
  );

  // Marquee Selection and Drag State
  const [selectMode, setSelectMode] = useState('marquee'); // 'marquee' | 'pan'
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);

  // Selection change handler
  const handleSelectionChange = useCallback(({ nodes: selNodes, edges: selEdges }) => {
    setSelectedNodes(selNodes || []);
    setSelectedEdges(selEdges || []);
  }, []);

  // Batch action handlers
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    selectedNodes.forEach((node) => {
      onDeleteNode?.(node.id);
    });
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, [selectedNodes, onDeleteNode]);

  const handleDuplicateSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    selectedNodes.forEach((node) => {
      onDuplicateNode?.(node);
    });
  }, [selectedNodes, onDuplicateNode]);

  const handleBatchSetCategory = useCallback(
    (categoryKey) => {
      if (selectedNodes.length === 0) return;
      selectedNodes.forEach((node) => {
        const updatedData = {
          ...node.data,
          category: categoryKey,
        };
        if (node.data?.onUpdateData) {
          node.data.onUpdateData(node.id, updatedData);
        } else if (onUpdateNodeData) {
          onUpdateNodeData(node.id, updatedData);
        }
      });
    },
    [selectedNodes, onUpdateNodeData]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, []);

  // Grid Snapping States
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridStep, setGridStep] = useState(20);
  const [gridVariant, setGridVariant] = useState('dots'); // 'dots' | 'lines' | 'cross'
  const [showGridMenu, setShowGridMenu] = useState(false);

  // Smoothly pan and zoom canvas to search focused node
  useEffect(() => {
    if (!focusedNodeId) return;

    const targetNode = nodes.find((n) => n.id === focusedNodeId);
    if (!targetNode) return;

    // Calculate absolute position on flow grid including parent zone offsets
    let absX = targetNode.position.x;
    let absY = targetNode.position.y;
    let curr = targetNode;
    while (curr.parentId) {
      const parent = nodes.find((n) => n.id === curr.parentId);
      if (!parent) break;
      absX += parent.position.x;
      absY += parent.position.y;
      curr = parent;
    }

    const width = targetNode.measured?.width || targetNode.width || 320;
    const height = targetNode.measured?.height || targetNode.height || 220;
    const centerX = absX + width / 2;
    const centerY = absY + height / 2;

    setCenter(centerX, centerY, { zoom: 1.2, duration: 750 });
  }, [focusedNodeId, nodes, setCenter]);

  // Drag over handler for HTML5 drag-and-drop
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop handler with grid snapping
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      try {
        const { nodeType, extraData } = JSON.parse(rawData);
        const rawPos = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Snap dropped position to grid step if enabled
        const position = snapToGrid
          ? {
              x: Math.round(rawPos.x / gridStep) * gridStep,
              y: Math.round(rawPos.y / gridStep) * gridStep,
            }
          : rawPos;

        if (onAddNode) {
          onAddNode(nodeType, position, extraData || {});
        }
      } catch (e) {
        console.error('Error handling dropped node:', e);
      }
    },
    [screenToFlowPosition, onAddNode, snapToGrid, gridStep]
  );

  // Align all existing nodes to the current grid step
  const handleAlignNodesToGrid = useCallback(() => {
    if (onNodesChange) {
      const positionChanges = nodes.map((node) => {
        const snappedX = Math.round(node.position.x / gridStep) * gridStep;
        const snappedY = Math.round(node.position.y / gridStep) * gridStep;
        return {
          id: node.id,
          type: 'position',
          position: { x: snappedX, y: snappedY },
        };
      });
      onNodesChange(positionChanges);
    }
    setShowGridMenu(false);
  }, [nodes, gridStep, onNodesChange]);

  // Pane right-click context menu (add nodes)
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    flowPosition: { x: 0, y: 0 },
  });

  // Node right-click context menu (status color, clone, delete)
  const [nodeContextMenu, setNodeContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
  });

  // Memoize nodeTypes so ReactFlow doesn't re-mount nodes on re-render
  const nodeTypes = useMemo(
    () => ({
      repoNode: RepoNode,
      serviceNode: ServiceNode,
      taskNode: TaskNode,
      noteNode: NoteNode,
      zoneNode: ZoneNode,
    }),
    []
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
        width: 20,
        height: 20,
      },
      labelStyle: { fill: '#cbd5e1', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#0f172a', rx: 6, ry: 6 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 6,
    }),
    []
  );

  // Pane right-click handler for canvas context menu
  const handlePaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      handleCloseNodeContextMenu();
      const rawPos = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const flowPos = snapToGrid
        ? {
            x: Math.round(rawPos.x / gridStep) * gridStep,
            y: Math.round(rawPos.y / gridStep) * gridStep,
          }
        : rawPos;

      setContextMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        flowPosition: flowPos,
      });
    },
    [screenToFlowPosition, snapToGrid, gridStep]
  );

  // Node right-click handler for node status color menu
  const handleNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      handleCloseContextMenu();
      setNodeContextMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        node,
      });
    },
    []
  );

  // Close pane context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  // Close node context menu
  const handleCloseNodeContextMenu = useCallback(() => {
    setNodeContextMenu((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  // Close all menus on canvas click / drag
  const handleDismissAllMenus = useCallback(() => {
    handleCloseContextMenu();
    handleCloseNodeContextMenu();
    setShowGridMenu(false);
  }, [handleCloseContextMenu, handleCloseNodeContextMenu]);

  // Set node category callback
  const handleSetNodeCategory = useCallback(
    (nodeId, categoryKey) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const updatedData = {
        ...targetNode.data,
        category: categoryKey,
      };

      if (targetNode.data?.onUpdateData) {
        targetNode.data.onUpdateData(nodeId, updatedData);
      } else if (onUpdateNodeData) {
        onUpdateNodeData(nodeId, updatedData);
      }
    },
    [nodes, onUpdateNodeData]
  );

  // Set node status color callback
  const handleSetNodeColor = useCallback(
    (nodeId, colorKey) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const updatedData = {
        ...targetNode.data,
        color: colorKey,
      };

      if (targetNode.data?.onUpdateData) {
        targetNode.data.onUpdateData(nodeId, updatedData);
      } else if (onUpdateNodeData) {
        onUpdateNodeData(nodeId, updatedData);
      }
    },
    [nodes, onUpdateNodeData]
  );

  // Set node migration status callback
  const handleSetNodeStatus = useCallback(
    (nodeId, statusKey) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const statusMeta = getNodeStatus(statusKey);
      const updatedData = {
        ...targetNode.data,
        status: statusKey,
        color: statusMeta.colorKey || targetNode.data?.color,
      };

      if (targetNode.data?.onUpdateData) {
        targetNode.data.onUpdateData(nodeId, updatedData);
      } else if (onUpdateNodeData) {
        onUpdateNodeData(nodeId, updatedData);
      }
    },
    [nodes, onUpdateNodeData]
  );

  // Set node architecture icon callback
  const handleSetNodeIcon = useCallback(
    (nodeId, iconKey) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const updatedData = {
        ...targetNode.data,
        icon: iconKey,
      };

      if (targetNode.data?.onUpdateData) {
        targetNode.data.onUpdateData(nodeId, updatedData);
      } else if (onUpdateNodeData) {
        onUpdateNodeData(nodeId, updatedData);
      }
    },
    [nodes, onUpdateNodeData]
  );

  // Auto-arrange layout with smooth fitView framing
  const handleAutoLayout = useCallback(
    (direction = 'LR') => {
      handleDismissAllMenus();
      onAutoLayout?.(direction);
      setTimeout(() => {
        fitView({ duration: 550, padding: 0.18 });
      }, 50);
    },
    [onAutoLayout, fitView, handleDismissAllMenus]
  );

  // Download flow as JSON file callback
  const handleDownloadFlowJson = useCallback(() => {
    if (onDownloadFlow) {
      onDownloadFlow();
      return;
    }

    try {
      const flow = toObject ? toObject() : { nodes, edges };
      const cleanedNodes = (flow.nodes || nodes || []).map((node) => {
        const { onUpdateData, onDeleteNode, ...cleanData } = node.data || {};
        return {
          ...node,
          data: cleanData,
        };
      });

      const payload = {
        name: 'Migration Flow',
        exportedAt: new Date().toISOString(),
        nodes: cleanedNodes,
        edges: flow.edges || edges || [],
        viewport: flow.viewport,
        version: '1.0',
      };

      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `migration-flow-${Date.now()}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download flow JSON:', err);
    }
  }, [onDownloadFlow, toObject, nodes, edges]);

  return (
    <div className="w-full h-full relative bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={selectMode === 'marquee'}
        panOnDrag={selectMode === 'pan' ? [1, 2] : false}
        panOnScroll={true}
        multiSelectionKeyCode={['Meta', 'Control', 'Shift']}
        deleteKeyCode={['Delete', 'Backspace']}
        onSelectionChange={handleSelectionChange}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onEdgeClick={(e, edge) => {
          handleDismissAllMenus();
          onEdgeClick?.(e, edge);
        }}
        onEdgeDoubleClick={(e, edge) => {
          handleDismissAllMenus();
          onEdgeDoubleClick?.(e, edge);
        }}
        onNodeClick={(e, node) => {
          handleDismissAllMenus();
          onNodeClick?.(e, node);
        }}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handleDismissAllMenus}
        onPaneContextMenu={handlePaneContextMenu}
        onMoveStart={handleDismissAllMenus}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid={snapToGrid}
        snapGrid={[gridStep, gridStep]}
        className="touch-none"
      >
        <Background
          variant={
            gridVariant === 'lines'
              ? BackgroundVariant.Lines
              : gridVariant === 'cross'
              ? BackgroundVariant.Cross
              : BackgroundVariant.Dots
          }
          gap={gridStep}
          size={gridVariant === 'lines' ? 1 : 1.5}
          color={theme === 'dark' ? '#334155' : '#cbd5e1'}
        />

        <Controls position="bottom-left" showInteractive={false}>
          <ControlButton
            onClick={() => setSelectMode(selectMode === 'pan' ? 'marquee' : 'pan')}
            title={
              selectMode === 'marquee'
                ? 'Marquee Selection Box Mode (ACTIVE) — Click & Drag to select multiple nodes simultaneously. Click to switch to Pan mode.'
                : 'Canvas Pan Mode (ACTIVE) — Drag to pan canvas. Click to switch to Marquee Box Selection mode.'
            }
            aria-label="Toggle Selection Mode"
          >
            {selectMode === 'marquee' ? (
              <BoxSelect className="w-4 h-4 text-blue-400 font-bold" />
            ) : (
              <MousePointer2 className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
            )}
          </ControlButton>
          <ControlButton
            onClick={() => handleAutoLayout('LR')}
            title="Auto-arrange Directed Graph (Left-to-Right pipeline)"
            aria-label="Auto-arrange Directed Graph"
          >
            <Workflow className="w-4 h-4 text-blue-400 hover:text-blue-300 transition-colors" />
          </ControlButton>
          <ControlButton
            onClick={() => handleAutoLayout('TB')}
            title="Auto-arrange Hierarchical Tree (Top-to-Bottom hierarchy)"
            aria-label="Auto-arrange Hierarchical Tree"
          >
            <Network className="w-4 h-4 text-indigo-400 hover:text-indigo-300 transition-colors" />
          </ControlButton>
          <ControlButton
            onClick={() => setShowGridMenu(!showGridMenu)}
            title={`Snap to Grid (${snapToGrid ? `${gridStep}px ON` : 'OFF'})`}
            aria-label="Grid Settings"
          >
            <Magnet className={`w-4 h-4 transition-colors ${snapToGrid ? 'text-amber-400' : 'text-slate-500'}`} />
          </ControlButton>
          <ControlButton
            onClick={handleDownloadFlowJson}
            title="Download Flow as JSON"
            aria-label="Download Flow as JSON"
          >
            <Download className="w-4 h-4 text-emerald-400 hover:text-emerald-300 transition-colors" />
          </ControlButton>
        </Controls>

        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.data?.color && STATUS_COLORS[node.data.color]) {
              return STATUS_COLORS[node.data.color].colorHex;
            }
            if (node.type === 'repoNode') return '#3b82f6';
            if (node.type === 'serviceNode') return '#06b6d4';
            if (node.type === 'taskNode') return '#6366f1';
            if (node.type === 'noteNode') return '#f59e0b';
            if (node.type === 'zoneNode') return '#334155';
            return '#64748b';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Floating Grid Snap Control Popover */}
      {showGridMenu && (
        <div className="absolute bottom-14 left-4 z-50 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-3 select-none space-y-3 ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-100">
              <Magnet className="w-4 h-4 text-amber-400" />
              <span>Snap to Grid</span>
            </div>
            <button
              type="button"
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                snapToGrid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {snapToGrid ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Grid Step Size */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Grid Size</span>
              <span className="text-amber-400">{gridStep}px</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[10, 15, 20, 30].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setGridStep(step)}
                  className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    gridStep === step
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {step}px
                </button>
              ))}
            </div>
          </div>

          {/* Grid Style Pattern */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              <span>Grid Pattern</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: 'dots', label: 'Dots' },
                { key: 'lines', label: 'Lines' },
                { key: 'cross', label: 'Cross' },
              ].map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setGridVariant(v.key)}
                  className={`py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                    gridVariant === v.key
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action: Snap Existing Nodes Now */}
          <button
            type="button"
            onClick={handleAlignNodesToGrid}
            className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Grid className="w-3.5 h-3.5 text-amber-400" /> Align All Nodes Now
          </button>
        </div>
      )}

      {/* Floating Side Drawer Component Palette */}
      <SideDrawer onAddNode={onAddNode} screenToFlowPosition={screenToFlowPosition} />

      {/* Floating Pane Context Menu (Add At Cursor) */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        flowPosition={contextMenu.flowPosition}
        onClose={handleCloseContextMenu}
        onAddNode={onAddNode}
      />

      {/* Floating Node Context Menu (Status Colors, Duplicate, Delete) */}
      <NodeContextMenu
        isOpen={nodeContextMenu.isOpen}
        x={nodeContextMenu.x}
        y={nodeContextMenu.y}
        node={nodeContextMenu.node}
        onClose={handleCloseNodeContextMenu}
        onSetNodeStatus={handleSetNodeStatus}
        onSetNodeCategory={handleSetNodeCategory}
        onSetNodeColor={handleSetNodeColor}
        onSetNodeIcon={handleSetNodeIcon}
        onDuplicateNode={onDuplicateNode}
        onDeleteNode={onDeleteNode}
      />
      {/* Floating Selection Toolbar for Marquee Batch Actions */}
      <SelectionToolbar
        selectedNodes={selectedNodes}
        selectedEdges={selectedEdges}
        onDeleteSelected={handleDeleteSelected}
        onDuplicateSelected={handleDuplicateSelected}
        onBatchSetCategory={handleBatchSetCategory}
        onClearSelection={handleClearSelection}
        selectMode={selectMode}
        onToggleSelectMode={() => setSelectMode(selectMode === 'pan' ? 'marquee' : 'pan')}
      />
    </div>
  );
}

export function Canvas(props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
