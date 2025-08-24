import { useState } from "react";
import { Moon, Sun } from "lucide-react";

interface SleepScrollerProps {
  bedtime: number;
  waketime: number;
  onBedtimeChange: (time: number) => void;
  onWaketimeChange: (time: number) => void;
}

export function SleepScroller({ bedtime, waketime, onBedtimeChange, onWaketimeChange }: SleepScrollerProps) {
  const [isDragging, setIsDragging] = useState<'bedtime' | 'waketime' | null>(null);

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

  const timeToPercentage = (time: number) => {
    return (time / 24) * 100;
  };

  const percentageToTime = (percentage: number) => {
    const time = (percentage / 100) * 24;
    // Snap to 15-minute increments
    return Math.round(time * 4) / 4;
  };

  const handleMouseDown = (type: 'bedtime' | 'waketime') => {
    setIsDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newTime = percentageToTime(percentage);

    if (isDragging === 'bedtime') {
      onBedtimeChange(newTime);
    } else {
      onWaketimeChange(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const sleepDuration = calculateSleepDuration();
  const bedtimePercentage = timeToPercentage(bedtime);
  const waketimePercentage = timeToPercentage(waketime);
  
  // Calculate sleep bar position and width
  let sleepBarLeft = bedtimePercentage;
  let sleepBarWidth = waketimePercentage - bedtimePercentage;
  
  if (sleepBarWidth < 0) {
    // Sleep spans midnight
    sleepBarWidth = 100 - bedtimePercentage + waketimePercentage;
  }

  return (
    <div className="space-y-6">
      {/* Time Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {sleepDuration.hours}h {sleepDuration.minutes}m
        </div>
        <div className="text-sm text-gray-600">
          Total Sleep Duration
        </div>
      </div>

      {/* Horizontal Sleep Scroller */}
      <div
        className="relative h-16 bg-gray-100 rounded-full cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Time markers */}
        <div className="absolute inset-0 flex items-center">
          {[0, 6, 12, 18].map((hour) => (
            <div
              key={hour}
              className="absolute w-px h-4 bg-gray-300"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              <div className="absolute -bottom-6 -left-3 text-xs text-gray-500 w-6 text-center">
                {hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
              </div>
            </div>
          ))}
        </div>

        {/* Sleep duration bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-80"
          style={{
            left: `${sleepBarLeft}%`,
            width: waketime < bedtime ? `${100 - bedtimePercentage}%` : `${sleepBarWidth}%`,
          }}
        />
        
        {/* If sleep spans midnight, add second bar */}
        {waketime < bedtime && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-80"
            style={{
              left: '0%',
              width: `${waketimePercentage}%`,
            }}
          />
        )}

        {/* Bedtime handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-purple-500 rounded-full shadow-lg cursor-grab flex items-center justify-center transition-transform ${
            isDragging === 'bedtime' ? 'scale-110 cursor-grabbing' : 'hover:scale-105'
          }`}
          style={{ left: `${bedtimePercentage}%`, transform: `translate(-50%, -50%)` }}
          onMouseDown={() => handleMouseDown('bedtime')}
        >
          <Moon className="w-5 h-5 text-purple-600" />
        </div>

        {/* Waketime handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-yellow-500 rounded-full shadow-lg cursor-grab flex items-center justify-center transition-transform ${
            isDragging === 'waketime' ? 'scale-110 cursor-grabbing' : 'hover:scale-105'
          }`}
          style={{ left: `${waketimePercentage}%`, transform: `translate(-50%, -50%)` }}
          onMouseDown={() => handleMouseDown('waketime')}
        >
          <Sun className="w-5 h-5 text-yellow-600" />
        </div>
      </div>

      {/* Time Labels */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-600" />
          <div>
            <div className="text-sm font-medium text-gray-900">Bedtime</div>
            <div className="text-lg font-bold text-purple-600">{formatTime(bedtime)}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-600" />
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Wake up</div>
            <div className="text-lg font-bold text-yellow-600">{formatTime(waketime)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}