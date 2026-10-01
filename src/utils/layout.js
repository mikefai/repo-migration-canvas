import dagre from '@dagrejs/dagre';

const NODE_DIMENSIONS = {
  repoNode: { width: 320, height: 260 },
  serviceNode: { width: 320, height: 260 },
  taskNode: { width: 340, height: 320 },
  noteNode: { width: 280, height: 240 },
  zoneNode: { width: 400, height: 400 },
  default: { width: 300, height: 240 },
};

/**
 * Calculates hierarchical tree / directed graph positions for nodes using Dagre.
 * @param {Array} nodes - ReactFlow nodes
 * @param {Array} edges - ReactFlow edges
 * @param {Object} options - Configuration options
 * @param {'LR' | 'TB'} options.direction - 'LR' (Left to Right) or 'TB' (Top to Bottom)
 * @param {number} options.nodesep - Distance between nodes in same rank
 * @param {number} options.ranksep - Distance between ranks (tree levels)
 */
export function getLayoutedElements(nodes, edges, options = {}) {
  const direction = options.direction || 'LR';
  const nodesep = options.nodesep || 70;
  const ranksep = options.ranksep || 120;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep,
    ranksep,
    align: 'UL',
    ranker: 'network-simplex',
  });

  // Separate non-zone nodes and zone containers
  const activeNodes = nodes.filter((n) => n.type !== 'zoneNode');
  const zoneNodes = nodes.filter((n) => n.type === 'zoneNode');

  // Register nodes with dimensions
  activeNodes.forEach((node) => {
    const dim = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.default;
    dagreGraph.setNode(node.id, { width: dim.width, height: dim.height });
  });

  // Register edges
  edges.forEach((edge) => {
    if (
      activeNodes.some((n) => n.id === edge.source) &&
      activeNodes.some((n) => n.id === edge.target)
    ) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // Compute Dagre layout
  dagre.layout(dagreGraph);

  // Position nodes
  const layoutedNodes = activeNodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    const dim = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.default;

    // Remove old parentId/extent if it was locked to a static zone
    const { parentId, extent, ...cleanNode } = node;

    return {
      ...cleanNode,
      position: {
        x: Math.round(nodeWithPos.x - dim.width / 2),
        y: Math.round(nodeWithPos.y - dim.height / 2),
      },
    };
  });

  // Position zones behind or beside nodes if zones exist
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  layoutedNodes.forEach((n) => {
    if (n.position.x < minX) minX = n.position.x;
    if (n.position.y < minY) minY = n.position.y;
    if (n.position.x > maxX) maxX = n.position.x;
    if (n.position.y > maxY) maxY = n.position.y;
  });

  const layoutedZones = zoneNodes.map((z, idx) => ({
    ...z,
    position: {
      x: minX !== Infinity ? minX - 40 : 40 + idx * 420,
      y: minY !== Infinity ? minY - 40 : 40,
    },
    style: {
      ...z.style,
      width: maxX !== -Infinity ? Math.max(maxX - minX + 400, 420) : 420,
      height: maxY !== -Infinity ? Math.max(maxY - minY + 400, 450) : 450,
    },
  }));

  return {
    nodes: [...layoutedZones, ...layoutedNodes],
    edges,
  };
}
