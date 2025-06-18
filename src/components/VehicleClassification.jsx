import React, {useState} from 'react'
import { CloudUpload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import 'handsontable/styles/ht-theme-horizon.css';
import Georgia from '../assets/Georgia.svg';
import California from '../assets/California.svg';
import Seattle from '../assets/Seattle.svg';
import NewYork from '../assets/NewYork.svg';
import VehicleStepper from './VerticalStepper';
// register Handsontable's modules
registerAllModules();


function VehicleClassification() {
  const [file, setFile] = useState(null);
  const [baseYear, setBaseYear] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [city, setCity] = useState("");
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const statesList = ['', 'Georgia', 'California', 'Seattle', 'NewYork'];

  const cityImages = {
    Georgia,
    California,
    Seattle,
    NewYork,
    };


  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFile(file);

  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = evt.target.result;
    console.log("Parsed data:", data);
    let workbook;

    if (file.name.endsWith('.csv')) {
      // For CSV files
      workbook = XLSX.read(data, { type: 'string' });
    } else {
      // For Excel files
      workbook = XLSX.read(data, { type: 'binary' });
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log("Parsed data:", parsedData);
    if (parsedData.length > 0) {
        setHeaders(parsedData[0]); // First row is headers
        setData(parsedData.slice(1)); // Rest of the data
      } else {
        setHeaders([]);
        setData([]);
      }
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file); // CSV is plain text
  } else {
    reader.readAsBinaryString(file); // Excel is binary
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("baseYear", baseYear);
    formData.append("vehicleType", vehicleType);
    formData.append("city", city);

    // POST formData to your backend here
    console.log("Form Submitted:", { file, baseYear, vehicleType, city });
  };

    return (

    <div className="flex flex-col items-center gap-5 pl-6 pt-4">
      <div className="flex items-center justify-between w-full">
        <form onSubmit={handleSubmit} className="flex items-end gap-4 p-4 shadow rounded">
              {/* Custom Upload Button */}
              <label className="flex items-center bg-blue-300 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded cursor-pointer h-[32px]">
                <span className="mr-2">Upload</span> Vehicle Classification Data
                <CloudUpload className="ml-2 w-5 h-5" />
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
              </label>

              {/* Base Year Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 whitespace-nowrap">Input the Base Year</label>
                <input
                  type="text"
                  value={baseYear}
                  onChange={(e) => setBaseYear(e.target.value)}
                  placeholder="202#"
                  className="border rounded px-2 py-1 w-20 h-[32px]"
                />
              </div>

              {/* Vehicle Type Dropdown */}
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
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
              <select value={city} onChange={(e) => setCity(e.target.value)} className="border rounded px-2 py-1 w-25">
                <option value="">City</option>
                {statesList.slice(1).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </form>

            <div className="ml-4">
              <VehicleStepper />
            </div>
      </div>

      
    

    <div className="flex flex-row w-full mt-4 gap-4">
      {data.length > 0 && (
              <div className="flex-1 min-w-[60%] overflow-auto border ht-theme-main-dark">
          <HotTable
            data={data}
            colHeaders={headers}
            rowHeaders={true}
            stretchH="all"
            width="100%"
            height="500px"
            licenseKey="non-commercial-and-evaluation"
          />
          </div>
            )}
        {city && cityImages[city] && (
        <div className="flex-1 flex items-center justify-center">
          <img
            src={cityImages[city]}
            alt={`${city} view`}
            className="w-full h-[500px] object-contain rounded rounded shadow-lg"
          />
        </div>
        )}
    </div>
    
    </div>

     
  );
}

export default VehicleClassification