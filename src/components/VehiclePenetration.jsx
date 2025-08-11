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

function VehiclePenetration({ activeStep }) {
  const theme = useAppStore((s) => s.theme);
  const classificationState = useAppStore((s) => s.classificationState);
  const penetrationState = useAppStore((s) => s.penetrationState);
  const setPenetrationState = useAppStore((s) => s.setPenetrationState);
  const setClassificationState = useAppStore((s) => s.setClassificationState);

  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const verticalSteps = [
    "Vehicle Classification Data",
    "Projected Vehicle Penetration Rate Data",
    "Traffic Volume and Speed",
    "Projected Demand",
  ];

  // guess "Vehicle Type" column index from headers; fallback to col 0
  const vehicleTypeColIndex = React.useMemo(() => {
    const headers = penetrationState.penetrationHeaders || [];
    const norm = (s) =>
      String(s || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
    const idx = headers.findIndex(
      (h) =>
        norm(h) === "vehicletype" ||
        norm(h) === "vehicle_type" ||
        /vehicle.*type/i.test(String(h))
    );
    return idx > -1 ? idx : 0;
  }, [penetrationState.penetrationHeaders]);

  // filter helper using the detected column index
  const filterByVehicle = React.useCallback((rows, vehicleType, vtIndex) => {
    if (!rows || rows.length === 0) return [];
    if (!vehicleType) return rows;
    const vt = vehicleType.toString().trim().toLowerCase();
    const filtered = rows.filter(
      (row) =>
        String(row?.[vtIndex] ?? "")
          .trim()
          .toLowerCase() === vt
    );
    // fallback to full rows to avoid an empty table if the value isn't present
    return filtered.length > 0 ? filtered : rows;
  }, []);

  // derive filtered table from original data whenever vehicle type changes (or file changes)
  React.useEffect(() => {
    const next = filterByVehicle(
      penetrationState.allPenetrationData,
      classificationState.vehicleType,
      vehicleTypeColIndex
    );
    setPenetrationState({ penetrationData: next });
  }, [
    classificationState.vehicleType,
    penetrationState.allPenetrationData,
    vehicleTypeColIndex,
    filterByVehicle,
    setPenetrationState,
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPenetrationState({ penetrationFile: file });

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
        setPenetrationState({
          penetrationHeaders: headers,
          allPenetrationData: rows, // store original, unfiltered rows
          // penetrationData will be derived in useEffect
        });
      } else {
        setPenetrationState({
          penetrationHeaders: [],
          allPenetrationData: [],
          penetrationData: [],
        });
      }
    };

    if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form className="flex items-center gap-4 p-4 rounded">
          <label
            className={`flex items-center font-semibold px-4 py-2 rounded cursor-pointer h-[32px] ${
              theme === "dark"
                ? "bg-blue-900 text-white"
                : "bg-blue-400 text-white"
            }`}
          >
            <span className="mr-2">Upload</span> Projected Penetration
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <select
            value={penetrationState.projectedYear}
            onChange={(e) =>
              setPenetrationState({ projectedYear: e.target.value })
            }
            className={`border rounded px-2 py-1 w-20 h-[32px] ${
              theme === "dark" ? "bg-[#18181b] text-white border-gray-700" : ""
            }`}
          >
            {classificationState.baseYear &&
              Array.from(
                { length: 6 },
                (_, i) => parseInt(classificationState.baseYear, 10) + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <select
            value={classificationState.vehicleType}
            onChange={(e) =>
              setClassificationState({ vehicleType: e.target.value })
            }
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
            disabled
            className={`border rounded px-2 py-1 w-25 ${
              theme === "dark" ? "bg-[#18181b] text-white border-gray-700" : ""
            }`}
          >
            <option>{classificationState.city || "City"}</option>
          </select>
        </form>

        {penetrationState.penetrationData?.length > 0 ? (
          <div className="flex-1 min-w-[60%] overflow-auto">
            <HotTable
              data={penetrationState.penetrationData}
              colHeaders={penetrationState.penetrationHeaders}
              rowHeaders
              stretchH="all"
              height="600px"
              width="100%"
              licenseKey="non-commercial-and-evaluation"
              themeName={
                theme === "dark" ? "ht-theme-main-dark" : "ht-theme-main"
              }
            />
          </div>
        ) : (
          <div className="flex-1 min-w-[60%] overflow-auto">
            {/* placeholder table */}
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

export default VehiclePenetration;
