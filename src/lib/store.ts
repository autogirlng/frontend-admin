import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import hostReducer from "./features/hostSlice";
import forgotPasswordReducer from "./features/forgotPasswordSlice";
import accountSetupReducer from "./features/accountSetupSlice";
import vehicleOnboardingReducer from "./features/vehicleOnboardingSlice";
import TeamMemberReducer from "./features/teamMemberSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      host: hostReducer,
      user: userReducer,
      forgotPassword: forgotPasswordReducer,
      accountSetup: accountSetupReducer,
      vehicleOnboarding: vehicleOnboardingReducer,
      teamMember: TeamMemberReducer,
    },
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
