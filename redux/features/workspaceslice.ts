import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaces: [],
  },
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
  },
});

export const { setWorkspaces } = workspaceSlice.actions;

export default workspaceSlice.reducer;
