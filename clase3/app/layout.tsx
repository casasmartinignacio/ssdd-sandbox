import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sticky notes",
  description: "Tablero de sticky notes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
