import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OtpState {
  forgotPasswordOtp: string;
}

const initialState: OtpState = {
  forgotPasswordOtp: "",
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setForgotPasswordOtp: (state, action: PayloadAction<string>) => {
      state.forgotPasswordOtp = action.payload;
    },
  },
});

export const { setForgotPasswordOtp } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
