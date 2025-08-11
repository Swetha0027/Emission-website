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
  const [AllData, setAllData] = React.useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClassificationState({ classificationFile: file });
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      let workbook;
      if (file.name.endsWith(".csv")) {
        workbook = XLSX.read(data, { type: "string" });
      } else {
        workbook = XLSX.read(data, { type: "binary" });
      }
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (parsedData.length > 0) {
        setClassificationState({
          classificationHeaders: parsedData[0],
          classificationData: parsedData.slice(1),
        });
        setAllData(parsedData.slice(1));
        console.log("Classification Data:", parsedData.slice(1));
      } else {
        setClassificationState({
          classificationHeaders: [],
          classificationData: [],
        });
        setAllData([]);
      }
    };

    if (file.name.endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  const handleVehicleChange = (selectedVehicleType) => {
    console.log("Selected Vehicle Type:", selectedVehicleType);

    if (selectedVehicleType === "" || !selectedVehicleType) {
      setClassificationState((prevState) => ({
        ...prevState,
        classificationData: [],
      }));
    } else {
      let filteredData = AllData.filter(
        (row) =>
          row[0].toString().trim().toLowerCase() ===
          selectedVehicleType.toString().trim().toLowerCase()
      );

      console.log("Filtered Data:", filteredData);

      if (filteredData.length === 0) {
        setClassificationState({
          classificationData: AllData,
        });
      } else {
        setClassificationState({
          classificationData: filteredData,
        });
      }

      console.log(
        "Updated Classification Data:",
        classificationState.classificationData
      );
    }
  };

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      {/* Left panel: form + table */}
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 rounded">
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
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
            <label className="text-xs text-gray-600">Base Year</label>
            <input
              type="text"
              value={classificationState.baseYear}
              onChange={(e) =>
                setClassificationState({ baseYear: e.target.value })
              }
              className="border rounded px-2 py-1 w-20 h-[32px]"
              disabled={classificationState.city === ""}
              placeholder="202#"
            />
          </div>

          <select
            value={classificationState.vehicleType}
            onChange={(e) => {
              setClassificationState({ vehicleType: e.target.value });
              handleVehicleChange(classificationState.vehicleType);
            }}
            disabled={classificationState.city === ""}
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

          <select
            value={classificationState.cityInput}
            onChange={(e) =>
              setClassificationState({
                cityInput: e.target.value,
                city: e.target.value.replace(/\s+/g, ""), // Keep cleaned version updated
              })
            }
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

        {classificationState.classificationData.length > 0 ? (
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

export default VehicleClassification;
