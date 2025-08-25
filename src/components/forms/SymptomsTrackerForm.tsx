import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { SymptomsTracker } from "@/components/SymptomsTracker";
import { useToast } from "@/hooks/use-toast";

export default function SymptomsTrackerForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/trackers');
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    
    // Simulate saving symptoms data
    setTimeout(() => {
      toast({
        title: "Symptoms Tracked! 📊",
        description: "Your symptom data has been successfully recorded.",
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
        </div>

        {/* Symptoms Tracker Card */}
        <div className="mb-6">
          <SymptomsTracker />
        </div>

      </div>
    </div>
  );
}