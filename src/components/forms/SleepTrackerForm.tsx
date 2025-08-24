import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Moon } from "lucide-react";
import { SleepTracker } from "@/components/features/sleep/SleepTracker";
import { useToast } from "@/hooks/use-toast";

export default function SleepTrackerForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/trackers');
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    
    // Simulate saving sleep data
    setTimeout(() => {
      toast({
        title: "Sleep Tracked! 🌙",
        description: "Your sleep patterns have been successfully recorded.",
        duration: 3000,
      });
      
      setIsSubmitting(false);
      navigate('/trackers');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 h-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
              Track Your Sleep
            </h1>
            <p className="text-muted-foreground">
              Monitor your rest patterns for optimal wellness
            </p>
          </div>
        </div>

        {/* Sleep Tracker Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-100">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              How did you sleep last night?
            </h3>
          </div>

          {/* Sleep Tracker Component */}
          <SleepTracker />
        </Card>

        {/* Complete Button */}
        <div className="flex justify-center md:justify-end">
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Moon className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Complete Tracking"}
          </Button>
        </div>
      </div>
    </div>
  );
}