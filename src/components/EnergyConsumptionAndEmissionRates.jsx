import React, { useMemo } from "react";
import useAppStore from "../useAppStore";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";
import { Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VEHICLE_TYPES = [
  "Combination long-haul Truck",
  "Combination short-haul Truck",
  "Light Commercial Truck",
  "Motorhome - Recreational Vehicle",
  "Motorcycle",
  "Other Buses",
  "Passenger Car",
  "Passenger Truck",
  "Refuse Truck",
  "School Bus",
  "Single Unit long-haul Truck",
  "Single Unit short-haul Truck",
  "Transit Bus",
];

const FUEL_TYPES = [
  "Compressed Natural Gas - CNG",
  "Diesel Fuel",
  "Electricity",
  "Ethanol - E-85",
  "Gasoline",
];

const EMISSION_TYPES = [
  { label: "CO2 Emissions", unit: "g/mi" },
  { label: "Energy Rate", unit: "MWh/mile" },
  { label: "NOx", unit: "g/mi" },
  { label: "PM2.5 Brake Wear", unit: "g/mi" },
  { label: "PM2.5 Tire Wear", unit: "g/mi" },
];

const SPEEDS = [5, 10, 20, 30, 40, 50, 60, 70];

function getRandomColor(idx) {
  // Generate visually distinct colors
  const colors = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#a55194", "#393b79", "#637939"
  ];
  return colors[idx % colors.length];
}

// Dummy data generator for each emission type
function generateDummyData(emissionType) {
  if (emissionType === "Energy Rate") {
    // Lower values for energy, similar to your sample
    return VEHICLE_TYPES.map((vehicleType, idx) => ({
      label: vehicleType,
      data: SPEEDS.map(
        (speed) =>
          0.025 / (speed / 10 + 1) + Math.random() * 0.002 // curve, small noise
      ),
      borderColor: getRandomColor(idx),
      backgroundColor: "rgba(0,0,0,0)",
      tension: 0.3,
      pointRadius: 1.5,
    }));
  }
  // Default: CO2 Emissions (higher values)
  return VEHICLE_TYPES.map((vehicleType, idx) => ({
    label: vehicleType,
    data: SPEEDS.map(
      (speed) =>
        6000 / (speed / 10 + 1) + Math.random() * 200 // curve, small noise
    ),
    borderColor: getRandomColor(idx),
    backgroundColor: "rgba(0,0,0,0)",
    tension: 0.3,
    pointRadius: 1.5,
  }));
}

export default function EnergyConsumptionAndEmissionRates({ activeStep }) {
  // Store slices
  const classificationState = useAppStore((s) => s.classificationState);
  const ConsumptionAndEmissionState = useAppStore((s) => s.ConsumptionAndEmission);
  const setConsumptionAndEmissionState = useAppStore((s) => s.setConsumptionAndEmission);

  // UI lists & lookups
  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };

  const cityKeyMap = useMemo(
    () => ({
      Atlanta: "Atlanta",
      "Los Angeles": "LosAngeles",
      Seattle: "Seattle",
      NewYork: "NewYork",
    }),
    []
  );

  const steps = [
    "Vehicle Energy Consumption and Emission Rates",
    " Grid Emission Rates",
  ];

  const ageOptions = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

  // Controlled selections
  const fuelType = ConsumptionAndEmissionState.FuelType || "";
  const emissionType = ConsumptionAndEmissionState.EmissionType || "";
  const vehicleAge = ConsumptionAndEmissionState.VehicleAge || "";

  // Find unit for selected emission type
  const emissionMeta = EMISSION_TYPES.find((e) => e.label === emissionType) || EMISSION_TYPES[0];

  // Prepare dummy chart data for both emission types
  const energyChartData = useMemo(() => ({
    labels: SPEEDS,
    datasets: generateDummyData("Energy Rate"),
  }), [fuelType, vehicleAge]);

  const co2ChartData = useMemo(() => ({
    labels: SPEEDS,
    datasets: generateDummyData("CO2 Emissions"),
  }), [fuelType, vehicleAge]);

  const selectedCityKey =
    cityKeyMap[classificationState.city] || cityKeyMap[classificationState.cityInput];

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      {/* Left: controls */}
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 rounded" onSubmit={(e) => e.preventDefault()}>
          {/* Fuel Type */}
          <select
            value={fuelType}
            onChange={(e) => {
              setConsumptionAndEmissionState({ FuelType: e.target.value });
            }}
            className="border rounded px-2 py-1 w-48"
          >
            <option value="">Select Fuel Type</option>
            {FUEL_TYPES.map((ft) => (
              <option key={ft} value={ft}>{ft}</option>
            ))}
          </select>

          {/* Emission Type */}
          <select
            value={emissionType}
            onChange={(e) => {
              setConsumptionAndEmissionState({ EmissionType: e.target.value });
            }}
            className="border rounded px-2 py-1 w-48"
          >
            <option value="">Select Emission Type</option>
            {EMISSION_TYPES.map((et) => (
              <option key={et.label} value={et.label}>{et.label}</option>
            ))}
          </select>

          {/* Vehicle Age */}
          <select
            value={vehicleAge}
            className="border rounded px-2 py-1 w-32"
            onChange={(e) => {
              setConsumptionAndEmissionState({ VehicleAge: e.target.value });
            }}
          >
            <option value="" disabled>
              Vehicle Age
            </option>
            {ageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* City (disabled; chosen previously) */}
          <select
            value={classificationState.city || classificationState.cityInput}
            disabled
            className="border rounded px-2 py-1 w-40"
          >
            <option value="">City</option>
            {statesList.slice(1).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Button 
              variant="contained" 
              color="primary" 
              disabled={!fuelType || !emissionType || !vehicleAge}
              onClick={() => {
                VEHICLE_TYPES.forEach((vehicleType, index) => {
                  setTimeout(() => {
                    toast.success(`Prediction data prepared for ${vehicleType}!`);
                  }, index * 500); // Stagger toasts by 500ms each
                });
                const allSelections = VEHICLE_TYPES.map(vehicleType => ({
                  fuelType,
                  emissionType,
                  vehicleAge,
                  city: classificationState.city || classificationState.cityInput,
                  vehicleType
                }));
                console.log('All vehicle type selections:', allSelections);
                // Here you can add logic to send to backend or plot
              }}
            >
              Predict & Plot
            </Button>
          </div>
        </form>

        {/* Two side-by-side charts as in your PDF */}
        <div className="mt-8 flex flex-row gap-8 justify-start">
          {/* Charts */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
            <div style={{ width: 420, height: 320 }}>
              <Line
                data={energyChartData}
                options={{
                  responsive: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Energy Rate (MWh/mile)`,
                    },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Speed (mph)" },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      title: { display: true, text: "MWh/mile" },
                      min: 0,
                      max: 0.025,
                    },
                  },
                }}
                width={400}
                height={300}
              />
            </div>
            <div style={{ width: 420, height: 320 }}>
              <Line
                data={co2ChartData}
                options={{
                  responsive: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `CO₂ Rate (gr/mile)`,
                    },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Speed (mph)" },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      title: { display: true, text: "g/mi" },
                      min: 0,
                      max: 7000,
                    },
                  },
                }}
                width={400}
                height={300}
              />
            </div>
            {/* Shared Legend on the side */}
            <div style={{ minWidth: 240, marginLeft: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 20 }}>Vehicle Types</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {VEHICLE_TYPES.map((type, idx) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      display: 'inline-block',
                      width: 32,
                      height: 16,
                      backgroundColor: getRandomColor(idx),
                      border: '2px solid #888',
                      marginRight: 14,
                      borderRadius: 4,
                    }} />
                    <span style={{ fontSize: 18, fontWeight: 500 }}>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: stepper + map image */}
      <div className="flex flex-col gap-6">
        <div className="ml-4">
          <VehicleStepper activeStep={activeStep} steps={steps} />
        </div>
        <div>
          {selectedCityKey && cityImages[selectedCityKey] && (
            <img
              src={cityImages[selectedCityKey]}
              alt={classificationState.city || classificationState.cityInput}
              className="w-full h-[500px] object-contain rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}