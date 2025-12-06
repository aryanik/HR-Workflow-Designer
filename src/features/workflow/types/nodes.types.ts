import type { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// Base node data structure
export interface BaseNodeData {
  label: string;
  metadata?: Record<string, string>;
}

// Start Node
export interface StartNodeData extends BaseNodeData {
  startTitle: string;
}

// Task Node
export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

// Approval Node
export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold?: number;
}

// Automated Step Node
export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  actionId: string;
  actionLabel: string;
  parameters: Record<string, string>;
}

// End Node
export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  showSummary: boolean;
}

// Union type for all node data
export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedStepNodeData 
  | EndNodeData;

// React Flow Node with our custom data
export type WorkflowNode = Node<WorkflowNodeData>;

// Workflow structure
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: Edge[];
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}
