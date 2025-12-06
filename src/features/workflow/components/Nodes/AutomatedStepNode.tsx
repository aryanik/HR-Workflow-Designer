import type { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { AutomatedStepNodeData } from '../../types/nodes.types';

export const AutomatedStepNode: React.FC<NodeProps<AutomatedStepNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      icon={Zap}
      color="border-purple-500 hover:border-purple-600"
      label={props.data.title || props.data.label || 'Automated Step'}
    />
  );
};
