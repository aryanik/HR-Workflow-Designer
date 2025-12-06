import React from 'react';
import { useForm } from 'react-hook-form';
import type { StartNodeData } from '../../types/nodes.types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateNodeData } from '../../slices/workflowSlice';
import { KeyValueEditor } from '../../../../shared/KeyValueEditor';
import { Input } from '../../../../shared/Input';

interface StartNodeFormProps {
  nodeId: string;
  initialData: StartNodeData;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeId, initialData }) => {
  const dispatch = useAppDispatch();
  const { register, watch, setValue } = useForm<StartNodeData>({
    defaultValues: initialData,
  });

  // Use subscription pattern - only updates when form actually changes
  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateNodeData({ nodeId, data: value as StartNodeData }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, nodeId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Start Node Configuration</h3>
      
      <Input
        label="Start Title"
        {...register('startTitle')}
        placeholder="e.g., New Employee Onboarding"
      />

      <KeyValueEditor
        label="Metadata"
        value={watch('metadata') || {}}
        onChange={(value) => setValue('metadata', value)}
      />
    </div>
  );
};
