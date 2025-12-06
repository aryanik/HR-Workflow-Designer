import { useForm } from 'react-hook-form';
import type { EndNodeData } from '../../types/nodes.types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateNodeData } from '../../slices/workflowSlice';
import React from 'react';
import { Input } from '../../../../shared/Input';
import { Checkbox } from '../../../../shared/Checkbox';

interface EndNodeFormProps {
  nodeId: string;
  initialData: EndNodeData;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeId, initialData }) => {
  const dispatch = useAppDispatch();
  const { register, watch } = useForm<EndNodeData>({
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateNodeData({ nodeId, data: value as EndNodeData }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, nodeId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">End Node Configuration</h3>
      
      <Input
        label="End Message"
        {...register('endMessage')}
        placeholder="e.g., Onboarding Complete"
        required
      />

      <Checkbox
        label="Show Summary"
        {...register('showSummary')}
      />
    </div>
  );
};
