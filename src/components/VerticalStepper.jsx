import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  stepConnectorClasses,
} from "@mui/material";
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

// Steps data

// Custom Connector (vertical line)
const QontoConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#0a2f5c",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderLeft: "2px solid #0a2f5c",
    minHeight: 32,
  },
}));

function VehicleStepper({ activeStep = 0, steps = [] }) {
  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      connector={<QontoConnector />}
      sx={{ alignItems: "flex-start" }}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel
            icon={
              index === activeStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
              ) : (
                // <RadioButtonCheckedIcon color="primary" fontSize="small" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
                // <RadioButtonUncheckedIcon color="action" fontSize="small" />
              )
            }
            sx={{
              ".MuiStepLabel-label": {
                color: "#0a2f5c",
                fontWeight: 500,
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default VehicleStepper;
