import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AccountSidebar from '../components/AccountSidebar';
import ProfilesForm from '../components/ProfilesForm';
import ApplicationsHistory from '../components/ApplicationsHistory';
import CvManager from '../components/CvManager';
import { FiMenu } from 'react-icons/fi';

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
      
      <div className="flex-1 flex flex-row min-h-0">
        {/* Desktop Sidebar (full height between header and footer) */}
        <div className="hidden md:block flex-shrink-0">
          <AccountSidebar active={active} onChange={changeTab} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Mobile Header / Toggle */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setShowSidebar(true)}
                className="inline-flex items-center justify-center p-2 rounded bg-surface border border-border text-text-primary mr-3"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-text-primary">
                Account Settings
              </h1>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto">
              <main className="bg-surface p-6 rounded border border-border">
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
      </div>

      <Footer />

      {/* Mobile overlay sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div className="fixed inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 bottom-0 z-50"
            onClick={(e) => e.stopPropagation()}
          >
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
    </div>
  );
}
