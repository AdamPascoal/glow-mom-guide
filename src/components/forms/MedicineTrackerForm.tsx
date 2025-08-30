import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, ArrowLeft, Check, History, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const predefinedMedicines = [
  { name: "Folic Acid", defaultDosage: "400", unit: "mcg" },
  { name: "Prenatal Multivitamin", defaultDosage: "1", unit: "capsule" },
  { name: "Iron Supplement", defaultDosage: "27", unit: "mg" },
  { name: "Calcium", defaultDosage: "1000", unit: "mg" },
  { name: "Vitamin D", defaultDosage: "1000", unit: "IU" },
  { name: "DHA / Omega-3", defaultDosage: "200", unit: "mg" },
  { name: "Magnesium", defaultDosage: "350", unit: "mg" },
  { name: "Probiotic", defaultDosage: "1", unit: "capsule" },
  { name: "Vitamin B12", defaultDosage: "2.6", unit: "mcg" },
  { name: "Zinc", defaultDosage: "11", unit: "mg" },
  { name: "Vitamin C", defaultDosage: "85", unit: "mg" },
  { name: "Biotin", defaultDosage: "30", unit: "mcg" },
  { name: "Choline", defaultDosage: "450", unit: "mg" }
];

interface Medicine {
  name: string;
  defaultDosage: string;
  unit: string;
}

interface MedicineHistoryEntry {
  date: string;
  medicines: string[];
  timestamp: number;
}

export default function MedicineTrackerForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkedMedicines, setCheckedMedicines] = useState<string[]>([]);
  const [medicineHistory, setMedicineHistory] = useState<MedicineHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentDate] = useState(new Date());

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicineHistory');
    if (savedHistory) {
      setMedicineHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Load today's medicines from history if they exist
  useEffect(() => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const todayEntry = medicineHistory.find(entry => entry.date === today);
    if (todayEntry) {
      setCheckedMedicines(todayEntry.medicines);
    }
  }, [medicineHistory, currentDate]);

  const toggleMedicine = (medicineName: string) => {
    setCheckedMedicines(prev => 
      prev.includes(medicineName) 
        ? prev.filter(name => name !== medicineName)
        : [...prev, medicineName]
    );
  };

  const handleSave = () => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const newEntry: MedicineHistoryEntry = {
      date: today,
      medicines: [...checkedMedicines],
      timestamp: Date.now()
    };

    // Update history - replace today's entry if it exists, otherwise add new
    const updatedHistory = medicineHistory.filter(entry => entry.date !== today);
    updatedHistory.push(newEntry);
    
    // Sort by date (newest first) and keep last 30 days
    const sortedHistory = updatedHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 30);
    
    setMedicineHistory(sortedHistory);
    localStorage.setItem('medicineHistory', JSON.stringify(sortedHistory));
    
    toast({
      title: "Medicine tracker saved! 💊",
      description: `${checkedMedicines.length} medicines marked as taken today`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-green-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/trackers?tab=tasks")}
              className="hover:bg-green-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Medicine Tracker</h1>
              <p className="text-sm text-gray-600">Check off your daily medications</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Medicine Checklist */}
        <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              Daily Medicine Checklist
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {checkedMedicines.length} of {predefinedMedicines.length} completed
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs px-2 py-1 h-7 border-green-300 text-green-700 hover:bg-green-50"
              >
                <History className="w-3 h-3 mr-1" />
                History
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {predefinedMedicines.map((medicine) => {
              const isChecked = checkedMedicines.includes(medicine.name);
              return (
                <div
                  key={medicine.name}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    isChecked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    id={medicine.name}
                    checked={isChecked}
                    onCheckedChange={() => toggleMedicine(medicine.name)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={medicine.name}
                      className={`font-medium cursor-pointer ${
                        isChecked ? 'text-green-800 line-through' : 'text-gray-800'
                      }`}
                    >
                      {medicine.name}
                    </label>
                    <p className={`text-sm ${isChecked ? 'text-green-600' : 'text-gray-600'}`}>
                      {medicine.defaultDosage} {medicine.unit}
                    </p>
                  </div>
                  {isChecked && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
              disabled={checkedMedicines.length === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Progress ({checkedMedicines.length} medicines)
            </Button>
          </div>
        </Card>

        {/* Medicine History */}
        {showHistory && (
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-green-600" />
                Medicine History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </Button>
            </div>
            
            {medicineHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No medicine history yet</p>
                <p className="text-sm">Start tracking your medicines to see history here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {medicineHistory.map((entry) => {
                  const entryDate = new Date(entry.timestamp);
                  const isToday = entry.date === format(currentDate, 'yyyy-MM-dd');
                  
                  return (
                    <div
                      key={entry.date}
                      className={`p-4 rounded-lg border ${
                        isToday ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-800">
                            {isToday ? 'Today' : format(entryDate, 'MMM dd, yyyy')}
                          </span>
                          {isToday && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.medicines.length} medicines taken
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {entry.medicines.map((medicineName) => {
                          const medicine = predefinedMedicines.find(m => m.name === medicineName);
                          return (
                            <div
                              key={medicineName}
                              className="flex items-center gap-2 text-sm p-2 bg-white rounded border border-gray-100"
                            >
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="font-medium">{medicineName}</span>
                              {medicine && (
                                <span className="text-gray-500 text-xs">
                                  {medicine.defaultDosage} {medicine.unit}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {entry.medicines.length === 0 && (
                        <div className="text-sm text-gray-500 italic">
                          No medicines taken this day
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

