import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import BlankPage from './pages/BlankPage';
import Sidebar from './partials/Sidebar';
import { useElasticScroll } from './utils/useElasticScroll';

function App() {

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const {
    elasticOffset,
    handleElasticWheel,
    resetElasticOffset,
    scrollRef: scrollAreaRef,
  } = useElasticScroll({ maxOffset: 36, strength: 0.16 });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    scrollAreaRef.current?.scrollTo({ top: 0 })
    resetElasticOffset()
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        ref={scrollAreaRef}
        onWheel={handleElasticWheel}
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="flex min-h-full flex-col transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${elasticOffset}px)` }}
        >
          <Routes>
            <Route
              exact
              path="/"
              element={(
                <Dashboard
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                />
              )}
            />
            <Route path="/personal-profile" element={<BlankPage />} />
            <Route path="/group-profile" element={<BlankPage />} />
            <Route path="/tag-system" element={<BlankPage />} />
            <Route path="/data-analysis" element={<BlankPage />} />
            <Route path="/model-settings" element={<BlankPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
