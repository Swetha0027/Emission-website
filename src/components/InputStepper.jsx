import React, { useState } from 'react';
import VehicleStepper from './VerticalStepper';  // Assume you already have this component
import VehicleClassification from './VehicleClassification';
import VehiclePenetration from './VehiclePenetration';


const steps = [
  'Vehicle Classification Data',
  'Projected Vehicle Penetration Rate Data',
  'Traffic Volume and Speed',
  'Projected Demand'
];

function InputStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [classificationState, setClassificationState] = useState({
    baseYear: '',
    vehicleType: '',
    city: '',
    classificationFile: null,
    classificationData: [],
    classificationHeaders: []
  })
  const [PenetrationState, setPenetrationState] = useState({
    projectedYear: '',
    PenetrationFile: null,
    penetrationData: [],
    penetrationHeaders: []
  });

  const handleNext = () => {
    console.log("next button clicked")
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };



  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 pl-6 pt-4">

      {/* Step-wise content */}
      <div className="w-full">
        {activeStep === 0 && (
          <VehicleClassification
            activeStep={activeStep}
            classificationState={classificationState}
            setClassificationState = {setClassificationState }
          />
        )}
        {activeStep === 1 && <VehiclePenetration 
        activeStep={activeStep}
        classificationState ={classificationState}
        PenetrationState = {PenetrationState}
        setPenetrationState = {setPenetrationState} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4">
        <button onClick={handleBack} disabled={activeStep === 0} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded">
          Previous
        </button>
        <button onClick={handleNext}  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}

export default InputStepper;
