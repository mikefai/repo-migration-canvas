import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';

import { RepoNode } from './nodes/RepoNode';
import { TaskNode } from './nodes/TaskNode';
import { NoteNode } from './nodes/NoteNode';
import { ZoneNode } from './nodes/ZoneNode';

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgeClick,
  onNodeClick,
  theme,
}) {
  // Memoize nodeTypes so ReactFlow doesn't re-mount nodes on re-render
  const nodeTypes = useMemo(
    () => ({
      repoNode: RepoNode,
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

  return (
    <div className="w-full h-full relative bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color={theme === 'dark' ? '#334155' : '#cbd5e1'}
        />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type === 'repoNode') return '#3b82f6';
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
    </div>
  );
}
