import useAppStore from "../useAppStore";
import Atlanta from "../assets/Georgia.svg";
import LosAngeles from "../assets/California.svg";
import Seattle from "../assets/Seattle.svg";
import NewYork from "../assets/NewYork.svg";
import VehicleStepper from "./VerticalStepper";
import AnalysisImage from "./AnalysisImage";
import {
  getAnalysisImgUrl,
  buildAnalysisFileName,
} from "../utils/analysisAssets";

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
  const trafficState = useAppStore((s) => s.trafficVolumeState);
  const statesList = ["", "Atlanta", "Los Angeles", "Seattle", "NewYork"];
  const cityImages = { Atlanta, LosAngeles, Seattle, NewYork };
  const steps = [
    "Vehicle Energy Consumption and Emission Rates",
    " Grid Emission Rates",
  ];

  const scenarios = [
    {
      title: "Mid-case Scenario",
      description:
        "This scenario represents central estimates for fundamental inputs, including technology costs, fuel prices, and overall demand growth. It specifically assumes electric sector policies as they were in place during August 2024.",
    },
    {
      title: "Low Renewable Energy and Battery Costs",
      description:
        "This scenario mirrors the foundational assumptions of the Mid-case but posits a future where renewable energy and battery costs are considerably lower than central estimates.",
    },
    {
      title: "High Renewable Energy and Battery Costs",
      description:
        "Similar to the Mid-case scenario, this projection assumes the same core assumptions but forecasts a future where renewable energy and battery costs are notably higher.",
    },
    {
      title: "High Demand Growth",
      description:
        "This scenario also utilizes the same base assumptions as the Mid-case, yet it anticipates a significantly higher average annual demand growth rate of 2.8% from 2022 through 2050, contrasting with the 1.8% in the base assumptions.",
    },
    {
      title: "Low Natural Gas Prices",
      description:
        "This scenario maintains consistency with the Mid-case assumptions but projects a future where natural gas prices are assumed to be lower.",
    },
    {
      title: "High Natural Gas Prices",
      description:
        "This scenario follows the same foundational assumptions as the Mid-case but anticipates a future where natural gas prices are assumed to be higher.",
    },
    {
      title: "Low Renewable Energy and Battery Costs with High Natural Gas Prices",
      description:
        "Building upon the base assumptions of the first scenario, this scenario combines the assumption of lower renewable energy and battery costs with higher natural gas prices.",
    },
    {
      title: "High Renewable Energy and Battery Costs with Low Natural Gas Prices",
      description:
        "This scenario also uses the same base assumptions as the first scenario, but it specifically combines higher renewable energy and battery costs with lower natural gas prices.",
    },
  ];

  const GridEmissionState = useAppStore((state) => state.GridEmission);
  const setGridEmissionState = useAppStore((state) => state.setGridEmission);

  const onDownload = () => {
    const emission = GridEmissionState.EmissionType;
    const city = classificationState.cityInput;

    const url = getAnalysisImgUrl(emission, city);
    if (!url) {
      toast.error("Image not found for selected emission/city");
      return;
    }

    const filename = buildAnalysisFileName(emission, city, url);

    // trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast.success("Download started");
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Grid Emission Type
            </label>

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
              <option value="CO2">CO2</option>
              <option value="N2O">N2O</option>
              <option value="CH4">CH4</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">City</label>
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
          </div>
        </form>
        {classificationState.cityInput && GridEmissionState.EmissionType && (
          <AnalysisImage
            emissionType={GridEmissionState.EmissionType}
            city={classificationState.cityInput}
            className="max-w-[900px] w-full h-auto object-contain rounded self-start"
            fallback={
              <div className="text-sm text-red-600">Image not found</div>
            }
          />
        )}

        <div>
          <Button
            variant="contained"
            onClick={onDownload}
            disabled={
              !GridEmissionState.EmissionType || !classificationState.cityInput
            }
          >
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
