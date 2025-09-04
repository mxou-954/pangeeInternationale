
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export const ExpandableText = ({ text, maxLength = 40, label, icon: Icon, bgColor = "bg-gray-50", textColor = "text-gray-600" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? text.slice(0, maxLength) + '...' 
    : text;

  return (
    <div>
      <span className="text-sm font-medium text-gray-700 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-1 text-orange-500" />}
        {label}
      </span>
      <div className={`text-sm ${textColor} mt-1 ${bgColor} p-2 rounded relative`}>
        <p className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
          {displayText}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Lire moins
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Lire plus
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};