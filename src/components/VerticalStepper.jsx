// VehicleStepper.jsx
import React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import useAppStore from "../useAppStore";

// Connector colored per theme (vertical uses a left border)
const QontoConnector = styled(StepConnector, {
  shouldForwardProp: (prop) => prop !== "isDark",
})(({ isDark }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: isDark ? "rgba(255,255,255,0.45)" : "#0a2f5c",
    minHeight: 32,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line},
    &.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderLeftColor: isDark ? "rgba(255,255,255,0.8)" : "#0a2f5c",
  },
}));

// StepLabel with themed text color (works reliably in v5/v6)
const ThemedStepLabel = styled(StepLabel, {
  shouldForwardProp: (prop) => prop !== "isDark",
})(({ isDark }) => ({
  "& .MuiStepLabel-label": {
    color: isDark ? "#fff" : "#0a2f5c",
    fontWeight: 500,
  },
  "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
    color: isDark ? "#fff" : "#0a2f5c",
  },
  "& .MuiStepLabel-label.Mui-disabled": {
    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(10,47,92,0.6)",
  },
}));

function VehicleStepper({ activeStep = 0, steps = [] }) {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === "dark";

  const iconActive = isDark ? "#fff" : "#0a2f5c";
  const iconInactive = isDark ? "rgba(255,255,255,0.6)" : "#0a2f5c";

  return (
    <Stepper
      key={theme} // force remount on mode change so connector recolors instantly
      activeStep={activeStep}
      orientation="vertical"
      connector={<QontoConnector isDark={isDark} />}
      sx={{ alignItems: "flex-start" }}
    >
      {steps.map((label, idx) => {
        const isActive = idx === activeStep;
        return (
          <Step key={`${label}-${theme}`}>
            <ThemedStepLabel
              isDark={isDark}
              icon={
                isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    aria-hidden="true"
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
                    aria-hidden="true"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                      fill={iconInactive}
                    />
                  </svg>
                )
              }
            >
              {label}
            </ThemedStepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

export default VehicleStepper;
