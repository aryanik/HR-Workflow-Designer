import { http, HttpResponse, delay } from 'msw';
import type { AutomationAction, SimulationResult, WorkflowPayload } from '../features/workflow/types/api.types';

const automationActions: AutomationAction[] = [
  { 
    id: 'send_email', 
    label: 'Send Email', 
    params: ['to', 'subject', 'body'] 
  },
  { 
    id: 'generate_doc', 
    label: 'Generate Document', 
    params: ['template', 'recipient', 'format'] 
  },
  { 
    id: 'notify_slack', 
    label: 'Notify Slack Channel', 
    params: ['channel', 'message', 'priority'] 
  },
  { 
    id: 'create_ticket', 
    label: 'Create Support Ticket', 
    params: ['title', 'description', 'assignee'] 
  },
  { 
    id: 'update_database', 
    label: 'Update Database Record', 
    params: ['table', 'recordId', 'fields'] 
  },
];

function simulateWorkflowExecution(workflow: WorkflowPayload): SimulationResult {
  const { nodes, edges } = workflow;
  
  // Validate workflow
  if (!nodes || nodes.length === 0) {
    return {
      success: false,
      executionTime: 0,
      steps: [],
      errors: ['Workflow has no nodes']
    };
  }

  // Find start node
  const startNode = nodes.find(n => n.type === 'start');
  if (!startNode) {
    return {
      success: false,
      executionTime: 0,
      steps: [],
      errors: ['No start node found in workflow']
    };
  }

  // Build edge map
  const edgeMap = new Map<string, string[]>();
  edges.forEach(e => {
    if (!edgeMap.has(e.source)) {
      edgeMap.set(e.source, []);
    }
    edgeMap.get(e.source)!.push(e.target);
  });

  // Traverse and build steps
  const steps = [];
  const visited = new Set<string>();
  let currentNodeId = startNode.id;
  let stepCount = 0;

  while (currentNodeId && stepCount < 50) {
    const node = nodes.find(n => n.id === currentNodeId);
    if (!node || visited.has(currentNodeId)) break;

    visited.add(currentNodeId);
    stepCount++;

    const timestamp = new Date(Date.now() + stepCount * 1000).toISOString();
    
    steps.push({
      nodeId: node.id,
      nodeTitle: getNodeTitle(node),
      nodeType: node.type,
      status: 'completed' as const,
      timestamp,
      message: generateStepMessage(node)
    });

    // Find next node
    const nextNodes = edgeMap.get(currentNodeId) || [];
    currentNodeId = nextNodes[0] || '';

    if (node.type === 'end') break;
  }

  return {
    success: true,
    executionTime: stepCount * 1.2,
    steps
  };
}

function getNodeTitle(node: { data?: Record<string, unknown> }): string {
  const data = node.data || {};
  return String(
    data.title || 
    data.label || 
    data.startTitle || 
    data.endMessage || 
    'Untitled'
  );
}

function generateStepMessage(node: { type: string; data?: Record<string, unknown> }): string {
  const data = node.data || {};
  
  switch (node.type) {
    case 'start':
      return `Workflow initiated: ${data.startTitle || 'New Workflow'}`;
    case 'task':
      return `Task assigned to ${data.assignee || 'unassigned'}: ${data.title}`;
    case 'approval':
      return `Approval request sent to ${data.approverRole || 'manager'}`;
    case 'automated':
      return `Automated action executed: ${data.actionLabel || 'Unknown action'}`;
    case 'end':
      return `Workflow completed: ${data.endMessage || 'Finished successfully'}`;
    default:
      return 'Step executed';
  }
}

export const handlers = [
  // GET /api/automations
  http.get('/api/automations', async () => {
    await delay(300); // Simulate network delay
    return HttpResponse.json(automationActions);
  }),

  // POST /api/simulate
  http.post('/api/simulate', async ({ request }) => {
    await delay(800); // Simulate processing time
    const workflow = await request.json() as WorkflowPayload;
    const result = simulateWorkflowExecution(workflow);
    return HttpResponse.json(result);
  }),
];
