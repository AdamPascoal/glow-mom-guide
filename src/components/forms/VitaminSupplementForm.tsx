import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pill, Heart, Trash2, X, ArrowLeft, Check, Edit } from "lucide-react";
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

const dosageUnits = ["mg", "mcg", "IU", "ml", "capsule", "tablet", "drops", "gummies"];

interface Vitamin {
  name: string;
  defaultDosage: string;
  unit: string;
}

interface TrackedVitamin extends Vitamin {
  taken: boolean;
}

export default function VitaminSupplementForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trackedVitamins, setTrackedVitamins] = useState<TrackedVitamin[]>([]);
  const [userAddedVitamins, setUserAddedVitamins] = useState<Vitamin[]>([]);
  const [isAddVitaminModalOpen, setIsAddVitaminModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const allAvailableVitamins = useMemo(() => [...predefinedVitamins, ...userAddedVitamins], [userAddedVitamins]);

  const toggleVitaminTracked = (vitamin: Vitamin) => {
    const isTracked = trackedVitamins.some(v => v.name === vitamin.name);
    if (isTracked) {
      setTrackedVitamins(prev => prev.filter(v => v.name !== vitamin.name));
    } else {
      setTrackedVitamins(prev => [...prev, { ...vitamin, taken: false }]);
    }
  };

  const toggleVitaminTaken = (vitaminName: string) => {
    setTrackedVitamins(prev => prev.map(v => 
      v.name === vitaminName ? { ...v, taken: !v.taken } : v
    ));
  };

  const handleAddNewVitamin = (newVitamin: Vitamin) => {
    if (allAvailableVitamins.some(v => v.name.toLowerCase() === newVitamin.name.toLowerCase())) {
      toast({
        title: "Vitamin already exists",
        description: "This vitamin is already in the list",
        variant: "destructive"
      });
      return;
    }
    setUserAddedVitamins(prev => [newVitamin, ...prev]);
    toast({
      title: "Vitamin added! 💊",
      description: `${newVitamin.name} has been added to your vitamin list`,
    });
  };

  const handleDeleteVitamin = (vitaminName: string) => {
    setUserAddedVitamins(prev => prev.filter(v => v.name !== vitaminName));
    setTrackedVitamins(prev => prev.filter(v => v.name !== vitaminName));
    toast({
      title: "Vitamin deleted",
      description: `${vitaminName} has been removed`,
    });
  };

  return (
    <>
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
                <h1 className="text-xl font-semibold text-gray-800">Vitamin & Supplements</h1>
                <p className="text-sm text-gray-600">Track your daily intake</p>
              </div>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-8">
          {/* Tracked Vitamins Section */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                My Daily Vitamins
              </h2>
              <Button
                size="sm"
                variant={isEditMode ? "secondary" : "default"}
                onClick={() => setIsEditMode(!isEditMode)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8 text-xs"
              >
                {isEditMode ? <><Check className="w-3 h-3 mr-1" /> Done</> : <><Edit className="w-3 h-3 mr-1" /> Edit</>}
              </Button>
            </div>
            {trackedVitamins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">No vitamins being tracked</p>
                <p className="text-sm">Select vitamins from the list below to track them.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {trackedVitamins.map((vitamin) => (
                  <Button
                    key={vitamin.name}
                    variant={vitamin.taken ? "default" : "outline"}
                    onClick={() => toggleVitaminTaken(vitamin.name)}
                    className={`h-auto py-3 flex flex-col items-center justify-center text-center transition-all duration-200 ${vitamin.taken ? 'bg-green-600 text-white' : 'bg-white'}`}
                  >
                    <Pill className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium leading-tight">{vitamin.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{vitamin.defaultDosage} {vitamin.unit}</span>
                  </Button>
                ))}
              </div>
            )}
          </Card>

          {/* All Vitamins/Medicines List */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                All Vitamins & Medications
              </h2>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsAddVitaminModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add New
              </Button>
            </div>
            
            <div className="space-y-2">
              {allAvailableVitamins.map((vitamin) => {
                const isTracked = trackedVitamins.some(v => v.name === vitamin.name);
                const isUserAdded = userAddedVitamins.some(v => v.name === vitamin.name);
                return (
                  <div
                    key={vitamin.name}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                      isTracked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{vitamin.name}</h3>
                      <p className="text-sm text-gray-600">{vitamin.defaultDosage} {vitamin.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditMode && isUserAdded && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-100 h-8 w-8"
                          onClick={() => handleDeleteVitamin(vitamin.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={isTracked ? "secondary" : "outline"}
                        onClick={() => toggleVitaminTracked(vitamin)}
                        className="w-24"
                      >
                        {isTracked ? <><Check className="w-4 h-4 mr-1" /> Tracked</> : <><Plus className="w-4 h-4 mr-1" /> Track</>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {isAddVitaminModalOpen && (
        <AddVitaminModal
          onClose={() => setIsAddVitaminModalOpen(false)}
          onAdd={handleAddNewVitamin}
        />
      )}
    </>
  );
}

function AddVitaminModal({ onClose, onAdd }: { onClose: () => void; onAdd: (vitamin: Vitamin) => void; }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("mg");

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim()) {
      // Basic validation
      return;
    }
    onAdd({ name: name.trim(), defaultDosage: dosage.trim(), unit });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-green-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Vitamin/Medication</h2>
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Vitamin C, Aspirin..." />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm font-medium">Dosage</Label>
                <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Amount" />
              </div>
              <div>
                <Label className="text-sm font-medium">Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dosageUnits.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="button" onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
