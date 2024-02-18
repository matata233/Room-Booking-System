import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f19e38",
    },
  },
});

const BookingStepper = () => {
  const steps = ["Login", "Booking", "Review", "Complete"];
  const [activeStep, setActiveStep] = React.useState(1);
  const [completed, setCompleted] = React.useState(new Set([0]));

  const handleNext = () => {
    let newCompleted = completed;
    newCompleted.add(activeStep - 1);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompleted(newCompleted);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(1);
    setCompleted(new Set([0]));
  };

  const handleStepClick = (step) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepLabel-label": {
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "AmazonEmber",
            },
            "& .MuiStepIcon-root": {
              backgroundColor: "#252f3d",
              borderRadius: "50%",
              width: 40,
              height: 40,
              marginTop: "-6px",
              "& .MuiStepIcon-text": {
                fill: "white",
              },
              position: "relative",
              zIndex: 1,
              "&:hover": {
                transform: "scale(1.5)",
                cursor: "pointer",
              },
            },
            "& .MuiStepIcon-root.Mui-active": {
              marginTop: "-20px",
              width: 60,
              height: 60,
              transition: "transform 0.3s",
            },
          }}
        >
          {steps.map((label, index) => {
            const stepProps = {
              onClick: () => handleStepClick(index),
            };
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {/* {activeStep === steps.length ? (
          <React.Fragment>
            <div class="ms-4 p-20">Congrats! - You're finished!</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
              class="inline-button"
            >
              <Link
                className="flex h-8 cursor-pointer items-center rounded-lg bg-theme-orange px-4 py-2 font-amazon-ember text-theme-dark-blue transition-colors  duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white  md:h-10"
                onClick={handleReset}
              >
                Back to Home Page
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div class="ms-4 p-20">Step {activeStep + 1}</div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                color="inherit"
              >
                Back
              </Button>

              <Link
                className="ml-4 flex h-8 cursor-pointer items-center rounded-lg bg-theme-orange px-4 py-2 font-amazon-ember text-theme-dark-blue transition-colors  duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white  md:h-10"
                onClick={handleNext}
              >
                {activeStep === 1
                  ? "Book Now"
                  : activeStep === 2
                    ? "Confirm"
                    : "Finish"}
              </Link>
            </div>
          </React.Fragment>
        )} */}
      </Box>
    </ThemeProvider>
  );
};

export default BookingStepper;
