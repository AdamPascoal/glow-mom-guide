import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Plus, Pill, Heart, Edit3, Trash2, X, ChevronLeft, ChevronRight, ArrowLeft, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const predefinedVitamins = [
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

const timingOptions = [
  "Morning (6-10 AM)",
  "Afternoon (12-4 PM)",
  "Evening (6-8 PM)",
  "Night (8-10 PM)",
  "With breakfast",
  "With lunch", 
  "With dinner",
  "Before bed",
  "Custom time"
];

const dosageUnits = ["mg", "mcg", "IU", "ml", "capsule", "tablet", "drops", "gummies"];

interface VitaminEntry {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  timing: string;
  frequency: string;
  withFood: boolean;
  category: string;
}

interface VitaminHistoryEntry {
  id: string;
  vitaminName: string;
  dosage: string;
  unit: string;
  takenAt: Date;
  notes?: string;
}

export default function VitaminSupplementForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedVitamins, setSelectedVitamins] = useState<VitaminEntry[]>([]);
  const [customVitamins, setCustomVitamins] = useState<VitaminEntry[]>([]);
  const [userAddedVitamins, setUserAddedVitamins] = useState<typeof predefinedVitamins>([]);
  const [newVitaminName, setNewVitaminName] = useState("");
  const [newVitaminDosage, setNewVitaminDosage] = useState("");
  const [newVitaminUnit, setNewVitaminUnit] = useState("mg");
  const [isAddVitaminModalOpen, setIsAddVitaminModalOpen] = useState(false);
  const [vitaminHistory, setVitaminHistory] = useState<VitaminHistoryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [currentHistoryDate, setCurrentHistoryDate] = useState(new Date());
  const [editingVitamin, setEditingVitamin] = useState<string | null>(null);
  const [editVitaminName, setEditVitaminName] = useState("");
  const [editVitaminDosage, setEditVitaminDosage] = useState("");
  const [editVitaminUnit, setEditVitaminUnit] = useState("");
  const [slideStates, setSlideStates] = useState<{[key: string]: boolean}>({});
  const [favoriteVitamins, setFavoriteVitamins] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVitaminSelectionModalOpen, setIsVitaminSelectionModalOpen] = useState(false);
  const [animatingVitamins, setAnimatingVitamins] = useState<Set<string>>(new Set());

  const addPredefinedVitamin = (vitamin: typeof predefinedVitamins[0]) => {
    const newVitamin: VitaminEntry = {
      id: Date.now().toString(),
      name: vitamin.name,
      dosage: vitamin.defaultDosage,
      unit: vitamin.unit,
      timing: "Morning (6-10 AM)",
      frequency: "Daily",
      withFood: vitamin.name.includes("Iron") ? false : true,
      category: "Predefined"
    };
    
    setSelectedVitamins(prev => [...prev, newVitamin]);
  };

  const removePredefinedVitamin = (vitaminName: string) => {
    setSelectedVitamins(prev => prev.filter(v => v.name !== vitaminName));
  };

  const updateVitamin = (id: string, updates: Partial<VitaminEntry>) => {
    setSelectedVitamins(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };

  const addCustomVitamin = () => {
    const newCustomVitamin: VitaminEntry = {
      id: `custom-${Date.now()}`,
      name: "",
      dosage: "1",
      unit: "mg",
      timing: "Morning (6-10 AM)",
      frequency: "Daily",
      withFood: true,
      category: "Custom"
    };
    setCustomVitamins(prev => [...prev, newCustomVitamin]);
  };

  const updateCustomVitamin = (id: string, updates: Partial<VitaminEntry>) => {
    setCustomVitamins(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };

  const removeCustomVitamin = (id: string) => {
    setCustomVitamins(prev => prev.filter(v => v.id !== id));
  };

  const addToMainList = () => {
    if (!newVitaminName.trim() || !newVitaminDosage.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both vitamin name and dosage",
        variant: "destructive"
      });
      return;
    }

    const newVitamin = {
      name: newVitaminName.trim(),
      defaultDosage: newVitaminDosage.trim(),
      unit: newVitaminUnit
    };

    // Check if vitamin already exists
    const allVitamins = [...predefinedVitamins, ...userAddedVitamins];
    if (allVitamins.some(v => v.name.toLowerCase() === newVitamin.name.toLowerCase())) {
      toast({
        title: "Vitamin already exists",
        description: "This vitamin is already in the list",
        variant: "destructive"
      });
      return;
    }

    setUserAddedVitamins(prev => [newVitamin, ...prev]); // Add to beginning for top positioning
    setNewVitaminName("");
    setNewVitaminDosage("");
    setNewVitaminUnit("mg");
    setIsAddVitaminModalOpen(false);
    
    // Add animation for the new vitamin
    setAnimatingVitamins(prev => new Set([...prev, newVitamin.name]));
    setTimeout(() => {
      setAnimatingVitamins(prev => {
        const newSet = new Set(prev);
        newSet.delete(newVitamin.name);
        return newSet;
      });
    }, 1000);
    
    // Re-open vitamin selection modal if it was open
    if (isVitaminSelectionModalOpen) {
      setTimeout(() => {
        setIsVitaminSelectionModalOpen(true);
      }, 100);
    }
    
    toast({
      title: "Vitamin added! 💊",
      description: `${newVitamin.name} has been added to your vitamin list`,
    });
  };

  const isVitaminSelected = (vitaminName: string) => {
    return selectedVitamins.some(v => v.name === vitaminName);
  };

  const logVitaminTaken = (vitaminName: string, dosage: string, unit: string) => {
    const newEntry: VitaminHistoryEntry = {
      id: Date.now().toString(),
      vitaminName,
      dosage,
      unit,
      takenAt: new Date(),
    };
    setVitaminHistory(prev => [newEntry, ...prev]);
    
    toast({
      title: "Vitamin logged! 💊",
      description: `${vitaminName} has been recorded`,
    });
  };

  const deleteHistoryEntry = (id: string) => {
    setVitaminHistory(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "History entry has been removed",
    });
  };

  const startEditEntry = (entry: VitaminHistoryEntry) => {
    setEditingEntry(entry.id);
    const date = entry.takenAt.toISOString().split('T')[0];
    const time = entry.takenAt.toTimeString().slice(0, 5);
    setEditDate(date);
    setEditTime(time);
  };

  const saveEditEntry = (id: string) => {
    if (!editDate || !editTime) return;
    
    const newDateTime = new Date(`${editDate}T${editTime}`);
    setVitaminHistory(prev => prev.map(entry => 
      entry.id === id ? { ...entry, takenAt: newDateTime } : entry
    ));
    
    setEditingEntry(null);
    setEditDate("");
    setEditTime("");
    
    toast({
      title: "Entry updated",
      description: "Date and time have been saved",
    });
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditDate("");
    setEditTime("");
  };

  const startEditVitamin = (vitamin: typeof predefinedVitamins[0]) => {
    setEditingVitamin(vitamin.name);
    setEditVitaminName(vitamin.name);
    setEditVitaminDosage(vitamin.defaultDosage);
    setEditVitaminUnit(vitamin.unit);
    setSlideStates(prev => ({ ...prev, [vitamin.name]: false }));
  };

  const saveVitaminEdit = (originalName: string) => {
    if (!editVitaminDosage.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter dosage",
        variant: "destructive"
      });
      return;
    }

    // Check if it's a user-added vitamin first
    const userVitaminIndex = userAddedVitamins.findIndex(v => v.name === originalName);
    if (userVitaminIndex !== -1) {
      // For user-added vitamins, allow name editing
      if (!editVitaminName.trim()) {
        toast({
          title: "Missing information",
          description: "Please enter vitamin name",
          variant: "destructive"
        });
        return;
      }
      const updatedVitamins = [...userAddedVitamins];
      updatedVitamins[userVitaminIndex] = {
        name: editVitaminName.trim(),
        defaultDosage: editVitaminDosage.trim(),
        unit: editVitaminUnit
      };
      setUserAddedVitamins(updatedVitamins);
    } else {
      // For predefined vitamins, only update dosage/unit by creating or updating a custom version
      const existingCustomIndex = userAddedVitamins.findIndex(v => v.name === originalName);
      
      if (existingCustomIndex !== -1) {
        // Update existing custom version
        const updatedVitamins = [...userAddedVitamins];
        updatedVitamins[existingCustomIndex] = {
          name: originalName,
          defaultDosage: editVitaminDosage.trim(),
          unit: editVitaminUnit
        };
        setUserAddedVitamins(updatedVitamins);
      } else {
        // Create new custom version
        const editedVitamin = {
          name: originalName,
          defaultDosage: editVitaminDosage.trim(),
          unit: editVitaminUnit
        };
        setUserAddedVitamins(prev => [...prev, editedVitamin]);
      }
    }

    setEditingVitamin(null);
    setEditVitaminName("");
    setEditVitaminDosage("");
    setEditVitaminUnit("");

    toast({
      title: "Dosage updated! 💊",
      description: `${originalName} dosage has been updated`,
    });
  };

  const cancelVitaminEdit = () => {
    setEditingVitamin(null);
    setEditVitaminName("");
    setEditVitaminDosage("");
    setEditVitaminUnit("");
  };

  const deleteVitamin = (vitaminName: string) => {
    // Only allow deletion of user-added vitamins
    const isUserAdded = userAddedVitamins.some(v => v.name === vitaminName);
    if (isUserAdded) {
      setUserAddedVitamins(prev => prev.filter(v => v.name !== vitaminName));
      toast({
        title: "Vitamin deleted",
        description: `${vitaminName} has been removed`,
      });
    }
    setSlideStates(prev => ({ ...prev, [vitaminName]: false }));
  };

  const toggleSlide = (vitaminName: string) => {
    setSlideStates(prev => ({ ...prev, [vitaminName]: !prev[vitaminName] }));
  };

  const toggleFavorite = (vitaminName: string, showToast: boolean = true) => {
    setFavoriteVitamins(prev => {
      const isFavorite = prev.includes(vitaminName);
      if (isFavorite) {
        return prev.filter(name => name !== vitaminName);
      } else {
        return [...prev, vitaminName];
      }
    });
    
    if (showToast) {
      const isFavorite = favoriteVitamins.includes(vitaminName);
      toast({
        title: isFavorite ? "Removed from My Vitamins" : "Added to My Vitamins! ❤️",
        description: `${vitaminName} ${isFavorite ? 'removed from' : 'added to'} My Vitamins`,
      });
    }
  };

  const isFavorite = (vitaminName: string) => {
    return favoriteVitamins.includes(vitaminName);
  };

  // Get selected vitamins for the favorites tab
  const getSelectedVitamins = () => {
    return allAvailableVitamins.filter(vitamin => favoriteVitamins.includes(vitamin.name));
  };

  // Get history entries for a specific date
  const getHistoryForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return vitaminHistory.filter(entry => entry.takenAt.toDateString() === dateStr);
  };

  // Navigate to previous/next day
  const navigateHistoryDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentHistoryDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentHistoryDate(newDate);
  };

  // Allow navigation to any future date
  const canNavigateNext = () => {
    return true; // Always allow forward navigation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validCustomVitamins = customVitamins.filter(v => v.name.trim());
    if (selectedVitamins.length === 0 && validCustomVitamins.length === 0) {
      toast({
        title: "No vitamins selected",
        description: "Please select at least one vitamin or supplement",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create tasks for each vitamin (predefined + custom)
      const allVitamins = [...selectedVitamins, ...customVitamins.filter(v => v.name.trim())];
      const tasks = allVitamins.map(vitamin => ({
        id: `vitamin-${Date.now()}-${vitamin.id}`,
        type: 'vitamin-supplement' as const,
        title: `${vitamin.name} - ${vitamin.dosage}${vitamin.unit}`,
        status: 'pending' as const,
        data: {
          ...vitamin,
          notes
        },
        createdAt: new Date().toISOString()
      }));

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
      existingTasks.push(...tasks);
      localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));

      toast({
        title: "Vitamins added! 💊",
        description: `${selectedVitamins.length} vitamin${selectedVitamins.length > 1 ? 's' : ''} added to your daily routine`,
        duration: 5000,
      });

      navigate('/my-tasks');
    } catch (error) {
      toast({
        title: "Error saving vitamins",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine predefined and user-added vitamins
  const allAvailableVitamins = [...predefinedVitamins, ...userAddedVitamins];
  
  // Sort vitamins with custom ones at the top
  const getSortedVitamins = () => {
    return [...allAvailableVitamins].sort((a, b) => {
      const aIsUserAdded = userAddedVitamins.some(v => v.name === a.name);
      const bIsUserAdded = userAddedVitamins.some(v => v.name === b.name);
      
      if (aIsUserAdded && !bIsUserAdded) return -1;
      if (!aIsUserAdded && bIsUserAdded) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-20px) scale(0.9);
            opacity: 0;
          }
          50% {
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .vitamin-card-enter {
          animation: slideInFromTop 0.6s ease-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-green-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-green-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Vitamin & Supplements</h1>
              <p className="text-sm text-gray-600">Track your daily vitamins</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">

        {/* My Vitamins - Shows Selected Vitamins */}
        <div className="space-y-6">
          {/* Daily History Card */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Daily History
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateHistoryDate('prev')}
                  className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm font-medium text-gray-700 min-w-0 w-24 sm:min-w-[120px] text-center">
                  {currentHistoryDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: currentHistoryDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateHistoryDate('next')}
                  disabled={!canNavigateNext()}
                  className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {(() => {
              const dayEntries = getHistoryForDate(currentHistoryDate);
              const isToday = currentHistoryDate.toDateString() === new Date().toDateString();
              
              return dayEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-1">
                    {isToday ? 'No vitamins logged today' : 'No vitamins logged'}
                  </p>
                  <p className="text-sm">
                    {isToday ? 'Use the "Log Taken" buttons above to track your intake' : 'No entries found for this date'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayEntries
                    .sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime())
                    .map((entry) => (
                      <div key={entry.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-gray-800">{entry.vitaminName}</h3>
                              <span className="text-sm text-gray-600">
                                {entry.dosage} {entry.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{entry.takenAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditEntry(entry)}
                              className="text-black hover:text-gray-800 hover:bg-gray-100 p-1 h-8 w-8"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHistoryEntry(entry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {editingEntry === entry.id && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex gap-2 items-center flex-wrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="px-2 py-1 border border-blue-200 rounded text-sm"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <input
                                  type="time"
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                  className="px-2 py-1 border border-blue-200 rounded text-sm"
                                />
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => saveEditEntry(entry.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-7 text-xs"
                              >
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                className="px-3 py-1 h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  }
                  
                  <div className="text-center pt-2">
                    <div className="text-sm text-gray-600">
                      {dayEntries.length} {dayEntries.length === 1 ? 'vitamin' : 'vitamins'} logged
                      {isToday ? ' today' : ` on ${currentHistoryDate.toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              );
            })()
            }
          </Card>

          {/* My Selected Vitamins Card */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                My Selected Vitamins
              </h2>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsVitaminSelectionModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Vitamins
                </Button>
              </div>
            </div>
            
            {favoriteVitamins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">No vitamins selected yet</p>
                <p className="text-sm">Add vitamins to My Vitamins in the Selection tab to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {allAvailableVitamins
                  .filter(vitamin => favoriteVitamins.includes(vitamin.name))
                  .map((vitamin) => {
                    const isUserAdded = userAddedVitamins.some(v => v.name === vitamin.name);
                    
                    return (
                      <div key={vitamin.name} className="p-4 rounded-lg border-2 border-green-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800 text-sm">{vitamin.name}</h3>
                          </div>
                          {isUserAdded && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Custom</span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {vitamin.defaultDosage} {vitamin.unit}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => logVitaminTaken(vitamin.name, vitamin.defaultDosage, vitamin.unit)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Log Taken
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFavorite(vitamin.name)}
                            className="h-7 px-2 text-xs text-pink-600 border-pink-300 hover:bg-pink-100"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Vitamin Selection Modal */}
      {isVitaminSelectionModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto border border-green-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Select Vitamins & Supplements
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose or add vitamins to add to your daily routine
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVitaminSelectionModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Available Vitamins</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddVitaminModalOpen(true);
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New Vitamin
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {getSortedVitamins().map((vitamin, index) => {
                  const isUserAdded = userAddedVitamins.some(v => v.name === vitamin.name);
                  const isSelected = isFavorite(vitamin.name);
                  const isAnimating = animatingVitamins.has(vitamin.name);
                  
                  return (
                    <div
                      key={vitamin.name}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform
                        ${isSelected
                          ? 'border-pink-400 bg-pink-50 shadow-md scale-105'
                          : 'border-green-200 hover:border-green-300 bg-white hover:shadow-sm hover:scale-102'
                        }
                        ${isAnimating ? 'animate-pulse bg-green-100 border-green-400' : ''}
                        ${isUserAdded ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                      onClick={() => {
                        if (editingVitamin !== vitamin.name) {
                          // Add animation effect
                          setAnimatingVitamins(prev => new Set([...prev, vitamin.name]));
                          setTimeout(() => {
                            setAnimatingVitamins(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(vitamin.name);
                              return newSet;
                            });
                          }, 600);
                          
                          toggleFavorite(vitamin.name, false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {editingVitamin === vitamin.name && isUserAdded ? (
                              <Input
                                value={editVitaminName}
                                onChange={(e) => setEditVitaminName(e.target.value)}
                                className="text-sm h-6 px-2 w-24"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <h4 className="font-medium text-gray-800 text-sm">
                                {vitamin.name}
                              </h4>
                            )}
                            {isSelected && editingVitamin !== vitamin.name && (
                              <Heart className="w-3 h-3 text-pink-500 fill-current" />
                            )}
                            {isUserAdded && editingVitamin !== vitamin.name && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Custom</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {editingVitamin === vitamin.name ? (
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <Input
                                  value={editVitaminDosage}
                                  onChange={(e) => setEditVitaminDosage(e.target.value)}
                                  className="text-xs h-5 px-1 w-12"
                                />
                                <Select
                                  value={editVitaminUnit}
                                  onValueChange={setEditVitaminUnit}
                                >
                                  <SelectTrigger className="w-12 h-5 text-xs px-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dosageUnits.map((unit) => (
                                      <SelectItem key={unit} value={unit} className="text-xs">
                                        {unit}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              `${vitamin.defaultDosage} ${vitamin.unit}`
                            )}
                          </div>
                          {isSelected && (
                            <div className="text-xs text-pink-600">★ Selected</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {editingVitamin === vitamin.name ? (
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => saveVitaminEdit(vitamin.name)}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-6 text-xs"
                              >
                                ✓
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelVitaminEdit}
                                className="px-2 py-1 h-6 text-xs"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditVitamin(vitamin);
                                }}
                                className="text-black hover:text-gray-800 bg-white hover:bg-gray-100 p-1 h-6 w-6 border border-gray-200"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${isSelected
                                  ? 'border-pink-500 bg-pink-500'
                                  : 'border-gray-300'
                                }
                              `}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVitaminSelectionModalOpen(false)}
                  className="px-6 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vitamin Modal */}
      {isAddVitaminModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-green-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Vitamin/Medication
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddVitaminModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Vitamin/Medication Name</Label>
                  <Input
                    value={newVitaminName}
                    onChange={(e) => setNewVitaminName(e.target.value)}
                    placeholder="e.g., Vitamin C, Aspirin..."
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Dosage</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newVitaminDosage}
                      onChange={(e) => setNewVitaminDosage(e.target.value)}
                      placeholder="Amount"
                      className="flex-1 border-green-200 focus:border-green-400"
                    />
                    <Select
                      value={newVitaminUnit}
                      onValueChange={setNewVitaminUnit}
                    >
                      <SelectTrigger className="w-16 sm:w-20 border-green-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dosageUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  This will be added to your vitamin list and available for selection.
                </p>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddVitaminModalOpen(false)}
                    className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={addToMainList}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}