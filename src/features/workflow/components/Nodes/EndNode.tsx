import type { NodeProps } from 'reactflow';
import { Flag } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/nodes.types';

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      icon={Flag}
      color="border-red-500 hover:border-red-600"
      label={props.data.endMessage || props.data.label || 'End'}
    />
  );
};
