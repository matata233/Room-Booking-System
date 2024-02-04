import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/system";
import PageTheme from "./PageTheme";

const AdminInputForm = (props) => {
  const firstlyHeader = props.firstlyHeader;
  const secondaryHeader = props.secondaryHeader;
  const labels = props.labels;
  const buttonText = props.buttonText;

  return (
    <ThemeProvider theme={PageTheme}>
      <Container
        fixed
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Stack spacing={2}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p style={{ fontSize: "30px" }} className="font-poppins">
              {firstlyHeader}
            </p>
          </div>
          <Card
            sx={{
              padding: "10px",
              height: "60vh",
              width: "60vw",
              border: "3px solid grey",
            }}
          >
            <Stack spacing={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p style={{ fontSize: "20px" }} className="font-poppins">
                  {secondaryHeader}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardContent
                  style={{
                    backgroundColor: "#f2f2f2",
                    width: "50vh",
                    border: "1px solid grey",
                    borderRadius: "8px",
                  }}
                >
                  {labels.map((label) => (
                    <TextField 
                    id="outlined-basic"
                    label={label} 
                    margin="normal"
                    size="small"
                    variant="outlined"
                    sx={{ display: "flex", justifyContent: "center" }}
                    />
                  ))}
                </CardContent>
              </div>
            </Stack>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardActions>
                <Button className="text-theme-orange">{buttonText}</Button>
              </CardActions>
            </div>
          </Card>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default AdminInputForm;
