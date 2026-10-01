/**
 * Validates React Flow connections between nodes.
 * Supports multi-linking so feature nodes can be connected multiple times.
 *
 * @param {Object} connection - React Flow connection object { source, target, sourceHandle, targetHandle }
 * @param {Array} nodes - List of all nodes in workspace
 * @param {Array} edges - List of all existing edges in workspace
 * @returns {Object} { valid: boolean, reason?: string, defaultLabel?: string, strokeColor?: string }
 */
export function validateConnection(connection, nodes = [], edges = []) {
  if (!connection || !connection.source || !connection.target) {
    return { valid: false, reason: 'Invalid connection parameters.' };
  }

  // 1. Prevent self-connection
  if (connection.source === connection.target) {
    return { valid: false, reason: 'A node cannot connect to itself.' };
  }

  // Find source & target nodes
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) {
    return { valid: false, reason: 'Source or target node not found.' };
  }

  // 2. Restrict outgoing connections from 'Note' nodes
  if (sourceNode.type === 'noteNode') {
    return {
      valid: false,
      reason: "Sticky Note nodes cannot have outgoing dependencies (annotations are documentation-only).",
    };
  }

  // 3. Restrict connections to/from 'Zone' container nodes
  if (sourceNode.type === 'zoneNode' || targetNode.type === 'zoneNode') {
    return {
      valid: false,
      reason: 'Architecture Zone boundary boxes cannot be connected directly as dependency edges.',
    };
  }

  // Count existing links between this source and target to label multi-links neatly
  const existingLinks = edges.filter(
    (e) => e.source === connection.source && e.target === connection.target
  );
  const linkCount = existingLinks.length;

  // Determine smart label and color styling based on source and target types
  let defaultLabel = linkCount > 0 ? `Feature Link #${linkCount + 1}` : 'Migration Dependency';
  let strokeColor = '#3b82f6'; // default blue

  if (sourceNode.type === 'repoNode' && targetNode.type === 'repoNode') {
    const sourceRole = sourceNode.data?.role || 'source';
    const targetRole = targetNode.data?.role || 'target';

    if (sourceRole === 'source' && targetRole === 'target') {
      defaultLabel = linkCount > 0 ? `Code Extract #${linkCount + 1}` : 'Code Extract & Move';
      strokeColor = '#3b82f6';
    } else if (sourceRole === 'target' && targetRole === 'source') {
      defaultLabel = linkCount > 0 ? `Upstream Ref #${linkCount + 1}` : 'Upstream Ref';
      strokeColor = '#a855f7';
    } else if (sourceRole === 'reference' || targetRole === 'reference') {
      defaultLabel = linkCount > 0 ? `Shared Types #${linkCount + 1}` : 'Shared Package / Types';
      strokeColor = '#10b981';
    }
  } else if (sourceNode.type === 'serviceNode' || targetNode.type === 'serviceNode') {
    defaultLabel = linkCount > 0 ? `API Link #${linkCount + 1}` : 'API Connection';
    strokeColor = '#06b6d4';
  } else if (sourceNode.type === 'taskNode' || targetNode.type === 'taskNode') {
    defaultLabel = linkCount > 0 ? `Task Link #${linkCount + 1}` : 'Task Scope';
    strokeColor = '#6366f1';
  } else if (targetNode.type === 'noteNode') {
    defaultLabel = linkCount > 0 ? `Annotation #${linkCount + 1}` : 'Annotates';
    strokeColor = '#f59e0b';
  }

  return {
    valid: true,
    defaultLabel,
    strokeColor,
  };
}
