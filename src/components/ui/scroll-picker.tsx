import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScrollPickerProps {
  options: string[] | number[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  itemHeight?: number;
  visibleItems?: number;
  placeholder?: string;
}

export function ScrollPicker({
  options,
  value,
  onChange,
  className = "",
  itemHeight = 40,
  visibleItems = 5,
  placeholder = "Select..."
}: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const centerIndex = Math.floor(visibleItems / 2);
  const containerHeight = visibleItems * itemHeight;

  // Calculate current selected index
  const selectedIndex = options.findIndex(option => option === value);
  const targetScrollTop = Math.max(0, (selectedIndex - centerIndex) * itemHeight);

  useEffect(() => {
    if (containerRef.current && !isDragging) {
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [value, targetScrollTop, isDragging]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    
    // Calculate which item should be selected based on scroll position
    const index = Math.round(scrollTop / itemHeight) + centerIndex;
    const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const newScrollTop = Math.max(0, scrollTop + deltaY);
    
    containerRef.current.scrollTop = newScrollTop;
    setScrollTop(newScrollTop);
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;
    
    const currentScrollTop = containerRef.current.scrollTop;
    const index = Math.round(currentScrollTop / itemHeight) + centerIndex;
    const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
    
    // Snap to the nearest item
    const snapScrollTop = Math.max(0, (clampedIndex - centerIndex) * itemHeight);
    containerRef.current.scrollTop = snapScrollTop;
    setScrollTop(snapScrollTop);
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
    
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const newScrollTop = Math.max(0, scrollTop + deltaY);
    
    containerRef.current.scrollTop = newScrollTop;
    setScrollTop(newScrollTop);
  };

  const handleMouseUp = () => {
    if (!containerRef.current) return;
    
    const currentScrollTop = containerRef.current.scrollTop;
    const index = Math.round(currentScrollTop / itemHeight) + centerIndex;
    const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
    
    // Snap to the nearest item
    const snapScrollTop = Math.max(0, (clampedIndex - centerIndex) * itemHeight);
    containerRef.current.scrollTop = snapScrollTop;
    setScrollTop(snapScrollTop);
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
    
    setIsDragging(false);
  };

  // Add padding items to allow center selection of first and last items
  const paddedOptions = [
    ...Array(centerIndex).fill(""),
    ...options,
    ...Array(centerIndex).fill("")
  ];

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Selection indicator */}
        <div
          className="absolute left-0 right-0 border-t border-b border-orange-300 bg-orange-50 pointer-events-none z-10"
          style={{
            top: centerIndex * itemHeight,
            height: itemHeight,
          }}
        />
        
        {/* Options */}
        <div className="relative">
          {paddedOptions.map((option, index) => {
            const isCenter = index === centerIndex + selectedIndex;
            const distanceFromCenter = Math.abs(index - (centerIndex + selectedIndex));
            const opacity = Math.max(0.3, 1 - (distanceFromCenter * 0.2));
            
            return (
              <div
                key={`${option}-${index}`}
                className={cn(
                  "flex items-center justify-center transition-all duration-200 select-none cursor-pointer",
                  isCenter 
                    ? "text-orange-600 font-semibold text-lg" 
                    : "text-gray-600 font-medium"
                )}
                style={{
                  height: itemHeight,
                  opacity: option === "" ? 0 : opacity,
                  transform: `scale(${isCenter ? 1.1 : 0.9})`,
                }}
                onClick={() => {
                  if (option && option !== "") {
                    onChange(option);
                  }
                }}
              >
                {option || (index < centerIndex || index >= paddedOptions.length - centerIndex ? "" : placeholder)}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-700">
          {value || placeholder}
        </span>
      </div>
    </div>
  );
}