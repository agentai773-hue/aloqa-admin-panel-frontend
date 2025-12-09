import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavSection } from '../../types/navigation';

interface SidebarSectionProps {
  section: NavSection;
  isCollapsed: boolean;
  isActive: boolean;
  onMobileClick?: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  isCollapsed,
  isActive,
  onMobileClick
}) => {
  const [isExpanded, setIsExpanded] = useState(section.isExpanded || false);
  const [, setTooltipOpen] = useState(false);
  const navigate = useNavigate();

  const toggleExpanded = () => {
    if (section.isExpandable && !isCollapsed) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSectionClick = () => {
    if (section.isExpandable) {
      toggleExpanded();
    }
  };

  const handleChildNavigate = (href: string) => {
    navigate(href);
    setTooltipOpen(false);
    if (onMobileClick) {
      onMobileClick();
    }
  };

  return (
    <div className="w-full">
      {/* Main Section Button */}
      {section.href ? (
        <NavLink
          to={section.href}
          onClick={onMobileClick}
          className={({ isActive }) =>
            `flex items-center ${isCollapsed ? 'justify-center px-2 py-3 ' : 'justify-between px-3 py-3'} rounded-xl transition-all duration-200 group relative w-full ${
              isActive
                ? 'bg-[#5DD149] text-white shadow-lg '
                : 'text-gray-700 hover:bg-green-50 hover:text-[#5DD149]'
            }`
          }
          title={isCollapsed ? section.name : ''}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
            <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${
              isActive ? 'bg-white text-[#5DD149]' : 'bg-[#5DD149] text-white group-hover:bg-[#306B25]'
            }`}>
              {section.icon}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap ml-3"
                >
                  {section.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div 
              className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg max-w-xs pointer-events-auto"
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            >
              <div className="font-semibold mb-1">{section.name}</div>
              {section.children && section.children.length > 0 && (
                <div className="space-y-1 text-xs border-t border-gray-700 pt-1 mt-1">
                  {section.children.map((child: { name: string; href: string }, index: number) => (
                    <div 
                      key={index} 
                      className="text-gray-300 hover:text-white cursor-pointer hover:bg-gray-800 px-2 py-1 rounded"
                      onClick={() => handleChildNavigate(child.href)}
                    >
                      • {child.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </NavLink>
      ) : (
        <button
          onClick={handleSectionClick}
          className={`flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-3'} rounded-xl transition-all duration-200 group relative w-full ${
            isActive
              ? 'bg-[#5DD149] text-white shadow-lg'
              : 'text-gray-700 hover:bg-green-50 hover:text-[#5DD149]'
          }`}
          title={isCollapsed ? section.name : ''}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
            <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${
              isActive ? 'bg-white text-[#5DD149]' : 'bg-[#5DD149] text-white group-hover:bg-[#306B25]'
            }`}>
              {section.icon}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap ml-3"
                >
                  {section.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div 
              className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg max-w-xs pointer-events-auto"
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            >
              <div className="font-semibold mb-1">{section.name}</div>
              {section.children && section.children.length > 0 && (
                <div className="space-y-1 text-xs border-t border-gray-700 pt-1 mt-1">
                  {section.children.map((child: { name: string; href: string }, index: number) => (
                    <div 
                      key={index} 
                      className="text-gray-300 hover:text-white cursor-pointer hover:bg-gray-800 px-2 py-1 rounded"
                      onClick={() => handleChildNavigate(child.href)}
                    >
                      • {child.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Chevron Icon - only show when not collapsed and section is expandable */}
          <AnimatePresence>
            {!isCollapsed && section.isExpandable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-colors" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Child Items */}
      <AnimatePresence>
        {!isCollapsed && section.children && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-1 space-y-1"
          >
            {section.children?.map((child: { name: string; href: string }, index: number) => (
              <NavLink
                key={index}
                to={child.href}
                onClick={onMobileClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group w-full ${
                    isActive
                      ? 'bg-[#5DD149] text-white shadow-md'
                      : 'text-gray-600 hover:bg-green-50 hover:text-[#5DD149]'
                  }`
                }
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-2 h-2 rounded-full shrink-0`}>
                    <div className="w-full h-full bg-current rounded-full opacity-60" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {child.name}
                  </span>
                </div>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};