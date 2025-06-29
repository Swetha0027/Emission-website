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

function VehicleTrafficVolume({
  classificationState,
  trafficVolumeState,
  setTrafficVolumeState,
  activeStep,
}) {
  const statesList = ["", "Georgia", "California", "Seattle", "NewYork"];

  const cityImages = {
    Georgia,
    California,
    Seattle,
    NewYork,
  };

  const handleTrafficFileChange = (e) => {
    const file = e.target.files[0];
    setTrafficVolumeState({ ...trafficVolumeState, trafficVolumeFile: file });

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
        setTrafficVolumeState({
          ...trafficVolumeState,
          trafficVolumeData: parsedData.slice(1),
        });
      } else {
        setTrafficVolumeState({
          ...trafficVolumeState,
          trafficVolumeData: [],
        });
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file); // CSV is plain text
    } else {
      reader.readAsBinaryString(file); // Excel is binary
    }
  };

  const handleMFTParametersChange = (e) => {
    const file = e.target.files[0];
    setTrafficVolumeState({
      ...trafficVolumeState,
      trafficMFTParametersFile: file,
    });

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
        setTrafficVolumeState({
          ...trafficVolumeState,
          trafficMFTParametersHeaders: parsedData[0],
          trafficMFTParametersData: parsedData.slice(1),
        });
      } else {
        setTrafficVolumeState({
          ...trafficVolumeState,
          trafficMFTParametersHeaders: [],
          trafficMFTParametersData: [],
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
          {/* Custom Upload for Traffic Volume */}
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> Traffic Volume Data
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleTrafficFileChange}
              className="hidden"
            />
          </label>

          {/* Custom Upload for MFT Parameters */}
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> MFT Parameters
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleMFTParametersChange}
              className="hidden"
            />
          </label>

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
        {trafficVolumeState.trafficMFTParametersData.length > 0 ? (
          <div className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark">
            <HotTable
              data={trafficVolumeState.trafficMFTParametersData}
              colHeaders={trafficVolumeState.trafficMFTParametersHeaders}
              rowHeaders={true}
              stretchH="all"
              height={"auto"}
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

export default VehicleTrafficVolume;
