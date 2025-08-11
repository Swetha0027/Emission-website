import React from "react";
import { CloudUpload } from "lucide-react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import "handsontable/styles/ht-theme-horizon.css";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";
import useAppStore from "../useAppStore";

registerAllModules();

function VehicleClassification({ activeStep }) {
  const theme = useAppStore((s) => s.theme);
  const classificationState = useAppStore((s) => s.classificationState);
  const setClassificationState = useAppStore((s) => s.setClassificationState);

  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const verticalSteps = [
    "Vehicle Classification Data",
    "Projected Vehicle Penetration Rate Data",
    "Traffic Volume and Speed",
    "Projected Demand",
  ];

  // keep original uploaded rows here; never mutate this
  const [originalData, setOriginalData] = React.useState([]);

  // helper: (re)filter by vehicle type from a source array
  const filterByVehicle = React.useCallback((rows, vehicleType) => {
    if (!rows || rows.length === 0) return [];
    if (!vehicleType) return rows;
    const filtered = rows.filter(
      (row) =>
        row?.[0]?.toString().trim().toLowerCase() ===
        vehicleType.toString().trim().toLowerCase()
    );
    // fallback to full rows if no match (keeps your previous behavior)
    return filtered.length > 0 ? filtered : rows;
  }, []);

  // re-derive table data whenever city or vehicleType changes (or new file loaded)
  React.useEffect(() => {
    const next = filterByVehicle(originalData, classificationState.vehicleType);
    setClassificationState({ classificationData: next });
  }, [
    classificationState.vehicleType,
    classificationState.city, // reapply filter when city changes
    originalData,
    filterByVehicle,
    setClassificationState,
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setClassificationState({ classificationFile: file });

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const isCSV = file.name.toLowerCase().endsWith(".csv");
      const workbook = XLSX.read(data, { type: isCSV ? "string" : "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) || [];

      if (parsed.length > 0) {
        const headers = parsed[0];
        const rows = parsed.slice(1);
        setClassificationState({ classificationHeaders: headers });
        setOriginalData(rows); // store raw rows ONLY here
        // classificationData will be computed by the useEffect above
      } else {
        setClassificationState({
          classificationHeaders: [],
          classificationData: [],
        });
        setOriginalData([]);
      }
    };

    if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  return (
    <div
      className={`flex flex-row items-stretch gap-6 pl-6 pt-4 transition-colors duration-300`}
    >
      {/* Left panel: form + table */}
      <div className="flex flex-col gap-6">
        <form
          className={`flex items-end gap-4 p-4 rounded transition-colors duration-300`}
        >
          <label
            className={`flex items-center font-semibold px-4 py-2 rounded cursor-pointer h-[32px] transition-colors duration-300 ${
              theme === "dark"
                ? "bg-blue-900 text-white"
                : "bg-blue-400 text-white"
            }`}
          >
            <span className="mr-2">Upload</span> Vehicle Classification
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              disabled={classificationState.city === ""}
              className="hidden"
            />
          </label>

          <div className="flex flex-col gap-1">
            <label
              className={`text-xs ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Base Year
            </label>
            <input
              type="text"
              value={classificationState.baseYear}
              onChange={(e) =>
                setClassificationState({ baseYear: e.target.value })
              }
              className={`border rounded px-2 py-1 w-20 h-[32px] transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-[#18181b] text-white border-gray-700 placeholder-gray-400"
                  : "bg-white text-black border-gray-300"
              }`}
              disabled={classificationState.city === ""}
              placeholder="202#"
            />
          </div>

          <select
            value={classificationState.vehicleType}
            onChange={(e) => {
              // just update the selection; effect will recompute table from originalData
              setClassificationState({ vehicleType: e.target.value });
            }}
            disabled={classificationState.city === ""}
            className={`border rounded px-2 py-1 w-32 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#18181b] text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="">Vehicle Type</option>
            <option value="Combination long-haul Truck">
              Combination long-haul Truck
            </option>
            <option value="Combination short-haul Truck">
              Combination short-haul Truck
            </option>
            <option value="Light Commercial Truck">
              Light Commercial Truck
            </option>
            <option value="Motorhome - Recreational Vehicle">
              Motorhome - Recreational Vehicle
            </option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Other Buses">Other Buses</option>
            <option value="Passenger Truck">Passenger Truck</option>
            <option value="Refuse Truck">Refuse Truck</option>
            <option value="School Bus">School Bus</option>
            <option value="Single Unit long-haul Truck">
              Single Unit long-haul Truck
            </option>
            <option value="Single Unit short-haul Truck">
              Single Unit short-haul Truck
            </option>
            <option value="Transit Bus">Transit Bus</option>
          </select>

          <select
            value={classificationState.cityInput}
            onChange={(e) =>
              setClassificationState({
                cityInput: e.target.value,
                city: e.target.value.replace(/\s+/g, ""), // keep cleaned version for image key
              })
            }
            className={`border rounded px-2 py-1 w-25 transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#18181b] text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="">City</option>
            {statesList.slice(1).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </form>

        {classificationState.classificationData?.length > 0 ? (
          <div
            className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark"
            style={{ minHeight: "500px" }}
          >
            <HotTable
              data={classificationState.classificationData}
              colHeaders={classificationState.classificationHeaders}
              rowHeaders
              stretchH="all"
              height="100%"
              width="100%"
              licenseKey="non-commercial-and-evaluation"
            />
          </div>
        ) : (
          <div className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark">
            {/* placeholder */}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="ml-4">
          <VehicleStepper activeStep={activeStep} steps={verticalSteps} />
        </div>
        {classificationState.city && cityImages[classificationState.city] && (
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

export default VehicleClassification;
