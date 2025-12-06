import { Provider } from 'react-redux';
import { store } from './app/store';
import { NodePalette } from './features/workflow/components/Sidebar/NodePalette';
import { NodeConfigPanel } from './features/workflow/components/Sidebar/NodeConfigPanel';
import { WorkflowCanvasWrapper } from './features/workflow/components/Canvas/WorkflowCanvas';
import { WorkflowSimulator } from './features/workflow/components/TestPanel/WorkflowSimulator';
import { useNodeOperations } from './features/workflow/hooks/useNodeOperations';
import { WorkflowActions } from './features/workflow/components/WorkflowActions/WorkflowActions'; // ADD THIS
import { Settings } from 'lucide-react';

const WorkflowDesigner: React.FC = () => {
  const { createNode } = useNodeOperations();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Node Palette Sidebar */}
      <NodePalette onAddNode={createNode} />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">HR Workflow Designer</h1>
            <p className="text-sm text-gray-500">Design and test internal workflows</p>
          </div>
          
          {/* ADD THESE BUTTONS */}
          <div className="flex items-center gap-3">
            <WorkflowActions />
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute top-16 bottom-0 left-0 right-0">
          <WorkflowCanvasWrapper />
          <WorkflowSimulator />
        </div>
      </div>

      {/* Configuration Panel */}
      <NodeConfigPanel />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <WorkflowDesigner />
    </Provider>
  );
}

export default App;
