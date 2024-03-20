import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "@/redux/features/sidebar-slice";
import workspaceReducer from "@/redux/features/workspaceslice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    sidebarReducer,
    workspace: workspaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
