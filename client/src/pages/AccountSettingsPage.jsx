import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccountSidebar from '../components/AccountSidebar';
import ProfilesForm from '../components/ProfilesForm';
import ApplicationsHistory from '../components/ApplicationsHistory';
import CvManager from '../components/CvManager';

export default function AccountSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = useMemo(() => new Set(['profiles', 'history', 'cv']), []);
  const initialTab = searchParams.get('tab');
  const [active, setActive] = useState(
    validTabs.has(initialTab) ? initialTab : 'profiles',
  );
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (validTabs.has(tab) && tab !== active) setActive(tab);
    if (!tab && active !== 'profiles') {
      // keep as-is when tab is omitted
    }
  }, [searchParams, validTabs, active]);

  function changeTab(tabKey) {
    setActive(tabKey);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!tabKey || tabKey === 'profiles') next.delete('tab');
      else next.set('tab', tabKey);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="py-8 flex-1">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              aria-label="Open menu"
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded bg-surface border border-border text-text-primary mr-3"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-text-primary">
              Account Settings
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop sidebar */}
            <div className="hidden md:block">
              <AccountSidebar active={active} onChange={changeTab} />
            </div>

            {/* Mobile overlay sidebar */}
            {showSidebar && (
              <div
                className="fixed inset-0 z-40 flex"
                onClick={() => setShowSidebar(false)}
              >
                <div className="w-full bg-black/40" />
                <div className="absolute left-0 top-0 bottom-0 z-50 p-4 w-64">
                  <AccountSidebar
                    active={active}
                    onChange={(k) => {
                      changeTab(k);
                      setShowSidebar(false);
                    }}
                    onClose={() => setShowSidebar(false)}
                  />
                </div>
              </div>
            )}

            <main className="md:col-span-3 bg-surface p-6 rounded border border-border">
              {active === 'profiles' && (
                <section>
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Profiles
                  </h2>
                  <ProfilesForm />
                </section>
              )}

              {active === 'history' && (
                <section>
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    History Apply
                  </h2>
                  <ApplicationsHistory defaultLimit={10} />
                </section>
              )}

              {active === 'cv' && (
                <section>
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    CV
                  </h2>
                  <CvManager />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
