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
        .map((savedTab) =>
          tabs.find((t) => t.label === savedTab.label)
            ? {
                ...tabs.find((t) => t.label === savedTab.label),
                pinned: savedTab.pinned || false,
              }
            : null
        )
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabOrder));
    }
  }, [tabOrder]);

  useEffect(() => {
    const calculateTabs = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const overflowButtonWidth = 100; 
      let availableWidth = containerWidth - overflowButtonWidth;
      let totalWidth = 0;
      const newVisible = [];
      const newOverflow = [];

      while (tabsRefs.current.length < tabOrder.length) {
        tabsRefs.current.push(null);
      }

      const pinnedTabs = tabOrder.filter(tab => tab.pinned);
      const unpinnedTabs = tabOrder.filter(tab => !tab.pinned);
      
      for (let i = 0; i < pinnedTabs.length; i++) {
        const tab = pinnedTabs[i];
        const index = tabOrder.indexOf(tab);
        const tabWidth = tabsRefs.current[index]?.offsetWidth || 100; 
        
        if (totalWidth + tabWidth <= availableWidth) {
          newVisible.push(tab);
          totalWidth += tabWidth;
        } else {
          newOverflow.push({ ...tab, index });
        }
      }
      
      for (let i = 0; i < unpinnedTabs.length; i++) {
        const tab = unpinnedTabs[i];
        const index = tabOrder.indexOf(tab);
        const tabWidth = tabsRefs.current[index]?.offsetWidth || 100; 
        
        if (totalWidth + tabWidth <= availableWidth) {
          newVisible.push(tab);
          totalWidth += tabWidth;
        } else {
          newOverflow.push({ ...tab, index });
        }
      }

      setVisibleTabs(newVisible);
      setOverflowTabs(newOverflow);
    };

    setTimeout(calculateTabs, 0);
    
    window.addEventListener("resize", calculateTabs);
    
    return () => window.removeEventListener("resize", calculateTabs);
  }, [tabOrder]);

  useEffect(() => {
    const calculateTabs = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const overflowButtonWidth = 100; 
      let availableWidth = containerWidth - overflowButtonWidth;
      let totalWidth = 0;
      const newVisible = [];
      const newOverflow = [];

      while (tabsRefs.current.length < tabOrder.length) {
        tabsRefs.current.push(null);
      }

      const pinnedTabs = tabOrder.filter(tab => tab.pinned);
      const unpinnedTabs = tabOrder.filter(tab => !tab.pinned);
      

      for (let i = 0; i < pinnedTabs.length; i++) {
        const tab = pinnedTabs[i];
        const index = tabOrder.indexOf(tab);
        const tabWidth = tabsRefs.current[index]?.offsetWidth || 100; 
        
        if (totalWidth + tabWidth <= availableWidth) {
          newVisible.push(tab);
          totalWidth += tabWidth;
        } else {
          newOverflow.push({ ...tab, index });
        }
      }
      
      for (let i = 0; i < unpinnedTabs.length; i++) {
        const tab = unpinnedTabs[i];
        const index = tabOrder.indexOf(tab);
        const tabWidth = tabsRefs.current[index]?.offsetWidth || 100;
        
        if (totalWidth + tabWidth <= availableWidth) {
          newVisible.push(tab);
          totalWidth += tabWidth;
        } else {
          newOverflow.push({ ...tab, index });
        }
      }

      setVisibleTabs(newVisible);
      setOverflowTabs(newOverflow);
    };

    setTimeout(calculateTabs, 0);
  }, [tabOrder]);

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
    }
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
        className="flex flex-wrap border-b border-gray-200 bg-white items-center"
      >
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
                onClick={() => setActiveTab(actualIndex)}
                className={`px-4 py-3 border-t-2 text-sm font-medium transition-colors duration-300 flex items-center relative ${
                  isActive
                    ? "border-blue-500 text-gray-900 bg-gray-100"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
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
                      size={12} 
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

        {overflowTabs.length > 0 && (
          <Menu as="div" className="relative inline-block text-left ml-auto">
            <Menu.Button 
              ref={overflowButtonRef}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
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
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
              {overflowTabs.map((tab) => (
                <Menu.Item key={tab.index}>
                  {({ active }) => (
                    <div className="flex items-center justify-between w-full px-4 py-2">
                      <button
                        onClick={() => setActiveTab(tab.index)}
                        className={`${
                          active ? "text-gray-900" : "text-gray-700"
                        } text-left text-sm flex-grow`}
                      >
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
            </Menu.Items>
          </Menu>
        )}
      </div>

      <div className="h-4 bg-gray-100" />
      {renderContent()}
    </div>
  );
};export default App;