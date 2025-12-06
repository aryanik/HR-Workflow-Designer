import { configureStore } from '@reduxjs/toolkit';
import { workflowApi } from '../features/workflow/api/workflowApi';
import workflowReducer from '../features/workflow/slices/workflowSlice';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['workflow/setNodes', 'workflow/setEdges'],
        ignoredPaths: ['workflow.nodes', 'workflow.edges'],
      },
    }).concat(workflowApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
