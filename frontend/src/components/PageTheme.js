import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

const PageTheme = createTheme({
  palette: {
    primary: {
      main: "#FFA500",
    },
  },
});

export default PageTheme;
