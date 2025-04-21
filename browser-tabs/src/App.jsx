import React, { useState, useEffect, useRef } from "react";
import { Menu } from "@headlessui/react";
import { FaThumbtack } from "react-icons/fa";

const STORAGE_KEY = "tab_order";

const App = ({ tabs }) => {
  const [tabOrder, setTabOrder] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const containerRef = useRef(null);
  const tabsRefs = useRef([]);
  const overflowButtonRef = useRef(null);
  const [hoveredTabIndex, setHoveredTabIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved)) {
      const orderedTabs = saved
        .map((savedTab) => {
          const originalTab = tabs.find((t) => t.label === savedTab.label);
          if (originalTab) {
            return {
              ...originalTab,
              pinned: savedTab.pinned || false,
            };
          }
          return null;
        })
        .filter(Boolean);

      const missingTabs = tabs.filter(
        (t) => !orderedTabs.find((ot) => ot.label === t.label)
      );

      const formattedMissingTabs = missingTabs.map((t) => ({
        ...t,
        pinned: false,
      }));

      const newTabOrder = [...orderedTabs, ...formattedMissingTabs].sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return a.pinned ? -1 : 1;
      });

      setTabOrder(newTabOrder);
    } else {
      setTabOrder(tabs.map((t) => ({ ...t, pinned: false })));
    }
  }, [tabs]);

  useEffect(() => {
    if (tabOrder.length) {
      const currentPath = window.location.pathname;
      const tabIndex = tabOrder.findIndex(tab => tab.url === currentPath);
      
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
      } else if (tabOrder[0] && tabOrder[0].url) {
        window.history.pushState({}, "", tabOrder[0].url);
      }
    }
  }, [tabOrder]);

  useEffect(() => {
    if (tabOrder.length) {
      const tabOrderForStorage = tabOrder.map(tab => ({
        label: tab.label,
        url: tab.url,
        pinned: tab.pinned,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabOrderForStorage));
    }
  }, [tabOrder]);

  const calculateTabs = () => {
    if (!containerRef.current || tabOrder.length === 0) return;
    
    // Initialize tabsRefs if needed
    while (tabsRefs.current.length < tabOrder.length) {
      tabsRefs.current.push(null);
    }
    
    const containerWidth = containerRef.current.offsetWidth;
    const overflowButtonWidth = 120; // Give more space for the overflow button
    let availableWidth = containerWidth - overflowButtonWidth;
    let totalWidth = 0;
    const newVisible = [];
    const newOverflow = [];
    
    // First pass - calculate using existing tabs and their real widths
    for (let i = 0; i < tabOrder.length; i++) {
      const tab = tabOrder[i];
      const tabElement = tabsRefs.current[i];
      // Use actual tab width if available, or estimate
      const tabWidth = tabElement ? tabElement.offsetWidth : (tab.label.length * 10 + 40);
      
      // First prioritize pinned tabs
      if (tab.pinned) {
        if (totalWidth + tabWidth <= availableWidth) {
          newVisible.push(tab);
          totalWidth += tabWidth;
        } else {
          newOverflow.push({ ...tab, index: i });
        }
      }
    }
    
    // Then handle unpinned tabs
    for (let i = 0; i < tabOrder.length; i++) {
      const tab = tabOrder[i];
      if (tab.pinned) continue; // Skip pinned tabs as they're already handled
      
      const tabElement = tabsRefs.current[i];
      const tabWidth = tabElement ? tabElement.offsetWidth : (tab.label.length * 10) + 40;
      
      if (totalWidth + tabWidth <= availableWidth) {
        newVisible.push(tab);
        totalWidth += tabWidth;
      } else {
        newOverflow.push({ ...tab, index: i });
      }
    }
    
    setVisibleTabs(newVisible);
    setOverflowTabs(newOverflow);
  };

  // Run calculation initially and on window resize
  useEffect(() => {
    if (tabOrder.length > 0) {
      // Use timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        calculateTabs();
      }, 0);
      
      window.addEventListener("resize", calculateTabs);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", calculateTabs);
      };
    }
  }, [tabOrder]);

  // Recalculate when refs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateTabs();
    }, 50); // Small delay to ensure DOM elements are rendered
    
    return () => clearTimeout(timer);
  }, [tabsRefs.current]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", String(index));
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = Number(e.dataTransfer.getData("dragIndex"));
    if (isNaN(dragIndex)) return;

    const newTabs = [...tabOrder];
    const dragged = newTabs[dragIndex];

    if (dragged.pinned) return; 
    
    const dropTab = newTabs[dropIndex];
    if (dropTab.pinned) return; 
    
    newTabs.splice(dragIndex, 1);
    newTabs.splice(dropIndex > dragIndex ? dropIndex - 1 : dropIndex, 0, dragged);
    
    setTabOrder(newTabs);
  };

  const togglePin = (index, e) => {
    e.stopPropagation();
    
    const newTabs = [...tabOrder];
    const tab = newTabs[index];
    tab.pinned = !tab.pinned;

    const sortedTabs = newTabs.sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });

    setTabOrder(sortedTabs);
    
    const newActiveIndex = sortedTabs.indexOf(tab);
    if (activeTab !== newActiveIndex) {
      setActiveTab(newActiveIndex);
      navigateToTab(newActiveIndex);
    }
  };

  const navigateToTab = (index) => {
    const tab = tabOrder[index];
    if (tab && tab.url) {
      window.history.pushState({}, "", tab.url);
      document.title = tab.label || document.title;
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
    navigateToTab(index);
  };

  const renderContent = () => (
    <div className="p-6 bg-white rounded-b-lg border border-gray-200 min-h-[300px]">
      <h2 className="text-lg font-semibold">{tabOrder[activeTab]?.label}</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div
        ref={containerRef}
        className="flex items-center border-b border-gray-200 bg-white relative"
      >
        <div className="flex flex-grow overflow-hidden">
          {visibleTabs.map((tab) => {
            const actualIndex = tabOrder.indexOf(tab);
            const isActive = activeTab === actualIndex;
            const isPinned = tab.pinned;
            const isHovered = hoveredTabIndex === actualIndex;

            return (
              <div
                key={tab.label}
                className="flex items-center group relative"
                draggable={!tab.pinned}
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, actualIndex)}
                onMouseEnter={() => setHoveredTabIndex(actualIndex)}
                onMouseLeave={() => setHoveredTabIndex(null)}
              >
                <button
                  ref={(el) => (tabsRefs.current[actualIndex] = el)}
                  onClick={() => handleTabClick(actualIndex)}
                  className={`px-4 py-3 border-t-2 text-sm font-medium transition-colors duration-300 flex items-center relative ${
                    isActive
                      ? "border-blue-500 text-gray-900 bg-gray-100"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}

                  {(isPinned || isHovered) && (
                    <button
                      className={`ml-2 ${
                        isPinned 
                          ? "text-red-500" 
                          : "text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      } transition-opacity duration-200`}
                      onClick={(e) => togglePin(actualIndex, e)}
                      title={isPinned ? "Unpin" : "Pin"}
                    >
                      <FaThumbtack 
                        size={10} 
                        style={{ 
                          transform: isPinned ? 'rotate(0deg)' : 'rotate(90deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    </button>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {overflowTabs.length > 0 && (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button 
              ref={overflowButtonRef}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 ml-2 my-1"
            >
              More ({overflowTabs.length})
              <svg
                className="ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                {overflowTabs.map((tab) => (
                  <Menu.Item key={tab.index}>
                    {({ active }) => (
                      <div className="flex items-center justify-between w-full px-4 py-2">
                        <button
                          onClick={() => handleTabClick(tab.index)}
                          className={`${
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                          } text-left text-sm flex-grow flex items-center`}
                        >
                          {tab.icon && <span className="mr-2">{tab.icon}</span>}
                          {tab.label}
                        </button>
                        
                        <button
                          onClick={(e) => togglePin(tab.index, e)}
                          className={`${
                            tab.pinned ? "text-red-500" : "text-gray-400 hover:text-red-500"
                          } flex-shrink-0 ml-2`}
                          title={tab.pinned ? "Unpin" : "Pin"}
                        >
                          <FaThumbtack 
                            size={12} 
                            style={{ 
                              transform: tab.pinned ? 'rotate(0deg)' : 'rotate(90deg)',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        </button>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      <div className="h-4 bg-gray-100" />
      {renderContent()}
    </div>
  );
};

export default App;