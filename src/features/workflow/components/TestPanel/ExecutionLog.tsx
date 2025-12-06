import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { SimulationResult } from '../../types/api.types';
import { format } from 'date-fns';

interface ExecutionLogProps {
  result: SimulationResult;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({ result }) => {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4 p-3 bg-green-50 rounded-lg">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <div className="font-semibold text-green-800">Simulation Complete</div>
          <div className="text-sm text-green-700">
            Executed {result.steps.length} steps in {result.executionTime.toFixed(2)}s
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {result.steps.map((step, index) => (
          <div
            key={step.nodeId}
            className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">{step.nodeTitle}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                  {step.nodeType}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-1">{step.message}</div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {format(new Date(step.timestamp), 'HH:mm:ss')}
              </div>
            </div>

            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {step.status === 'failed' && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {result.errors && result.errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {result.errors.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
