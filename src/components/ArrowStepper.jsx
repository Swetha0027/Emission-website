import React, { useState } from "react";
import InputStepper from "./InputStepper";

export default function ArrowStepper() {
  const [activeStep, setActiveStep] = useState(-1);
  const steps = ["Input Data", "Analysis", "Results"];

  const handleStart = () => {
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const getStepStyle = (index) => {
    const isActive = index === activeStep;
    const isCompleted = index < activeStep;

    let baseClasses =
      "relative flex items-center justify-center px-8 py-3 text-sm font-medium transition-all duration-200 ";

    if (index === 0) {
      // First step - arrow pointing right
      baseClasses += "clip-path-first ";
    } else if (index === steps.length - 1) {
      // Last step - arrow pointing left
      baseClasses += "clip-path-last ";
    } else {
      // Middle steps - arrows on both sides
      baseClasses += "clip-path-middle ";
    }

    if (isActive) {
      baseClasses += "bg-[#10b981] text-white z-20";
    } else if (isCompleted) {
      baseClasses += "bg-white text-green-700 z-10";
    } else {
      baseClasses += "bg-white text-gray-600 z-0";
    }

    return baseClasses;
  };

  if (activeStep === -1) {
    return (
      <div style={{ minHeight: "calc(100vh - 155px)" }}>
        <div className="flex justify-center items-center  mt-4 gap-4">
          <style jsx>{`
            :root {
              --arrow: 20px;
              --border-width: 4px;
            }

            .clip-path-first {
              clip-path: polygon(
                0 0,
                calc(100% - var(--arrow)) 0,
                100% 50%,
                calc(100% - var(--arrow)) 100%,
                0 100%
              );
              margin-right: calc(-1 * var(--arrow));
            }

            .clip-path-first::before {
              content: "";
              position: absolute;
              top: calc(-1 * var(--border-width));
              left: calc(-1 * var(--border-width));
              right: calc(-1 * var(--border-width));
              bottom: calc(-1 * var(--border-width));
              background: #10b981;
              clip-path: polygon(
                0 0,
                calc(100% - var(--arrow)) 0,
                100% 50%,
                calc(100% - var(--arrow)) 100%,
                0 100%
              );
              z-index: -2;
            }

            .clip-path-first::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: inherit;
              clip-path: polygon(
                calc(var(--border-width)) calc(var(--border-width)),
                calc(100% - var(--arrow) - var(--border-width))
                  calc(var(--border-width)),
                calc(100% - var(--border-width)) 50%,
                calc(100% - var(--arrow) - var(--border-width))
                  calc(100% - var(--border-width)),
                calc(var(--border-width)) calc(100% - var(--border-width))
              );
              z-index: -1;
            }

            .clip-path-middle {
              clip-path: polygon(
                0% 0%,
                calc(100% - var(--arrow)) 0%,
                100% 50%,
                calc(100% - var(--arrow)) 100%,
                0% 100%,
                var(--arrow) 50%
              );
              margin-right: calc(-1 * var(--arrow));
            }

            .clip-path-middle::before {
              content: "";
              position: absolute;
              top: calc(-1 * var(--border-width));
              left: calc(-1 * var(--border-width));
              right: calc(-1 * var(--border-width));
              bottom: calc(-1 * var(--border-width));
              background: #10b981;
              clip-path: polygon(
                0% 0%,
                calc(100% - var(--arrow)) 0%,
                100% 50%,
                calc(100% - var(--arrow)) 100%,
                0% 100%,
                var(--arrow) 50%
              );
              z-index: -2;
            }

            .clip-path-middle::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: inherit;
              clip-path: polygon(
                calc(var(--border-width)) calc(var(--border-width)),
                calc(100% - var(--arrow) - var(--border-width))
                  calc(var(--border-width)),
                calc(100% - var(--border-width)) 50%,
                calc(100% - var(--arrow) - var(--border-width))
                  calc(100% - var(--border-width)),
                calc(var(--border-width)) calc(100% - var(--border-width)),
                calc(var(--arrow) + var(--border-width)) 50%
              );
              z-index: -1;
            }

            .clip-path-last {
              clip-path: polygon(
                0% 0%,
                100% 0%,
                100% 100%,
                0% 100%,
                var(--arrow) 50%
              );
            }

            .clip-path-last::before {
              content: "";
              position: absolute;
              top: calc(-1 * var(--border-width));
              left: calc(-1 * var(--border-width));
              right: calc(-1 * var(--border-width));
              bottom: calc(-1 * var(--border-width));
              background: #10b981;
              clip-path: polygon(
                0% 0%,
                100% 0%,
                100% 100%,
                0% 100%,
                var(--arrow) 50%
              );
              z-index: -2;
            }

            .clip-path-last::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: inherit;
              clip-path: polygon(
                calc(var(--border-width)) calc(var(--border-width)),
                calc(100% - var(--border-width)) calc(var(--border-width)),
                calc(100% - var(--border-width))
                  calc(100% - var(--border-width)),
                calc(var(--border-width)) calc(100% - var(--border-width)),
                calc(var(--arrow) + var(--border-width)) 50%
              );
              z-index: -1;
            }

            /* Ensure text is above the pseudo-element */
            .clip-path-first span,
            .clip-path-middle span,
            .clip-path-last span {
              position: relative;
              z-index: 1;
            }
          `}</style>
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={getStepStyle(index) + " min-w-[180px]"}
              >
                <span className="relative z-10">{step}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-8 p-6"
      style={{ minHeight: "calc(100vh - 155px)" }}
    >
      {/* Custom CSS for clip paths with proper borders */}
      <style jsx>{`
        :root {
          --arrow: 20px;
          --border-width: 4px;
        }

        .clip-path-first {
          clip-path: polygon(
            0 0,
            calc(100% - var(--arrow)) 0,
            100% 50%,
            calc(100% - var(--arrow)) 100%,
            0 100%
          );
          margin-right: calc(-1 * var(--arrow));
        }

        .clip-path-first::before {
          content: "";
          position: absolute;
          top: calc(-1 * var(--border-width));
          left: calc(-1 * var(--border-width));
          right: calc(-1 * var(--border-width));
          bottom: calc(-1 * var(--border-width));
          background: #10b981;
          clip-path: polygon(
            0 0,
            calc(100% - var(--arrow)) 0,
            100% 50%,
            calc(100% - var(--arrow)) 100%,
            0 100%
          );
          z-index: -2;
        }

        .clip-path-first::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          clip-path: polygon(
            calc(var(--border-width)) calc(var(--border-width)),
            calc(100% - var(--arrow) - var(--border-width))
              calc(var(--border-width)),
            calc(100% - var(--border-width)) 50%,
            calc(100% - var(--arrow) - var(--border-width))
              calc(100% - var(--border-width)),
            calc(var(--border-width)) calc(100% - var(--border-width))
          );
          z-index: -1;
        }

        .clip-path-middle {
          clip-path: polygon(
            0% 0%,
            calc(100% - var(--arrow)) 0%,
            100% 50%,
            calc(100% - var(--arrow)) 100%,
            0% 100%,
            var(--arrow) 50%
          );
          margin-right: calc(-1 * var(--arrow));
        }

        .clip-path-middle::before {
          content: "";
          position: absolute;
          top: calc(-1 * var(--border-width));
          left: calc(-1 * var(--border-width));
          right: calc(-1 * var(--border-width));
          bottom: calc(-1 * var(--border-width));
          background: #10b981;
          clip-path: polygon(
            0% 0%,
            calc(100% - var(--arrow)) 0%,
            100% 50%,
            calc(100% - var(--arrow)) 100%,
            0% 100%,
            var(--arrow) 50%
          );
          z-index: -2;
        }

        .clip-path-middle::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          clip-path: polygon(
            calc(var(--border-width)) calc(var(--border-width)),
            calc(100% - var(--arrow) - var(--border-width))
              calc(var(--border-width)),
            calc(100% - var(--border-width)) 50%,
            calc(100% - var(--arrow) - var(--border-width))
              calc(100% - var(--border-width)),
            calc(var(--border-width)) calc(100% - var(--border-width)),
            calc(var(--arrow) + var(--border-width)) 50%
          );
          z-index: -1;
        }

        .clip-path-last {
          clip-path: polygon(
            0% 0%,
            100% 0%,
            100% 100%,
            0% 100%,
            var(--arrow) 50%
          );
        }

        .clip-path-last::before {
          content: "";
          position: absolute;
          top: calc(-1 * var(--border-width));
          left: calc(-1 * var(--border-width));
          right: calc(-1 * var(--border-width));
          bottom: calc(-1 * var(--border-width));
          background: #10b981;
          clip-path: polygon(
            0% 0%,
            100% 0%,
            100% 100%,
            0% 100%,
            var(--arrow) 50%
          );
          z-index: -2;
        }

        .clip-path-last::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          clip-path: polygon(
            calc(var(--border-width)) calc(var(--border-width)),
            calc(100% - var(--border-width)) calc(var(--border-width)),
            calc(100% - var(--border-width)) calc(100% - var(--border-width)),
            calc(var(--border-width)) calc(100% - var(--border-width)),
            calc(var(--arrow) + var(--border-width)) 50%
          );
          z-index: -1;
        }

        /* Ensure text is above the pseudo-element */
        .clip-path-first span,
        .clip-path-middle span,
        .clip-path-last span {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Stepper */}
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step} className={getStepStyle(index) + " min-w-[180px]"}>
            <span className="relative z-10">{step}</span>
          </div>
        ))}
      </div>

      <div>
        {activeStep === 0 && (
          <div className="flex flex-row items-center gap-4 p-4 bg-white shadow rounded">
            <InputStepper finalNext={handleNext} />
          </div>
        )}

        {activeStep === 1 && (
          <div className="flex flex-row items-center gap-4 p-4 bg-white shadow rounded">
            <AnalysisStepper finalNext={handleNext} />
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <p className="text-gray-600 mb-4">Here are your results:</p>
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">Analysis completed successfully!</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {activeStep > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        )}

        {activeStep === steps.length - 1 && (
          <button
            onClick={() => setActiveStep(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
