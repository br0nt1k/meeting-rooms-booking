import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 mb-4">
        <h1 className="text-xl font-bold">Booking App</h1>
      </nav>
      
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}