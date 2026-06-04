import React, { useState } from 'react';
import DashboardSidebar from '../../components/DashboardSidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex flex-row min-h-0">
        {/* Desktop Sidebar (full height between header and footer) */}
        <div className="hidden md:block flex-shrink-0">
          <DashboardSidebar onClose={() => setOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 rounded border inline-flex items-center justify-center bg-surface border-border text-text-primary"
                aria-label="Toggle menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>

            <main>{children}</main>
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
            className="absolute left-0 top-0 bottom-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
