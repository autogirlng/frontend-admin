import { VehicleInformation, VehiclePhotos } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VehicleState {
  vehicle: VehicleInformation | null;
  currentStep: number;
}

const initialState: VehicleState = {
  vehicle: null,
  currentStep: 0,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    updateVehicleInformation: (
      state,
      action: PayloadAction<VehicleInformation>
    ) => {
      state.vehicle = action.payload;
    },
    setVehicleOnboardingCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    // New reducer to clear the vehicle state
    clearVehicleState: (state) => {
      // You can either assign initialState directly
      // This works because Redux Toolkit uses Immer internally,
      // allowing direct modification or assignment of new state.
      Object.assign(state, initialState);
      // Or, if you prefer a more explicit return (though not strictly necessary with Immer):
      // return initialState;
    },
  },
});

export const {
  updateVehicleInformation,
  setVehicleOnboardingCurrentStep,
  clearVehicleState, // Export the new action creator
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
