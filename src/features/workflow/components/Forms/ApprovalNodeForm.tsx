import { useForm } from 'react-hook-form';
import type { ApprovalNodeData } from '../../types/nodes.types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateNodeData } from '../../slices/workflowSlice';
import { Input } from '../../../../shared/Input';
import React from 'react';

interface ApprovalNodeFormProps {
  nodeId: string;
  initialData: ApprovalNodeData;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeId, initialData }) => {
  const dispatch = useAppDispatch();
  const { register, watch } = useForm<ApprovalNodeData>({
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateNodeData({ nodeId, data: value as ApprovalNodeData }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, nodeId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Approval Node Configuration</h3>
      
      <Input
        label="Title"
        {...register('title')}
        placeholder="e.g., Manager Approval"
        required
      />

      <Input
        label="Approver Role"
        {...register('approverRole')}
        placeholder="e.g., Manager, HRBP, Director"
        required
      />

      <Input
        type="number"
        label="Auto-Approve Threshold (optional)"
        {...register('autoApproveThreshold', { valueAsNumber: true })}
        placeholder="e.g., 1000"
      />
      <p className="text-xs text-gray-500 -mt-3 mb-4">
        If set, requests below this threshold will be auto-approved
      </p>
    </div>
  );
};
