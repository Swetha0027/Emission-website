import React from "react";
import { CloudUpload } from "lucide-react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import "handsontable/styles/ht-theme-horizon.css";
import Georgia from "../assets/Georgia.svg";
import California from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";
// register Handsontable's modules
registerAllModules();

function VehiclePenetration({
  classificationState,
  PenetrationState,
  setPenetrationState,
  activeStep,
}) {
  const statesList = ["", "Georgia", "California", "Seattle", "NewYork"];

  const cityImages = {
    Georgia,
    California,
    Seattle,
    NewYork,
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPenetrationState({ ...PenetrationState, PenetrationFile: file });

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      console.log("Parsed data:", data);
      let workbook;

      if (file.name.endsWith(".csv")) {
        // For CSV files
        workbook = XLSX.read(data, { type: "string" });
      } else {
        // For Excel files
        workbook = XLSX.read(data, { type: "binary" });
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("Parsed data:", parsedData);
      if (parsedData.length > 0) {
        setPenetrationState({
          ...PenetrationState,
          penetrationHeaders: parsedData[0],
          penetrationData: parsedData.slice(1),
        });
      } else {
        setPenetrationState({
          ...PenetrationState,
          penetrationHeaders: [],
          penetrationData: [],
        });
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file); // CSV is plain text
    } else {
      reader.readAsBinaryString(file); // Excel is binary
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-4 p-4 shadow rounded"
        >
          {/* Custom Upload Button */}
          <label className="flex items-center bg-blue-300 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> Projected Vehicle Penetration
            Rate Data
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Base Year Input */}
          <div className="flex flex-col gap-1">
            <select
              value={PenetrationState.projectedYear}
              placeholder="Projected Year"
              onChange={(e) =>
                setPenetrationState((prevState) => ({
                  ...prevState,
                  projectedYear: e.target.value,
                }))
              }
              className="border rounded px-2 py-1 w-20 h-[32px]"
            >
              {classificationState.baseYear &&
                Array.from(
                  { length: 6 },
                  (_, index) => parseInt(classificationState.baseYear) + index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>

          {/* Vehicle Type Dropdown */}
          <select
            value={classificationState.vehicleType}
            disabled
            className="border rounded px-2 py-1 w-32"
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

          {/* City Dropdown */}
          <select
            value={classificationState.city}
            disabled
            className="border rounded px-2 py-1 w-25"
          >
            <option value="">City</option>
            {statesList.slice(1).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </form>
        {PenetrationState.penetrationData.length > 0 ? (
          <div
            className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark"
            style={{ minHeight: "500px" }}
          >
            <HotTable
              data={PenetrationState.penetrationData}
              colHeaders={PenetrationState.penetrationHeaders}
              rowHeaders={true}
              stretchH="all"
              height={"100%"}
              width="100%"
              licenseKey="non-commercial-and-evaluation"
            />
          </div>
        ) : (
          <div className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark">
            <div className="opacity-50 pointer-events-none">
              <HotTable
                data={Array(50).fill(["No data", "No data", "No data"])}
                colHeaders={["Column 1", "Column 2", "Column 3"]}
                rowHeaders={true}
                height={500}
                stretchH="all"
                width="100%"
                readOnly={true}
                licenseKey="non-commercial-and-evaluation"
              />
            </div>
            <div className="text-center text-gray-500 mt-2 mb-2">
              No classification data available
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="ml-4">
          <VehicleStepper activeStep={activeStep} />
        </div>
        {classificationState.city && cityImages[classificationState.city] && (
          <div className="flex-1 flex items-center justify-center">
            <img
              src={cityImages[classificationState.city]}
              alt={`${classificationState.city} view`}
              className="w-full h-[500px] object-contain rounded shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default VehiclePenetration;
