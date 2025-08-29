import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotherhoodStageProvider } from "./contexts/MotherhoodStageContext";
import Home from "./pages/Home";
import Trackers from "./pages/Trackers";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import AddTask from "./pages/AddTask";
import MyTasks from "./pages/MyTasks";
import SwipeableTrackers from "./components/SwipeableTrackers";
import { MobileNavigation, MobileHeader, DesktopNavigation } from "./components/layout/Navigation";

const queryClient = new QueryClient();

function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <DesktopNavigation />
      <main className="pt-16 pb-20 md:pt-0 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community/:communityName" element={<Community />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/add-task/:trackerId" element={<SwipeableTrackers />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileNavigation />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotherhoodStageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </MotherhoodStageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
