import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const AdminInputForm = (props) => {
  const firstlyHeader = props.firstlyHeader;
  const secondaryHeader = props.secondaryHeader;
  const labels = props.labels;
  const buttonText = props.buttonText;

  return (
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
            <p style={{ fontSize: "30px" }} >
              {firstlyHeader}
            </p>
          </div>
          <Card
            sx={{
              padding: "10px",
              height: "60vh",
              width: "60vw",
              border: "2px solid #232f3e",
              backgroundColor: "#f2f2f2"
            }}
          >
            <Stack spacing={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p style={{ fontSize: "20px" }}>
                  {secondaryHeader}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardContent
                  style={{
                    backgroundColor: "#f2f2f2",
                    width: "50vh",
                    border: "solid grey",
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
            <div style={{ display: "flex", justifyContent: "center", marginTop:"20px" }}>
                <Link
                  to="/roomManagementAddPage"
                  className="flex h-8 cursor-pointer items-center rounded-lg bg-theme-orange px-4 py-2 font-amazon-ember text-theme-dark-blue transition-colors  duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white  md:h-10"
                >
                  {buttonText}
                </Link>
            </div>
          </Card>
        </Stack>
      </Container>
  );
};

export default AdminInputForm;