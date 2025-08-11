import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trackers from "./pages/Trackers";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AddTask from "./pages/AddTask";
import MyTasks from "./pages/MyTasks";
import DoctorAppointmentForm from "./pages/DoctorAppointmentForm";
import VitaminSupplementForm from "./pages/VitaminSupplementForm";
import MedicalTestForm from "./pages/MedicalTestForm";
import PersonalReminderForm from "./pages/PersonalReminderForm";
import { MobileNavigation, DesktopNavigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <DesktopNavigation />
          <main className="pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trackers" element={<Trackers />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/add-task/doctor-appointment" element={<DoctorAppointmentForm />} />
              <Route path="/add-task/vitamin-supplement" element={<VitaminSupplementForm />} />
              <Route path="/add-task/medical-test" element={<MedicalTestForm />} />
              <Route path="/add-task/personal-reminder" element={<PersonalReminderForm />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MobileNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
