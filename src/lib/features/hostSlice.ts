import { HostTable } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HostState {
  host: HostTable | null | undefined;
}

const initialState: HostState = {
  host: null,
};

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    updateHostInfo: (state, action: PayloadAction<HostTable>) => {
      state.host = action.payload;
    },
  },
});

export const { updateHostInfo } = hostSlice.actions;
export default hostSlice.reducer;
