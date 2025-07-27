"use client";

import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
        {children}
      </main>
    </div>
  );
}