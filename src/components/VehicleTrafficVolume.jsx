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

  // Submit data to backend
  const handleNext = async () => {
    // Collect values
    const city =
      (classificationState.city ?? classificationState.cityInput) || "";
    const trafficVolumeFile = trafficState.trafficVolumeFile || null;
    const mftParametersFile = trafficState.trafficMFTParametersFile || null;
    const values = {
      city,
      trafficVolumeFile: trafficVolumeFile ? trafficVolumeFile.name : null,
      mftParametersFile: mftParametersFile ? mftParametersFile.name : null,
    };
    console.log("Traffic Volume and Speed upload values (on Next):", values);

    // Check if both files are selected
    if (!trafficVolumeFile || !mftParametersFile) {
      toast.error("Please select both Traffic Volume and MFT Parameters files");
      return;
    }

    // Prepare FormData for backend
    const formData = new FormData();
    formData.append("city_name", city); // Use city_name as expected by backend

    // Add transaction_id from localStorage or default
    const storedTransactionId =
      localStorage.getItem("transaction_id") || "emission-analysis-2025";
    formData.append("transaction_id", storedTransactionId);

    formData.append("file1", trafficVolumeFile);
    formData.append("file2", mftParametersFile);

    try {
      console.log("Uploading to /upload/traffic_volume...");
      const res = await fetch("http://localhost:5003/upload/traffic_volume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      console.log("Backend response:", data);
      toast.success("Traffic data uploaded successfully!");

      // Store transaction_id for later use
      if (data.transaction_id) {
        localStorage.setItem("transaction_id", data.transaction_id);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + err.message);
    }
  };

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

  const loadSheet = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const wb = file.name.endsWith(".csv")
        ? XLSX.read(data, { type: "string" })
        : XLSX.read(data, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (type === "trafficVolume") {
        if (parsed.length)
          setTrafficState({
            trafficVolumeHeaders: parsed[0],
            trafficVolumeData: parsed.slice(1),
            trafficVolumeFile: file,
          });
        else
          setTrafficState({
            trafficVolumeHeaders: [],
            trafficVolumeData: [],
            trafficVolumeFile: file,
          });
      } else if (type === "mftParameters") {
        if (parsed.length)
          setTrafficState({
            trafficMFTParametersHeaders: parsed[0],
            trafficMFTParametersData: parsed.slice(1),
            trafficMFTParametersFile: file,
          });
        else
          setTrafficState({
            trafficMFTParametersHeaders: [],
            trafficMFTParametersData: [],
            trafficMFTParametersFile: file,
          });
      }
      // Print variable in console after upload
      const city =
        (classificationState.city ?? classificationState.cityInput) || "";
      const trafficVolumeFile =
        type === "trafficVolume" ? file : trafficState.trafficVolumeFile;
      const mftParametersFile =
        type === "mftParameters" ? file : trafficState.trafficMFTParametersFile;
      const values = {
        city,
        trafficVolumeFile: trafficVolumeFile ? trafficVolumeFile.name : null,
        mftParametersFile: mftParametersFile ? mftParametersFile.name : null,
      };
      console.log(
        "Traffic Volume and Speed upload values (after upload):",
        values
      );
    };
    file.name.endsWith(".csv")
      ? reader.readAsText(file)
      : reader.readAsBinaryString(file);
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

  const hasTrafficVolumeData =
    trafficState.trafficVolumeData && trafficState.trafficVolumeData.length > 0;
  const hasMFTParametersData =
    trafficState.trafficMFTParametersData &&
    trafficState.trafficMFTParametersData.length > 0;

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
              onChange={(e) => loadSheet(e.target.files[0], "trafficVolume")}
              className="hidden"
            />
          </label>
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> MFD Parameters
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => loadSheet(e.target.files[0], "mftParameters")}
              className="hidden"
            />
          </label>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">City</label>
            <select
              value={classificationState.cityInput}
              disabled
              className={`bg-gray-300 text-gray-600 rounded px-2 py-1 w-25 `}
            >
              <option value="">City</option>
              {statesList.slice(1).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Submit button for uploading traffic data */}
        {(hasTrafficVolumeData || hasMFTParametersData) && (
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
            {/* Table for Traffic Volume */}
            {/* {hasTrafficVolumeData && (
              <div className="overflow-auto max-h-96 mt-4">
                <div className="font-semibold text-lg mb-2">Traffic Volume Table</div>
                <table className="border w-full">
                  <thead>
                    <tr>
                      {trafficState.trafficVolumeHeaders && trafficState.trafficVolumeHeaders.map((header, idx) => (
                        <th key={idx} className="border px-2 py-1 bg-gray-100">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trafficState.trafficVolumeData.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border px-2 py-1">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )} */}
            {/* Table for MFT Parameters */}
            <TractParametersTable trafficState={trafficState} />
            {/* {hasMFTParametersData && (
              <div className="overflow-auto max-h-96 mt-4">
                <div className="font-semibold text-lg mb-2">MFD Parameters Table</div>
                <table className="border w-full">
                  <thead>
                    <tr>
                      {trafficState.trafficMFTParametersHeaders && trafficState.trafficMFTParametersHeaders.map((header, idx) => (
                        <th key={idx} className="border px-2 py-1 bg-gray-100">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trafficState.trafficMFTParametersData.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border px-2 py-1">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )} */}
            {/* Show calculated speeds if available */}
            {/* {calculatedSpeeds.length > 0 && (
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
            )} */}
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
