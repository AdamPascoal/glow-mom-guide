import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekNavigatorProps {
  onWeekChange: (weekOffset: number) => void;
  currentWeekOffset: number;
  className?: string;
}

export function WeekNavigator({ onWeekChange, currentWeekOffset, className }: WeekNavigatorProps) {
  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "This Week";
    if (offset === -1) return "Last Week";
    return `${Math.abs(offset)} weeks ago`;
  };

  const handlePrevious = () => {
    onWeekChange(currentWeekOffset - 1);
  };

  const handleNext = () => {
    if (currentWeekOffset < 0) {
      onWeekChange(currentWeekOffset + 1);
    }
  };

  const getWeekDateRange = (offset: number) => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    
    const targetWeekStart = new Date(currentWeekStart);
    targetWeekStart.setDate(currentWeekStart.getDate() + (offset * 7));
    
    const targetWeekEnd = new Date(targetWeekStart);
    targetWeekEnd.setDate(targetWeekStart.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };
    
    return `${formatDate(targetWeekStart)} - ${formatDate(targetWeekEnd)}`;
  };

  return (
    <div className={cn("flex items-center justify-between bg-white rounded-lg p-3 border", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevious}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>
      
      <div className="text-center">
        <div className="font-medium text-gray-800">
          {getWeekLabel(currentWeekOffset)}
        </div>
        <div className="text-xs text-gray-500">
          {getWeekDateRange(currentWeekOffset)}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        disabled={currentWeekOffset >= 0}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-800 disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Utility function to filter entries by week offset
export function filterEntriesByWeek<T extends { date: string }>(entries: T[], weekOffset: number): T[] {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  
  const targetWeekStart = new Date(currentWeekStart);
  targetWeekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
  
  const targetWeekEnd = new Date(targetWeekStart);
  targetWeekEnd.setDate(targetWeekStart.getDate() + 6);
  targetWeekEnd.setHours(23, 59, 59, 999); // End of day
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= targetWeekStart && entryDate <= targetWeekEnd;
  });
}

// Utility function to get week range dates
export function getWeekRange(weekOffset: number) {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  
  const targetWeekStart = new Date(currentWeekStart);
  targetWeekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
  
  const targetWeekEnd = new Date(targetWeekStart);
  targetWeekEnd.setDate(targetWeekStart.getDate() + 6);
  
  return { start: targetWeekStart, end: targetWeekEnd };
}