import React, { useState } from "react";
import EnergyConsumptionAndEmissionRates from "./EnergyConsumptionAndEmissionRates";
import GridEmissionRates from "./GridEmissionRates";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Stack from "@mui/material/Stack";

const steps = [
  "Vehicle Energy Consumption and Emission Rates",
  " Grid Emission Rates",
];

function AnalysisStepper({ finalNext }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    console.log("next button clicked");
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (steps.length == 2) {
      finalNext();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 pl-6 pt-4">
      {/* Step-wise content */}
      <div className="w-full">
        {activeStep === 0 && (
          <EnergyConsumptionAndEmissionRates activeStep={activeStep} />
        )}
        {activeStep === 1 && <GridEmissionRates activeStep={activeStep} />}
      </div>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={1}>
        <IconButton
          aria-label="previous"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton aria-label="next" onClick={handleNext}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </div>
  );
}

export default AnalysisStepper;
