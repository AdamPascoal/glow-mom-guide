import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Moon, CheckSquare, Plus, ListTodo, Calendar, Pill, FileText, Bell, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodTracker } from "@/components/MoodTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { TaskTracker } from "@/components/TaskTracker";
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Scatter } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const taskModules = [
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    description: "Schedule and track medical appointments",
    icon: Calendar,
    color: "from-red-100 to-red-200",
    iconColor: "text-red-600",
    borderColor: "border-red-200",
    route: "/add-task/doctor-appointment"
  },
  {
    id: "vitamin-supplement",
    title: "Vitamin / Supplement",
    description: "Track your daily vitamins and supplements",
    icon: Pill,
    color: "from-green-100 to-green-200",
    iconColor: "text-green-600", 
    borderColor: "border-green-200",
    route: "/add-task/vitamin-supplement"
  },
  {
    id: "medical-test",
    title: "Medical Test",
    description: "Log medical tests and results",
    icon: FileText,
    color: "from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    route: "/add-task/medical-test"
  },
  {
    id: "personal-reminder",
    title: "Personal Reminder",
    description: "Set personal wellness reminders",
    icon: Bell,
    color: "from-purple-100 to-purple-200",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
    route: "/add-task/personal-reminder"
  }
];

// Mock data for wellness chart
const wellnessData = [
  { date: '2024-01-01', hours: 7.5, mood: 4 },
  { date: '2024-01-02', hours: 8.2, mood: 5 },
  { date: '2024-01-03', hours: 6.8, mood: 3 },
  { date: '2024-01-04', hours: 7.9, mood: 4 },
  { date: '2024-01-05', hours: 8.5, mood: 5 },
  { date: '2024-01-06', hours: 7.2, mood: 4 },
  { date: '2024-01-07', hours: 8.0, mood: 4 },
];

// Mock symptom data
const symptomEntriesData = [
  { id: 1, symptom: 'Morning Sickness', severity: 3, date: '2024-01-07' },
  { id: 2, symptom: 'Fatigue', severity: 2, date: '2024-01-07' },
  { id: 3, symptom: 'Back Pain', severity: 1, date: '2024-01-06' },
  { id: 4, symptom: 'Headache', severity: 2, date: '2024-01-05' },
];

// DueDateEstimator Component
const DueDateEstimator = ({ dueDateString }: { dueDateString: string }) => {
  const calculateDaysLeft = () => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateWeeksPregnant = () => {
    // Assuming 40 weeks pregnancy
    const totalDays = 280;
    const daysLeft = calculateDaysLeft();
    const daysPassed = totalDays - daysLeft;
    return Math.floor(daysPassed / 7);
  };

  const daysLeft = calculateDaysLeft();
  const weeksPregnant = calculateWeeksPregnant();

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pregnancy Journey</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-pink-600 mb-1">{weeksPregnant}</div>
            <div className="text-sm text-gray-600">Weeks Pregnant</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600 mb-1">{daysLeft}</div>
            <div className="text-sm text-gray-600">Days to Go</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm text-gray-700">Due Date: {new Date(dueDateString).toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  );
};

// SymptomOverview Component
const SymptomOverview = ({ symptomEntries }: { symptomEntries: typeof symptomEntriesData }) => {
  const getSeverityColor = (severity: number) => {
    if (severity <= 1) return 'bg-green-100 text-green-800';
    if (severity <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Symptoms</h3>
      <div className="space-y-3">
        {symptomEntries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">{entry.symptom}</span>
              <p className="text-sm text-gray-600">{entry.date}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
              Severity {entry.severity}/5
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Custom chart components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">{new Date(label).toLocaleDateString()}</p>
        <p className="text-sm font-medium text-pink-600">
          Sleep: {payload[0].value} hours
        </p>
      </div>
    );
  }
  return null;
};

const CustomScatterShape = (props: any) => {
  const { cx, cy, payload } = props;
  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const emoji = moodEmojis[payload.mood - 1] || '😐';
  
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16">
      {emoji}
    </text>
  );
};

export default function Trackers() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleModuleClick = (module: typeof taskModules[0]) => {
    setSelectedModule(module.id);
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      navigate(module.route);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-card-foreground mb-2">
              Wellness Trackers
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Monitor your mood, sleep, and daily wellness activities with medical insights
            </p>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-secondary/50">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mood" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-mood-card data-[state=active]:text-primary"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sleep"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-sleep-muted data-[state=active]:text-sleep-primary"
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-task-card data-[state=active]:text-task-primary"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    📊 Wellness Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Get insights into your pregnancy journey and wellness patterns
                  </p>
                </div>
                <DueDateEstimator dueDateString="2026-04-10" />
                <div className={`bg-white rounded-2xl shadow-sm ${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">Weekly Sleep & Mood</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
                      <span className="text-sm font-medium text-gray-600">This Week</span>
                      <button className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">See how your sleep and mood are connected.</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={wellnessData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })} stroke="#9CA3AF" fontSize={12} />
                        <YAxis dataKey="hours" stroke="#9CA3AF" fontSize={12} domain={[0, 12]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="hours" stroke={'#f4a3b8'} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                        <Scatter dataKey="hours" shape={<CustomScatterShape />} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <SymptomOverview symptomEntries={symptomEntriesData} />
              </div>
            </TabsContent>

            <TabsContent value="mood" className="mt-0">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    🧠 Mood Tracker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Track your emotional wellness with evidence-based insights
                  </p>
                </div>
                <MoodTracker />
              </div>
            </TabsContent>

            <TabsContent value="sleep" className="mt-0">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    🛌 Sleep Tracker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Monitor your rest patterns for optimal pregnancy health
                  </p>
                </div>
                <SleepTracker />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    ✨ Wellness Trackers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose from our specialized tracking modules designed for pregnancy and motherhood wellness
                  </p>
                </div>

                {/* 4-Box Wellness Module Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {taskModules.map((module) => {
                    const IconComponent = module.icon;
                    const isSelected = selectedModule === module.id;
                    
                    return (
                      <Card
                        key={module.id}
                        className={`
                          relative p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 touch-manipulation min-h-[120px]
                          ${isSelected ? 'scale-95 shadow-inner' : 'hover:scale-105 active:scale-98'}
                          ${module.borderColor} bg-gradient-to-br ${module.color}
                        `}
                        onClick={() => handleModuleClick(module)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`
                            flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-white/80 shadow-sm
                            ${isSelected ? 'scale-90' : ''}
                            transition-transform duration-200
                          `}>
                            <IconComponent className={`w-6 h-6 sm:w-5 sm:h-5 ${module.iconColor}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 mb-1 text-base sm:text-sm">
                              {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3 w-2 h-2 bg-white/60 rounded-full" />
                        <div className="absolute bottom-3 right-4 w-1 h-1 bg-white/40 rounded-full" />
                      </Card>
                    );
                  })}
                </div>

                {/* Add Task Button */}
                <div className="text-center pt-4">
                  <Button onClick={() => navigate("/add-task")} size="lg" className="animate-fade-in">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Daily Wellness Tasks */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      📋 Daily Wellness Tasks
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Complete evidence-based activities for pregnancy health
                    </p>
                  </div>
                  <TaskTracker />
                </div>
                
                {/* My Tasks Button */}
                <div className="text-center pt-4">
                  <Button onClick={() => navigate("/my-tasks")} variant="outline" size="lg">
                    <ListTodo className="w-4 h-4 mr-2" />
                    My Tasks
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-wellness/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-semibold text-card-foreground mb-3">
            💡 Tracking Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Track consistently for the most accurate insights and medical benefits
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              All feedback is based on current pregnancy research and clinical guidelines
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use notes in mood tracking to identify patterns and triggers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Left-side sleeping and 7-9 hours are optimal for fetal development
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}