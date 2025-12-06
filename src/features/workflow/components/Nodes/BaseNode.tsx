import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { LucideIcon } from 'lucide-react';

interface BaseNodeProps extends NodeProps {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const BaseNode: React.FC<BaseNodeProps> = ({ 
  icon: Icon, 
  color, 
  label,
  selected,
  data 
}) => {
  return (
    <div 
      className={`
        px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[180px]
        transition-all duration-200
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${color}
      `}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800 truncate">
            {label || 'Untitled'}
          </div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-gray-400"
      />
    </div>
  );
};
