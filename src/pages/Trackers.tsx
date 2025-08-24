import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Moon, CheckSquare, Plus, ListTodo, Calendar, Pill, FileText, Bell, BarChart3, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodTracker } from "@/components/MoodTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { TaskTracker } from "@/components/TaskTracker";
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Scatter } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMotherhoodStage } from "@/contexts/MotherhoodStageContext";

const taskModules = [
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    description: "Track your emotional wellness daily",
    icon: Heart,
    color: "from-pink-100 to-pink-200",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
    route: "/add-task/mood-tracker"
  },
  {
    id: "sleep-tracker",
    title: "Sleep Tracker",
    description: "Monitor your rest patterns daily",
    icon: Moon,
    color: "from-indigo-100 to-indigo-200",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    route: "/add-task/sleep-tracker"
  },
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
  const { getVisibleTrackers, isTrackerVisible } = useMotherhoodStage();
  const visibleTabs = getVisibleTrackers();
  const [activeTab, setActiveTab] = useState(visibleTabs[0] || "mood");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0] || "mood");
    }
  }, [visibleTabs, activeTab]);

  // Load upcoming appointments from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
    const doctorAppointments = savedTasks.filter((task: any) => task.type === 'doctor-appointment');
    const now = new Date();
    const upcoming = doctorAppointments
      .filter((apt: any) => new Date(apt.date) >= now)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3); // Show only next 3 appointments
    setUpcomingAppointments(upcoming);
  }, []);

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
          <TabsList className={`grid w-full h-auto p-1 bg-secondary/50`} style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}>
            {visibleTabs.includes('overview') && (
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
            )}
            {visibleTabs.includes('mood') && (
              <TabsTrigger 
                value="mood" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-mood-card data-[state=active]:text-primary"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Mood</span>
              </TabsTrigger>
            )}
            {visibleTabs.includes('sleep') && (
              <TabsTrigger 
                value="sleep"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-sleep-muted data-[state=active]:text-sleep-primary"
              >
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Sleep</span>
              </TabsTrigger>
            )}
            {visibleTabs.includes('tasks') && (
              <TabsTrigger 
                value="tasks"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-task-card data-[state=active]:text-task-primary"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="mt-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                     Wellness Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Get insights into your pregnancy journey and wellness patterns
                  </p>
                </div>
                {isTrackerVisible('pregnancy-journey') && (
                  <DueDateEstimator dueDateString="2026-04-10" />
                )}
                
                {/* Upcoming Appointments */}
                <Card className="px-6 pt-6 pb-3 bg-transparent border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      Upcoming Appointments
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/add-task/doctor-appointment')}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 px-3 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-red-300" />
                      <p className="text-base text-gray-600 mb-2">No upcoming appointments</p>
                      <p className="text-sm text-gray-500">Schedule your next medical appointment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 bg-white/60 rounded-lg border border-red-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-800 text-base">{appointment.data.doctorName}</h4>
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap">
                                  {appointment.data.specialty}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                </div>
                                {appointment.time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{appointment.time}</span>
                                  </div>
                                )}
                              </div>
                              
                              {appointment.data.appointmentTypes?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {appointment.data.appointmentTypes.slice(0, 3).map((type: string, index: number) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                      {type}
                                    </span>
                                  ))}
                                  {appointment.data.appointmentTypes.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                      +{appointment.data.appointmentTypes.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {upcomingAppointments.length > 0 && (
                        <div className="text-center -mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/add-task/doctor-appointment')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100 text-xs h-5 px-1 py-0.5"
                          >
                            View All Appointments
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
                
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
                     Mood Tracker
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
                     Sleep Tracker
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
                     Wellness Trackers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose from our specialized tracking modules designed for pregnancy and motherhood wellness
                  </p>
                </div>

                {/* 4-Box Wellness Module Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {taskModules.filter(module => isTrackerVisible(module.id)).map((module) => {
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


                
              </div>
            </TabsContent>
          </div>
        </Tabs>

      </div>
    </div>
  );
}