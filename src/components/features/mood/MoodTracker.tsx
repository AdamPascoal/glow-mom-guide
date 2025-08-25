import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Users, Baby, Bed, History, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { emoji: "😍", label: "Happy", value: "happy" },
  { emoji: "🙂", label: "Content", value: "content" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "🥲", label: "Sad", value: "sad" },
  { emoji: "😠", label: "Angry", value: "angry" },
];

const reasonTags = [
  { label: "Partner", icon: Heart },
  { label: "Body Changes", icon: Baby },
  { label: "Hormonal", icon: Users },
  { label: "Sleep", icon: Bed },
];

const getMoodAdvice = (mood: string, reason?: string) => {
  const adviceMap = {
    happy: "Great! Positive emotions support oxytocin and lower cortisol. Keep it up with light movement.",
    content: "Wonderful! This balanced mood supports both your well-being and baby's development.",
    neutral: "Flat mood could indicate overwhelm. Want a resource on prenatal anxiety?",
    sad: "Persistent sadness could be hormonal or emotional. Consider 5-7 minutes of mindful breathing.",
    angry: reason === "Partner" 
      ? "Relationship strain is common. Try gratitude journaling or a 1-on-1 with your partner."
      : "It's normal to feel frustrated. Take deep breaths and consider gentle movement to release tension."
  };
  return adviceMap[mood as keyof typeof adviceMap] || "Thank you for tracking your mood. This helps you stay aware of your emotional patterns.";
};

interface MoodEntry {
  id: string;
  mood: string;
  reasons: string[];
  notes: string;
  date: string;
  timestamp: number;
}

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const { toast } = useToast();

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      reasons: selectedReasons,
      notes: notes,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };

    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    
    const advice = getMoodAdvice(selectedMood, selectedReasons[0]);
    
    toast({
      title: "Mood logged! 💚",
      description: advice,
      duration: 6000,
    });

    // Reset form
    setSelectedMood("");
    setSelectedReasons([]);
    setNotes("");
  };

  const getMoodEmoji = (mood: string) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.emoji : "😐";
  };

  const getMoodLabel = (mood: string) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.label : mood;
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 pb-24 max-w-full overflow-x-hidden">

      {/* Mood Selector Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          How are you feeling today?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the emoji that best represents your current mood
        </p>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`
                relative p-2 sm:p-4 rounded-2xl text-center transition-all duration-200 
                min-h-[70px] sm:min-h-[80px] w-full touch-manipulation
                ${selectedMood === mood.value 
                  ? 'bg-accent scale-105 shadow-lg border-2 border-primary' 
                  : 'bg-white border border-border hover:scale-105 hover:shadow-md active:scale-95'
                }
              `}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{mood.emoji}</div>
              <div className="text-xs font-medium text-foreground">
                {mood.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contributing Factors Section */}
      {selectedMood && (
        <div className="mb-8 animate-in fade-in duration-300">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            What might be contributing? (Optional)
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {reasonTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => toggleReason(tag.label)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium
                  transition-all duration-200 touch-manipulation min-h-[40px] sm:min-h-[44px]
                  ${selectedReasons.includes(tag.label)
                    ? 'bg-secondary text-secondary-foreground border-2 border-primary shadow-sm' 
                    : 'bg-white text-foreground border border-border hover:bg-accent hover:shadow-sm'
                  }
                `}
              >
                <tag.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes Section */}
      {selectedMood && (
        <div className="mb-8 animate-in fade-in duration-500">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Additional notes (Optional)
          </h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any specific thoughts or concerns..."
            className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base bg-white rounded-2xl border-border resize-none w-full"
          />
        </div>
      )}

      {/* Mood History Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Mood History
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Review your past mood entries and patterns
        </p>
        
        {moodHistory.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-border">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No mood entries yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground px-4">Start tracking your mood to see patterns and insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodHistory.slice(0, 10).map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl border border-border p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl">{getMoodEmoji(entry.mood)}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground text-sm sm:text-base">{getMoodLabel(entry.mood)}</h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{entry.date}</span>
                      </div>
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
            
            {moodHistory.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing latest 10 entries out of {moodHistory.length} total
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      {selectedMood && (
        <div className="fixed bottom-20 left-2 right-2 sm:left-4 sm:right-4 animate-in fade-in duration-700 z-50">
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#F28CAB] hover:bg-[#E07A9F] text-white font-semibold 
                     py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-200 
                     min-h-[50px] sm:min-h-[56px] active:scale-98 hover:shadow-xl text-sm sm:text-base"
          >
            Log Mood Entry
          </button>
        </div>
      )}
    </div>
  );
}