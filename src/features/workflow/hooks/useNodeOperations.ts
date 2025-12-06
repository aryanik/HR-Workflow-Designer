import { useCallback } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { addNode } from '../slices/workflowSlice';
import type { NodeType } from '../types/nodes.types';

export const useNodeOperations = () => {
  const dispatch = useAppDispatch();

  const createNode = useCallback((type: NodeType) => {
    const position = { x: Math.random() * 500, y: Math.random() * 500 };
    
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: getDefaultNodeData(type),
    };

    dispatch(addNode(newNode));
  }, [dispatch]);

  return { createNode };
};

function getDefaultNodeData(type: NodeType) {
  switch (type) {
    case 'start':
      return { label: 'Start', startTitle: 'New Workflow' };
    case 'task':
      return { label: 'Task', title: 'New Task', description: '', assignee: '' };
    case 'approval':
      return { label: 'Approval', title: 'Approval Required', approverRole: '' };
    case 'automated':
      return { label: 'Automated', title: 'Automated Step', actionId: '', actionLabel: '', parameters: {} };
    case 'end':
      return { label: 'End', endMessage: 'Workflow Complete', showSummary: false };
    default:
      return { label: 'Unknown' };
  }
}
