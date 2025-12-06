import type { NodeProps } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/nodes.types';

export const TaskNode: React.FC<NodeProps<TaskNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      icon={CheckSquare}
      color="border-blue-500 hover:border-blue-600"
      label={props.data.title || props.data.label || 'Task'}
    />
  );
};
