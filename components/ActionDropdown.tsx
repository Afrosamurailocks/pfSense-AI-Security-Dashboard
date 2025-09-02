
import React, { useState, useEffect, useRef } from 'react';
import { DiagnosticToolType } from '../App';

interface ActionDropdownProps {
  targetIp: string;
  runDiagnostic: (tool: DiagnosticToolType, target: string) => void;
  title?: string;
  tools?: DiagnosticToolType[];
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ 
    targetIp, 
    runDiagnostic, 
    title = "Tools", 
    tools = ['ping', 'traceroute', 'dnslookup'] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRun = (tool: DiagnosticToolType) => {
    runDiagnostic(tool, targetIp);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-accent-blue/70 shadow-sm px-3 py-1 bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-accent-blue transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          <svg className="-mr-1 ml-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {tools.includes('ping') && (
                <button onClick={() => handleRun('ping')} className="w-full text-left text-gray-300 hover:bg-accent-blue hover:text-white block px-4 py-2 text-sm">
                    Ping
                </button>
            )}
            {tools.includes('traceroute') && (
                 <button onClick={() => handleRun('traceroute')} className="w-full text-left text-gray-300 hover:bg-accent-blue hover:text-white block px-4 py-2 text-sm">
                    Traceroute
                </button>
            )}
             {tools.includes('dnslookup') && (
                <button onClick={() => handleRun('dnslookup')} className="w-full text-left text-gray-300 hover:bg-accent-blue hover:text-white block px-4 py-2 text-sm">
                    DNS Lookup
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
