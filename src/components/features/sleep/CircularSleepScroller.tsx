import { useState, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

interface CircularSleepScrollerProps {
  bedtime: number;
  waketime: number;
  onBedtimeChange: (time: number) => void;
  onWaketimeChange: (time: number) => void;
}

export function CircularSleepScroller({ 
  bedtime, 
  waketime, 
  onBedtimeChange, 
  onWaketimeChange 
}: CircularSleepScrollerProps) {
  const [isDragging, setIsDragging] = useState<'bedtime' | 'waketime' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const handleRadius = 16;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateSleepDuration = () => {
    let duration = waketime - bedtime;
    if (duration < 0) duration += 24;
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return { hours, minutes, total: duration };
  };

  const timeToAngle = (time: number) => {
    // Convert 24-hour time to angle (0 degrees = 12 AM at top)
    return (time / 24) * 360 - 90; // -90 to start at top
  };

  const angleToTime = (angle: number) => {
    // Convert angle back to 24-hour time
    const normalizedAngle = (angle + 90 + 360) % 360;
    const time = (normalizedAngle / 360) * 24;
    // Snap to 15-minute increments
    return Math.round(time * 4) / 4;
  };

  const getPointOnCircle = (angle: number, r: number = radius) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(radian),
      y: centerY + r * Math.sin(radian)
    };
  };

  const getAngleFromPoint = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const createSleepArc = () => {
    const startAngle = timeToAngle(bedtime);
    const endAngle = timeToAngle(waketime);
    
    const startPoint = getPointOnCircle(startAngle);
    const endPoint = getPointOnCircle(endAngle);
    
    // For sleep spanning midnight (bedtime > waketime in 24h format)
    if (bedtime > waketime) {
      // Create two arcs: bedtime to midnight, and midnight to waketime
      const midnightAngle = timeToAngle(0); // 12 AM at top
      const midnightPoint = getPointOnCircle(midnightAngle);
      
      // Calculate if we need large arc flag for each segment
      const firstArcSweep = (360 + midnightAngle - startAngle) % 360;
      const secondArcSweep = (endAngle - midnightAngle + 360) % 360;
      
      return (
        <>
          {/* First arc: bedtime to midnight */}
          <path
            d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${firstArcSweep > 180 ? 1 : 0} 1 ${midnightPoint.x} ${midnightPoint.y}`}
            fill="none"
            stroke="url(#sleepGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Second arc: midnight to waketime */}
          <path
            d={`M ${midnightPoint.x} ${midnightPoint.y} A ${radius} ${radius} 0 ${secondArcSweep > 180 ? 1 : 0} 1 ${endPoint.x} ${endPoint.y}`}
            fill="none"
            stroke="url(#sleepGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </>
      );
    } else {
      // Single arc for sleep within same day
      const sweepAngle = (endAngle - startAngle + 360) % 360;
      const largeArcFlag = sweepAngle > 180 ? 1 : 0;
      
      return (
        <path
          d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`}
          fill="none"
          stroke="url(#sleepGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />
      );
    }
  };

  const handleMouseDown = (type: 'bedtime' | 'waketime', e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const angle = getAngleFromPoint(x, y);
    const newTime = angleToTime(angle);
    
    if (isDragging === 'bedtime') {
      onBedtimeChange(newTime);
    } else {
      onWaketimeChange(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const angle = getAngleFromPoint(x, y);
      const newTime = angleToTime(angle);
      
      if (isDragging === 'bedtime') {
        onBedtimeChange(newTime);
      } else {
        onWaketimeChange(newTime);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalMouseMove as any);
      document.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalMouseMove as any);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, onBedtimeChange, onWaketimeChange]);

  const sleepDuration = calculateSleepDuration();
  const bedtimeAngle = timeToAngle(bedtime);
  const waketimeAngle = timeToAngle(waketime);
  const bedtimePoint = getPointOnCircle(bedtimeAngle);
  const waketimePoint = getPointOnCircle(waketimeAngle);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Time Labels */}
      <div className="flex justify-between items-center w-full max-w-sm">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">BEDTIME</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatTime(bedtime)}</div>
          <div className="text-sm text-gray-500">Tonight</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1 justify-end">
            <span className="text-sm font-medium text-gray-600">WAKE UP</span>
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatTime(waketime)}</div>
          <div className="text-sm text-gray-500">Tomorrow</div>
        </div>
      </div>

      {/* Circular Scroller */}
      <div className="relative">
        <svg
          ref={svgRef}
          width="300"
          height="300"
          className="cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <defs>
            <linearGradient id="sleepGradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="30%" stopColor="#9f7aea" />
              <stop offset="70%" stopColor="#ed8936" />
              <stop offset="100%" stopColor="#f6ad55" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          
          {/* Hour markers */}
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360 - 90;
            const innerPoint = getPointOnCircle(angle, radius - 20);
            const outerPoint = getPointOnCircle(angle, radius - 8);
            const isMainHour = i % 6 === 0;
            
            return (
              <g key={i}>
                <line
                  x1={innerPoint.x}
                  y1={innerPoint.y}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  stroke="#cbd5e0"
                  strokeWidth={isMainHour ? "2" : "1"}
                />
                {isMainHour && (
                  <text
                    x={getPointOnCircle(angle, radius - 35).x}
                    y={getPointOnCircle(angle, radius - 35).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-gray-600"
                  >
                    {i === 0 ? '12AM' : i === 6 ? '6AM' : i === 12 ? '12PM' : '6PM'}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Sleep arc */}
          {createSleepArc()}
          
          {/* Bedtime handle */}
          <g>
            <circle
              cx={bedtimePoint.x}
              cy={bedtimePoint.y}
              r={handleRadius}
              fill="white"
              stroke="#9f7aea"
              strokeWidth="3"
              className={`cursor-grab transition-transform ${
                isDragging === 'bedtime' ? 'scale-110' : 'hover:scale-105'
              }`}
              onMouseDown={(e) => handleMouseDown('bedtime', e)}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsDragging('bedtime');
              }}
            />
            <Moon 
              className="w-4 h-4 text-purple-600 pointer-events-none"
              style={{
                transform: `translate(${bedtimePoint.x - 8}px, ${bedtimePoint.y - 8}px)`
              }}
            />
          </g>
          
          {/* Wake time handle */}
          <g>
            <circle
              cx={waketimePoint.x}
              cy={waketimePoint.y}
              r={handleRadius}
              fill="white"
              stroke="#ed8936"
              strokeWidth="3"
              className={`cursor-grab transition-transform ${
                isDragging === 'waketime' ? 'scale-110' : 'hover:scale-105'
              }`}
              onMouseDown={(e) => handleMouseDown('waketime', e)}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsDragging('waketime');
              }}
            />
            <Sun 
              className="w-4 h-4 text-orange-600 pointer-events-none"
              style={{
                transform: `translate(${waketimePoint.x - 8}px, ${waketimePoint.y - 8}px)`
              }}
            />
          </g>
        </svg>
        
        {/* Center duration display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {sleepDuration.hours}h {sleepDuration.minutes}m
            </div>
            <div className="text-sm text-gray-500">Sleep Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
}