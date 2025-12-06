import React from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { importWorkflow, clearWorkflow } from '../../slices/workflowSlice';

export const WorkflowActions: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector(state => state.workflow.nodes);
  const edges = useAppSelector(state => state.workflow.edges);

  const handleExport = () => {
    const workflow = {
      name: "HR Workflow",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      nodes: nodes,
      edges: edges,
    };

    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            dispatch(importWorkflow({
              nodes: workflow.nodes || [],
              edges: workflow.edges || [],
            }));
          } catch {
            alert('Invalid workflow file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (confirm('Clear entire workflow? This cannot be undone.')) {
      dispatch(clearWorkflow());
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        disabled={nodes.length === 0}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        title="Export workflow as JSON"
      >
        <Download size={16} />
        Export
      </button>
      
      <button
        onClick={handleImport}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        title="Import workflow from JSON"
      >
        <Upload size={16} />
        Import
      </button>
      
      <button
        onClick={handleClear}
        disabled={nodes.length === 0}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        title="Clear workflow"
      >
        <Trash2 size={16} />
        Clear
      </button>
    </div>
  );
};
