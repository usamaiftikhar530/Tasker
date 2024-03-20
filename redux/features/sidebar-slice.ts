import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: SidebarState;
};

type SidebarState = {
  isSideBarOpen: boolean;
};

const initialState = {
  value: {
    isSideBarOpen: false,
  } as SidebarState,
} as InitialState;

export const sidebar = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    SidebarOpenClose: (state) => {
      state.value.isSideBarOpen = !state.value.isSideBarOpen;
    },
  },
});

export const { SidebarOpenClose } = sidebar.actions;
export default sidebar.reducer;
