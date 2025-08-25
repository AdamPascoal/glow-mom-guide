import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { WeekNavigator, filterEntriesByWeek } from "@/components/ui/week-navigator";
import { Heart, Users, Baby, Bed, History, Calendar, Zap, Brain, Shield, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const overallMoods = [
  { emoji: "😔", label: "Very Low", value: 1 },
  { emoji: "😕", label: "Low", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😄", label: "Very Good", value: 5 },
];

const moodDimensions = [
  {
    id: "overallMood",
    title: "Overall Mood",
    icon: Smile,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    description: "Quick snapshot of daily emotional state",
    labels: ["Very Low 😔", "Low 😕", "Neutral 😐", "Good 🙂", "Very Good 😄"]
  },
  {
    id: "energy",
    title: "Energy / Fatigue",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "How physical state and rest affect mood",
    labels: ["Exhausted", "Low", "Moderate", "Good", "Energized"]
  },
  {
    id: "stress",
    title: "Stress / Anxiety",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Identifies spikes in worry, stress, or overwhelm",
    labels: ["Calm", "Slight", "Moderate", "High", "Overwhelmed"]
  },
  {
    id: "calmness",
    title: "Calmness / Irritability",
    icon: Heart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Captures hormonal shifts, sleep effects, or tension",
    labels: ["Irritable", "Tense", "Neutral", "Peaceful", "Very Calm"]
  },
  {
    id: "emotionalStability",
    title: "Emotional Stability",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Helps spot mood swings that may signal postpartum concerns",
    labels: ["Very Moody", "Moody", "Neutral", "Stable", "Very Stable"]
  }
];

const reasonTags = [
  { label: "Partner", icon: Heart },
  { label: "Body Changes", icon: Baby },
  { label: "Hormonal", icon: Users },
  { label: "Sleep", icon: Bed },
];

const getMultiDimensionalAdvice = (values: typeof moodValues, reason?: string) => {
  const { overallMood, energy, stress, calmness, emotionalStability } = values;
  
  // Priority advice based on concerning patterns
  if (stress >= 4 && calmness <= 2) {
    return "High stress and irritability detected. Consider deep breathing exercises or prenatal yoga to help regulate your nervous system.";
  }
  
  if (energy <= 2 && overallMood <= 2) {
    return "Low energy and mood may indicate need for more rest. Ensure adequate sleep and consider gentle movement like walking.";
  }
  
  if (emotionalStability <= 2) {
    return "Mood swings are common during pregnancy. Consider tracking patterns and discuss with your healthcare provider if concerning.";
  }
  
  if (overallMood >= 4 && energy >= 4) {
    return "Great mood and energy levels! This positive state supports both your well-being and baby's development.";
  }
  
  return "Thank you for tracking your mood across multiple dimensions. This comprehensive data helps identify patterns in your emotional wellness.";
};

interface MoodEntry {
  id: string;
  overallMood: number;
  energy: number;
  stress: number;
  calmness: number;
  emotionalStability: number;
  reasons: string[];
  notes: string;
  date: string;
  timestamp: number;
}

export function MoodTracker() {
  const [moodValues, setMoodValues] = useState({
    overallMood: 3,
    energy: 3,
    stress: 3,
    calmness: 3,
    emotionalStability: 3
  });
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const { toast } = useToast();

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleMoodChange = (dimensionId: string, value: number[]) => {
    setMoodValues(prev => ({
      ...prev,
      [dimensionId]: value[0]
    }));
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      overallMood: moodValues.overallMood,
      energy: moodValues.energy,
      stress: moodValues.stress,
      calmness: moodValues.calmness,
      emotionalStability: moodValues.emotionalStability,
      reasons: selectedReasons,
      notes: notes,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    
    const advice = getMultiDimensionalAdvice(moodValues, selectedReasons[0]);
    
    toast({
      title: "Mood logged! 💚",
      description: advice,
      duration: 6000,
    });

    // Reset form
    setMoodValues({
      overallMood: 3,
      energy: 3,
      stress: 3,
      calmness: 3,
      emotionalStability: 3
    });
    setSelectedReasons([]);
    setNotes("");
  };

  const getMoodEmoji = (overallMood: number) => {
    const moodObj = overallMoods.find(m => m.value === overallMood);
    return moodObj ? moodObj.emoji : "😐";
  };

  const getMoodLabel = (overallMood: number) => {
    const moodObj = overallMoods.find(m => m.value === overallMood);
    return moodObj ? moodObj.label : `Level ${overallMood}`;
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 pb-24 max-w-full overflow-x-hidden">

      {/* Multi-dimensional Mood Tracker */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          How are you feeling today?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Rate each dimension on a scale of 1-5 to get a comprehensive view of your emotional wellness
        </p>
        
        <div className="space-y-6">
          {moodDimensions.map((dimension) => {
            const IconComponent = dimension.icon;
            const currentValue = moodValues[dimension.id as keyof typeof moodValues];
            
            return (
              <div key={dimension.id} className="bg-white rounded-2xl border border-border p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${dimension.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${dimension.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      {dimension.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {dimension.description}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {dimension.id === 'overallMood' ? getMoodEmoji(currentValue) : currentValue}
                  </div>
                </div>
                
                <div className="mb-3">
                  <Slider
                    value={[currentValue]}
                    onValueChange={(value) => handleMoodChange(dimension.id, value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span className="text-center font-medium">
                    {dimension.labels[currentValue - 1]}
                  </span>
                  <span>5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Mood Entry Button */}
      <div className="mb-8 flex justify-center">
        <button 
          onClick={handleSubmit}
          className="bg-[#F28CAB] hover:bg-[#E07A9F] text-white font-semibold 
                   py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg transition-all duration-200 
                   min-h-[50px] sm:min-h-[56px] active:scale-98 hover:shadow-xl text-sm sm:text-base"
        >
          Log Mood Entry
        </button>
      </div>

      {/* Mood History Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Weekly Mood History
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Review your mood entries and patterns by week
        </p>
        
        <div className="mb-4">
          <WeekNavigator 
            currentWeekOffset={currentWeekOffset}
            onWeekChange={setCurrentWeekOffset}
            className="bg-pink-50/50 border-pink-200/50"
          />
        </div>
        
        {(() => {
          const weeklyMoods = filterEntriesByWeek(moodHistory, currentWeekOffset);
          const sortedWeeklyMoods = weeklyMoods.sort((a, b) => b.timestamp - a.timestamp);
          
          return sortedWeeklyMoods.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-border">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                {currentWeekOffset === 0 ? "No mood entries this week" : "No mood entries for this week"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground px-4">
                {currentWeekOffset === 0 ? "Start tracking your mood to see patterns and insights" : "Try selecting a different week"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedWeeklyMoods.map((entry) => (
                <div key={entry.id} className="bg-white rounded-2xl border border-border p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-xl sm:text-2xl">{getMoodEmoji(entry.overallMood)}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground text-sm sm:text-base">{getMoodLabel(entry.overallMood)}</h3>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mood Dimensions Summary */}
                  <div className="mb-2 sm:mb-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Energy: {entry.energy}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Stress: {entry.stress}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Calm: {entry.calmness}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Stable: {entry.emotionalStability}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  {entry.reasons.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {entry.reasons.map((reason, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full whitespace-nowrap">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {entry.notes && (
                    <div className="text-xs sm:text-sm text-muted-foreground bg-accent/50 rounded-lg p-2 sm:p-3 break-words">
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}