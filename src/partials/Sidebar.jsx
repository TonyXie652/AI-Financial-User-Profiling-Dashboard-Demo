import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useElasticScroll } from "../utils/useElasticScroll";

const navigationItems = [
  { label: "首页界面", path: "/" },
  { label: "个人画像", path: "/personal-profile" },
  { label: "群体画像", path: "/group-profile" },
  { label: "标签体系", path: "/tag-system" },
  { label: "数据分析", path: "/data-analysis" },
  { label: "模型设置", path: "/model-settings" },
];

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = "default",
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const {
    elasticOffset,
    handleElasticWheel,
    scrollRef: sidebarScrollRef,
  } = useElasticScroll({ maxOffset: 34, strength: 0.16 });

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={(node) => {
          sidebar.current = node;
          sidebarScrollRef.current = node;
        }}
        onWheel={handleElasticWheel}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-56 shrink-0 bg-white dark:bg-[#001529] p-1.5 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-56"} ${variant === "v2" ? "" : ""}`}
      >
        <div
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${elasticOffset}px)` }}
        >
          {/* Sidebar header */}
          <div className="flex justify-between mb-8 px-2 pt-4">
            {/* Close button */}
            <button
              ref={trigger}
              className="lg:hidden text-gray-900/55 hover:text-gray-900 dark:text-white/55 dark:hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
              </svg>
            </button>

            {/* Logo */}
            <NavLink end to="/" className="block h-8 overflow-hidden">
              <span
                className="block text-2xl leading-8 font-bold text-gray-900 dark:text-white duration-200"
                style={{ fontFamily: '"Microsoft YaHei", "微软雅黑", sans-serif' }}
              >
                Demo
              </span>
            </NavLink>
          </div>

          {/* Links */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase text-gray-900/65 dark:text-white/65 font-semibold px-4">
                <span>菜单</span>
              </h3>

              <ul className="mt-10 ml-5 space-y-4">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <li key={item.path}>
                      <NavLink
                        end
                        to={item.path}
                        className={`group block mr-4 rounded-md truncate transition-[background-color,box-shadow] duration-500 ease-out ${
                          isActive
                            ? "bg-[#1677ff] text-white shadow-sm"
                            : "text-gray-900 dark:text-white"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center justify-start px-4 py-2.5">
                          <span
                            className={`text-xs font-medium transition-opacity duration-1000 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isActive
                                ? "opacity-100"
                                : "opacity-38 group-hover:opacity-95"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
