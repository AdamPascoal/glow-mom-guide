import { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, Heart, Moon, Calendar, Pill, FileText, Bell, AlertTriangle, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { MoodTracker } from "@/components/features/mood/MoodTracker";
import { SleepTracker } from "@/components/features/sleep/SleepTracker";
import { SymptomsTracker } from "@/components/SymptomsTracker";
import { useToast } from "@/hooks/use-toast";
import { useMotherhoodStage } from "@/contexts/MotherhoodStageContext";
import { format } from "date-fns";
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

const vitaminTypes = [
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

const VitaminSupplementTracker = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    dosage: "",
    frequency: "daily",
    timeOfDay: [] as string[],
    startDate: new Date(),
    notes: "",
    otherType: ""
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const timeSlots = ["Morning", "Afternoon", "Evening", "Before Bed"];

  const handleTimeChange = (time: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      timeOfDay: checked 
        ? [...prev.timeOfDay, time]
        : prev.timeOfDay.filter(t => t !== time)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vitamin/Supplement Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Prenatal Vitamins"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {vitaminTypes.map((type) => (
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
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            placeholder="e.g., 1 tablet, 400mg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency *</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="twice-daily">Twice Daily</SelectItem>
              <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="as-needed">As Needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Time of Day</Label>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox
                id={time}
                checked={formData.timeOfDay.includes(time)}
                onCheckedChange={(checked) => handleTimeChange(time, checked as boolean)}
              />
              <Label htmlFor={time} className="text-sm">{time}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any special instructions, side effects to monitor, etc..."
          className="min-h-[80px]"
        />
      </div>
    </div>
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
    id: "vitamin-supplement",
    title: "Vitamin / Supplement",
    subtitle: "Track your daily vitamins and supplements",
    icon: Pill,
    color: "from-green-100 to-green-200",
    iconColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
    component: VitaminSupplementTracker,
    completionMessage: "Vitamin/Supplement Added! 💊",
    completionDescription: "Your vitamin/supplement has been added to your routine.",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});

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

    // Validate form data for complex forms
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
      } else if (currentTracker.id === 'vitamin-supplement') {
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

  const TrackerComponent = currentTracker.component;
  const IconComponent = currentTracker.icon;

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
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
              {currentTracker.title}
            </h1>
            <p className="text-muted-foreground">
              {currentTracker.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Indicators */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToTracker('prev')}
            disabled={currentIndex === 0}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-2">
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
                      <TrackerComp />
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
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex justify-center md:justify-end mb-4">
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 ${currentTracker.buttonColor}`}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Complete Tracking"}
          </Button>
        </div>

        {/* Swipe Instruction */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          Swipe left/right to access more trackers ({currentIndex + 1} of {visibleTrackers.length})
        </div>
      </div>
    </div>
  );
}