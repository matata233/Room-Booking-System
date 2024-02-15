import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

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

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepLabel-label": {
            fontSize: "16px", 
            fontWeight: "bold", 
            fontFamily: "AmazonEmber"
          },
          '& .MuiStepIcon-root': { // Target the step icon (number circle)
            backgroundColor: 'green', // Change the background color
            borderRadius: '50%', // Make it a circle
            width: 40, // Change the width (size)
            height: 40, // Change the height (size)
            '& .MuiStepIcon-text': { // Target the text inside the circle
              fill: 'white', // Change the text color
            }
          },
          '& .MuiStepIcon-text':{
            color:'red'
          }

        }}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished!
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Back to Home Page</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default BookingStepper;