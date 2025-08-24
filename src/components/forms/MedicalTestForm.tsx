import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, FileText, CalendarIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const predefinedTests = [
  "Glucose Screening",
  "Group B Strep Test", 
  "Blood Pressure Check",
  "CBC (Complete Blood Count)",
  "Thyroid Panel",
  "Genetic Tests",
  "Ultrasound",
  "Anatomy Scan",
  "Growth Scan",
  "Non-Stress Test",
  "Urine Test",
  "Iron/Hemoglobin Test",
  "Amniocentesis",
  "Other"
];

const resultStatuses = [
  "Normal",
  "Abnormal - needs follow-up",
  "Pending/Not received",
  "Inconclusive"
];

export default function MedicalTestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    testName: "",
    customTestName: "",
    prescribedByDoctor: "yes",
    testDate: undefined as Date | undefined,
    results: "",
    resultStatus: "",
    nextRecommendedDate: undefined as Date | undefined,
    doctorName: "",
    location: "",
    notes: "",
    cost: "",
    fasting: "no",
    preparationNotes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const testName = formData.testName === "Other" ? formData.customTestName : formData.testName;
    
    if (!testName || !formData.testDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in test name and test date",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const task = {
        id: Date.now().toString(),
        type: 'medical-test' as const,
        title: testName,
        date: formData.testDate.toISOString(),
        status: 'pending' as const,
        data: {
          ...formData,
          finalTestName: testName
        },
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
      existingTasks.push(task);
      localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));

      toast({
        title: "Medical test logged! 🔬",
        description: `${testName} has been added to your medical records`,
        duration: 5000,
      });

      navigate('/my-tasks');
    } catch (error) {
      toast({
        title: "Error saving test",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-blue-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Medical Test</h1>
              <p className="text-sm text-gray-600">Log your medical test results</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Information */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Test Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name *</Label>
                <Select 
                  value={formData.testName} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, testName: value }))}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedTests.map((test) => (
                      <SelectItem key={test} value={test}>
                        {test}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.testName === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customTestName">Specify Test Name *</Label>
                  <Input
                    id="customTestName"
                    value={formData.customTestName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTestName: e.target.value }))}
                    placeholder="Enter test name"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <Label>Prescribed by Doctor?</Label>
                <RadioGroup
                  value={formData.prescribedByDoctor}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, prescribedByDoctor: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prescribed-yes" className="border-blue-300" />
                    <Label htmlFor="prescribed-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prescribed-no" className="border-blue-300" />
                    <Label htmlFor="prescribed-no" className="cursor-pointer">No (Self-requested)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Test Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-blue-200 focus:border-blue-400",
                          !formData.testDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.testDate ? format(formData.testDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.testDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, testDate: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor/Provider</Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                    placeholder="Dr. Smith"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Test Preparation */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Test Preparation
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Fasting Required?</Label>
                <RadioGroup
                  value={formData.fasting}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fasting: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fasting-yes" className="border-blue-300" />
                    <Label htmlFor="fasting-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fasting-no" className="border-blue-300" />
                    <Label htmlFor="fasting-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preparationNotes">Preparation Instructions</Label>
                <Textarea
                  id="preparationNotes"
                  value={formData.preparationNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationNotes: e.target.value }))}
                  placeholder="e.g., Fast for 12 hours, drink plenty of water, bring ID..."
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Test Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lab name or hospital"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Test Results
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resultStatus">Result Status</Label>
                <Select 
                  value={formData.resultStatus} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resultStatus: value }))}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select result status" />
                  </SelectTrigger>
                  <SelectContent>
                    {resultStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="results">Results / Values</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                  placeholder="Enter test results, values, or interpretation..."
                  className="border-blue-200 focus:border-blue-400 min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Next Recommended Test Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-blue-200 focus:border-blue-400",
                        !formData.nextRecommendedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.nextRecommendedDate ? format(formData.nextRecommendedDate, "PPP") : "Optional - pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.nextRecommendedDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, nextRecommendedDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (if applicable)</Label>
                <Input
                  id="cost"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="$150 or covered by insurance"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes, concerns, or observations..."
                  className="border-blue-200 focus:border-blue-400 min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/add-task")}
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Test Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}