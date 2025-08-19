// web/src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const brand = {
  primary:   "#0E2244",
  secondary: "#CE9B25",
  pageBg:    "#EBEBEB",
  paperBg:   "#FFFFFF",
  textMain:  "#0E2244",
  textSoft:  "#505359",
  success:   "#374419",
  warning:   "#CE9B25",
  error:     "#A1242D",
  info:      "#0E2244",
  divider:   "rgba(14,34,68,.12)",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: brand.primary, contrastText: "#FFFFFF" },
    secondary: { main: brand.secondary, contrastText: "#FFFFFF" },
    success:   { main: brand.success },
    warning:   { main: brand.warning },
    error:     { main: brand.error },
    info:      { main: brand.info },
    background: { default: brand.pageBg, paper: brand.paperBg },
    text: { primary: brand.textMain, secondary: brand.textSoft },
    divider: brand.divider,
    action: {
      hover: "rgba(2,6,23,.04)",
      selected: "rgba(2,6,23,.08)",
      focus: "rgba(14,34,68,.22)",
      disabled: "rgba(2,6,23,.26)",
      disabledBackground: "rgba(2,6,23,.12)",
      active: "rgba(2,6,23,.54)",
    },
  },
  shape: { borderRadius: 12 },
});

export default theme;
