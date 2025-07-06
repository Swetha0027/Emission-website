import React, { useState } from "react";
import EnergyConsumptionAndEmissionRates from "./EnergyConsumptionAndEmissionRates";
import GridEmissionRates from "./GridEmissionRates";

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
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AnalysisStepper;
