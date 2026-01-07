import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { DataProvider } from "@/contexts/DataContext";
import { FilterProvider } from "@/contexts/FilterContext";

export const metadata: Metadata = {
  title: "TA Dashboard - Twill",
  description: "Talent Advisor Internal Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <DataProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </DataProvider>
        </UserProvider>
      </body>
    </html>
  );
}
