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
  const [activeTab, setActiveTab] = useState<'favorites' | 'selection'>('favorites');
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

    setUserAddedVitamins(prev => [...prev, newVitamin]);
    setNewVitaminName("");
    setNewVitaminDosage("");
    setNewVitaminUnit("mg");
    setIsAddVitaminModalOpen(false);
    
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
    if (!editVitaminName.trim() || !editVitaminDosage.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both name and dosage",
        variant: "destructive"
      });
      return;
    }

    // Check if it's a user-added vitamin first
    const userVitaminIndex = userAddedVitamins.findIndex(v => v.name === originalName);
    if (userVitaminIndex !== -1) {
      const updatedVitamins = [...userAddedVitamins];
      updatedVitamins[userVitaminIndex] = {
        name: editVitaminName.trim(),
        defaultDosage: editVitaminDosage.trim(),
        unit: editVitaminUnit
      };
      setUserAddedVitamins(updatedVitamins);
    } else {
      // It's a predefined vitamin - add the edited version to userAddedVitamins
      const editedVitamin = {
        name: editVitaminName.trim(),
        defaultDosage: editVitaminDosage.trim(),
        unit: editVitaminUnit
      };
      setUserAddedVitamins(prev => [...prev, editedVitamin]);
    }

    setEditingVitamin(null);
    setEditVitaminName("");
    setEditVitaminDosage("");
    setEditVitaminUnit("");

    toast({
      title: "Vitamin updated! 💊",
      description: `${editVitaminName} has been updated`,
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

  const toggleFavorite = (vitaminName: string) => {
    setFavoriteVitamins(prev => {
      const isFavorite = prev.includes(vitaminName);
      if (isFavorite) {
        return prev.filter(name => name !== vitaminName);
      } else {
        return [...prev, vitaminName];
      }
    });
    
    const isFavorite = favoriteVitamins.includes(vitaminName);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites! ❤️",
      description: `${vitaminName} ${isFavorite ? 'removed from' : 'added to'} your favorites`,
    });
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

  return (
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
        {/* Tab Navigation */}
        <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 mb-6 border border-green-200">
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Favorites
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('selection')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'selection'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Pill className="w-4 h-4 inline mr-2" />
            Vitamin Selection
          </button>
        </div>

        {activeTab === 'favorites' ? (
        /* Favorites Tab - Shows Selected Vitamins */
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
                <div className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
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
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 h-8 w-8"
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
              <div className="text-sm text-gray-600">
                {favoriteVitamins.length} favorites
              </div>
            </div>
            
            {favoriteVitamins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">No favorites yet</p>
                <p className="text-sm">Add vitamins to favorites in the Selection tab to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
        ) : activeTab === 'selection' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vitamin Selection */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                Select Vitamins & Supplements
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddVitaminModalOpen(true)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allAvailableVitamins.map((vitamin) => {
                const isUserAdded = userAddedVitamins.some(v => v.name === vitamin.name);
                const isSlid = slideStates[vitamin.name] || false;
                
                return editingVitamin === vitamin.name ? (
                  <div key={vitamin.name} className="p-3 rounded-lg border-2 border-blue-300 bg-blue-50">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Vitamin Name</Label>
                        <Input
                          value={editVitaminName}
                          onChange={(e) => setEditVitaminName(e.target.value)}
                          className="border-blue-200 focus:border-blue-400 text-sm"
                          placeholder="Vitamin name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dosage</Label>
                        <div className="flex gap-2">
                          <Input
                            value={editVitaminDosage}
                            onChange={(e) => setEditVitaminDosage(e.target.value)}
                            className="flex-1 border-blue-200 focus:border-blue-400 text-sm"
                            placeholder="Amount"
                          />
                          <Select
                            value={editVitaminUnit}
                            onValueChange={setEditVitaminUnit}
                          >
                            <SelectTrigger className="w-16 border-blue-200 text-xs">
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
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => saveVitaminEdit(vitamin.name)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelVitaminEdit}
                          className="flex-1 h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            deleteVitamin(vitamin.name);
                            cancelVitaminEdit();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white h-7 px-3 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={vitamin.name} className="relative overflow-hidden rounded-lg">
                    {/* Slide Actions Background */}
                    <div className={`absolute inset-0 flex items-center justify-end pr-3 transition-opacity duration-200 ${
                      isSlid ? 'opacity-100' : 'opacity-0'
                    } bg-gradient-to-l from-red-500 to-blue-500`}>
                      <div className="flex gap-2">
                        {isUserAdded && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditVitamin(vitamin);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-7 w-7"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                        {isUserAdded && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteVitamin(vitamin.name);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white p-1 h-7 w-7"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Main Vitamin Card */}
                    <div
                      className={`
                        p-3 border-2 cursor-pointer transition-all duration-200 transform
                        ${isFavorite(vitamin.name)
                          ? 'border-pink-400 bg-pink-50 shadow-md'
                          : isVitaminSelected(vitamin.name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-green-200 hover:border-green-300 bg-white'
                        }
                        ${isSlid ? 'translate-x-[-80px]' : 'translate-x-0'}
                      `}
                      onClick={() => {
                        if (isSlid) {
                          setSlideStates(prev => ({ ...prev, [vitamin.name]: false }));
                        }
                        // Card click no longer handles selection - only favorites and edit buttons work
                      }}
                      onTouchStart={(e) => {
                        if (isUserAdded) {
                          const startX = e.touches[0].clientX;
                          const handleTouchMove = (moveEvent: TouchEvent) => {
                            const currentX = moveEvent.touches[0].clientX;
                            const diffX = startX - currentX;
                            if (diffX > 50) {
                              toggleSlide(vitamin.name);
                              document.removeEventListener('touchmove', handleTouchMove);
                            }
                          };
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', () => {
                            document.removeEventListener('touchmove', handleTouchMove);
                          }, { once: true });
                        }
                      }}
                      onDoubleClick={() => {
                        if (isUserAdded) {
                          toggleSlide(vitamin.name);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium text-gray-800 text-sm">
                              {vitamin.name}
                            </div>
                            {isFavorite(vitamin.name) && (
                              <Heart className="w-3 h-3 text-pink-500 fill-current" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {vitamin.defaultDosage} {vitamin.unit}
                          </div>
                          {isFavorite(vitamin.name) && (
                            <div className="text-xs text-pink-600 mt-1">★ Favorite</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Favorite Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(vitamin.name);
                            }}
                            className={`
                              p-1 rounded-full transition-all duration-200 hover:scale-110
                              ${isFavorite(vitamin.name)
                                ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-pink-100 hover:text-pink-500'
                              }
                            `}
                          >
                            <Heart className={`w-4 h-4 ${
                              isFavorite(vitamin.name) ? 'fill-current' : ''
                            }`} />
                          </button>
                          
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditVitamin(vitamin);
                            }}
                            className="p-1 rounded-full transition-all duration-200 hover:scale-110 bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>



          {/* Custom Vitamins Configuration */}
          {customVitamins.length > 0 && (
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Add (One-time Use)
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addCustomVitamin}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-4">
              {customVitamins.map((vitamin) => (
                <div key={vitamin.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <Input
                      value={vitamin.name}
                      onChange={(e) => updateCustomVitamin(vitamin.id, { name: e.target.value })}
                      placeholder="e.g., Vitamin C, Magnesium..."
                      className="flex-1 mr-3 border-green-200 focus:border-green-400 font-medium"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomVitamin(vitamin.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <div className="flex gap-2">
                        <Input
                          value={vitamin.dosage}
                          onChange={(e) => updateCustomVitamin(vitamin.id, { dosage: e.target.value })}
                          className="flex-1 border-green-200"
                          placeholder="Amount"
                        />
                        <Select
                          value={vitamin.unit}
                          onValueChange={(value) => updateCustomVitamin(vitamin.id, { unit: value })}
                        >
                          <SelectTrigger className="w-20 border-green-200">
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
                    
                    <div className="space-y-2">
                      <Label>Timing</Label>
                      <Select
                        value={vitamin.timing}
                        onValueChange={(value) => updateCustomVitamin(vitamin.id, { timing: value })}
                      >
                        <SelectTrigger className="border-green-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timingOptions.map((timing) => (
                            <SelectItem key={timing} value={timing}>
                              {timing}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={vitamin.frequency}
                        onValueChange={(value) => updateCustomVitamin(vitamin.id, { frequency: value })}
                      >
                        <SelectTrigger className="border-green-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Every other day">Every other day</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <Checkbox
                      id={`withFood-${vitamin.id}`}
                      checked={vitamin.withFood}
                      onCheckedChange={(checked) => updateCustomVitamin(vitamin.id, { withFood: !!checked })}
                      className="border-green-300 data-[state=checked]:bg-green-600"
                    />
                    <Label htmlFor={`withFood-${vitamin.id}`} className="text-sm">
                      Take with food
                    </Label>
                  </div>
                </div>
              ))}
              
              {customVitamins.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No additional vitamins added yet.</p>
                  <p className="text-xs">Click "Add" to include custom vitamins or medications.</p>
                </div>
              )}
            </div>
          </Card>
          )}

          {/* Submit Button */}
          {activeTab === 'selection' && !editingVitamin && (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/add-task")}
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Add to Daily Routine"}
              </Button>
            </div>
          )}
        </form>
        ) : null}
      </div>

      {/* Add Vitamin Modal */}
      {isAddVitaminModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-green-200">
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
                      <SelectTrigger className="w-20 border-green-200">
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
  );
}