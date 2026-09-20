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
  const isLight = theme === 'light';

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
      style: { stroke: isLight ? '#2563eb' : '#3b82f6', strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isLight ? '#2563eb' : '#3b82f6',
        width: 22,
        height: 22,
      },
      labelStyle: {
        fill: isLight ? '#0f172a' : '#cbd5e1',
        fontSize: 11,
        fontWeight: 700,
      },
      labelBgStyle: {
        fill: isLight ? '#ffffff' : '#0f172a',
        rx: 6,
        ry: 6,
        stroke: isLight ? '#cbd5e1' : '#334155',
        strokeWidth: 1,
      },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 6,
    }),
    [isLight]
  );

  return (
    <div className={`w-full h-full relative ${isLight ? 'bg-slate-100' : 'bg-slate-950'}`}>
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
          size={1.8}
          color={isLight ? '#94a3b8' : '#334155'}
        />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type === 'repoNode') return isLight ? '#2563eb' : '#3b82f6';
            if (node.type === 'taskNode') return isLight ? '#4f46e5' : '#6366f1';
            if (node.type === 'noteNode') return isLight ? '#d97706' : '#f59e0b';
            if (node.type === 'zoneNode') return isLight ? '#cbd5e1' : '#334155';
            return '#64748b';
          }}
          maskColor={isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.7)'}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}
