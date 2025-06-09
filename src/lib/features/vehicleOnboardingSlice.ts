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
  },
});

export const { updateVehicleInformation, setVehicleOnboardingCurrentStep } =
  vehicleSlice.actions;
export default vehicleSlice.reducer;
