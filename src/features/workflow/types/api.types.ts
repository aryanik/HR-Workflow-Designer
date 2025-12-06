export interface AutomationAction {
    id: string;
    label: string;
    params: string[];
  }
  
  export interface SimulationStep {
    nodeId: string;
    nodeTitle: string;
    nodeType: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    timestamp: string;
    message: string;
  }
  
  export interface SimulationResult {
    success: boolean;
    executionTime: number;
    steps: SimulationStep[];
    errors?: string[];
  }
  
  export interface WorkflowPayload {
    nodes: Array<{
      id: string;
      type: string;
      data: Record<string, unknown>;
    }>;
    edges: Array<{
      id?: string;
      source: string;
      target: string;
    }>;
  }
  
  