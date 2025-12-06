import  { useState } from 'react';
import { Play, XCircle, CheckCircle, Loader } from 'lucide-react';
import { useAppSelector } from '../../../../app/hooks';
import { useSimulateWorkflowMutation } from '../../api/workflowApi';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { ExecutionLog } from './ExecutionLog';

export const WorkflowSimulator: React.FC = () => {
  const nodes = useAppSelector(state => state.workflow.nodes);
  const edges = useAppSelector(state => state.workflow.edges);
  const [simulateWorkflow, { data, isLoading, isSuccess, isError, error }] = useSimulateWorkflowMutation();
  const validation = useWorkflowValidation();
  const [showPanel, setShowPanel] = useState(false);

  const handleSimulate = async () => {
    if (!validation.isValid) {
      alert('Please fix validation errors before simulating');
      return;
    }

    const workflow = {
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type || 'unknown',
        data: n.data as unknown as Record<string, unknown>,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    await simulateWorkflow(workflow);
    setShowPanel(true);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSimulate}
          disabled={isLoading || nodes.length === 0}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg font-medium
            transition-all duration-200
            ${nodes.length === 0 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Test Workflow
            </>
          )}
        </button>
      </div>

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="absolute top-16 right-4 z-10 max-w-md">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Validation Errors</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {validation.errors.map((err, idx) => (
                    <li key={idx}>• {err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Panel */}
      {showPanel && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-2xl z-20">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Workflow Simulation</h3>
              {isSuccess && data?.success && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {isError && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isSuccess && data && <ExecutionLog result={data} />}
            {isError && (
              <div className="p-4 text-red-600">
                Error: {error?.toString() || 'Simulation failed'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
