import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Plane Boomer",
  description: "An interesting diApp game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
