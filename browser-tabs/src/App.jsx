import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const App = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const containerRef = useRef(null);
  const tabsRefs = useRef([]);

  useEffect(() => {
    const calculateTabs = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let totalWidth = 0;
      const newVisibleTabs = [];
      const newOverflowTabs = [];

      // Очищаємо масив рефів, якщо кількість табів змінилась
      tabsRefs.current = tabsRefs.current.slice(0, tabs.length);

      // Перебираємо всі таби, щоб визначити, які вміщуються
      for (let i = 0; i < tabs.length; i++) {
        const tabWidth = tabsRefs.current[i]?.offsetWidth || 0;
        totalWidth += tabWidth;

        if (totalWidth < containerWidth - 120) {
          newVisibleTabs.push(tabs[i]);
        } else {
          newOverflowTabs.push({ ...tabs[i], index: i });
        }
      }

      setVisibleTabs(newVisibleTabs);
      setOverflowTabs(newOverflowTabs);
    };

    // Викликаємо функцію для визначення видимих табів
    calculateTabs();

    // Додаємо обробник resize
    window.addEventListener("resize", calculateTabs);
    return () => window.removeEventListener("resize", calculateTabs);
  }, [tabs]);

  const renderContent = () => (
    <div className="p-6 bg-white rounded-b-lg border border-gray-200 min-h-[550px]">
      {/* Тут буде контент активного табу */}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div ref={containerRef} className="flex flex-wrap border-b border-gray-200 bg-white items-center">
        {visibleTabs.map((tab, index) => {
          const actualIndex = tabs.indexOf(tab);
          const isActive = activeTab === actualIndex;
          return (
            <button
              key={index}
              ref={(el) => (tabsRefs.current[actualIndex] = el)}
              onClick={() => setActiveTab(actualIndex)}
              className={`px-4 py-3 border-t-2 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "border-blue-500 text-gray-900 bg-gray-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {overflowTabs.length > 0 && (
          <Menu as="div" className="relative inline-block text-left ml-auto px-4">
            <MenuButton className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <svg
                className="ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
              {overflowTabs.map((tab) => (
                <MenuItem key={tab.index}>
                  {({ active }) => (
                    <button
                      onClick={() => setActiveTab(tab.index)}
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      {tab.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="h-4 bg-gray-100" />
      {renderContent()}
    </div>
  );
};

export default App;
