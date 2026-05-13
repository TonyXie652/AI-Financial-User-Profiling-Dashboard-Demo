import React, { useEffect, useRef, useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import PersonalProfile from './pages/Personal_profile';
import GroupProfile from './pages/Group_profile';
import TagSystem from './pages/Tag_system';
import DataAnalysis from './pages/Data_analysis';
import ModelSettings from './pages/Model_settings';
import Sidebar from './partials/Sidebar';
import { useElasticScroll } from './utils/useElasticScroll';

function App() {

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollHideTimerRef = useRef(null);
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

  useEffect(() => {
    return () => window.clearTimeout(scrollHideTimerRef.current);
  }, []);

  const handleMainScroll = () => {
    setIsScrolling(true);
    window.clearTimeout(scrollHideTimerRef.current);
    scrollHideTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 700);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        ref={scrollAreaRef}
        onWheel={handleElasticWheel}
        onScroll={handleMainScroll}
        className={`app-scrollbar relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden scroll-smooth ${isScrolling ? 'is-scrolling' : ''}`}
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
            <Route
              path="/personal-profile"
              element={(
                <PersonalProfile
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              )}
            />
            <Route path="/group-profile" element={<GroupProfile />} />
            <Route path="/tag-system" element={<TagSystem />} />
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/model-settings" element={<ModelSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
