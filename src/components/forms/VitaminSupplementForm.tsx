import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pill, Heart, Trash2, X, ArrowLeft, Check, Edit, Calendar } from "lucide-react";
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

interface VitaminHistoryEntry extends Vitamin {
  takenAt: Date;
}

export default function VitaminSupplementForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vitaminHistory, setVitaminHistory] = useState<VitaminHistoryEntry[]>([]);
  const [userAddedVitamins, setUserAddedVitamins] = useState<Vitamin[]>([]);
  const [isAddVitaminModalOpen, setIsAddVitaminModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const allAvailableVitamins = useMemo(() => [...predefinedVitamins, ...userAddedVitamins], [userAddedVitamins]);

  const handleToggleVitamin = (vitamin: Vitamin, taken: boolean) => {
    const today = new Date().toDateString();
    if (taken) {
      const newEntry: VitaminHistoryEntry = { ...vitamin, takenAt: new Date() };
      setVitaminHistory(prev => [...prev, newEntry]);
    } else {
      setVitaminHistory(prev => prev.filter(entry => 
        !(entry.name === vitamin.name && entry.takenAt.toDateString() === today)
      ));
    }
  };

  const isVitaminTakenToday = (vitaminName: string) => {
    const today = new Date().toDateString();
    return vitaminHistory.some(entry => entry.name === vitaminName && entry.takenAt.toDateString() === today);
  };

  const todaysHistory = useMemo(() => {
    const today = new Date().toDateString();
    return vitaminHistory.filter(entry => entry.takenAt.toDateString() === today);
  }, [vitaminHistory]);

  const handleAddNewVitamin = (newVitamin: Vitamin) => {
    if (allAvailableVitamins.some(v => v.name.toLowerCase() === newVitamin.name.toLowerCase())) {
      toast({ title: "Vitamin already exists", variant: "destructive" });
      return;
    }
    setUserAddedVitamins(prev => [newVitamin, ...prev]);
    toast({ title: "Vitamin added! 💊" });
  };

  const handleDeleteVitamin = (vitaminName: string) => {
    setUserAddedVitamins(prev => prev.filter(v => v.name !== vitaminName));
    setVitaminHistory(prev => prev.filter(v => v.name !== vitaminName));
    toast({ title: "Vitamin deleted" });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => navigate("/trackers?tab=tasks")} className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-800">Vitamin & Supplement Tracker</h1>
                <p className="text-sm text-gray-600">Log your daily intake</p>
              </div>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-8">
          {/* Daily History Card */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's History
              </h2>
              <span className="text-sm font-medium text-gray-600">
                {todaysHistory.length} taken
              </span>
            </div>
            {todaysHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">No vitamins logged today</p>
                <p className="text-sm">Check off vitamins from the list below to log them.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysHistory.map((entry) => (
                  <div key={entry.name} className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{entry.name}</span>
                    <span className="text-sm text-gray-600">{entry.defaultDosage} {entry.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* All Vitamins/Medicines Checklist */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                My Vitamins & Medications
              </h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant={isEditMode ? "secondary" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? <><Check className="w-4 h-4 mr-1" /> Done</> : <><Edit className="w-4 h-4 mr-1" /> Edit</>}
                </Button>
                <Button size="sm" onClick={() => setIsAddVitaminModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add New
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {allAvailableVitamins.map((vitamin) => (
                <div key={vitamin.name} className="p-3 rounded-lg border flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`vitamin-check-${vitamin.name}`}
                      checked={isVitaminTakenToday(vitamin.name)}
                      onCheckedChange={(checked) => handleToggleVitamin(vitamin, !!checked)}
                    />
                    <Label htmlFor={`vitamin-check-${vitamin.name}`} className="font-medium text-gray-800 cursor-pointer">
                      {vitamin.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{vitamin.defaultDosage} {vitamin.unit}</span>
                    {isEditMode && userAddedVitamins.some(v => v.name === vitamin.name) && (
                      <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-100 h-8 w-8" onClick={() => handleDeleteVitamin(vitamin.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
    if (!name.trim() || !dosage.trim()) { return; }
    onAdd({ name: name.trim(), defaultDosage: dosage.trim(), unit });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-200">
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
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{dosageUnits.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
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