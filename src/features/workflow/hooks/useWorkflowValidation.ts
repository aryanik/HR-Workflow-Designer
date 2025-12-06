import { useMemo } from 'react';
import type { Node, Edge } from 'reactflow';
import { useAppSelector } from '../../../app/hooks';
import type { 
  ValidationResult, 
  ValidationError,
  WorkflowNodeData,
  TaskNodeData,
  ApprovalNodeData 
} from '../types/nodes.types';

// Helper function to safely get node title
const getNodeTitle = (node: Node<WorkflowNodeData>): string => {
  const data = node.data;
  if (!data) return 'Untitled';
  
  if ('title' in data && typeof data.title === 'string') return data.title;
  if ('startTitle' in data && typeof data.startTitle === 'string') return data.startTitle;
  if ('endMessage' in data && typeof data.endMessage === 'string') return data.endMessage;
  if ('label' in data && typeof data.label === 'string') return data.label;
  
  return 'Untitled';
};

export const useWorkflowValidation = (): ValidationResult => {
  const nodes = useAppSelector(state => state.workflow.nodes);
  const edges = useAppSelector(state => state.workflow.edges);

  return useMemo(() => {
    const errors: ValidationError[] = [];

    // Must have at least one node
    if (nodes.length === 0) {
      errors.push({
        message: 'Workflow must have at least one node',
        severity: 'error',
      });
      return { isValid: false, errors };
    }

    // Must have exactly one start node
    const startNodes = nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push({
        message: 'Workflow must have exactly one Start node',
        severity: 'error',
      });
    } else if (startNodes.length > 1) {
      errors.push({
        message: 'Workflow can only have one Start node',
        severity: 'error',
      });
    }

    // Must have at least one end node
    const endNodes = nodes.filter(n => n.type === 'end');
    if (endNodes.length === 0) {
      errors.push({
        message: 'Workflow must have at least one End node',
        severity: 'warning',
      });
    }

    // Check for disconnected nodes (except start)
    const connectedNodeIds = new Set<string>();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    nodes.forEach(node => {
      if (node.type !== 'start' && !connectedNodeIds.has(node.id)) {
        const label = getNodeTitle(node);
        errors.push({
          nodeId: node.id,
          message: `Node "${label}" is not connected`,
          severity: 'warning',
        });
      }
    });

    // Check for cycles (simplified)
    const hasCycle = detectCycle(nodes, edges);
    if (hasCycle) {
      errors.push({
        message: 'Workflow contains a cycle (circular dependency)',
        severity: 'error',
      });
    }

    // Validate node-specific data
    nodes.forEach(node => {
      const data = node.data;
      
      if (node.type === 'task') {
        const taskData = data as TaskNodeData;
        if (!taskData.title) {
          errors.push({
            nodeId: node.id,
            message: 'Task node must have a title',
            severity: 'error',
          });
        }
      }
      
      if (node.type === 'approval') {
        const approvalData = data as ApprovalNodeData;
        if (!approvalData.approverRole) {
          errors.push({
            nodeId: node.id,
            message: 'Approval node must specify an approver role',
            severity: 'error',
          });
        }
      }
    });

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }, [nodes, edges]);
};

function detectCycle(nodes: Node[], edges: Edge[]): boolean {
  const graph = new Map<string, string[]>();
  
  nodes.forEach(node => graph.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = graph.get(edge.source) || [];
    neighbors.push(edge.target);
    graph.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) return true;
    }
  }

  return false;
}
