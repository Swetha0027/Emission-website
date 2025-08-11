import { create } from "zustand";

// Global app store
const useAppStore = create((set) => ({
  // Classification slice
  classificationState: {
    baseYear: "",
    vehicleType: "",
    city: "",
    cityInput: "",
    classificationFile: null,
    classificationHeaders: [],
    classificationData: [],        // filtered
    allClassificationData: [],     // original
  },
  setClassificationState: (partial) =>
    set((state) => ({
      classificationState: { ...state.classificationState, ...partial },
    })),

  // Penetration slice
  penetrationState: {
    projectedYear: "",
    penetrationFile: null,
    penetrationHeaders: [],
    penetrationData: [],           // filtered
    allPenetrationData: [],        // original
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

  // Consumption & Emission slice
  ConsumptionAndEmission: {
    FuelType: "",
    EmissionType: "",
    VehicleAge: "",
  },
  setConsumptionAndEmission: (partial) =>
    set((state) => ({
      ConsumptionAndEmission: { ...state.ConsumptionAndEmission, ...partial },
    })),

  // Grid Emission slice
  GridEmission: {
    EmissionType: "",
  },
  setGridEmission: (partial) =>
    set((state) => ({
      GridEmission: { ...state.GridEmission, ...partial },
    })),

  // Projected Demand slice
  projectedDemandState: {
    projectedTrafficVolumeFile: null,
    projectedTrafficVolumeData: [],
    projectedTrafficVolumeHeaders: [],
  },
  setProjectedDemandState: (partial) =>
    set((state) => ({
      projectedDemandState: { ...state.projectedDemandState, ...partial },
    })),

  // Theme slice
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

export default useAppStore;
