import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeekNavigator, filterEntriesByWeek } from "@/components/ui/week-navigator";
import { AlertTriangle, Plus, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: number;
  notes?: string;
  date: string;
  time: string;
}

const commonSymptoms = [
  "Morning Sickness",
  "Nausea",
  "Fatigue",
  "Back Pain",
  "Headache",
  "Heartburn",
  "Constipation",
  "Swelling",
  "Leg Cramps",
  "Braxton Hicks",
  "Shortness of Breath",
  "Frequent Urination",
  "Breast Tenderness",
  "Dizziness",
  "Round Ligament Pain",
  "Insomnia",
  "Mood Changes",
  "Food Cravings",
  "Food Aversions",
  "Skin Changes"
];

const getSeverityColor = (severity: number) => {
  if (severity <= 1) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
  if (severity <= 2) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
  if (severity <= 3) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
  return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
};

const getSeverityLabel = (severity: number) => {
  const labels = ['', 'Mild', 'Moderate', 'Uncomfortable', 'Severe'];
  return labels[severity] || 'Unknown';
};

export function SymptomsTracker() {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");
  const [customSymptom, setCustomSymptom] = useState<string>("");
  const [severity, setSeverity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const savedSymptoms = localStorage.getItem("pregnancy-symptoms");
    if (savedSymptoms) {
      setSymptoms(JSON.parse(savedSymptoms));
    }
  }, []);

  const saveSymptoms = (newSymptoms: SymptomEntry[]) => {
    localStorage.setItem("pregnancy-symptoms", JSON.stringify(newSymptoms));
    setSymptoms(newSymptoms);
  };

  const addSymptom = () => {
    let symptomName = selectedSymptom;
    
    // If "Other" is selected, use the custom symptom name
    if (selectedSymptom === "Other") {
      if (!customSymptom.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter a custom symptom name.",
          variant: "destructive"
        });
        return;
      }
      symptomName = customSymptom.trim();
    }
    
    if (!symptomName || !severity) {
      toast({
        title: "Missing Information",
        description: "Please select a symptom and severity level.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const newSymptom: SymptomEntry = {
      id: Date.now().toString(),
      symptom: symptomName,
      severity,
      notes: notes.trim() || undefined,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSymptoms = [newSymptom, ...symptoms];
    saveSymptoms(updatedSymptoms);

    toast({
      title: "Symptom Recorded",
      description: `${symptomName} (${getSeverityLabel(severity)}) has been tracked.`,
      duration: 3000
    });

    // Reset form
    setSelectedSymptom("");
    setCustomSymptom("");
    setSeverity(1);
    setNotes("");
  };

  const deleteSymptom = (id: string) => {
    const updatedSymptoms = symptoms.filter(s => s.id !== id);
    saveSymptoms(updatedSymptoms);
    
    toast({
      title: "Symptom Removed",
      description: "Symptom entry has been deleted.",
      duration: 2000
    });
  };

  const weeklySymptoms = filterEntriesByWeek(symptoms, currentWeekOffset);
  const sortedWeeklySymptoms = weeklySymptoms.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

  return (
    <Card className="p-6 space-y-6 bg-white border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Symptom Tracker
        </h3>
        <p className="text-sm text-muted-foreground">
          Monitor pregnancy symptoms 
        </p>
      </div>

      {/* Add Symptom Form - Always Visible */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
        <h4 className="font-medium text-gray-800 text-center">Record New Symptom</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Symptom
            </label>
            <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Choose a symptom" />
              </SelectTrigger>
              <SelectContent 
                className="max-h-[500px] w-[450px] max-w-[95vw]" 
                align="center"
                side="bottom"
                sideOffset={8}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-3">
                  {commonSymptoms.map((symptom) => (
                    <SelectItem 
                      key={symptom} 
                      value={symptom} 
                      className="text-base py-4 px-4 cursor-pointer hover:bg-orange-50 rounded-lg m-1 min-h-[48px] flex items-center"
                    >
                      {symptom}
                    </SelectItem>
                  ))}
                  <SelectItem 
                    value="Other" 
                    className="text-base py-4 px-4 cursor-pointer hover:bg-orange-100 rounded-lg m-1 min-h-[48px] flex items-center font-medium bg-orange-50 border border-orange-200"
                  >
                    Other (Custom)
                  </SelectItem>
                </div>
              </SelectContent>
            </Select>
            
            {/* Custom Symptom Input Field */}
            {selectedSymptom === "Other" && (
              <div className="mt-4 animate-in fade-in duration-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter Custom Symptom
                </label>
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Type your symptom name..."
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  autoFocus
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Intensity Level (1-5)
            </label>
            <Select value={severity.toString()} onValueChange={(value) => setSeverity(parseInt(value))}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" className="text-base py-3">1 - Mild</SelectItem>
                <SelectItem value="2" className="text-base py-3">2 - Moderate</SelectItem>
                <SelectItem value="3" className="text-base py-3">3 - Uncomfortable</SelectItem>
                <SelectItem value="4" className="text-base py-3">4 - Distressing</SelectItem>
                <SelectItem value="5" className="text-base py-3">5 - Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details about the symptom..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={addSymptom} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            disabled={!selectedSymptom || (selectedSymptom === "Other" && !customSymptom.trim())}
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Symptom
          </Button>
        </div>
      </div>

      {/* Weekly Symptoms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">Weekly Entries</h4>
        </div>
        
        <WeekNavigator 
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          className="bg-gray-50 border-gray-200"
        />
        
        {sortedWeeklySymptoms.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base text-gray-600 mb-2">
              {currentWeekOffset === 0 ? "No symptoms recorded this week" : "No symptoms recorded for this week"}
            </p>
            <p className="text-sm text-gray-500">
              {currentWeekOffset === 0 ? "Start tracking symptoms to monitor patterns" : "Try selecting a different week"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedWeeklySymptoms.map((symptom) => {
              const colors = getSeverityColor(symptom.severity);
              return (
                <div
                  key={symptom.id}
                  className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-800">{symptom.symptom}</span>
                      <Badge className={`${colors.bg} ${colors.text} ${colors.border} border text-xs`}>
                        {getSeverityLabel(symptom.severity)} ({symptom.severity}/5)
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(symptom.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{symptom.time}</span>
                      </div>
                    </div>
                    
                    {symptom.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {symptom.notes}
                      </p>
                    )}
                  </div>
                  
                  {currentWeekOffset === 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSymptom(symptom.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </Card>
  );
}