import React from 'react';
import type { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/nodes.types';

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      icon={Play}
      color="border-green-500 hover:border-green-600"
      label={props.data.startTitle || props.data.label || 'Start'}
    />
  );
};
