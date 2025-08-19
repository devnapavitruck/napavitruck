// Permite usar variant="soft" en Button y Chip (tipado TS)
import "@mui/material/Button";
import "@mui/material/Chip";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}
