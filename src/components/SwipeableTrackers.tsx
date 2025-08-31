import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Heart, Moon, Calendar, Pill, FileText, Bell, AlertTriangle, ChevronLeft, ChevronRight, Clock, Plus, Check, X, History, Pencil } from "lucide-react";
import { MoodTracker } from "@/components/features/mood/MoodTracker";
import { SleepTracker } from "@/components/features/sleep/SleepTracker";
import { SymptomsTracker } from "@/components/SymptomsTracker";
import { useToast } from "@/hooks/use-toast";
import { useMotherhoodStage } from "@/contexts/MotherhoodStageContext";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";

// Form data and helper constants
const specialties = [
  "OB/GYN",
  "Pediatrician", 
  "Nutritionist",
  "Endocrinologist",
  "Psychiatrist",
  "Cardiologist",
  "Dermatologist",
  "Other"
];

const appointmentTypes = [
  "Prenatal Checkup",
  "Ultrasound Scan", 
  "Blood Test",
  "Glucose Screening",
  "Genetic Screening",
  "Anatomy Scan",
  "Growth Scan",
  "Non-Stress Test",
  "Other"
];

const medicineTypes = [
  "Prenatal Vitamin",
  "Folic Acid",
  "Iron",
  "Calcium",
  "Vitamin D",
  "Omega-3 (DHA)",
  "Vitamin B6",
  "Magnesium",
  "Zinc",
  "Other"
];

const testTypes = [
  "Blood Test",
  "Urine Test",
  "Ultrasound",
  "X-Ray",
  "MRI/CT Scan",
  "Genetic Testing",
  "Glucose Test",
  "Blood Pressure",
  "Other"
];

const reminderCategories = [
  "Medication",
  "Exercise",
  "Appointment",
  "Health Check",
  "Nutrition",
  "Self Care",
  "Other"
];

// Tracker Form Components
const DoctorAppointmentTracker = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    date: undefined as Date | undefined,
    time: "",
    appointmentTypes: [] as string[],
    location: "",
    notes: "",
    otherType: ""
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleAppointmentTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      appointmentTypes: checked 
        ? [...prev.appointmentTypes, type]
        : prev.appointmentTypes.filter(t => t !== type)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor's Name *</Label>
          <Input
            id="doctorName"
            value={formData.doctorName}
            onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
            placeholder="Dr. Smith"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty *</Label>
          <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Appointment Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({...formData, date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Appointment Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {appointmentTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.appointmentTypes.includes(type)}
                onCheckedChange={(checked) => handleAppointmentTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location/Address</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Hospital or clinic address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any special instructions or reminders..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

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

const dosageUnits = ["mg", "mcg", "IU", "ml", "capsule", "tablet", "drops", "gummies"];

interface MedicineHistoryEntry {
  date: string;
  medicines: string[];
  timestamp: number;
}

const MedicineTracker = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
  const [checkedMedicines, setCheckedMedicines] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<Array<{name: string, defaultDosage: string, unit: string}>>([]);
  const [userMedicines, setUserMedicines] = useState<Array<{name: string, defaultDosage: string, unit: string}>>([]);
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);
  const [medicineHistory, setMedicineHistory] = useState<MedicineHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllQuickMedicines, setShowAllQuickMedicines] = useState(false); // no longer shown; kept to avoid wider refactor
  const [currentDate] = useState(new Date());
  const [historyIndex, setHistoryIndex] = useState(0);

  const allMedicines = [...selectedMedicines];

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicineHistory');
    if (savedHistory) {
      setMedicineHistory(JSON.parse(savedHistory));
    }
    const savedUserMeds = localStorage.getItem('userMedicines');
    if (savedUserMeds) {
      try { setUserMedicines(JSON.parse(savedUserMeds)); } catch {}
    }
    const savedSelected = localStorage.getItem('selectedMedicines');
    if (savedSelected) {
      try { setSelectedMedicines(JSON.parse(savedSelected)); } catch {}
    }
  }, []);

  // Keep inline history focused on today's entry when available, otherwise most recent
  useEffect(() => {
    if (medicineHistory.length === 0) {
      setHistoryIndex(0);
      return;
    }
    const todayKey = format(currentDate, 'yyyy-MM-dd');
    const idx = medicineHistory.findIndex(e => e.date === todayKey);
    setHistoryIndex(idx >= 0 ? idx : 0);
  }, [medicineHistory, currentDate]);

  // Load today's medicines from history if they exist
  useEffect(() => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const todayEntry = medicineHistory.find(entry => entry.date === today);
    if (todayEntry) {
      setCheckedMedicines(todayEntry.medicines);
    }
  }, [medicineHistory, currentDate]);

  useEffect(() => {
    onDataChange({
      checkedMedicines,
      completedCount: checkedMedicines.length,
      totalCount: allMedicines.length
    });
  }, [checkedMedicines, allMedicines.length, onDataChange]);

  // persist user selections
  useEffect(() => {
    localStorage.setItem('selectedMedicines', JSON.stringify(selectedMedicines));
  }, [selectedMedicines]);
  useEffect(() => {
    localStorage.setItem('userMedicines', JSON.stringify(userMedicines));
  }, [userMedicines]);

  const toggleMedicine = (medicineName: string) => {
    setCheckedMedicines(prev => {
      const newChecked = prev.includes(medicineName) 
        ? prev.filter(name => name !== medicineName)
        : [...prev, medicineName];
      
      return newChecked;
    });
  };

  // Auto-save whenever checkedMedicines changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSaveMedicines();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [checkedMedicines]);

  const addMedicineToList = (medicine: {name: string, defaultDosage: string, unit: string}) => {
    if (!selectedMedicines.some(m => m.name === medicine.name)) {
      setSelectedMedicines(prev => [...prev, medicine]);
    }
  };

  const toggleSelectedMedicine = (medicine: {name: string, defaultDosage: string, unit: string}) => {
    setSelectedMedicines(prev => {
      const exists = prev.some(m => m.name === medicine.name);
      if (exists) {
        // Also uncheck from today's checked list so Quick Log doesn't hide a checked item
        setCheckedMedicines(cm => cm.filter(n => n !== medicine.name));
        return prev.filter(m => m.name !== medicine.name);
      }
      return [...prev, medicine];
    });
  };

  const updateSelectedMedicine = (medicine: {name: string, defaultDosage: string, unit: string}) => {
    setSelectedMedicines(prev => prev.map(m => m.name === medicine.name ? medicine : m));
    // if user-defined version exists, update it too
    setUserMedicines(prev => {
      const exists = prev.some(m => m.name === medicine.name);
      return exists ? prev.map(m => m.name === medicine.name ? medicine : m) : prev;
    });
  };

  const addCustomMedicine = (medicine: {name: string, defaultDosage: string, unit: string}) => {
    if (!medicine.name.trim()) return;
    // prevent duplicates by name (override user-defined, not predefined)
    setUserMedicines(prev => {
      const filtered = prev.filter(m => m.name !== medicine.name);
      return [...filtered, medicine];
    });
    if (!selectedMedicines.some(m => m.name === medicine.name)) {
      setSelectedMedicines(prev => [...prev, medicine]);
    }
  };

  // Quick toggle from inline history checklist: DOES NOT alter main daily checklist
  const quickToggleToday = (medicine: {name: string, defaultDosage: string, unit: string}) => {
    const willCheck = !checkedMedicines.includes(medicine.name);
    setCheckedMedicines(prev => (
      willCheck ? [...prev, medicine.name] : prev.filter(n => n !== medicine.name)
    ));
  };

  const handleSaveMedicines = () => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const newEntry: MedicineHistoryEntry = {
      date: today,
      medicines: [...checkedMedicines],
      timestamp: Date.now()
    };

    // Update history - replace today's entry if it exists, otherwise add new
    setMedicineHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(entry => entry.date !== today);
      updatedHistory.push(newEntry);
      
      // Sort by date (newest first) and keep last 30 days
      const sortedHistory = updatedHistory
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30);
      
      localStorage.setItem('medicineHistory', JSON.stringify(sortedHistory));
      return sortedHistory;
    });
  };

  return (
    <div className="space-y-4">
      {/* Medicine Selector Card */}
      {showMedicineSelector && (
        <MedicineSelectorCard
          onClose={() => setShowMedicineSelector(false)}
          medicines={[...userMedicines, ...predefinedMedicines.filter(p => !userMedicines.some(u => u.name === p.name))]}
          onToggleMedicine={toggleSelectedMedicine}
          onUpdateMedicine={updateSelectedMedicine}
          onAddCustomMedicine={addCustomMedicine}
          alreadySelected={selectedMedicines.map(m => m.name)}
        />
      )}

      {/* Inline Recent Medicine History Card (grouped by dates) */}
      <Card className="p-4 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center mb-3">
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <History className="w-4 h-4 text-green-600" />
            Recent Medicine History by Date
          </h4>
        </div>

        {medicineHistory.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Pill className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No entries yet. Track medicines to see them here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(() => {
              const entry = medicineHistory[historyIndex];
              const entryDate = entry ? new Date(entry.timestamp) : new Date();
              const diff = differenceInCalendarDays(currentDate, entryDate);
              const label = diff === 0
                ? 'Today'
                : diff === 1
                ? 'Yesterday'
                : format(entryDate, 'EEE, MMM dd, yyyy');
              const hasPrev = historyIndex < medicineHistory.length - 1;
              const hasNext = historyIndex > 0;
              return (
                <div key={entry?.date ?? 'current'} className="p-3 rounded-lg bg-white border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (hasPrev) setHistoryIndex(i => Math.min(i + 1, medicineHistory.length - 1)); }}
                      disabled={!hasPrev}
                      className={`p-1 rounded disabled:opacity-40 disabled:cursor-not-allowed ${hasPrev ? 'hover:bg-green-50' : ''}`}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-semibold text-gray-800">{label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (hasNext) setHistoryIndex(i => Math.max(i - 1, 0)); }}
                      disabled={!hasNext}
                      className={`p-1 rounded disabled:opacity-40 disabled:cursor-not-allowed ${hasNext ? 'hover:bg-green-50' : ''}`}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">{entry?.medicines.length ?? 0} taken</span>
                  </div>
                  {entry && entry.medicines.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entry.medicines.map((medicineName) => {
                        const medicine = predefinedMedicines.find(m => m.name === medicineName) || 
                                         selectedMedicines.find(m => m.name === medicineName);
                        return (
                          <span
                            key={medicineName}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100"
                          >
                            <Check className="w-3 h-3" />
                            {medicineName}
                            {medicine && (
                              <span className="text-[10px] text-green-600/80">
                                · {medicine.defaultDosage} {medicine.unit}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">No medicines taken</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </Card>

      {/* Quick Log Today - separate card with vertically aligned items */}
      <Card className="p-4 border-green-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-green-600" />
            <h4 className="text-base font-semibold text-gray-800">Quick Log Today</h4>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMedicineSelector(true); }}
              className="w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              aria-label="Add medicine"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedMedicines.filter(m => m.name !== 'Folic Acid').length === 0 ? (
          <div className="text-sm text-gray-500 py-3">
            No quick items yet. Use the + to add medicines.
          </div>
        ) : (
          <ul className="divide-y divide-green-100">
            {selectedMedicines
              .filter(m => m.name !== 'Folic Acid')
              .map((medicine) => {
              const isChecked = checkedMedicines.includes(medicine.name);
              return (
                <li key={medicine.name} className="py-2">
                  <label
                    className={`flex items-center gap-2 px-1 rounded-md cursor-pointer transition-colors h-10 ${
                      isChecked ? 'bg-green-50' : 'bg-transparent hover:bg-green-50'
                    }`}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => quickToggleToday(medicine)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <span className="font-medium text-sm text-gray-800 flex-1 truncate">{medicine.name}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {medicine.defaultDosage} {medicine.unit}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Medicine History */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto border border-blue-200 max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Medicine History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
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
                          isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-800">
                              {isToday ? 'Today' : format(entryDate, 'MMM dd, yyyy')}
                            </span>
                            {isToday && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
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
                            const medicine = predefinedMedicines.find(m => m.name === medicineName) || 
                                           selectedMedicines.find(m => m.name === medicineName);
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MedicineSelectorCard = ({ 
  onClose, 
  medicines,
  onToggleMedicine,
  onUpdateMedicine,
  onAddCustomMedicine,
  alreadySelected
}: { 
  onClose: () => void; 
  medicines: Array<{name: string, defaultDosage: string, unit: string}>;
  onToggleMedicine: (medicine: {name: string, defaultDosage: string, unit: string}) => void;
  onUpdateMedicine: (medicine: {name: string, defaultDosage: string, unit: string}) => void;
  onAddCustomMedicine: (medicine: {name: string, defaultDosage: string, unit: string}) => void;
  alreadySelected: string[];
}) => {
  const [newMed, setNewMed] = useState<{name: string, defaultDosage: string, unit: string}>({ name: "", defaultDosage: "", unit: dosageUnits[0] });
  const [editMap, setEditMap] = useState<Record<string, {defaultDosage: string, unit: string}>>({});
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[70vw] max-w-[800px] max-h-[70vh] mx-auto border border-green-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Medicines to Add</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Add custom medicine */}
          <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <div>
                <Label htmlFor="newMedName">Medicine name</Label>
                <Input id="newMedName" value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})} placeholder="e.g., Probiotic" />
              </div>
              <div>
                <Label htmlFor="newMedDose">Dosage</Label>
                <Input id="newMedDose" value={newMed.defaultDosage} onChange={(e) => setNewMed({...newMed, defaultDosage: e.target.value})} placeholder="e.g., 1" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Unit</Label>
                  <Select value={newMed.unit} onValueChange={(v) => setNewMed({...newMed, unit: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosageUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => { onAddCustomMedicine(newMed); setNewMed({ name: "", defaultDosage: "", unit: dosageUnits[0] }); }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            {medicines.map((medicine) => {
              const isAlreadySelected = alreadySelected.includes(medicine.name);
              return (
                <div
                  key={medicine.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isAlreadySelected 
                      ? 'bg-green-50 border-green-300 hover:bg-green-100' 
                      : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => onToggleMedicine(medicine)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{medicine.name}</h4>
                      {editMap[medicine.name] ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            className="h-8 w-24"
                            value={editMap[medicine.name].defaultDosage}
                            onChange={(e) => setEditMap(prev => ({...prev, [medicine.name]: { ...prev[medicine.name], defaultDosage: e.target.value }}))}
                          />
                          <Select
                            value={editMap[medicine.name].unit}
                            onValueChange={(v) => setEditMap(prev => ({...prev, [medicine.name]: { ...prev[medicine.name], unit: v }}))}
                          >
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dosageUnits.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                            onClick={(e) => { e.stopPropagation(); const updated = { name: medicine.name, defaultDosage: editMap[medicine.name].defaultDosage, unit: editMap[medicine.name].unit }; onUpdateMedicine(updated); setEditMap(prev => { const cp = {...prev}; delete cp[medicine.name]; return cp; }); }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {medicine.defaultDosage} {medicine.unit}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-green-50"
                        onClick={(e) => { e.stopPropagation(); setEditMap(prev => ({...prev, [medicine.name]: prev[medicine.name] || { defaultDosage: medicine.defaultDosage, unit: medicine.unit }})); }}
                        aria-label="Edit dosage"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      {isAlreadySelected ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};  

const MedicalTestTracker = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    testName: "",
    testType: "",
    scheduledDate: undefined as Date | undefined,
    location: "",
    orderingDoctor: "",
    preparationNotes: "",
    notes: "",
    otherType: ""
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testName">Test Name *</Label>
          <Input
            id="testName"
            value={formData.testName}
            onChange={(e) => setFormData({...formData, testName: e.target.value})}
            placeholder="e.g., Glucose Screening"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="testType">Test Type *</Label>
          <Select value={formData.testType} onValueChange={(value) => setFormData({...formData, testType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              {testTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Scheduled Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.scheduledDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.scheduledDate}
                onSelect={(date) => setFormData({...formData, scheduledDate: date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderingDoctor">Ordering Doctor</Label>
          <Input
            id="orderingDoctor"
            value={formData.orderingDoctor}
            onChange={(e) => setFormData({...formData, orderingDoctor: e.target.value})}
            placeholder="Dr. who ordered the test"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location/Lab</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Hospital, lab, or clinic address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparationNotes">Preparation Instructions</Label>
        <Textarea
          id="preparationNotes"
          value={formData.preparationNotes}
          onChange={(e) => setFormData({...formData, preparationNotes: e.target.value})}
          placeholder="Fasting requirements, medications to avoid, etc..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any other relevant information..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

const PersonalReminderTracker = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    dueDate: undefined as Date | undefined,
    priority: "medium",
    frequency: "once",
    notes: "",
    otherCategory: ""
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Reminder Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Take prenatal vitamin"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {reminderCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData({...formData, dueDate: date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="once">One-time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Detailed description of the reminder..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any other relevant information..."
          className="min-h-[60px]"
        />
      </div>
    </div>
  );
};

const trackerConfigs = [
  {
    id: "mood-tracker",
    title: "Track Your Mood",
    subtitle: "Record your emotional wellness for today",
    icon: Heart,
    color: "from-pink-100 to-pink-200",
    iconColor: "text-pink-600",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
    component: MoodTracker,
    completionMessage: "Mood Tracked! ✨",
    completionDescription: "Your mood has been successfully recorded.",
    isSimple: true
  },
  {
    id: "sleep-tracker", 
    title: "Track Your Sleep",
    subtitle: "Monitor your rest patterns for optimal wellness",
    icon: Moon,
    color: "from-indigo-100 to-indigo-200",
    iconColor: "text-indigo-600",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    component: SleepTracker,
    completionMessage: "Sleep Tracked! 🌙",
    completionDescription: "Your sleep patterns have been successfully recorded.",
    isSimple: true
  },
  {
    id: "symptoms-tracker",
    title: "Symptoms Tracker", 
    subtitle: "Track pregnancy symptoms and patterns",
    icon: AlertTriangle,
    color: "from-orange-100 to-orange-200",
    iconColor: "text-orange-600",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    component: SymptomsTracker,
    completionMessage: "Symptoms Tracked! 📋",
    completionDescription: "Your symptoms have been successfully recorded.",
    isSimple: true
  },
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    subtitle: "Schedule and track medical appointments",
    icon: Calendar,
    color: "from-red-100 to-red-200",
    iconColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
    component: DoctorAppointmentTracker,
    completionMessage: "Appointment Scheduled! 📅",
    completionDescription: "Your appointment has been added to your tasks.",
    isSimple: false
  },
  {
    id: "medicine-tracker",
    title: "Medicine Tracker",
    subtitle: "Track your daily medications and supplements",
    icon: Pill,
    color: "from-green-100 to-green-200",
    iconColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
    component: MedicineTracker,
    completionMessage: "Medicine Added! 💊",
    completionDescription: "Your medicine has been added to your routine.",
    isSimple: false
  },
  {
    id: "medical-test",
    title: "Medical Test",
    subtitle: "Log medical tests and results",
    icon: FileText,
    color: "from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    component: MedicalTestTracker,
    completionMessage: "Medical Test Scheduled! 🔬",
    completionDescription: "Your medical test has been added to your tasks.",
    isSimple: false
  },
  {
    id: "personal-reminder",
    title: "Personal Reminder",
    subtitle: "Set personal wellness reminders",
    icon: Bell,
    color: "from-purple-100 to-purple-200",
    iconColor: "text-purple-600",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    component: PersonalReminderTracker,
    completionMessage: "Reminder Created! 🔔",
    completionDescription: "Your personal reminder has been added.",
    isSimple: false
  }
];

export default function SwipeableTrackers() {
  const navigate = useNavigate();
  const { trackerId } = useParams();
  const { toast } = useToast();
  const { getVisibleTrackers, isTrackerVisible } = useMotherhoodStage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter trackers based on visibility
  const visibleTrackers = trackerConfigs.filter(tracker => 
    isTrackerVisible(tracker.id)
  );

  // Find current tracker index
  const currentIndex = visibleTrackers.findIndex(tracker => tracker.id === trackerId) || 0;

  useEffect(() => {
    const translateX = -currentIndex * 100;
    setCurrentTranslate(translateX);
    setPrevTranslate(translateX);
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    const translateX = prevTranslate + (diffX / window.innerWidth) * 100;
    
    // Clamp translation to valid bounds
    const maxTranslate = -(visibleTrackers.length - 1) * 100;
    const clampedTranslate = Math.max(maxTranslate, Math.min(0, translateX));
    
    setCurrentTranslate(clampedTranslate);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine which tracker to snap to
    const threshold = 25; // Minimum swipe percentage to change tracker
    const diffFromPrev = currentTranslate - prevTranslate;
    
    let newIndex = currentIndex;
    
    if (Math.abs(diffFromPrev) > threshold) {
      if (diffFromPrev < -threshold && currentIndex < visibleTrackers.length - 1) {
        newIndex = currentIndex + 1;
      } else if (diffFromPrev > threshold && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
    }
    
    const newTracker = visibleTrackers[newIndex];
    if (newTracker && newTracker.id !== trackerId) {
      navigate(`/add-task/${newTracker.id}`, { replace: true });
    } else {
      // Snap back to current position
      setCurrentTranslate(prevTranslate);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diffX = currentX - startX;
    const translateX = prevTranslate + (diffX / window.innerWidth) * 100;
    
    const maxTranslate = -(visibleTrackers.length - 1) * 100;
    const clampedTranslate = Math.max(maxTranslate, Math.min(0, translateX));
    
    setCurrentTranslate(clampedTranslate);
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const navigateToTracker = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    const newTracker = visibleTrackers[newIndex];
    
    if (newTracker) {
      navigate(`/add-task/${newTracker.id}`, { replace: true });
    }
  };

  const handleBack = () => {
    navigate('/trackers?tab=tasks');
  };

  const handleComplete = () => {
    const currentTracker = visibleTrackers[currentIndex];
    if (!currentTracker) return;

    // Only validate and save data for complex forms
    if (!currentTracker.isSimple) {
      const formData = formDataMap[currentTracker.id];
      
      // Basic validation based on tracker type
      if (currentTracker.id === 'doctor-appointment') {
        if (!formData?.doctorName || !formData?.specialty || !formData?.date) {
          toast({
            title: "Missing required fields",
            description: "Please fill in doctor name, specialty, and appointment date",
            variant: "destructive"
          });
          return;
        }
      } else if (currentTracker.id === 'medicine-tracker') {
        if (!formData?.name || !formData?.type || !formData?.dosage) {
          toast({
            title: "Missing required fields",
            description: "Please fill in name, type, and dosage",
            variant: "destructive"
          });
          return;
        }
      } else if (currentTracker.id === 'medical-test') {
        if (!formData?.testName || !formData?.testType) {
          toast({
            title: "Missing required fields",
            description: "Please fill in test name and type",
            variant: "destructive"
          });
          return;
        }
      } else if (currentTracker.id === 'personal-reminder') {
        if (!formData?.title || !formData?.category || !formData?.description) {
          toast({
            title: "Missing required fields",
            description: "Please fill in title, category, and description",
            variant: "destructive"
          });
          return;
        }
      }

      // Save complex form data to localStorage
      if (formData) {
        const task = {
          id: Date.now().toString(),
          type: currentTracker.id,
          title: formData.title || formData.name || formData.testName || `${formData.doctorName} - ${formData.specialty}`,
          date: formData.date?.toISOString() || formData.scheduledDate?.toISOString() || formData.dueDate?.toISOString(),
          time: formData.time,
          status: 'pending' as const,
          data: formData,
          createdAt: new Date().toISOString()
        };

        const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
        existingTasks.push(task);
        localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));
      }
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: currentTracker.completionMessage,
        description: currentTracker.completionDescription,
        duration: 3000,
      });
      
      setIsSubmitting(false);
      navigate('/trackers?tab=tasks');
    }, 1000);
  };


  const currentTracker = visibleTrackers[currentIndex];
  if (!currentTracker) {
    navigate('/trackers?tab=tasks');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header with Navigation */}
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 h-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* Previous Tracker Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToTracker('prev')}
            disabled={currentIndex === 0}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-2xl font-bold text-card-foreground mb-1">
              {currentTracker.title}
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              {currentTracker.subtitle}
            </p>
            
            {/* Navigation Indicators */}
            <div className="flex justify-center gap-2">
              {visibleTrackers.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Next Tracker Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToTracker('next')}
            disabled={currentIndex === visibleTrackers.length - 1}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Swipeable Content Container */}
        <div 
          className="relative overflow-hidden"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${currentTranslate}%)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            {visibleTrackers.map((tracker, index) => {
              const TrackerComp = tracker.component;
              const Icon = tracker.icon;
              
              return (
                <div key={tracker.id} className="w-full flex-shrink-0">
                  <Card className="p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${tracker.color}`}>
                        <Icon className={`w-5 h-5 ${tracker.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {tracker.id === 'sleep-tracker' 
                          ? "How did you sleep last night?"
                          : `Today's ${tracker.title.split(' ')[tracker.title.split(' ').length - 1]}`
                        }
                      </h3>
                    </div>

                    {/* Render the appropriate tracker component */}
                    {tracker.isSimple ? (
                      <TrackerComp {...({} as any)} />
                    ) : (
                      <TrackerComp 
                        onDataChange={(data: any) => {
                          setFormDataMap(prev => ({
                            ...prev,
                            [tracker.id]: data
                          }));
                        }}
                      />
                    )}

                    {/* Record Button - Inside Card for Complex Forms */}
                    {!tracker.isSimple && (
                      <div className={`flex mt-6 pt-6 border-t border-gray-100 ${
                        tracker.id === 'doctor-appointment' || tracker.id === 'medicine-tracker' || tracker.id === 'personal-reminder' ? 'justify-center' : 'justify-center md:justify-end'
                      }`}>
                        <Button
                          onClick={handleComplete}
                          disabled={isSubmitting}
                          className={`w-full md:w-auto px-8 ${tracker.buttonColor}`}
                        >
                          {tracker.id === 'doctor-appointment' && <Calendar className="w-4 h-4 mr-2" />}
                          {tracker.id === 'medicine-tracker' && <Pill className="w-4 h-4 mr-2" />}
                          {tracker.id === 'medical-test' && <FileText className="w-4 h-4 mr-2" />}
                          {tracker.id === 'personal-reminder' && <Bell className="w-4 h-4 mr-2" />}
                          {isSubmitting ? "Recording..." : "Record"}
                        </Button>
                      </div>
                    )}

                    {/* History Record Section - Only for Doctor Appointment */}
                    {tracker.id === 'doctor-appointment' && (
                      <div className="mt-6 pt-6 border-t border-gray-200 bg-gray-50/50 rounded-lg p-4">
                        <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          Appointment History
                        </h4>
                        
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {(() => {
                                const tasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
                                const appointments = tasks.filter((task: any) => 
                                  task.type === 'doctor-appointment' && 
                                  task.date && 
                                  new Date(task.date) > new Date()
                                );
                                return appointments.length;
                              })()}
                            </div>
                            <div className="text-xs text-blue-700 font-medium">Upcoming</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-600">
                              {(() => {
                                const tasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
                                const appointments = tasks.filter((task: any) => 
                                  task.type === 'doctor-appointment' && 
                                  (task.status === 'completed' || (task.date && new Date(task.date) <= new Date()))
                                );
                                return appointments.length;
                              })()}
                            </div>
                            <div className="text-xs text-green-700 font-medium">Completed</div>
                          </div>
                        </div>

                        {/* Recent Appointments List */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Recent Appointments</h5>
                          {(() => {
                            const tasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
                            const appointments = tasks
                              .filter((task: any) => task.type === 'doctor-appointment')
                              .sort((a: any, b: any) => {
                                const dateA = new Date(a.date || a.createdAt);
                                const dateB = new Date(b.date || b.createdAt);
                                return dateB.getTime() - dateA.getTime();
                              })
                              .slice(0, 3);

                            return appointments.length === 0 ? (
                              <div className="text-center py-6 text-gray-500">
                                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No appointments scheduled yet</p>
                                <p className="text-xs text-gray-400">Record your first appointment above</p>
                              </div>
                            ) : (
                              appointments.map((appointment: any) => {
                                const appointmentDate = appointment.date ? new Date(appointment.date) : null;
                                const isUpcoming = appointmentDate && appointmentDate > new Date();
                                
                                return (
                                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-800 text-sm">
                                        {appointment.data?.doctorName || 'Doctor'} - {appointment.data?.specialty || 'Appointment'}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {appointmentDate ? 
                                          appointmentDate.toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: appointmentDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                          }) + (appointment.data?.time ? ` at ${appointment.data.time}` : '')
                                          : 'Date not set'
                                        }
                                      </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      isUpcoming 
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                      {isUpcoming ? 'Upcoming' : 'Completed'}
                                    </div>
                                  </div>
                                );
                              })
                            );
                          })()}
                        </div>

                        {/* View All Link */}
                        <div className="mt-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/trackers?tab=tasks')}
                            className="text-xs text-gray-600 hover:text-gray-800"
                          >
                            View All Appointments →
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe Instruction */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          Swipe or use header arrows to navigate ({currentIndex + 1} of {visibleTrackers.length})
        </div>
      </div>
    </div>
  );
}
