import { useCallback } from 'react';
import type { Node } from 'reactflow';
import { useAppDispatch } from '../../../app/hooks';
import { addNode } from '../slices/workflowSlice';
import type { 
  NodeType,
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData
} from '../types/nodes.types';

export const useNodeOperations = () => {
  const dispatch = useAppDispatch();

  const createNode = useCallback((type: NodeType) => {
    const position = { x: Math.random() * 500, y: Math.random() * 500 };
    
    const newNode: Node<WorkflowNodeData> = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: getDefaultNodeData(type),
    };

    dispatch(addNode(newNode));
  }, [dispatch]);

  return { createNode };
};

function getDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { label: 'Start', startTitle: 'New Workflow' } as StartNodeData;
    case 'task':
      return { label: 'Task', title: 'New Task', description: '', assignee: '' } as TaskNodeData;
    case 'approval':
      return { label: 'Approval', title: 'Approval Required', approverRole: '' } as ApprovalNodeData;
    case 'automated':
      return { label: 'Automated', title: 'Automated Step', actionId: '', actionLabel: '', parameters: {} } as AutomatedStepNodeData;
    case 'end':
      return { label: 'End', endMessage: 'Workflow Complete', showSummary: false } as EndNodeData;
    default:
      return { label: 'Unknown' } as WorkflowNodeData;
  }
}
