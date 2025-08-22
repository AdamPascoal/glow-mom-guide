import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Heart, TrendingUp, Info, FileText, Shield, MessageCircle, Calendar, ThumbsUp } from "lucide-react";
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

  // Mock data for user's posts and comments
  const [userPosts] = useState([
    {
      id: '1',
      content: 'Just hit 28 weeks! So excited and a little nervous. Sharing a photo of my growing bump. What\'s one piece of advice you\'d give to your 28-week pregnant self?',
      community: 'Trimester 2 Support',
      likes: 85,
      comments: 12,
      timestamp: '2 days ago',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      content: 'Morning sickness hitting hard this week. Found that ginger tea and small frequent meals really help. What are your go-to remedies? 💚',
      community: 'First Trimester Tips',
      likes: 42,
      comments: 8,
      timestamp: '1 week ago'
    },
    {
      id: '3',
      content: 'Anyone else experiencing round ligament pain? It\'s been pretty intense lately. My doctor says it\'s normal but wondering what helps you manage it.',
      community: 'Trimester 2 Support',
      likes: 67,
      comments: 15,
      timestamp: '2 weeks ago'
    }
  ]);

  const [userComments] = useState([
    {
      id: '1',
      content: 'This pregnancy pillow has been a lifesaver for me! Highly recommend trying it.',
      postContent: 'Looking for comfortable sleep positions during pregnancy...',
      community: 'Trimester 2 Support',
      likes: 23,
      timestamp: '1 day ago'
    },
    {
      id: '2',
      content: 'I found that prenatal yoga really helped with my back pain. Maybe give it a try?',
      postContent: 'Back pain during pregnancy - any tips?',
      community: 'Mental Health & Wellness',
      likes: 15,
      timestamp: '3 days ago'
    },
    {
      id: '3',
      content: 'Congratulations! The first kicks are such a magical moment. Enjoy every second!',
      postContent: 'Finally felt the first kicks today!',
      community: 'Trimester 2 Support',
      likes: 8,
      timestamp: '1 week ago'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');



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

        {/* My Posts & Comments */}
        <Card className="p-6 max-w-4xl mx-auto mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              My Posts & Comments
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Posts ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Comments ({userComments.length})
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'posts' ? (
              userPosts.map((post) => (
                <div key={post.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {post.community}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              userComments.map((comment) => (
                <div key={comment.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {comment.community}
                      </span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">On post:</p>
                    <p className="text-sm text-foreground font-medium">
                      "{comment.postContent}"
                    </p>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {activeTab === 'posts' && userPosts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-lg font-semibold mb-2">No posts yet</h4>
                <p className="text-muted-foreground mb-4">
                  Start sharing your pregnancy journey with the community!
                </p>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            )}
            
            {activeTab === 'comments' && userComments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-lg font-semibold mb-2">No comments yet</h4>
                <p className="text-muted-foreground mb-4">
                  Engage with other moms by commenting on their posts!
                </p>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Explore Community
                </Button>
              </div>
              )}
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