import React, { useEffect, useRef, useState } from 'react';

import Notifications from '../components/DropdownNotifications';
import Help from '../components/DropdownHelp';
import UserMenu from '../components/DropdownProfile';
import ThemeToggle from '../components/ThemeToggle';
import Transition from '../utils/Transition';

const timeRangeOptions = [
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: '90d', label: '近90天' },
  { value: '1y', label: '近一年' },
];

function TimeRangeDropdown({ value, onChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const selectedOption = timeRangeOptions.find((option) => option.value === value) || timeRangeOptions[1];

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !trigger.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        type="button"
        className={`relative z-20 flex h-8 min-w-[94px] items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold shadow-xs outline-hidden transition-colors duration-200 ${
          dropdownOpen
            ? 'border-blue-500 bg-blue-50 text-gray-800 dark:border-blue-400/80 dark:bg-gray-800 dark:text-gray-100'
            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/70'
        }`}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="leading-none">{selectedOption.label}</span>
        <svg
          className={`mt-px h-3.5 w-3.5 shrink-0 fill-current transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M4.3 5.9a1 1 0 0 1 1.4 0L8 8.2l2.3-2.3a1 1 0 1 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>

      <Transition
        show={dropdownOpen}
        tag="div"
        className="absolute left-0 top-[calc(100%-2px)] z-10 w-full origin-top overflow-hidden rounded-b-2xl border border-t-0 border-blue-500 bg-white pt-1 shadow-lg dark:border-blue-400/70 dark:bg-gray-800"
        enter="transition ease-out duration-180 transform"
        enterStart="opacity-0 scale-y-75 -translate-y-1"
        enterEnd="opacity-100 scale-y-100 translate-y-0"
        leave="transition ease-in duration-120 transform"
        leaveStart="opacity-100 scale-y-100 translate-y-0"
        leaveEnd="opacity-0 scale-y-75 -translate-y-1"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {timeRangeOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:hover:text-white'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setDropdownOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Transition>
    </div>
  );
}

function Header({
  sidebarOpen,
  setSidebarOpen,
  timeRange = '30d',
  setTimeRange,
  variant = 'default',
}) {
  return (
    <header className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md before:bg-white/90 dark:before:bg-gray-800/90 before:-z-10 z-30 ${variant === 'v2' || variant === 'v3' ? 'after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10' : 'max-lg:shadow-xs'} ${variant === 'v3' ? 'dark:before:bg-gray-800/90' : ''}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>

          <div className="flex">
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">打开侧边栏</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Notifications align="right" />
            {setTimeRange && (
              <TimeRangeDropdown value={timeRange} onChange={setTimeRange} />
            )}
            <Help align="right" />
            <ThemeToggle />
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
