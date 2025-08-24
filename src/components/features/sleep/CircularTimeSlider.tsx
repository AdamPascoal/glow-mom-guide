import { useState, useRef, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

interface CircularTimeSliderProps {
  bedtime: number; // hours in 24h format (e.g., 22.5 for 10:30 PM)
  waketime: number; // hours in 24h format (e.g., 7.25 for 7:15 AM)
  onBedtimeChange: (time: number) => void;
  onWaketimeChange: (time: number) => void;
}

export function CircularTimeSlider({ 
  bedtime, 
  waketime, 
  onBedtimeChange, 
  onWaketimeChange 
}: CircularTimeSliderProps) {
  const [isDragging, setIsDragging] = useState<'bedtime' | 'waketime' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const radius = 110;
  const center = 140;
  const strokeWidth = 12;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateSleepDuration = () => {
    let duration = waketime - bedtime;
    if (duration < 0) duration += 24; // Handle overnight sleep
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return { hours, minutes, total: duration };
  };

  const snapToInterval = (time: number) => {
    // Snap to 15-minute intervals
    return Math.round(time * 4) / 4;
  };

  const angleToTime = (angle: number) => {
    // Convert angle to 24-hour time (0 degrees = 12 AM)
    const normalizedAngle = (angle + 90) % 360; // Offset by 90 degrees so 12 is at top
    const time = (normalizedAngle / 360) * 24;
    return snapToInterval(time);
  };

  const timeToAngle = (time: number) => {
    // Convert 24-hour time to angle (12 AM = -90 degrees from top)
    return (time / 24) * 360 - 90;
  };

  const getPointOnCircle = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  const handleMouseDown = (type: 'bedtime' | 'waketime') => {
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const time = angleToTime(angle);

    if (isDragging === 'bedtime') {
      onBedtimeChange(time);
    } else {
      onWaketimeChange(time);
    }
  }, [isDragging, onBedtimeChange, onWaketimeChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const bedtimePoint = getPointOnCircle(timeToAngle(bedtime));
  const waketimePoint = getPointOnCircle(timeToAngle(waketime));
  const sleepDuration = calculateSleepDuration();

  // Create arc path for sleep duration
  const createArcPath = () => {
    const startAngle = timeToAngle(bedtime);
    const endAngle = timeToAngle(waketime);
    const largeArcFlag = sleepDuration.total > 12 ? 1 : 0;
    
    const start = getPointOnCircle(startAngle);
    const end = getPointOnCircle(endAngle);
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Add touch support
  const handleTouchStart = (type: 'bedtime' | 'waketime') => {
    setIsDragging(type);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left - center;
    const y = touch.clientY - rect.top - center;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const time = angleToTime(angle);

    if (isDragging === 'bedtime') {
      onBedtimeChange(time);
    } else {
      onWaketimeChange(time);
    }
  }, [isDragging, onBedtimeChange, onWaketimeChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const getMedicalFeedback = () => {
    const duration = sleepDuration.total;
    if (duration < 5) {
      return "⚠️ Warning: Insufficient sleep can lead to hormonal imbalance, poor immunity, and increased pregnancy risks.";
    } else if (duration < 6.5) {
      return "💡 Caution: Slightly low sleep. Aim for at least 7 hours for optimal health.";
    } else if (duration <= 8) {
      return "✅ Good! Decent rest. Keep this consistent.";
    } else if (duration <= 9.5) {
      return "🌟 Excellent! This is optimal sleep duration during pregnancy.";
    } else {
      return "⚠️ Too much sleep can sometimes indicate fatigue or underlying issues. Discuss with your doctor if frequent.";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="relative flex justify-center">
        <svg
          ref={svgRef}
          width="300"
          height="300"
          className="transform -rotate-90 max-w-[90vw] max-h-[90vw]"
          viewBox="0 0 280 280"
        >
          {/* Outer ring background */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted) / 0.3)"
            strokeWidth={strokeWidth}
          />
          
          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360 - 90;
            const point = getPointOnCircle(angle);
            const innerPoint = {
              x: center + (radius - 15) * Math.cos((angle * Math.PI) / 180),
              y: center + (radius - 15) * Math.sin((angle * Math.PI) / 180),
            };
            return (
              <line
                key={i}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={point.x}
                y2={point.y}
                stroke="hsl(var(--muted) / 0.6)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Sleep duration arc */}
          <path
            d={createArcPath()}
            fill="none"
            stroke="url(#sleepGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--sleep-moon))" />
              <stop offset="100%" stopColor="hsl(var(--sleep-accent))" />
            </linearGradient>
          </defs>
          
          {/* Bedtime handle */}
          <g transform={`translate(${bedtimePoint.x}, ${bedtimePoint.y})`}>
            <circle
              r="16"
              fill="hsl(var(--sleep-moon))"
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer hover:scale-110 transition-all duration-200 drop-shadow-md"
              onMouseDown={() => handleMouseDown('bedtime')}
              onTouchStart={() => handleTouchStart('bedtime')}
            />
            <Moon 
              size={16} 
              className="fill-white stroke-white transform rotate-90 translate-x-[-8px] translate-y-[-8px] pointer-events-none" 
            />
          </g>
          
          {/* Wake time handle */}
          <g transform={`translate(${waketimePoint.x}, ${waketimePoint.y})`}>
            <circle
              r="16"
              fill="hsl(var(--sleep-accent))"
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer hover:scale-110 transition-all duration-200 drop-shadow-md"
              onMouseDown={() => handleMouseDown('waketime')}
              onTouchStart={() => handleTouchStart('waketime')}
            />
            <Sun 
              size={16} 
              className="fill-white stroke-white transform rotate-90 translate-x-[-8px] translate-y-[-8px] pointer-events-none" 
            />
          </g>
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl md:text-4xl font-bold text-sleep-primary mb-1">
            {sleepDuration.hours}h {sleepDuration.minutes}m
          </div>
          <div className="text-sm text-sleep-secondary opacity-80">sleep duration</div>
        </div>
      </div>
      
      {/* Medical Feedback */}
      <div className="w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <p className="text-white/90 text-sm leading-relaxed text-center">
            {getMedicalFeedback()}
          </p>
        </div>
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between w-full max-w-sm px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sleep-moon font-medium mb-1">
            <Moon size={16} />
            <span>Bedtime</span>
          </div>
          <div className="text-white/80 text-lg font-semibold">{formatTime(bedtime)}</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sleep-accent font-medium mb-1">
            <Sun size={16} />
            <span>Wake Up</span>
          </div>
          <div className="text-white/80 text-lg font-semibold">{formatTime(waketime)}</div>
        </div>
      </div>
    </div>
  );
}