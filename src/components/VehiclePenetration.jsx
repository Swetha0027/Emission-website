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
  const classificationState = useAppStore((s) => s.classificationState);
  const penetrationState = useAppStore((s) => s.penetrationState);
  const setPenetrationState = useAppStore((s) => s.setPenetrationState);

  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const verticalSteps = [
    "Vehicle Classification Data",
    "Projected Vehicle Penetration Rate Data",
    "Traffic Volume and Speed",
    "Projected Demand",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPenetrationState({ penetrationFile: file });
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      let workbook;
      if (file.name.endsWith(".csv"))
        workbook = XLSX.read(data, { type: "string" });
      else workbook = XLSX.read(data, { type: "binary" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (parsedData.length > 0) {
        setPenetrationState({
          penetrationHeaders: parsedData[0],
          penetrationData: parsedData.slice(1),
        });
      } else {
        setPenetrationState({ penetrationHeaders: [], penetrationData: [] });
      }
    };

    if (file.name.endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 shadow rounded">
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
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
            className="border rounded px-2 py-1 w-20 h-[32px]"
          >
            {classificationState.baseYear &&
              Array.from(
                { length: 6 },
                (_, i) => parseInt(classificationState.baseYear) + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
          <select disabled className="border rounded px-2 py-1 w-32">
            <option>{classificationState.vehicleType}</option>
          </select>
          <select disabled className="border rounded px-2 py-1 w-25">
            <option>{classificationState.city}</option>
          </select>
        </form>
        {penetrationState.penetrationData.length > 0 ? (
          <div className="flex-1 min-w-[60%] overflow-auto ht-theme-main-dark">
            <HotTable
              data={penetrationState.penetrationData}
              colHeaders={penetrationState.penetrationHeaders}
              rowHeaders
              stretchH="all"
              height="auto"
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
            className="w-full h-[500px] object-contain rounded shadow-lg"
          />
        )}
      </div>
    </div>
  );
}

export default VehiclePenetration;
