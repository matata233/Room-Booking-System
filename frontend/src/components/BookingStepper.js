import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f19e38",
    },
  },
});

const BookingStepper = ({currentStage}) => {
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const steps = ["Login", "Booking", "Review", "Complete"];
  const [activeStep, setActiveStep] = React.useState(currentStage);

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
              fontSize: matches ? "12px" : "16px",
              fontWeight: "bold",
              fontFamily: "AmazonEmber",
            },
            "& .MuiStepIcon-root": {
              backgroundColor: "#252f3d",
              borderRadius: "50%",
              width: matches ? 30 : 40,
              height: matches ? 30 : 40,
              marginTop: "-6px",
              "& .MuiStepIcon-text": {
                fill: "white",
              },
              position: "relative",
              zIndex: 1,
              "&:hover": {
                transform: "scale(1.2)",
                cursor: "pointer",
                transition: "transform 0.3s",
              },
            },
            "& .MuiStepIcon-root.Mui-active": {
              marginTop: matches ? "-10px" : "-15px",
              width: matches ? 40 : 50,
              height: matches ? 40 : 50,
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
      </Box>
    </ThemeProvider>
  );
};

export default BookingStepper;
