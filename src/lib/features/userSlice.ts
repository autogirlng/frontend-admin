import { User } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  userToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  userToken: "",
  isAuthenticated: false,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
      localStorage.setItem("user_token", action.payload);
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.isLoading = action.payload.isLoading;
      state.userToken = action.payload.userToken;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userToken = "";
      localStorage.removeItem("user_token");
      localStorage.clear();
    },
  },
});

export const { setUser, clearUser, setLoading, setToken, updateUserData } =
  userSlice.actions;
export default userSlice.reducer;
