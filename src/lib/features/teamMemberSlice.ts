import { HostTable, Member } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MemberState {
  member: Member | null | undefined;
}

const initialState: MemberState = {
  member: null,
};

const teamMemberSlice = createSlice({
  name: "teamMember",
  initialState,
  reducers: {
    updateMember: (state, action: PayloadAction<Member>) => {
      state.member = action.payload;
    },
  },
});

export const { updateMember } = teamMemberSlice.actions;
export default teamMemberSlice.reducer;
