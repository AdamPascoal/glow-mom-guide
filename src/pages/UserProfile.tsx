import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Calendar, MapPin, Users, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  dueDate?: string;
  currentWeek?: number;
  followers: number;
  following: number;
  postsCount: number;
  isFollowing: boolean;
}

interface Post {
  id: string;
  tag: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
}

// Mock user data
const mockUsers: { [key: string]: UserProfile } = {
  'nurturing-nest': {
    id: '1',
    username: 'nurturing-nest',
    displayName: 'Nurturing Nest',
    avatar: '/placeholder.svg',
    bio: 'First-time mom-to-be 💕 Sharing my pregnancy journey and learning from this amazing community. Love minimalist living and natural wellness.',
    location: 'San Francisco, CA',
    joinDate: 'March 2024',
    dueDate: 'September 2024',
    currentWeek: 32,
    followers: 245,
    following: 189,
    postsCount: 28,
    isFollowing: false,
  },
  'mama-bear-club': {
    id: '2',
    username: 'mama-bear-club',
    displayName: 'Mama Bear Club',
    avatar: '/placeholder.svg',
    bio: 'Second pregnancy, still learning every day! 🐻 Love connecting with other mamas and sharing tips. Advocate for mental health awareness.',
    location: 'Austin, TX',
    joinDate: 'January 2024',
    dueDate: 'October 2024',
    currentWeek: 28,
    followers: 312,
    following: 156,
    postsCount: 42,
    isFollowing: true,
  },
  'jessica-l': {
    id: '3',
    username: 'jessica-l',
    displayName: 'Jessica L.',
    avatar: '/placeholder.svg',
    bio: 'Expecting baby #1 in December! 👶 Nutritionist by day, pregnancy blogger by night. Always happy to share evidence-based tips.',
    location: 'Portland, OR',
    joinDate: 'February 2024',
    dueDate: 'December 2024',
    currentWeek: 14,
    followers: 189,
    following: 203,
    postsCount: 19,
    isFollowing: false,
  },
};

// Mock posts for each user
const mockUserPosts: { [key: string]: Post[] } = {
  'nurturing-nest': [
    {
      id: '1',
      tag: 'Trimester 2 Support',
      content: 'Feeling overwhelmed by the sheer volume of baby gear out there! Any recommendations for must-have items that truly made a difference for you? Trying to keep it minimalist but practical. 🙏',
      likes: 85,
      comments: 12,
      isLiked: false,
      timestamp: '2h',
    },
    {
      id: '4',
      tag: 'Product Recommendations',
      content: 'Just finished setting up our nursery with only the essentials. Sharing my minimalist baby gear list for other mamas who want to keep it simple! ✨',
      likes: 67,
      comments: 8,
      isLiked: true,
      timestamp: '1d',
    },
  ],
  'mama-bear-club': [
    {
      id: '2',
      tag: 'New Moms Connect',
      content: 'Just hit 28 weeks! So excited and a little nervous. Sharing a photo of my growing bump. What\'s one piece of advice you\'d give to your 28-week pregnant self?',
      image: '/placeholder.svg',
      likes: 85,
      comments: 12,
      isLiked: false,
      timestamp: '4h',
    },
  ],
  'jessica-l': [
    {
      id: '3',
      tag: 'First Trimester Tips',
      content: 'Morning sickness hitting hard this week. Found that ginger tea and small frequent meals really help. What are your go-to remedies? 💚',
      likes: 42,
      comments: 8,
      isLiked: true,
      timestamp: '6h',
    },
  ],
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');

  const user = username ? mockUsers[username] : null;
  const userPosts = username ? mockUserPosts[username] || [] : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go back to feed</Button>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    // In a real app, this would make an API call
    console.log(`${user.isFollowing ? 'Unfollowing' : 'Following'} ${user.username}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{user.displayName}</h1>
              <p className="text-sm text-muted-foreground">{user.postsCount} posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Profile Header */}
        <div className="py-6">
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-2xl flex-shrink-0">
              {user.displayName.charAt(0)}
            </div>
            
            {/* Stats and Follow Button */}
            <div className="flex-1 min-w-0">
              {/* Stats Row */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="font-bold text-xl text-foreground">{user.postsCount}</div>
                    <div className="text-xs text-muted-foreground font-medium">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-foreground">{user.followers}</div>
                    <div className="text-xs text-muted-foreground font-medium">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-foreground">{user.following}</div>
                    <div className="text-xs text-muted-foreground font-medium">Following</div>
                  </div>
                </div>
              </div>
              
              {/* Follow Button */}
              <Button
                onClick={handleFollow}
                variant={user.isFollowing ? "outline" : "default"}
                size="sm"
                className="w-full h-9 font-medium"
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>

          {/* Bio and Info */}
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg text-foreground mb-2">{user.displayName}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinDate}</span>
              </div>
              {user.currentWeek && (
                <div className="flex items-center gap-1.5">
                  <Baby className="w-4 h-4" />
                  <span>{user.currentWeek} weeks pregnant</span>
                </div>
              )}
            </div>

            {user.dueDate && (
              <div className="pt-1">
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200">
                  Due: {user.dueDate}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-4">
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    {/* Post Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.tag}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                    
                    {post.image && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post attachment"
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">About {user.displayName}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Bio:</span>
                  <p className="mt-1 text-muted-foreground">{user.bio}</p>
                </div>
                {user.location && (
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="mt-1 text-muted-foreground">{user.location}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Member since:</span>
                  <p className="mt-1 text-muted-foreground">{user.joinDate}</p>
                </div>
                {user.currentWeek && user.dueDate && (
                  <div>
                    <span className="font-medium">Pregnancy:</span>
                    <p className="mt-1 text-muted-foreground">
                      {user.currentWeek} weeks pregnant, due {user.dueDate}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
