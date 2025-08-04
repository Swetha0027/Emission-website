import useAppStore from "../useAppStore";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";

const EnergyConsumptionAndEmissionRates = ({ activeStep }) => {
  const classificationState = useAppStore((state) => state.classificationState);
  const ConsumptionAndEmissionState = useAppStore(
    (state) => state.ConsumptionAndEmission
  );
  const setConsumptionAndEmissionState = useAppStore(
    (state) => state.setConsumptionAndEmission
  );
  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const steps = [
    "Vehicle Energy Consumption and Emission Rates",
    " Grid Emission Rates",
  ];

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      {/* Left panel: form + table */}
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 shadow rounded">
          <select
            value={ConsumptionAndEmissionState.FuelType}
            onChange={(e) =>
              setConsumptionAndEmissionState({
                FuelType: e.target.value,
              })
            }
            className="border rounded px-2 py-1 w-32"
          >
            <option value="">Select Fuel Type</option>
            <option value="Compressed Natural Gas - CNG">
              Compressed Natural Gas - CNG
            </option>
            <option value="Diesel Fuel">Diesel Fuel</option>
            <option value="Electricity">Electricity</option>
            <option value="Ethanol - E-85">Ethanol - E-85</option>
            <option value="Gasoline">Gasoline</option>
          </select>
          <select
            value={ConsumptionAndEmissionState.EmissionType}
            onChange={(e) =>
              setConsumptionAndEmissionState({
                EmissionType: e.target.value,
              })
            }
            className="border rounded px-2 py-1 w-32"
          >
            <option value="">Select Emission Type</option>
            <option value="CO₂ Emissions">CO₂ Emissions</option>
            <option value="Energy Rate">Energy Rate</option>
            <option value="NOx">NOx</option>
            <option value="PM2.5 Brake Wear">PM2.5 Brake Wear</option>
            <option value="PM2.5 Tire Wear">PM2.5 Tire Wear</option>
          </select>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Vehicle Age</label>
            <input
              type="text"
              value={ConsumptionAndEmissionState.VehicleAge}
              onChange={(e) =>
                setConsumptionAndEmissionState({
                  VehicleAge: e.target.value,
                })
              }
              className="border rounded px-2 py-1 w-20 h-[32px]"
              placeholder="Enter age in Years..."
            />
          </div>

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
      </div>

      <div className="flex flex-col gap-6">
        <div className="ml-4">
          <VehicleStepper activeStep={activeStep} steps={steps} />
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
};

export default EnergyConsumptionAndEmissionRates;
