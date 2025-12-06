import { X, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNode, deleteNode } from '../../slices/workflowSlice';
import { StartNodeForm } from '../Forms/StartNodeForm';
import { TaskNodeForm } from '../Forms/TaskNodeForm';
import { ApprovalNodeForm } from '../Forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from '../Forms/AutomatedStepNodeForm';
import { EndNodeForm } from '../Forms/EndNodeForm';
import type { 
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData
} from '../../types/nodes.types';

export const NodeConfigPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector(state => state.workflow.selectedNodeId);
  const selectedNode = useAppSelector(state => 
    state.workflow.nodes.find(n => n.id === selectedNodeId)
  );

  const handleClose = () => {
    dispatch(selectNode(null));
  };

  const handleDelete = () => {
    if (selectedNodeId && confirm('Delete this node? This will also remove all connected edges.')) {
      dispatch(deleteNode(selectedNodeId));
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">No node selected</p>
          <p className="text-xs mt-2">Click on a node to configure it</p>
        </div>
      </div>
    );
  }

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeForm nodeId={selectedNode.id} initialData={selectedNode.data as StartNodeData} />;
      case 'task':
        return <TaskNodeForm nodeId={selectedNode.id} initialData={selectedNode.data as TaskNodeData} />;
      case 'approval':
        return <ApprovalNodeForm nodeId={selectedNode.id} initialData={selectedNode.data as ApprovalNodeData} />;
      case 'automated':
        return <AutomatedStepNodeForm nodeId={selectedNode.id} initialData={selectedNode.data as AutomatedStepNodeData} />;
      case 'end':
        return <EndNodeForm nodeId={selectedNode.id} initialData={selectedNode.data as EndNodeData} />;  {/* ← THIS LINE */}
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Node Configuration</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Node"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto">
        {renderForm()}
      </div>
    </div>
  );
};
