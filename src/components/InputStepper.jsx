import React, { useState } from "react";
import VehicleClassification from "./VehicleClassification";
import VehiclePenetration from "./VehiclePenetration";
import VehicleTrafficVolume from "./VehicleTrafficVolume";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Stack from "@mui/material/Stack";
import ProjectedDemand from "./ProjectedDemand";

const steps = [
  "Vehicle Classification Data",
  "Projected Vehicle Penetration Rate Data",
  "Traffic Volume and Speed",
  "Projected Demand",
];

function InputStepper({ finalNext }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    console.log("next button clicked");
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (steps.length === 4) {
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
        {activeStep === 0 && <VehicleClassification activeStep={activeStep} />}
        {activeStep === 1 && <VehiclePenetration activeStep={activeStep} />}

        {activeStep === 2 && <VehicleTrafficVolume activeStep={activeStep} />}
        {activeStep === 3 && <ProjectedDemand activeStep={activeStep} />}
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

export default InputStepper;
