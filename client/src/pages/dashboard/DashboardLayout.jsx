import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex gap-4">
            <div className="hidden md:block">
              <DashboardSidebar onClose={() => setOpen(false)} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="md:hidden p-2 rounded border"
                  aria-label="Toggle menu"
                >
                  {/* hamburger icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <main>{children}</main>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* mobile overlay sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden />
          <div
            className="absolute left-0 top-0 bottom-0 p-4 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
