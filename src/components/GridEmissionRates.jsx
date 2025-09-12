import useAppStore from "../useAppStore";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

const GridEmissionRates = ({ activeStep }) => {
  const classificationState = useAppStore((state) => state.classificationState);
  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const steps = [
    "Vehicle Energy Consumption and Emission Rates",
    " Grid Emission Rates",
  ];

  const scenarios = [
    {
      title: "Mid-case",
      description:
        "This scenario represents central estimates for key inputs such as technology costs, fuel prices, and demand growth, with no inclusion of nascent technologies. It assumes electric sector policies as they existed in September 2023.",
    },
    {
      title: "Low Renewable Energy and Battery Costs",
      description:
        "Mirrors the Mid-case assumptions but assumes lower costs and greater performance improvements for renewable energy and batteries.",
    },
    {
      title: "High Renewable Energy and Battery Costs",
      description:
        "Similar to the Mid-case but with higher costs and less significant performance improvements for renewable energy and batteries.",
    },
    {
      title: "High Electricity Demand Growth",
      description:
        "Uses the Mid-case base assumptions but assumes a higher average annual demand growth rate of 2.8% from 2024 to 2050, consistent with a trajectory towards 100% economy-wide decarbonization.",
    },
    {
      title: "Low Natural Gas Prices",
      description:
        "Consistent with the Mid-case but assumes lower natural gas prices.",
    },
    {
      title: "High Natural Gas Prices",
      description:
        "Follows the Mid-case base assumptions but assumes higher natural gas prices.",
    },
    {
      title: "95% Decarbonization by 2050",
      description:
        "Building on the Mid-case, includes nascent technologies and enforces a national decarbonization constraint, reducing net electricity-sector emissions to 5% of 2005 levels by 2050.",
    },
    {
      title: "100% Decarbonization by 2035",
      description:
        "Like the 95% case but more aggressive—achieves net-zero emissions by 2035 via inclusion of nascent technologies and a linear emissions reduction to zero.",
    },
  ];

  const GridEmissionState = useAppStore((state) => state.GridEmission);
  const setGridEmissionState = useAppStore((state) => state.setGridEmission);
  const onDownload = () => {
    console.log("Download clicked");
    toast.info("Download started...");
    // Implement download logic here
    // Assuming download succeeds
    setTimeout(() => toast.success("Download completed!"), 1000);
  };

  return (
    <div className="flex flex-row items-stretch gap-6 pl-6 pt-4">
      {/* Left panel: form + table */}
      <div className="flex flex-col gap-6">
        <Card variant="outlined" sx={{ backgroundColor: "#fafafa", mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scenarios
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {scenarios.map(({ title, description }) => (
                <ListItem key={title} sx={{ display: "block", py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <form className="flex items-end gap-4 p-4 rounded">
          <select
            value={GridEmissionState.EmissionType}
            onChange={(e) =>
              setGridEmissionState({
                EmissionType: e.target.value,
              })
            }
            className="border rounded px-2 py-1 w-56"
          >
            <option value="">Select Grid Emission Type</option>
            <option value="CO₂ Emissions">CO₂ Emissions</option>
            <option value="Energy Rate">Energy Rate</option>
            <option value="NOx">NOx</option>
            <option value="PM2.5 Brake Wear">PM2.5 Brake Wear</option>
            <option value="PM2.5 Tire Wear">PM2.5 Tire Wear</option>
          </select>
          <select
            value={classificationState.cityInput}
            disabled
            className="border rounded px-2 py-1 w-32"
          >
            <option value="">City</option>
            {statesList.slice(1).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </form>

        <div>
          <Button variant="contained" onClick={onDownload}>
            Download
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="ml-4 flex items-center gap-4">
          <VehicleStepper activeStep={activeStep} steps={steps} />
          <img
            src="src/assets/Logo2.jpg"
            alt="NREL Cambium"
            style={{ width: "120px", height: "auto" }}
          />
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
};

export default GridEmissionRates;
