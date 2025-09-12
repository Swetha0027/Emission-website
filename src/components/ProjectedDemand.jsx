  // Helper to convert table data to CSV string
  function arrayToCSV(headers, rows) {
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csvRows = [headers.map(escape).join(",")];
    for (const row of rows) {
      csvRows.push(row.map(escape).join(","));
    }
    return csvRows.join("\n");
  }

  // Send data to backend on Next
  const handleNext = async () => {
    // Collect values
    const city = classificationState.city || '';
  // Prefer penetrationState.projectedYear, fallback to classificationState.baseYear
  let year = penetrationState.projectedYear || classificationState.baseYear || '';
    const file = projectedDemandState.projectedTrafficVolumeFile || null;
    const headers = projectedDemandState.projectedTrafficVolumeHeaders || [];
    const data = projectedDemandState.projectedTrafficVolumeData || [];
    // Convert table to CSV string
    const csvString = headers.length && data.length ? arrayToCSV(headers, data) : '';
    // Store all in a variable
    const values = {
      city,
      year,
      file,
      csv: csvString,
    };
    // Print in console
    console.log('Projected Demand upload values:', {
      ...values,
      file: file ? file.name : null,
    });

    // Prepare FormData for backend
    const formData = new FormData();
    formData.append('city', city);
    formData.append('year', year);
    if (file) formData.append('file', file);
    if (csvString) formData.append('csv', new Blob([csvString], { type: 'text/csv' }), 'table.csv');

    try {
      const res = await fetch('http://127.0.0.1:5000/upload/projected_traffic', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const respData = await res.json();
      console.log('Backend response:', respData);
      toast.success("Data uploaded successfully!");
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
function ProjectedDemand({ activeStep }) {
  const theme = useAppStore((s) => s.theme);
  const classificationState = useAppStore((s) => s.classificationState);
  const penetrationState = useAppStore((s) => s.penetrationState);
  const projectedDemandState = useAppStore((s) => s.projectedDemandState);
  const setProjectedDemandState = useAppStore((s) => s.setProjectedDemandState);
  const trafficState = useAppStore((s) => s.trafficVolumeState);

  const trafficVolumeImages = {
    Atlanta: AtlantaTF,
    "Los Angeles": LosAngelesTF,
    Seattle: SeattleTF,
    NewYork: NewYorkTF,
  };
  // Helper to convert table data to CSV string
  function arrayToCSV(headers, rows) {
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csvRows = [headers.map(escape).join(",")];
    for (const row of rows) {
      csvRows.push(row.map(escape).join(","));
    }
    return csvRows.join("\n");
  }

  const loadSheet = (file, keyHeaders, keyData) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const wb = file.name.endsWith(".csv")
        ? XLSX.read(data, { type: "string" })
        : XLSX.read(data, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (parsed.length) {
        setProjectedDemandState({
          [keyHeaders]: parsed[0],
          [keyData]: parsed.slice(1),
        });
        // Print variable in console after upload
        const city = classificationState.city || '';
        // Prefer penetrationState.projectedYear, fallback to classificationState.baseYear
        let year = penetrationState.projectedYear || classificationState.baseYear || '';
        const csvString = arrayToCSV(parsed[0], parsed.slice(1));
        const values = {
          city,
          year,
          file,
          csv: csvString,
        };
        console.log('Projected Demand upload values (after upload):', {
          ...values,
          file: file ? file.name : null,
        });
      } else {
        setProjectedDemandState({ [keyHeaders]: [], [keyData]: [] });
      }
    };
    file.name.endsWith(".csv")
      ? reader.readAsText(file)
      : reader.readAsBinaryString(file);
    setProjectedDemandState({
      [file === projectedDemandState.projectedTrafficVolumeFile
        ? "projectedTrafficVolumeFile"
        : "projectedTrafficVolumeFile"]: file,
    });
  };

  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };

  const city =
    (classificationState.city ?? classificationState.cityInput) || "";
  const key = city.trim();
  const srcImg = trafficVolumeImages[key];
  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 rounded">
          <label className="flex items-center bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
            <span className="mr-2">Upload</span> Projected Traffic Volume Data
            <CloudUpload className="ml-2 w-5 h-5" />
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                loadSheet(
                  e.target.files[0],
                  "projectedTrafficVolumeHeaders",
                  "projectedTrafficVolumeData"
                )
              }
              className="hidden"
            />
          </label>

          <select
            value={penetrationState.projectedYear}
            disabled
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
        {srcImg ? (
          <img
            src={srcImg}
            alt={city}
            className="w-full max-h-[350px] ma object-contain rounded"
          />
        ) : null}
        {projectedDemandState.projectedTrafficVolumeData.length ? (
          <HotTable
            className="min-w-[60%] overflow-auto"
            style={{ minHeight: 500 }}
            data={projectedDemandState.projectedTrafficVolumeData}
            colHeaders={projectedDemandState.projectedTrafficVolumeHeaders}
            rowHeaders
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            themeName={
              theme === "dark" ? "ht-theme-main-dark" : "ht-theme-main"
            }
            pagination={false}
            renderPagination={false}
            // Remove navigation arrows by disabling pagination UI
          />
        ) : (
          <div className="min-w-[60%] flex items-center justify-center h-[500px] text-gray-500">
            No data
          </div>
        )}
        <TractParametersTable trafficState={trafficState} />
      </div>
      <div className="flex flex-col gap-6">
        <VehicleStepper activeStep={activeStep} />
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

export default ProjectedDemand;
