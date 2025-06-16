import React, { useState } from 'react';

const StarRating = ({ 
  value = 0, 
  onChange, 
  disabled = false, 
  size = 'w-8 h-8',
  readonly = false 
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);

  const handleStarClick = (starIndex, isHalf) => {
    if (disabled || readonly) return;
    
    const newValue = isHalf ? starIndex - 0.5 : starIndex;
    setCurrentValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleMouseEnter = (starIndex, isHalf) => {
    if (disabled || readonly) return;
    setHoverValue(isHalf ? starIndex - 0.5 : starIndex);
  };

  const handleMouseLeave = () => {
    if (disabled || readonly) return;
    setHoverValue(0);
  };

  const getStarFill = (starIndex) => {
    const activeValue = hoverValue || currentValue;
    
    if (activeValue >= starIndex) {
      return 'full'; // Full star
    } else if (activeValue >= starIndex - 0.5) {
      return 'half'; // Half star
    }
    return 'empty'; // Empty star
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillType = getStarFill(starIndex);
          
          return (
            <div 
              key={starIndex} 
              className="relative cursor-pointer"
              onMouseLeave={handleMouseLeave}
            >
              {/* Background star (gray) */}
              <svg 
                className={`${size} text-gray-300 transition-colors duration-150`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              
              {/* Half star overlay */}
              {fillType === 'half' && (
                <svg 
                  className={`${size} text-yellow-400 absolute inset-0 transition-colors duration-150`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              
              {/* Full star overlay */}
              {fillType === 'full' && (
                <svg 
                  className={`${size} text-yellow-400 absolute inset-0 transition-colors duration-150`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              
              {/* Left half clickable area */}
              <div 
                className="absolute inset-0 w-1/2 z-10"
                onClick={() => handleStarClick(starIndex, true)}
                onMouseEnter={() => handleMouseEnter(starIndex, true)}
              />
              
              {/* Right half clickable area */}
              <div 
                className="absolute inset-0 left-1/2 w-1/2 z-10"
                onClick={() => handleStarClick(starIndex, false)}
                onMouseEnter={() => handleMouseEnter(starIndex, false)}
              />
            </div>
          );
        })}
      </div>
      
      <span className="ml-2 text-sm text-gray-600 font-medium">
        {currentValue.toFixed(1)} / 5.0
      </span>
    </div>
  );
};

export default StarRating;
