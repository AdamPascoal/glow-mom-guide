import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Bell, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const reminderTypes = [
  { name: "Kegel Exercises", description: "Strengthen pelvic floor muscles", icon: "💪" },
  { name: "Prenatal Yoga", description: "Gentle stretching and relaxation", icon: "🧘‍♀️" },
  { name: "Hospital Tour", description: "Visit delivery location", icon: "🏥" },
  { name: "Journaling / Affirmations", description: "Mental wellness practice", icon: "📝" },
  { name: "Meditation", description: "Mindfulness and stress relief", icon: "🧘" },
  { name: "Walking", description: "Light cardiovascular exercise", icon: "🚶‍♀️" },
  { name: "Hydration Check", description: "Drink water reminder", icon: "💧" },
  { name: "Breathing Exercises", description: "Deep breathing practice", icon: "🫁" },
  { name: "Rest/Nap Time", description: "Scheduled rest period", icon: "😴" },
  { name: "Other", description: "Custom wellness activity", icon: "✨" }
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every other day" },
  { value: "3-times-week", label: "3 times a week" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" }
];

const timeOfDayOptions = [
  "Morning (6-10 AM)",
  "Late Morning (10 AM-12 PM)",
  "Afternoon (12-4 PM)",
  "Evening (4-8 PM)",
  "Night (8-10 PM)",
  "Custom time"
];

export default function PersonalReminderForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    reminderType: "",
    customType: "",
    frequency: "",
    customFrequency: "",
    timeOfDay: "",
    customTime: "",
    duration: "",
    notes: "",
    enableNotifications: true,
    specificDays: [] as string[],
    goalStreak: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day]
    }));
  };

  const selectedReminderType = reminderTypes.find(type => type.name === formData.reminderType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderName = formData.reminderType === "Other" ? formData.customType : formData.reminderType;
    
    if (!reminderName || !formData.frequency || !formData.timeOfDay) {
      toast({
        title: "Missing required fields",
        description: "Please fill in reminder type, frequency, and time of day",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const task = {
        id: Date.now().toString(),
        type: 'personal-reminder' as const,
        title: reminderName,
        status: 'pending' as const,
        data: {
          ...formData,
          finalReminderName: reminderName,
          finalFrequency: formData.frequency === "custom" ? formData.customFrequency : formData.frequency,
          finalTimeOfDay: formData.timeOfDay === "Custom time" ? formData.customTime : formData.timeOfDay
        },
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
      existingTasks.push(task);
      localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));

      toast({
        title: "Reminder set! 🔔",
        description: `${reminderName} reminder has been added to your wellness routine`,
        duration: 5000,
      });

      navigate('/my-tasks');
    } catch (error) {
      toast({
        title: "Error saving reminder",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Personal Reminder</h1>
              <p className="text-sm text-gray-600">Set wellness reminders</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reminder Type Selection */}
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Choose Wellness Activity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reminderTypes.map((type) => (
                <div
                  key={type.name}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${formData.reminderType === type.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300 bg-white'
                    }
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, reminderType: type.name }))}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{type.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm mb-1">
                        {type.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {type.description}
                      </div>
                    </div>
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${formData.reminderType === type.name
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {formData.reminderType === type.name && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.reminderType === "Other" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="customType">Specify Custom Activity</Label>
                <Input
                  id="customType"
                  value={formData.customType}
                  onChange={(e) => setFormData(prev => ({ ...prev, customType: e.target.value }))}
                  placeholder="e.g., Read pregnancy book, Call mom"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            )}
          </Card>

          {/* Frequency & Timing */}
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Schedule & Frequency
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeOfDay">Time of Day *</Label>
                  <Select 
                    value={formData.timeOfDay} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, timeOfDay: value }))}
                  >
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="When?" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOfDayOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.frequency === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customFrequency">Custom Frequency</Label>
                  <Input
                    id="customFrequency"
                    value={formData.customFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, customFrequency: e.target.value }))}
                    placeholder="e.g., Every Monday and Wednesday"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              )}
              
              {formData.timeOfDay === "Custom time" && (
                <div className="space-y-2">
                  <Label htmlFor="customTime">Specific Time</Label>
                  <Input
                    id="customTime"
                    type="time"
                    value={formData.customTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTime: e.target.value }))}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (optional)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 15 minutes, 30 minutes"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
          </Card>

          {/* Specific Days (for weekly+ frequencies) */}
          {(formData.frequency === "weekly" || formData.frequency === "3-times-week") && (
            <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Specific Days
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
                      ${formData.specificDays.includes(day)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-purple-200 hover:border-purple-300 bg-white'
                      }
                    `}
                    onClick={() => handleDayToggle(day)}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {day.slice(0, 3)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Goals & Settings */}
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Goals & Settings
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalStreak">Goal Streak (days)</Label>
                <Input
                  id="goalStreak"
                  type="number"
                  value={formData.goalStreak}
                  onChange={(e) => setFormData(prev => ({ ...prev, goalStreak: e.target.value }))}
                  placeholder="e.g., 7, 30"
                  className="border-purple-200 focus:border-purple-400"
                />
                <p className="text-xs text-gray-600">Set a goal for consecutive days to build a healthy habit</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableNotifications"
                  checked={formData.enableNotifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableNotifications: !!checked }))}
                  className="border-purple-300 data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="enableNotifications" className="text-sm">
                  Enable push notifications for this reminder
                </Label>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 border-purple-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Notes & Motivation
            </h2>
            
            <div className="space-y-2">
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any personal notes, motivations, or specific instructions for this activity..."
                className="border-purple-200 focus:border-purple-400 min-h-[100px]"
              />
            </div>
            
            {selectedReminderType && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{selectedReminderType.icon}</span>
                  <span className="font-medium text-purple-800">Wellness Tip</span>
                </div>
                <p className="text-sm text-purple-700">
                  {getWellnessTip(selectedReminderType.name)}
                </p>
              </div>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/add-task")}
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Set Reminder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getWellnessTip(reminderType: string): string {
  const tips: Record<string, string> = {
    "Kegel Exercises": "Perform 3 sets of 10-15 repetitions daily. Contract pelvic muscles for 3-5 seconds, then relax. Helps prepare for delivery and prevents incontinence.",
    "Prenatal Yoga": "Focus on gentle poses that open hips and strengthen core. Avoid lying flat on back after first trimester. Practice deep breathing throughout.",
    "Hospital Tour": "Ask about pain management options, labor positions, and what to bring. Visit the nursery and parking facilities too.",
    "Journaling / Affirmations": "Write about your feelings, hopes, and concerns. Positive affirmations can reduce anxiety and build confidence for motherhood.",
    "Meditation": "Even 5-10 minutes daily can reduce stress hormones and improve sleep quality. Try pregnancy-specific guided meditations.",
    "Walking": "Aim for 30 minutes of moderate walking. It's safe throughout pregnancy and helps with circulation, mood, and stamina for labor.",
    "Hydration Check": "Aim for 8-10 glasses of water daily during pregnancy. Proper hydration supports increased blood volume and prevents constipation.",
    "Breathing Exercises": "Practice deep diaphragmatic breathing. It increases oxygen flow to baby and helps manage labor pain naturally.",
    "Rest/Nap Time": "Listen to your body. Growing a baby is exhausting work! Rest helps prevent pregnancy complications and supports fetal development."
  };
  
  return tips[reminderType] || "Consistent self-care practices during pregnancy support both your health and your baby's development.";
}