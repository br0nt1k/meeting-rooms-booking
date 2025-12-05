import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Meeting Room Booking",
  description: "Book your room easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-linear-to-br from-indigo-50 via-white to-blue-50 text-gray-900 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}