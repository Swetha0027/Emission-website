import React, { useMemo, useState, useEffect, useRef } from "react";
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

function getRandomColor(idx) {
  // Generate visually distinct colors
  const colors = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#a55194", "#393b79", "#637939"
  ];
  return colors[idx % colors.length];
}

export default function EnergyConsumptionAndEmissionRates({ activeStep }) {
  // Store slices
  const classificationState = useAppStore((s) => s.classificationState);
  const ConsumptionAndEmissionState = useAppStore((s) => s.ConsumptionAndEmission);
  const setConsumptionAndEmissionState = useAppStore((s) => s.setConsumptionAndEmission);

  // State for real chart data
  const [updateCounter, setUpdateCounter] = useState(0);
  const [currentUnit, setCurrentUnit] = useState("units");

  // State to hold all received vehicle data
  const [vehicleData, setVehicleData] = useState({});

  // Ref for potential direct chart manipulation (future use)
  // const chartRef = useRef(null);

  // State for chart data
  const [co2ChartData, setCo2ChartData] = useState({
    labels: [],
    datasets: [{
      label: "No Data Yet",
      data: [],
      borderColor: "#ccc",
      backgroundColor: "rgba(0,0,0,0)",
      tension: 0.3,
      pointRadius: 2,
    }],
  });
  const [energyChartData, setEnergyChartData] = useState({
    labels: [],
    datasets: [{
      label: "No Data Yet", 
      data: [],
      borderColor: "#ccc",
      backgroundColor: "rgba(0,0,0,0)",
      tension: 0.3,
      pointRadius: 2,
    }],
  });

  // useEffect to update chart data when vehicleData changes
  useEffect(() => {
    const vehicleColorMap = VEHICLE_TYPES.reduce((acc, type, idx) => {
      acc[type] = getRandomColor(idx);
      return acc;
    }, {});

    const energyDatasets = [];
    const co2Datasets = [];
    let unit = "units";

    Object.entries(vehicleData).forEach(([vehicleType, data]) => {
      // Handle the nested data structure from your backend
      let actualData = data;
      
      // Check if data has the nested "0" structure
      if (data && data["0"] && !data.results) {
        actualData = data["0"];
      }
      
      if (!actualData || !actualData.results) {
        return;
      }

      const results = actualData.results;
      const dataPoints = results.map(r => ({ x: r.speed, y: r.prediction }));

      const newDataset = {
        label: vehicleType,
        data: dataPoints,
        borderColor: vehicleColorMap[vehicleType] || "#000",
        backgroundColor: "rgba(0,0,0,0)",
        tension: 0.3,
        pointRadius: 2,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        }
      };

      // Use prediction_type from backend instead of emissionType
      const predictionType = actualData.prediction_type || data.emissionType || "CO2 Emissions";

      if (predictionType === "Energy Rate") {
        energyDatasets.push(newDataset);
      } else {
        // All CO2 Emissions and other types go to CO2 chart
        co2Datasets.push(newDataset);
      }

      // Get unit from the nested structure
      if (actualData.unit) unit = actualData.unit;
    });

    // Update current unit
    setCurrentUnit(unit);

    // Handle empty data case
    if (energyDatasets.length === 0) {
      setEnergyChartData({
        labels: [],
        datasets: [{
          label: "No Data Available",
          data: [],
          borderColor: "#ccc",
          backgroundColor: "rgba(0,0,0,0)",
          tension: 0.3,
          pointRadius: 2,
        }],
      });
    } else {
      setEnergyChartData({
        labels: [], // Not needed for scatter plots
        datasets: energyDatasets,
      });
    }

    if (co2Datasets.length === 0) {
      setCo2ChartData({
        labels: [],
        datasets: [{
          label: "No Data Available",
          data: [],
          borderColor: "#ccc", 
          backgroundColor: "rgba(0,0,0,0)",
          tension: 0.3,
          pointRadius: 2,
        }],
      });
    } else {
      setCo2ChartData({
        labels: [], // Not needed for scatter plots
        datasets: co2Datasets,
      });
    }

    // Increment update counter to force chart re-render
    setUpdateCounter(prev => prev + 1);
  }, [vehicleData]);

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

  // Prepare chart data
  // const energyChartData = useMemo(() => ({
  //   labels: [],
  //   datasets: [],
  // }), []);

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
              onClick={async() => {
                const transactionId = classificationState.transactionId || localStorage.getItem("transaction_id");
                if (!transactionId || transactionId === "none") {
                  toast.error("Transaction ID is missing or invalid. Please upload vehicle classification data first.");
                  return;
                }
                try {
                  // Clear previous data
                  setVehicleData({});
                  setUpdateCounter(0);

                  for (const vehicleType of VEHICLE_TYPES) {
                  const payload = {
                    fuelType,
                    emissionType,
                    vehicleAge,
                    city: classificationState.city || classificationState.cityInput,
                    vehicleType,
                    transaction_id: transactionId
                    };

                    // Show toast that this vehicle is being processed
                    toast.info(`Sending request for ${vehicleType}...`);

                    // Send request to backend
                    const res = await fetch("http://localhost:5000/predict_emissions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    if (!res.ok) throw new Error(`Prediction failed for ${vehicleType}`);

                    const data = await res.json();

                    // Store the data for this vehicle type
                    setVehicleData(prev => ({
                      ...prev,
                      [vehicleType]: {
                        ...data,
                        emissionType: emissionType, // Keep for backward compatibility
                        selectedEmissionType: emissionType, // What user selected
                        timestamp: Date.now()
                      }
                    }));

                    // Success toast
                    toast.success(`Prediction received for ${vehicleType}!`);
                  }

                  toast.success("✅ All vehicle types processed successfully!");
                } catch (err) {
                  toast.error("Error contacting backend: " + err.message);
                }
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
                key={`energy-${updateCounter}`}
                data={energyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `Energy Rate (${currentUnit})`,
                    },
                  },
                  parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y'
                  },
                  scales: {
                    x: {
                      type: 'linear',
                      title: { display: true, text: "Speed (mph)" },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      title: { display: true, text: currentUnit },
                      // Allow negative values by removing beginAtZero
                    },
                  },
                }}
              />
            </div>
            <div style={{ width: 420, height: 320 }}>
              <Line
                key={`co2-${updateCounter}`}
                data={co2ChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `${emissionType || 'CO2'} (${currentUnit})`,
                    },
                  },
                  parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y'
                  },
                  scales: {
                    x: {
                      type: 'linear',
                      title: { display: true, text: "Speed (mph)" },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      title: { display: true, text: currentUnit },
                      // Allow negative values by removing beginAtZero
                    },
                  },
                }}
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
                      border: '2px solid #9a1212ff',
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