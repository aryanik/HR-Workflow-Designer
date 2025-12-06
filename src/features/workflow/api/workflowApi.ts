import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AutomationAction, SimulationResult, WorkflowPayload } from '../types/api.types';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAutomations: builder.query<AutomationAction[], void>({
      query: () => '/automations',
    }),
    simulateWorkflow: builder.mutation<SimulationResult, WorkflowPayload>({
      query: (workflow) => ({
        url: '/simulate',
        method: 'POST',
        body: workflow,
      }),
    }),
  }),
});

export const { 
  useGetAutomationsQuery, 
  useSimulateWorkflowMutation 
} = workflowApi;
