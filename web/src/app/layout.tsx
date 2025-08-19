import type { Metadata } from "next";
import ThemeRegistry from "../providers/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = { title: "NapaviTruck", description: "Consola de administración" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
