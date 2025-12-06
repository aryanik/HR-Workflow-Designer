import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";
import type { ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNode,
  selectNode,
} from "../../slices/workflowSlice";
import type { NodeType } from "../../types/nodes.types";

import {
  StartNode,
  TaskNode,
  ApprovalNode,
  AutomatedStepNode,
  EndNode,
} from "../Nodes";

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

export const WorkflowCanvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const edges = useAppSelector((state) => state.workflow.edges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      dispatch(addNode(newNode));
    },
    [reactFlowInstance, dispatch]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      dispatch(selectNode(node.id));
    },
    [dispatch]
  );

  const handlePaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => dispatch(onNodesChange(changes))}
        onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
        onConnect={(connection) => dispatch(onConnect(connection))}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

function getDefaultNodeData(type: NodeType) {
  switch (type) {
    case "start":
      return { label: "Start", startTitle: "New Workflow" };
    case "task":
      return {
        label: "Task",
        title: "New Task",
        description: "",
        assignee: "",
      };
    case "approval":
      return {
        label: "Approval",
        title: "Approval Required",
        approverRole: "",
      };
    case "automated":
      return {
        label: "Automated",
        title: "Automated Step",
        actionId: "",
        actionLabel: "",
        parameters: {},
      };
    case "end":
      return {
        label: "End",
        endMessage: "Workflow Complete",
        showSummary: false,
      };
    default:
      return { label: "Unknown" };
  }
}

export const WorkflowCanvasWrapper: React.FC = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);
