import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

export default function MedicineTrackerForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkedMedicines, setCheckedMedicines] = useState<string[]>([]);

  const toggleMedicine = (medicineName: string) => {
    setCheckedMedicines(prev => 
      prev.includes(medicineName) 
        ? prev.filter(name => name !== medicineName)
        : [...prev, medicineName]
    );
  };

  const handleSave = () => {
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
            <div className="text-sm text-gray-600">
              {checkedMedicines.length} of {predefinedMedicines.length} completed
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
      </div>
    </div>
  );
}

