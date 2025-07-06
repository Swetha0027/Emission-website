import { create } from "zustand";

// Store for classification, penetration, and traffic volume states
const useAppStore = create((set) => ({
  // Classification slice
  classificationState: {
    baseYear: "",
    vehicleType: "",
    city: "",
    classificationFile: null,
    classificationData: [],
    classificationHeaders: [],
  },
  setClassificationState: (partial) =>
    set((state) => ({
      classificationState: { ...state.classificationState, ...partial },
    })),

  // Penetration slice
  penetrationState: {
    projectedYear: "",
    penetrationFile: null,
    penetrationData: [],
    penetrationHeaders: [],
  },
  setPenetrationState: (partial) =>
    set((state) => ({
      penetrationState: { ...state.penetrationState, ...partial },
    })),

  // Traffic volume slice
  trafficVolumeState: {
    trafficVolumeFile: null,
    trafficVolumeData: [],
    trafficMFTParametersFile: null,
    trafficMFTParametersData: [],
    trafficMFTParametersHeaders: [],
  },
  setTrafficVolumeState: (partial) =>
    set((state) => ({
      trafficVolumeState: { ...state.trafficVolumeState, ...partial },
    })),
}));

export default useAppStore;
