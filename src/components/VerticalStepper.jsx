// VehicleStepper.jsx
import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  stepConnectorClasses,
} from "@mui/material";
import useAppStore from "../useAppStore";

const QontoConnector = styled(StepConnector, {
  shouldForwardProp: (prop) => prop !== "isDark",
})(({ isDark }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: isDark ? "rgba(255,255,255,0.8)" : "#0a2f5c",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderLeft: `2px solid ${isDark ? "rgba(255,255,255,0.45)" : "#0a2f5c"}`,
    minHeight: 32,
  },
}));

function VehicleStepper({ activeStep = 0, steps = [] }) {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === "dark";

  const labelColor = isDark ? "#ffffff" : "#0a2f5c";
  const iconActive = isDark ? "#ffffff" : "#0a2f5c";
  const iconInactive = isDark ? "rgba(255,255,255,0.6)" : "#0a2f5c";

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      connector={<QontoConnector isDark={isDark} />}
      sx={{ alignItems: "flex-start" }}
    >
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        return (
          <Step key={label}>
            <StepLabel
              icon={
                isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      fill={iconActive}
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                      fill={iconInactive}
                    />
                  </svg>
                )
              }
              sx={{
                ".MuiStepLabel-label": {
                  color: labelColor,
                  fontWeight: 500,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

export default VehicleStepper;
