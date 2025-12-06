import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { AutomatedStepNodeData } from '../../types/nodes.types';
import { useAppDispatch } from '../../../../app/hooks';
import { updateNodeData } from '../../slices/workflowSlice';
import { useGetAutomationsQuery } from '../../api/workflowApi';
import { Input } from '../../../../shared/Input';
import { Select } from '../../../../shared/Select';

interface AutomatedStepNodeFormProps {
  nodeId: string;
  initialData: AutomatedStepNodeData;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({ 
  nodeId, 
  initialData 
}) => {
  const dispatch = useAppDispatch();
  const { data: automations = [], isLoading } = useGetAutomationsQuery();
  const { register, watch, setValue } = useForm<AutomatedStepNodeData>({
    defaultValues: initialData,
  });

  const formData = watch();
  const [selectedAction, setSelectedAction] = useState(
    automations.find(a => a.id === initialData.actionId)
  );

  useEffect(() => {
    const action = automations.find(a => a.id === formData.actionId);
    setSelectedAction(action);
    if (action) {
      setValue('actionLabel', action.label);
    }
  }, [formData.actionId, automations, setValue]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateNodeData({ nodeId, data: value as AutomatedStepNodeData }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, nodeId]);

  const handleParamChange = (paramName: string, value: string) => {
    const updatedParams = { ...formData.parameters, [paramName]: value };
    setValue('parameters', updatedParams);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Automated Step Configuration</h3>
      
      <Input
        label="Title"
        {...register('title')}
        placeholder="e.g., Send Welcome Email"
        required
      />

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading actions...</div>
      ) : (
        <Select
          label="Action Type"
          {...register('actionId')}
          options={automations.map(a => ({ value: a.id, label: a.label }))}
          required
        />
      )}

      {selectedAction && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Action Parameters</h4>
          {selectedAction.params.map(param => (
            <Input
              key={param}
              label={param.charAt(0).toUpperCase() + param.slice(1)}
              value={formData.parameters?.[param] || ''}
              onChange={(e) => handleParamChange(param, e.target.value)}
              placeholder={`Enter ${param}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
