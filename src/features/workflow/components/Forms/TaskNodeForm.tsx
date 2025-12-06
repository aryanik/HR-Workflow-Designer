import { useForm } from 'react-hook-form';
import type { TaskNodeData } from '../../types/nodes.types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateNodeData } from '../../slices/workflowSlice';
import React from 'react';
import { Input } from '../../../../shared/Input';
import { Textarea } from '../../../../shared/Textarea';
import { KeyValueEditor } from '../../../../shared/KeyValueEditor';

interface TaskNodeFormProps {
  nodeId: string;
  initialData: TaskNodeData;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeId, initialData }) => {
  const dispatch = useAppDispatch();
  const { register, watch, setValue } = useForm<TaskNodeData>({
    defaultValues: initialData,
  });

  const formData = watch();

  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateNodeData({ nodeId, data: value as TaskNodeData }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, nodeId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Task Node Configuration</h3>
      
      <Input
        label="Title"
        {...register('title')}
        placeholder="e.g., Collect Employee Documents"
        required
      />

      <Textarea
        label="Description"
        {...register('description')}
        placeholder="Detailed task description..."
      />

      <Input
        label="Assignee"
        {...register('assignee')}
        placeholder="e.g., HR Manager"
      />

      <Input
        type="date"
        label="Due Date"
        {...register('dueDate')}
      />

      <KeyValueEditor
        label="Custom Fields"
        value={formData.customFields || {}}
        onChange={(value) => setValue('customFields', value)}
      />
    </div>
  );
};
