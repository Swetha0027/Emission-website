import useAppStore from "../useAppStore";
import Georgia from "../assets/Georgia.svg";
import California from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";

const GridEmissionRates = ({ activeStep }) => {
  const classificationState = useAppStore((state) => state.classificationState);
  const statesList = ["", "Georgia", "California", "Seattle", "NewYork"];
  const cityImages = { Georgia, California, Seattle, NewYork };
  const steps = [
    "Vehicle Energy Consumption and Emission Rates",
    " Grid Emission Rates",
  ];

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      {/* Left panel: form + table */}
      <div className="flex flex-col gap-6">
        <form className="flex items-end gap-4 p-4 shadow rounded">
          {/* <select
            value={classificationState.vehicleType}
            onChange={(e) =>
              setClassificationState({ vehicleType: e.target.value })
            }
            disabled={classificationState.classificationData.length === 0}
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
            value={classificationState.vehicleType}
            onChange={(e) =>
              setClassificationState({ vehicleType: e.target.value })
            }
            disabled={classificationState.classificationData.length === 0}
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
            value={classificationState.vehicleType}
            onChange={(e) =>
              setClassificationState({ vehicleType: e.target.value })
            }
            disabled={classificationState.classificationData.length === 0}
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
          </select> */}
          <select
            value={classificationState.city}
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

export default GridEmissionRates;
