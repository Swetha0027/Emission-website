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

    // ConsumptionAndEmission slice
  ConsumptionAndEmission: {
    FuelType: "",
    EmissionType: "",
    VehicleAge: "",
  },
  setConsumptionAndEmission: (partial) =>
    set((state) => ({
      ConsumptionAndEmission: { ...state.ConsumptionAndEmission, ...partial },
    })),

      // GridEmmision slice
  GridEmission: {
    EmissionType: "",
  },
  setGridEmission: (partial) =>
    set((state) => ({
      GridEmission: { ...state.GridEmission, ...partial },
    })),

    projectedDemandState: {
      projectedTrafficVolumeFile: null,
      projectedTrafficVolumeData: [],
      projectedTrafficVolumeHeaders: []
    },

    setProjectedDemandState: (partial) =>
      set((state)=>({
        projectedDemandState: { ...state.projectedDemandState, ...partial}
      })),

  // Theme slice
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

export default useAppStore;
