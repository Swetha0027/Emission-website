  // Send data to backend on Next
  const handleNext = async () => {
    // Send all relevant data to backend
    const payload = {
      city: classificationState.city,
      base_year: classificationState.baseYear,
      vehicle_type: classificationState.vehicleType,
      traffic_table_data: trafficState.allTrafficData,
      traffic_table_headers: trafficState.trafficHeaders,
    };
    try {
  const res = await fetch('http://localhost:5000/upload/traffic_volume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      console.log('Backend response:', data);
      toast.success("Data uploaded successfully!");
      // Optionally show a message or move to next page
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    // Optionally move to next page here
  };
import React from "react";
import { CloudUpload } from "lucide-react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import useAppStore from "../useAppStore";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import "handsontable/dist/handsontable.full.min.css";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import "handsontable/styles/ht-theme-horizon.css";
import VehicleStepper from "./VerticalStepper";
import AtlantaTF from "../assets/TrafficVolumeGA.png";
import LosAngelesTF from "../assets/TrafficVolumeCA.png";
import SeattleTF from "../assets/TrafficVolumeWA.png";
import NewYorkTF from "../assets/TrafficVolumeNY.png";
import TractParametersTable from "./TractParametersTable";
import { toast } from "react-toastify";
registerAllModules();


function VehicleTrafficVolume({ activeStep }) {
  const classificationState = useAppStore((s) => s.classificationState);
  const trafficState = useAppStore((s) => s.trafficVolumeState);
  const setTrafficState = useAppStore((s) => s.setTrafficVolumeState);
  const [calculatedSpeeds, setCalculatedSpeeds] = React.useState([]);

  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const trafficVolumeImages = {
    Atlanta: AtlantaTF,
    "Los Angeles": LosAngelesTF,
    Seattle: SeattleTF,
    NewYork: NewYorkTF,
  };
  const verticalSteps = [
    "Vehicle Classification Data",
    "Projected Vehicle Penetration Rate Data",
    "Traffic Volume and Speed",
    "Projected Demand",
  ];

  const loadSheet = (file, keyHeaders, keyData) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const wb = file.name.endsWith(".csv")
        ? XLSX.read(data, { type: "string" })
        : XLSX.read(data, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (parsed.length)
        setTrafficState({
          [keyHeaders]: parsed[0],
          [keyData]: parsed.slice(1),
        });
      else setTrafficState({ [keyHeaders]: [], [keyData]: [] });
    };
    file.name.endsWith(".csv")
      ? reader.readAsText(file)
      : reader.readAsBinaryString(file);
    setTrafficState({
      [file === trafficState.trafficVolumeFile
        ? "trafficVolumeFile"
        : "trafficMFTParametersFile"]: file,
    });
  };

  // Calculate speed when user clicks the button
  /*const handleCalculateSpeed = () => {
    const data = trafficState.trafficMFTParametersData || [];
    const headers = trafficState.trafficMFTParametersHeaders || [];
    // Try to find columns for distance and time
    const distanceIdx = headers.findIndex(h => /distance/i.test(h));
    const timeIdx = headers.findIndex(h => /time/i.test(h));
    if (distanceIdx === -1 || timeIdx === -1) {
      toast.error("CSV must have 'distance' and 'time' columns.");
      return;
    }
    const speeds = data.map(row => {
      const distance = parseFloat(row[distanceIdx]);
      const time = parseFloat(row[timeIdx]);
      const speed = time > 0 ? (distance / time) : 0;
      return { distance, time, speed: speed.toFixed(2) };
    });
    setCalculatedSpeeds(speeds);
  };*/

  const city =
    (classificationState.city ?? classificationState.cityInput) || "";
  const key = city.trim();
  const srcImg = trafficVolumeImages[key];

  const hasData =
    (trafficState.trafficMFTParametersData && trafficState.trafficMFTParametersData.length > 0);

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 rounded">
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> Traffic Volume
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                loadSheet(
                  e.target.files[0],
                  "trafficMFTParametersHeaders",
                  "trafficMFTParametersData"
                )
              }
              className="hidden"
            />
          </label>
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> MFT Parameters
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                loadSheet(
                  e.target.files[0],
                  "trafficMFTParametersHeaders",
                  "trafficMFTParametersData"
                )
              }
              className="hidden"
            />
          </label>
          <select
            value={classificationState.cityInput}
            disabled
            className="border rounded px-2 py-1 w-25"
          >
            <option value="">City</option>
            {statesList.slice(1).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </form>
        {hasData && (
          <>
            {/*
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-40"
              onClick={handleCalculateSpeed}
            >
              Calculate Speed
            </button>
            */}
            {srcImg ? (
              <img
                src={srcImg}
                alt={city}
                className="w-full max-h-[350px] ma object-contain rounded"
              />
            ) : null}
            {/* Show calculated speeds if available */}
            {calculatedSpeeds.length > 0 && (
              <table className="mt-4 border w-full">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Distance (mi)</th>
                    <th className="border px-2 py-1">Time (hr)</th>
                    <th className="border px-2 py-1">Speed (mph)</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedSpeeds.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{row.distance}</td>
                      <td className="border px-2 py-1">{row.time}</td>
                      <td className="border px-2 py-1">{row.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <VehicleStepper activeStep={activeStep} steps={verticalSteps} />
        {classificationState.city && (
          <img
            src={cityImages[classificationState.city]}
            alt={classificationState.city}
            className="w-full h-[500px] object-contain rounded"
          />
        )}
      </div>
    </div>
  );
}

export default VehicleTrafficVolume;
