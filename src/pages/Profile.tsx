import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Heart, TrendingUp, Info, FileText, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    age: "28",
    email: "sarah.johnson@email.com",
    phoneNumber: "+1 (555) 123-4567",
    dateOfBirth: "1996-03-15",
    firstChild: "No",
    joinDate: "2024-01-15",
    wellnessGoal: "Mental Health & Sleep",
    language: "English",
    rank: "Secret Agent"
  });



  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile updated! ✨",
      description: "Your preferences have been saved successfully.",
      duration: 3000,
    });
  };

  const handleAboutClick = (section: string) => {
    toast({
      title: `${section}`,
      description: `This would open the ${section.toLowerCase()} page.`,
      duration: 2000,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your wellness journey and preferences
          </p>
        </div>

        {/* Profile Picture and Personal Info */}
        <div className="text-center mb-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-16 h-16 text-primary" />
          </div>
          
          {/* Personal Details */}
          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold text-card-foreground">{userInfo.name}</h2>
            <p className="text-muted-foreground">Join Date: {formatDate(userInfo.joinDate)}</p>
            <p className="text-muted-foreground">Rank: {userInfo.rank}</p>
          </div>
        </div>

        {/* Wellness Journey Stats */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Wellness Journey Stats
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-mood-content mb-1">142</div>
              <div className="text-sm text-muted-foreground">Mood Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sleep-primary mb-1">89</div>
              <div className="text-sm text-muted-foreground">Sleep Logs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-task-primary mb-1">78%</div>
              <div className="text-sm text-muted-foreground">Task Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>

        {/* Personal Information Settings */}
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Personal Information
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-sm font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                value={userInfo.age}
                onChange={(e) => setUserInfo(prev => ({ ...prev, age: e.target.value }))}
                className="mt-1"
                min="1"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={userInfo.phoneNumber}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={userInfo.dateOfBirth}
                onChange={(e) => setUserInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="firstChild" className="text-sm font-medium">First Child</Label>
              <select
                id="firstChild"
                value={userInfo.firstChild}
                onChange={(e) => setUserInfo(prev => ({ ...prev, firstChild: e.target.value }))}
                className="mt-1 px-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[120px]"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

          </div>
        </Card>

        {/* Save Button */}
        <div className="mt-8 flex justify-center md:justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto px-8">
            <Heart className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>

        {/* About Card */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              About
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
              onClick={() => handleAboutClick("About Us")}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span className="font-medium">About Us</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Learn about our mission to support you
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
              onClick={() => handleAboutClick("Terms of Use")}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium">Terms of Use</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Read our terms and conditions for using the app
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
              onClick={() => handleAboutClick("Privacy Policy")}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium">Privacy Policy</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Understand how we protect your personal data
              </p>
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}