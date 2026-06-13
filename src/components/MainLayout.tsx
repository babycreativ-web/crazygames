"use client";

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useSearchParams } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || undefined;
  const activeFilter = searchParams.get("filter") || undefined;

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Grid: Sidebar + Content */}
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          activeCategory={activeCategory}
          activeFilter={activeFilter}
        />

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={handleCloseSidebar}
            className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 px-4 py-6 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

