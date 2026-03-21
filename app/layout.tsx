import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/shared/SessionProvider";

export const metadata: Metadata = {
  title: "BharatLedger - Financial Inclusion Platform",
  description: "Empowering India's informal borrowers with fair, transparent credit scoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
