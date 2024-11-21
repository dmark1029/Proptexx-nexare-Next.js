import { createTheme, ThemeProvider } from "@mui/material/styles";

const TooltipThemeProvider = ({ children }) => {
  const theme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: "#fff",
            fontSize: "14px",
            color: "black",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
          arrow: {
            color: "#003366",
          },
        },
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default TooltipThemeProvider;
