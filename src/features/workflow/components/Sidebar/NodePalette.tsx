import { Play, CheckSquare, UserCheck, Zap, Flag } from 'lucide-react';
import type { NodeType } from '../../types/nodes.types';

interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    icon: Play,
    color: 'bg-green-50 border-green-300 hover:bg-green-100',
    description: 'Workflow entry point'
  },
  {
    type: 'task',
    label: 'Task',
    icon: CheckSquare,
    color: 'bg-blue-50 border-blue-300 hover:bg-blue-100',
    description: 'Human task step'
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: UserCheck,
    color: 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100',
    description: 'Approval requirement'
  },
  {
    type: 'automated',
    label: 'Automated',
    icon: Zap,
    color: 'bg-purple-50 border-purple-300 hover:bg-purple-100',
    description: 'System action'
  },
  {
    type: 'end',
    label: 'End',
    icon: Flag,
    color: 'bg-red-50 border-red-300 hover:bg-red-100',
    description: 'Workflow completion'
  },
];

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Node Palette</h2>
      
      <div className="space-y-2">
        {nodeTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type)}
              onClick={() => onAddNode(template.type)}
              className={`
                p-3 border-2 rounded-lg cursor-move transition-colors
                ${template.color}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{template.label}</span>
              </div>
              <p className="text-xs text-gray-600">{template.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Drag nodes onto the canvas or click to add at center
        </p>
      </div>
    </div>
  );
};
