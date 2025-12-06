import type { NodeProps } from 'reactflow';
import { UserCheck } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/nodes.types';

export const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      icon={UserCheck}
      color="border-yellow-500 hover:border-yellow-600"
      label={props.data.title || props.data.label || 'Approval'}
    />
  );
};
